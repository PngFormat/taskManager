const mongoose = require("mongoose");

const FocusStatSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    mode: { type: String, enum: ["focus", "shortBreak", "longBreak"], required: true },
    focusScore: { type: Number, required: true },
    interruptions: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FocusStat", FocusStatSchema);
