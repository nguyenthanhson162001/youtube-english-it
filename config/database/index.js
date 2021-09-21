const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/english');
        console.log('Connect successfully !!!')
    } catch (error) {
        console.log('Connect fail  !!!' + error)
    }
}
module.exports = { connect }