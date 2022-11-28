const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    city: {
        type: Schema.Types.String,
        required: true,
    },
    landmark: {
        type: Schema.Types.String,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    contactNumber: {
        type: Schema.Types.Number,
        required: true,
    },
    state: {
        type: Schema.Types.String,
        required: true,
    },
    street: {
        type: Schema.Types.String,
        required: true,
    },
    zipCode: {
        type: Schema.Types.String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Address', addressSchema);