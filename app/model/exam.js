const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Exam = new Schema({
    userName: String,
    percentComplete: { type: String, default: 0 },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
}, { timestamps: true })
module.exports = mongoose.model('Exam', Exam)

//userSend: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// unitName  = Dev day
// slug:dev-day