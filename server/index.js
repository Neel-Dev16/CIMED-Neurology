require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        httpOnly: true,
    },
}));

// Import routes
const loginRoute = require('./routes/login');
app.use('/api/login', loginRoute);

const logoutRoute = require('./routes/logout');
app.use('/api/logout', logoutRoute);

const projectsRoute = require('./routes/projects');
app.use('/api/projects', projectsRoute);

// New admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// New registration route
const registrationRoute = require('./routes/registration');
app.use('/api/register', registrationRoute);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
