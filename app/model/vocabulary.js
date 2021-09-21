const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Vocabulary = new Schema({
    english: String,
    vietnamese: String,
    type: String,
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
})
module.exports = mongoose.model('Vocabulary', Vocabulary)