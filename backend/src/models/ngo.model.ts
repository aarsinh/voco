import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

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
            validator: function (v: string) {
                return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please fill valid phone number'],
        required: true
    },
    website: {
        type: String,
        validate: {
            validator: function (v: string) {
                return validator.isURL(v, { protocols: ['http', 'https'] });
            },
            message: `Invalid URL`
        }
    }
}, { timestamps: true });

ngoSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

export const NGO = mongoose.model('ngo', ngoSchema);