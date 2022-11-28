const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const { TOKEN_SALT } = require('../constants/constants');

exports.signup = async (req, res, next) => {
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

    const { email, password, firstName, lastName, contactNumber } = req.body;

    User.findOne({ email: email })
        .then((result) => {
            if(result){
                res.status(400).json('Try any other email, this email is already registered!');
                return;
            }
        }).catch((error)=>{
            console.log(error);
            res.status(500).json('Internal Server Error');
            return;
        });
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        email,
        contactNumber,
        firstName,
        password: hashedPassword,
        role: 'USER',
        lastName: lastName,
        userName: ''
    });

    newUser.save().then((result) => {
        const response = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email
        }
        res.status(200).json(response);
    }).catch((error) => {
        console.log(error);
        res.status(500).json('Internal server error');
    })

}

exports.login = (req, res, next) => {
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

    const { email, password } = req.body;
    User.findOne({ email: email })
        .then( async (result) => {
            console.log(result);
            if(!result){
                res.status(404).json('This email has not been registered!')
                return;
            }
            const isEqual = await bcrypt.compare(password, result.password);
            if(!isEqual){
                res.status(400).json('Invalid Credentials!');
                return;
            }
            const token = JWT.sign({
                _id: result._id,
                email: result.email,
                role: result.role,
                timeStamp: new Date().toISOString()
            }, TOKEN_SALT, { expiresIn: '1h' } );
            const responseBody = {
                email: result.email,
                name: result.firstName,
                isAuthenticated: true
            }
            res.set('x-auth-token', token);
            res.status(200).json(responseBody);
        })

}