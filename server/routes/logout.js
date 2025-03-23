const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.status(200).json({ message: 'Logout successful' });
        });
    } else {
        return res.status(400).json({ message: 'No active session' });
    }
});

module.exports = router;
