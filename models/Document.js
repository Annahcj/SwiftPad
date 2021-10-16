const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('document', documentSchema);