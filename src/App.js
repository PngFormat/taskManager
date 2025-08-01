import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar.tsx";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import dayjs from "dayjs";

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Закончить макет", completed: false, dueDate: "2025-08-29" },
        { id: 2, title: "Купить продукты", completed: true, dueDate: "2025-08-24" },
    ]);
    const [maxTasksPerDay, setMaxTasksPerDay] = useState(() => {
        const saved = localStorage.getItem("maxTasksPerDay");
        return saved ? Number(saved) : 3;
    })



    const suggestDate = () => {
        const taskCountByDate = {};

        tasks.forEach((task) => {
            taskCountByDate[task.dueDate] = (taskCountByDate[task.dueDate] || 0) + 1;
        });

        for (let i = 0; i < 7; i++) {
            const date  = dayjs().add(i, "day").format("YYYY-MM-DD")
            if ((taskCountByDate[date] || 0) < 3) return date;
        }

        return dayjs().add(1, "day").format("YYYY-MM-DD");
    }

    const getBestDay = () => {
        const taskCountByDate = {};

        tasks.forEach(task => {
            taskCountByDate[task.dueDate] = (taskCountByDate[task.dueDate] || 0) + 1;
        });

        for (let i = 0; i < 7; i++) {
            const date = dayjs().add(i, "day").format("YYYY-MM-DD");
            if ((taskCountByDate[date] || 0) < maxTasksPerDay) {
                return date;
            }
        }

        return dayjs().add(1, "day").format("YYYY-MM-DD");

    }

    const addTask = ({ title, dueDate }) => {
        const finalDueDate = dueDate || suggestDate();

        const countForDate = tasks.filter((t) => t.dueDate === finalDueDate).length;

        if (countForDate >= maxTasksPerDay) {
            alert(`❌ Ви вже досягли ліміту задач (${maxTasksPerDay}) на ${finalDueDate}`);
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            dueDate: finalDueDate,
        };
        setTasks((prev) => {
            const updated = [newTask, ...prev];

            const count = updated.filter((t) => t.dueDate === finalDueDate).length;
            if (count > 3) {
                alert(`⚠️ На ${finalDueDate} уже ${count} задач(и). Подумай, стоит ли добавлять ещё.`);
            }
            return updated;
        });

    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const bestDay = getBestDay();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            <Home
                                tasks={tasks}
                                addTask={addTask}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                                bestDay={bestDay}
                            />
                        }
                    />
                    <Route path="calendar" element={<Calendar tasks={tasks} />} />
                    <Route
                        path="tasks"
                        element={
                            <Tasks
                                tasks={tasks}
                                addTask={addTask}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                            />
                        }
                    />
                    <Route path="settings" element={
                        <Settings
                            maxTasksPerDay={maxTasksPerDay}
                            setMaxTasksPerDay={setMaxTasksPerDay}
                    />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
