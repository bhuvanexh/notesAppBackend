import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            required: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
    },
    {
        timeStamps: true
    }
)



export const User = mongoose.model('User', userSchema)