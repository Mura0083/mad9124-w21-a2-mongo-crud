import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: {
        first: { type: String, trim: true, maxlength: 64, required: true },
        last: { type: String, trim: true, maxlength: 64, required: true },
        nick: { type: String, trim: true, maxlength: 64 },
    },
    email: { type: String, trim: true, maxlength: 512, required: true}
})

const Model = mongoose.model('Student', schema)

export default Model