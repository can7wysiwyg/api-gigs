const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
   
   userImage: {
    data: Buffer,
    contentType: String,

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
    admin: {
        type: Number,
        default: 0
    },
    facebookLink: {
        type: String,
    },
    whatsappLink: {
        type: String,
    },
    twitterLink: {
        type: String,
    },
    linkedInLink: {
        type: String,
    }
    
    

}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)