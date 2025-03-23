const isAuthenticated = (req, res, next) => {
    // Check if the user session exists
    if (req.session && req.session.user) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }
};

module.exports = isAuthenticated;
