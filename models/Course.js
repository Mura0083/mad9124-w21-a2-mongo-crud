import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    code: {type: String, trim: true, maxlength: 16, required: true},
    title: {type: String, trim: true, maxlength: 255, required: true},
    description: {type: String, trim: true, maxlength: 2048},
    url: {type: String, trim: true, maxlength: 512},
    students: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'}
})

const Model = mongoose.model('Course', schema)

export default Model