import mongoose from "mongoose";

export const notesSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        content: String,
        userID: {
            type: String,
            required: true
        }
    },
    {
        timeStamps: true
    }
)

// Define a virtual property 'id' that maps to '_id'
notesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are included in toJSON output
notesSchema.set('toJSON', {
    virtuals: true
});

export const Note = mongoose.model('Note', notesSchema)