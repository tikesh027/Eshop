const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    availableItems: {
        type: Schema.Types.Number,
        required: true
    },
    category: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        default: ''
    },
    imageURL:{
        type: Schema.Types.String,
        default: ''
    },
    manufacturer:{
        type: Schema.Types.String,
        required: true
    },
    name:{
        type: Schema.Types.String,
        required: true
    },
    price:{
        type: Schema.Types.Number,
        required: true
    }
}, { timestamps : {
    createdAt: 'created',
    updatedAt: 'updated'
}});

module.exports = mongoose.model('Product', productSchema);