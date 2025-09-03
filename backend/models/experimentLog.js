const mongoose = require("mongoose");

const ExperimentLogSchema = new mongoose.Schema({
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true},
    method: {type: String, enum: ["Pomodoro", "GTD", "Kanban", "Eisenhower"], required: true },
    event: {type: String, enum: ["start", "pause", "resume", "interrupt", "complete"], required: true },
    timestamp: {type: Date, default: Date.now()},
    payload: {type: Object, default: {}},
})

module.exports = mongoose.model("ExperimentLog", ExperimentLogSchema);