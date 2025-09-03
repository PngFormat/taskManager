import {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar.tsx";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import dayjs from "dayjs";
import FocusMode from "./pages/FocusMode.tsx";
import ProductivityPage from "./pages/ProductivityPage.tsx";
import TaskHistory from "./components/TaskHistory.tsx";
import {autoMoveUnfinishedTasks} from "./utils/taskUtils";
import NotesPage from "./pages/NotesPage.tsx";
import ExportImportPage from "./pages/ExportImportPage.tsx";
import ResearchPage from "./pages/ResearchPage.tsx";

function App() {
    const [tasks, setTasks] = useState([]);

    const [maxTasksPerDay, setMaxTasksPerDay] = useState(() => {
        const saved = localStorage.getItem("maxTasksPerDay");
        return saved ? Number(saved) : 3;
    })

    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
            .then(res => res.json())
            .then(data =>
            {
                const updated = autoMoveUnfinishedTasks(data);
                setTasks(updated)
            })
    },[])

    const reorderTasks = (newOrder) => {
        setTasks(newOrder);
    };

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

    const addTask = async ({ title, dueDate, priority = "medium", tags = [] }) => {
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
            priority,
            tags,
        };

        const res = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newTask)
        })

        const savedTask = await res.json();
        setTasks(prev => [savedTask, ...prev]);
    };

    const toggleTask =  async (id) => {
        const task = tasks.find(t => t._id === id || t.id === id);
        if (!task) return;
        const updatedTask = { ...task, completed: !task.completed };

        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ completed: updatedTask.completed }),
        });

        setTasks(prev => prev.map(t => (t._id === id || t.id === id) ? updatedTask : t));
    };



    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE",
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
        }
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
                                reorderTasks={reorderTasks}
                            />

                        }
                    />
                    <Route path="calendar" element={<Calendar tasks={tasks} onAddTask={addTask} />} />
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
                    <Route
                        path="focus-mode"
                        element={
                            <FocusMode
                                tasks={tasks}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                            />
                        }
                    />
                    <Route
                        path="productivity"
                        element={
                            <ProductivityPage tasks={tasks} />
                        }
                    />

                    <Route
                        path="archive"
                        element={
                            <TaskHistory tasks={tasks} />
                        }
                    />
                    <Route
                        path="notes"
                        element={
                            <NotesPage />
                        }
                    />

                </Route>

                <Route
                    path="export-import"
                    element={
                    <ExportImportPage
                        tasks={tasks}
                        setTasks={setTasks}
                    />}
                />
                <Route
                    path="research"
                    element={
                        <ResearchPage
                        />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
