const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
    const { university_email, password } = req.body;

    try {
        // Check system setting first
        const settingsResult = await pool.query(
            'SELECT setting_value FROM system_settings WHERE setting_key = $1',
            ['student_login_enabled']
        );
        const studentLoginEnabled = settingsResult.rows[0]?.setting_value ?? true;

        // Check user credentials
        const userResult = await pool.query(
            'SELECT * FROM users WHERE university_email = $1',
            [university_email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ 
                message: 'User not registered. Please sign up first.' 
            });
        }

        const user = userResult.rows[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check login restriction for students
        if (!studentLoginEnabled && user.role === 'student') {
            return res.status(403).json({ 
                message: 'Student logins are currently disabled' 
            });
        }

        req.session.user = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            university_email: user.university_email,
            role: user.role,
        };

        res.status(200).json({
            message: 'Login successful',
            user: req.session.user,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
