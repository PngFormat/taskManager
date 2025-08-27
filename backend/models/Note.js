const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true },
    content: { type: String, required: true},
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Note", noteSchema);