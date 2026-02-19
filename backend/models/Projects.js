const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ngo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    registrations: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);