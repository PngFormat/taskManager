import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.put("/:id/complete", async (reg, res) => {
    try {
        const { timeSpent } = req.body;
        const task = await Task.findByIdAndUpdate(
            reg.params.id,
            {
                status: "completed",
                completedAt: new Date(),
                timeSpent
            },
            {new: true}
        );
        res.json(task);

    } catch ( error) {
        res.status(500).json({ error: "Помилка завершення задачі"});
    }
});

router.get("/history", async (reg, res) => {
    try {
        const history = await Task.find({ status: "completed",}).sort({completedAt: -1});
        res.json(history);
    } catch ( error ) {
        res.status(500).json({ error: "Помилка завантаження історії"});
    }
})

export default router;