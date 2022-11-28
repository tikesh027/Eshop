const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.searchProduct = (req, res, next) => {
    const params = req.query;
    const sortDirection = params.Direction &&
        params.Direction.toLowerCase() === 'asc' ? 1 : -1;
    const queryParams = {
        Category: params.Category || "",
        Direction: sortDirection,
        Name: params.Name || "",
        'Sort By': params['Sort By'] || "_id"
    };

    Product.find({ $or: [
            { category: queryParams.Category },
            { name: queryParams.Name }
        ]})
        .sort({ [queryParams['Sort By']] : queryParams.Direction })
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

exports.getProductCategories = (req, res, next) => {
    Product.find().distinct('category').then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId).then((result) => {
        if(!result){
            res.status(404).json(`No Product found for ID - ${productId}`);
            return;
        }
        res.status(200).json(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
}

exports.addProduct = (req, res, next) => {
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
    if(req.userRole !== 'ADMIN'){
        res.status(401).json('You are not authorised to access this endpoint!');
        return;
    }

    const { availableItems, category, description, imageURL, manufacturer,  name, price} = req.body;

    const newProduct = new Product({
        availableItems: availableItems,
        category: category,
        description: description || "",
        imageURL: imageURL || "",
        manufacturer: manufacturer,
        name: name,
        price: price
    });

    newProduct.save().then((result)=>{
        res.status(200).json(result);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    })
}

exports.updateProduct = (req, res, next) => {
    if(req.userRole !== 'ADMIN'){
        res.status(401).json('You are not authorised to access this endpoint!');
        return;
    }
    const productId = req.params.id;
    const { availableItems, category, description, imageURL, manufacturer,  name, price} = req.body;

    Product.findByIdAndUpdate(productId,{
        availableItems, category, description, imageURL, manufacturer,  name, price
    }, { new: true }).then((result)=>{
        if(!result){
            res.status(404).json(`No Product found for ID - ${productId}`);
            return;
        }
        res.status(200).json(result);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    })
}

exports.deleteProduct = (req, res, next) => {
    if(req.userRole !== 'ADMIN'){
        res.status(401).json('You are not authorised to access this endpoint!');
        return;
    }
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
        .then((result)=>{
            if(!result){
                res.status(404).json(`No Product found for ID - ${productId}`);
                return;
            }
            res.status(200).json(`Product with ID - ${productId} deleted successfully!`);
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json(error);
        })
}