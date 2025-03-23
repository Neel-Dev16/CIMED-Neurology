const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
    const { university_email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE university_email = $1',
            [university_email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user details in the session
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
