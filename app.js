const MONGODB_URI = 'mongodb+srv://tikesh027:tikesh@cluster0.xgb8plp.mongodb.net/?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.use(router);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('Connected');
        app.listen(3000);
    })
    .catch((error) => {
        console.log(error);
    });

