import mongoose, { Schema } from 'mongoose'
import bcrhttps://github.com/aarsinh/voco/pull/2/conflict?name=backend%252Fsrc%252Fmodels%252Fngo.model.ts&ancestor_oid=143b8aa1be940de782fad04618fcbdec51641889&base_oid=4916214f03bbae2aa73e3150535574a306727959&head_oid=900bef0f2c976a0bf2c33ab5337c5b72b068163dypt from 'bcrypt'
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
