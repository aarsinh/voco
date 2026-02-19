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
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please fill valid phone number']
    },
}, { timestamps: true });

module.exports = Project = mongoose.model('project', projectSchema);