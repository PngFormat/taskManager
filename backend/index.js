const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB подключена"))
    .catch(err => console.error("❌ Ошибка подключения:", err));

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: String,
    priority: String,
    tags: [String],
    completedAt: String
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req,res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/api/tasks", async (req,res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Видалено"})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,
    () => console.log(`🚀 Сервер працює на порту ${PORT}`))