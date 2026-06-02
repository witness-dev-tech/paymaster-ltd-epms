const express = require('express');
const session = require('express-session');
const cors = require('cors'); // 1. Import the cors package
const dotenv = require('dotenv');

// Import All Routes
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();
const app = express();

// 2. Configure CORS Middleware
// It must accept requests from your exact frontend port and allow credentials (cookies)
app.use(cors({
    origin: 'http://localhost:5173', // Your React Vite frontend URL
    credentials: true,               // Allows express-session cookies to pass through
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON bodies
app.use(express.json());

// Session Middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: false, // Set to true if running production HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24-hour cookie expiration
    }
}));

// Route Endpoints Registration
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/reports', reportRoutes);

// Base Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: "System is fully functional and running." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});