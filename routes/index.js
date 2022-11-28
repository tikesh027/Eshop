const express = require('express');
const { body } = require('express-validator/check');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const ShippingAddressController = require('../controllers/shippingAddressController');
const ProductController = require('../controllers/productController');

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

router.get('/products', ProductController.searchProduct);

router.get('/products/categories', ProductController.getProductCategories);

router.get('/products/:id', ProductController.getProductById);

router.post('/products', authMiddleware, [
    body('availableItems').trim().isNumeric().withMessage('availableItems is required!'),
    body('category').trim().not().isEmpty().withMessage('category is required!'),
    body('manufacturer').trim().not().isEmpty().withMessage('manufacturer is required!'),
    body('name').trim().not().isEmpty().withMessage('name is required!'),
    body('price').trim().isNumeric().withMessage('price is required!'),
], ProductController.addProduct);

router.put('/products/:id', authMiddleware, ProductController.updateProduct);


module.exports = router;