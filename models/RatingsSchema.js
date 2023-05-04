const mongoose = require('mongoose')

const RatingsSchema = mongoose.Schema({
    ratingCreatedBy: {
        type: String,
        required: true
    },
    ratedTo: {
        type: String,
        required: true
    },
    ratingCommentary: {
        type: String,
        maxLength: 240,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Rating", RatingsSchema)