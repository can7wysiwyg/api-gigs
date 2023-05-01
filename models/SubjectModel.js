const mongoose = require('mongoose')

const SubjectSchema = mongoose.Schema({

    subjectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subjectName: {
        type: String,
        required: true
    },
    subjectPrice: {
        type: String,
        required: true
    },
    subjectCommentary: {
        type: String,
        required: true
    }


}, {
    timestamps: true
})




module.exports = mongoose.model('Subject', SubjectSchema)