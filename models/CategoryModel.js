const mongoose = require('mongoose')

const CatSchema = mongoose.Schema({

    catName: {
        type: String,
        unique: true,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Category', CatSchema)