const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const { 
    firstName,
    lastName,
    universityNetId,
    universityEmail,
    phone,
    password,
    role = 'student',
    status = 'active'
  } = req.body;

  try {
    // Validate email domain
    if (!universityEmail.endsWith('@illinois.edu')) {
      return res.status(400).json({ message: 'Only @illinois.edu emails allowed' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE university_email = $1 OR university_netid = $2',
      [universityEmail, universityNetId]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Insert new user
    await pool.query(
      `INSERT INTO users (
        first_name, 
        last_name, 
        university_netid, 
        university_email, 
        password, 
        phone, 
        role, 
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        firstName,
        lastName,
        universityNetId,
        universityEmail,
        password,
        phone,
        role,
        status
      ]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;
