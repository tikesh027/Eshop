const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true
    },
    firstName: {
        type: Schema.Types.String,
        required: true
    },
    lastName: {
        type: Schema.Types.String,
        // required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    contactNumber: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: true
    },
    userName: {
        type: Schema.Types.String,
    }
}, { timestamps : {
    createdAt: 'created',
    updatedAt: 'updated'  
} });

module.exports = mongoose.model('User', userSchema);