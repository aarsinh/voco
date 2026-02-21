import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return validator.isEmail(v)
            }
        }
    },
    password: {
        type: String,
        required: true
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
    registeredProjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, { timestamps: true });

volunteerSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

export default mongoose.model('Volunteer', volunteerSchema);