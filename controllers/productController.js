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