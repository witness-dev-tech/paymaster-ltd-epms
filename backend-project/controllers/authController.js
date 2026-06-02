const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const userId = await User.create(username, passwordHash);

        res.status(201).json({ message: 'User registered successfully!', userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        req.session.userId = user.userId;
        req.session.username = user.username;

        res.status(200).json({ message: 'Login successful!', user: { id: user.userId, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};