const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Task = require("./models/tasks");
const { generateRepeatingTasks } = require("./repeatTasks.js");
const { autoMoveUnfinishedTasks } = require("./utils/autoMoveUnfinishedTasks.js")
const fetch = require("node-fetch");
const notesRouter = require("./routes/notes")
const ExperimentLog = require("./models/experimentLog")
const focusStatsRouter = require("./routes/FocusStats")

dotenv.config();

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use("/api/focus", focusStatsRouter);

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
    const updateData = {...req.body};

    if (updateData.completed === true) {
        updateData.completedAt = new Date();
    } else if (updateData.completed === false) {
        updateData.completedAt = null;
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        );

        res.json(updatedTask)
    } catch (err) {
        console.error("Помилка оновлення задачі:", err );
        res.status(500).json({error: "Не вдалося оновити задачу"})
    }
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

app.post("/api/experiment/log", async (req, res) => {
    try{
        const {taskId, method, event, payload } = req.body;
        const log = await ExperimentLog.create({taskId, method, event, payload });

        if (event === "complete") {
            await Task.findByIdAndUpdate(taskId, {completed: true, completedAt: new Date() });
        }
        res.json(log);
    } catch (e) {
        console.error(e)
        res.status(500).json({error: "Failed to log experiment event"});
    }
});

app.get("/api/experiment/report", async (req, res) => {
    try {
        const tasks = await Task.find();
        const logs = await ExperimentLog.find();

        const byMethod = {};

        const logsByTask = logs.reduce((acc, l) => {
            (acc[l.taskId] ||= []).push(l);
            return acc;
        }, {});

        for (const t of tasks) {
            const m = t.method || "Pomodoro";
            (byMethod[m] ||= { done: 0, onTime: 0, totalCycleMin: 0, cnt: 0, interruptions: 0 });

            const taskLogs = logsByTask[t._id] || [];
            const interruptCount = taskLogs.filter(l => l.event === "interrupt").length;

            const completed = t.completed === true && !!t.completedAt;
            const start = t.startedAt || t.createdAt;
            const end = t.completedAt || new Date();

            const cycleMin = (end - start) / 60000;

            if (completed) {
                byMethod[m].done += 1;
                byMethod[m].cnt += 1;
                byMethod[m].totalCycleMin += cycleMin;

                const onTime = t.dueDate ? (new Date(t.completedAt) <= new Date(t.dueDate)) : true;
                if (onTime) byMethod[m].onTime += 1;
            }

            byMethod[m].interruptions += interruptCount;
        }

        const report = Object.entries(byMethod).map(([method, v]) => ({
            method,
            completed: v.done,
            onTimeRate: v.done ? +(v.onTime / v.done).toFixed(2) : 0,
            avgCycleMinutes: v.cnt ? Math.round(v.totalCycleMin / v.cnt) : 0,
            interruptions: v.interruptions,
        }));

        res.json({ report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to build report" });
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
