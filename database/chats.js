const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ugandaSchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String
    },
    blocked: {
        type: Boolean,
        default: false
    }
}, {strict: false, timestamps: true })

const model = mongoose.model('Ugandan Nyumbu', ugandaSchema)
module.exports = model