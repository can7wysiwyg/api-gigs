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

        data: Buffer,
    contentType: String,
     },
   tutorSpecialty1: {
        type: String,
        required: true
    },
    tutorSpecialty2: {
        type: String

    },
    tutorSpecialty3: {
        type: String

    }

}, {
    timestamps: true
})

module.exports = mongoose.model("TQualification", QualificationSchema)