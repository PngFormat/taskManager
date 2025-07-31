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

    const addTask = (title) => {
        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            dueDate: dayjs().add(1, "day").format("YYYY-MM-DD")
        };
        setTasks((prev) => [newTask, ...prev]);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

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
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
