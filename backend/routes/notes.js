import express from "express";
import Note from "../models/Note.js";

const router = express.Router();


router.get("/", async (req, res) => {
    const notes = await Note.find().populate("taskId");
    res.json(notes);
});

router.post("/", async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.json(note);
});


router.put("/:id", async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
});

router.delete("/:id", async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
});

export default router;
