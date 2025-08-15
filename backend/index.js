const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Task = require("./models/tasks");
const { generateRepeatingTasks } = require("./repeatTasks.js");
const { autoMoveUnfinishedTasks } = require("./utils/autoMoveUnfinishedTasks.js")


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB подключена"))
    .catch(err => console.error("❌ Ошибка подключения:", err));


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

generateRepeatingTasks();
autoMoveUnfinishedTasks();

setInterval(() => {
    generateRepeatingTasks();
    autoMoveUnfinishedTasks();
}, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT,
    () => console.log(`🚀 Сервер працює на порту ${PORT}`))