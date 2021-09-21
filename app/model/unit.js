const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema
mongoose.plugin(slug);

const Unit = new Schema({
    name: String,
    background: String,
    description: String,
    // subscriber: Number,
    slug: { type: String, slug: 'name', unique: true },
}, { timestamps: true })
module.exports = mongoose.model('Unit', Unit)
    // unit 1 Life
    // unit-1-life
    // http/domaion/showunit/unit-1-life
    //userSend: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // unitName  = Dev day
    // slug:dev-day