const express = require('express');
const { body } = require('express-validator/check');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const ShippingAddressController = require('../controllers/shippingAddressController');


const router = express.Router();

router.post('/users', [
    body('email').isEmail().withMessage('Invalid email-id format!'),
    body('contactNumber').trim().isNumeric().isLength({ max: 10, min: 10 }).withMessage('Invalid contact number!'),
    body('password').trim().isLength({ min: 2 }).withMessage('Password too short')
], AuthController.signup);

router.post('/auth', [
    body('email').isEmail().withMessage('Invalid email-id format!'),
], AuthController.login);

router.post('/addresses', authMiddleware, [
    body('zipCode').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Invalid zip code!'),
    body('contactNumber').trim().isNumeric().isLength({ max: 10, min: 10 }).withMessage('Invalid contact number!'),
    body('city').trim().not().isEmpty().withMessage('city is required!'),
    body('name').trim().not().isEmpty().withMessage('name is required!'),
    body('state').trim().not().isEmpty().withMessage('state is required!'),
    body('street').trim().not().isEmpty().withMessage('street is required!'),
], ShippingAddressController.addAddress);

module.exports = router;