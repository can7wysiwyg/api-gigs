const mongoose = require("mongoose")

const QualificationSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    qualification: {
        type: String
    },
    qualificationImage: {

       type: String,
       required: true
     },
   tutorSpecialty1: {
        type: String,
        required: true
    },
    tutorSpecialty2: {
        type: String,
        default: null

    },
    tutorSpecialty3: {
        type: String,
        default: null

    }

}, {
    timestamps: true
})

module.exports = mongoose.model("TQualification", QualificationSchema)