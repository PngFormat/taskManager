const express = require("express");
const FocusStat = require("../models/FocusStat");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { taskId, focusScore, interruptions, mode } = req.body;
        if (!taskId) return res.status(400).json({ error: "taskId is required" });

        const stat = await FocusStat.findOneAndUpdate(
            { taskId },
            { focusScore, interruptions, mode, timestamp: new Date() },
            { new: true, upsert: true }
        );

        res.json(stat);
    } catch (err) {
        console.error("FocusStat error:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
