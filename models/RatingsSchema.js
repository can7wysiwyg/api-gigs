const mongoose = require('mongoose')

const RatingsSchema = mongoose.Schema({
    ratingCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ratedTo: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    ratingCommentary: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Rating", RatingsSchema)