const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        default: 0
    }




}, {
    timestamps: true
})


module.exports = mongoose.model('Admin', AdminSchema)