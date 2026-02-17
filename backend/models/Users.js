const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please fill valid phone number']
    },
    timestamps: true
});

const ngoSchema = new mongoose.Schema({

});

module.exports = Volunteer = mongoose.model('volunteer', volunteerSchema);
module.exports = NGO = mongoose.model('ngo', ngoSchema);