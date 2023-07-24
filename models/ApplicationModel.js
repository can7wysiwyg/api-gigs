const mongoose = require('mongoose')

const ApplicationSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Apply', ApplicationSchema)