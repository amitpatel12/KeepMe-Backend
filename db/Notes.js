const mongoose = require('mongoose')

const NotesSchema = new mongoose.Schema({
    title:String,
    tag:String,
    data:String,
    userId:String,
    time:String,
    date:String
})

module.exports = mongoose.model("notes",NotesSchema)