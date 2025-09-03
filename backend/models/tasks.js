const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: String,
    priority: String,
    tags: [String],
    repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none"
    },
    method: {
        type: String,
        enum: ["Pomodoro", "GTD", "Kanban", "Eisenhower"],
        default: "Pomodoro"
    },
    estimatedMinutes: {type: Number, default: 25},
    importance: {type: Number, min: 1, max: 5, default: 3},
    urgency: {type: Number, min: 1, max: 5, default: 3},
    createdAt: { type: Date, default: Date.now },
    startedAt: Date,
    completedAt: Date
});

module.exports = mongoose.model("Task", taskSchema);