const mongoose = require('mongoose');
const validator = require('validator');

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
}, { timestamps: true });

const ngoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v){
                return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please fill valid phone number'],
        required: true
    },
    website: {
        type: String,
        validate: {
            validator: function(v){
                return validator.isURL(v, { protocols: ['http', 'https'] });
            },
            message: `Invalid URL`
        }
    }
}, { timestamps: true });

module.exports = Volunteer = mongoose.model('volunteer', volunteerSchema);
module.exports = NGO = mongoose.model('ngo', ngoSchema);