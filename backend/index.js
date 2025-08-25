const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Task = require("./models/tasks");
const { generateRepeatingTasks } = require("./repeatTasks.js");
const { autoMoveUnfinishedTasks } = require("./utils/autoMoveUnfinishedTasks.js")
const fetch = require("node-fetch");

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

app.post("/api/weather", async (req, res) => {
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ error: "Не указан город" });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=uk&appid=${apiKey}`
        );

        const data = await response.json();
        console.log("🌦 API Response:", data);

        if (!data.list || data.cod !== "200") {
            return res.status(404).json({ error: "Город не найден", raw: data });
        }

        const tomorrowForecast = data.list.find(item => item.dt_txt.includes("12:00:00"));

        if (!tomorrowForecast) {
            return res.status(404).json({ error: "Прогноз на завтра не найден" });
        }
        console.log("Raw API Response:", data);
        res.json({
            weather: tomorrowForecast.weather[0].main,
            description: tomorrowForecast.weather[0].description,
            temp: tomorrowForecast.main.temp
        });

    } catch (err) {
        console.error("Ошибка прогноза:", err);
        res.status(500).json({ error: "Не удалось получить прогноз" });
    }
});



generateRepeatingTasks();
autoMoveUnfinishedTasks();

setInterval(() => {
    generateRepeatingTasks();
    autoMoveUnfinishedTasks();
}, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT,
    () => console.log(`🚀 Сервер працює на порту ${PORT}`))