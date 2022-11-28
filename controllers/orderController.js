const Order = require('../models/order');
const Address = require('../models/address');
const Product = require('../models/product');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

exports.createOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const mappedError = errors.array();
        if(mappedError.length === 1){
            res.status(400).json(mappedError[0].msg);
            return;
        }
        const errorObject = {}
        mappedError.forEach((error)=>{
            errorObject[error.param] = error.msg;
        })
        res.status(400).json(errorObject);
        return;
    }
    if(req.userRole === 'ADMIN'){
        res.status(401).json('You are not authorised to access this endpoint!');
        return;
    }

    const { addressId, productId, quantity } = req.body;
    if(quantity == 0){
        res.status(400).json('Quantity cannot be 0');
        return;
    }

    if(!mongoose.Types.ObjectId.isValid(addressId)){
        res.status(400).json(`No Address found for ID - ${addressId}!`);
        return;
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
        res.status(400).json(`No Product found for ID - ${productId}!`);
        return;
    }
    let product = null;
    try{
        product = await Product.findById(productId);
    }catch(error){
        console.log(error);
        res.status(500).json('Internal server error');
    }
    
    let address = null;
    try{
        address = await Address.findById(addressId);
    }catch(error){
        console.log(error);
        res.status(500).json('Internal server error');
    }
    
    if(!product){
        res.status(400).json(`No Product found for ID - ${productId}!`);
        return;
    }

    if(!address){
        res.status(400).json(`No Address found for ID - ${addressId}!`);
        return;
    }

    if(product.availableItems === 0){
        res.status(400).json(`Product with ID - ${productId} is currently out of stock!`);
        return;
    }

    const availableItems = product.availableItems - quantity;

    if(availableItems < 0){
        res.status(400).json(`Only ${product.availableItems} items left for Product with ID ${productId}`);
        return;
    }

    try{
       const updateStock = await Product.findByIdAndUpdate(productId, { availableItems: availableItems })
       console.log(updateStock);
    }catch(error){
        res.status(500).json('Something went wrong');
        return;
    }

    const newOrder = new Order({
        address: address._id,
        product: product._id,
        quantity: quantity,
        user: req.userId,
        amount: product.price * quantity
    });

    newOrder.save().then((result) => {
        return result.populate('address');
    }).then((resultWithAddress) => {
        return resultWithAddress.populate('product');
    }).then((resultWithAddressProduct) => {
        return resultWithAddressProduct.populate('user');
    }).then((resultWithAddressProductUser) => {
        const responseObj = { };
        responseObj.user = resultWithAddressProductUser.user;
        responseObj.product = resultWithAddressProductUser.product;
        responseObj.shippingAddress = resultWithAddressProductUser.address;
        responseObj.shippingAddress.user = resultWithAddressProductUser.user;
        responseObj.amount = resultWithAddressProductUser.amount;
        responseObj.orderDate = resultWithAddressProductUser.orderDate;
        responseObj._id = resultWithAddressProductUser._id;
        res.status(200).json(responseObj);
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json('Internal server error');
    })

}