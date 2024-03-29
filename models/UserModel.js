const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
   
   userImage: {
    type: String,
    required: true

   },
   fullname: {
    type: String,

    required: true
},
    username: {
        type: String,
    
        required: true
    },
    email: {
        type: String,
    
        required: true
    },
    phoneNumber: {
        type: String,
        required: true

    },
    password: {
        type: String,
    
        required: true
    },
    securityAnswer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    facebookLink: {
        type: String,
        default: ""
    },
    whatsappLink: {
        type: String,
        default: ""
    },
    twitterLink: {
        type: String,
        default: ""
    },
    linkedInLink: {
        type: String,
        default: ""
    }
    
    

}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)