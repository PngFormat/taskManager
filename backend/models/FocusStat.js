const mongoose = require("mongoose");

const FocusStatSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    mode: { type: String, enum: ["focus", "shortBreak", "longBreak"], required: true},
    focusScore: { type: Number, required: true },
    interruptions: { type: Number, default: 0},
    timestamp: { type: Date, default: Date.now}
})

export default mongoose.model("FocusStat", FocusStatSchema);