const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: String,
    priority: String,
    tags: [String],
    completedAt: String,
    repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none"
    }
});

module.exports = mongoose.model("Task", taskSchema);