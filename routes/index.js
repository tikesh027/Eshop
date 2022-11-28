const express = require('express');
const { body } = require('express-validator/check');
const AuthController = require('../controllers/authController');
const router = express.Router();

router.post('/users', [
    body('email').isEmail().withMessage('Invalid email-id format!'),
    body('contactNumber').trim().isNumeric().isLength({ max: 10, min: 10 }).withMessage('Invalid contact number!'),
    body('password').trim().isLength({ min: 2 }).withMessage('Password too short')
], AuthController.signup);

router.post('/auth', [
    body('email').isEmail().withMessage('Invalid email-id format!'),
], AuthController.login);

module.exports = router;