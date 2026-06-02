const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').trim().escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.register);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;