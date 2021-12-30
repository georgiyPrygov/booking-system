const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    descr: {
        type: String,
    },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    title: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    roomPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        required: true
    },
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Reservation', schema)