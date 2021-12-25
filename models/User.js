const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    reservations: [{type: Types.ObjectId, ref: 'Reservation'}]
})

module.exports = model('User', schema)