import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Закончить макет", completed: false },
        { id: 2, title: "Купить продукты", completed: true },
    ]);

    const addTask = (title) => {
        const newTask = {
            id: Date.now(),
            title,
            completed: false,
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
                    <Route path="calendar" element={<Calendar />} />
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
