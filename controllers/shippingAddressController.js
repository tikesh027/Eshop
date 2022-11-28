const { validationResult } = require('express-validator');
const Address = require('../models/address');


exports.addAddress = (req, res, next) => {
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

    const { city, landmark, name, contactNumber, state, street, zipCode } = req.body;

    const newAddress = new Address({
        city,
        name,
        landmark,
        contactNumber,
        state,
        street,
        zipCode,
        user: req.userId
    });

    newAddress.save().then((result)=>{
        return result.populate('user');
    })
    .then((savedAddress) => {
        if(!savedAddress){
            res.status(500).json('Something went wrong! :(');
            return;
        }
        res.status(200).json(savedAddress);
    })
    .catch((error) => {
        console.log(error);
        res.state(500).json('Internal server error');
    })
}