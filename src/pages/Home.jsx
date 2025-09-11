import { useState, useEffect, useMemo } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Home({
                                 tasks,
                                 addTask,
                                 toggleTask,
                                 deleteTask,
                                 bestDay,
                                 reorderTasks,
                                 onUpdateDeadline,
                             }) {
    const [filterPriority, setFilterPriority] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [taskList, setTaskList] = useState(tasks);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const filteredTasks = useMemo(() => {
        return taskList
            .filter((task) =>
                filterPriority ? task.priority === filterPriority : true
            )
            .filter((task) => (filterTag ? task.tags?.includes(filterTag) : true))
            .sort((a, b) => {
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
    }, [taskList, filterPriority, filterTag]);

    const allTags = Array.from(
        new Set(tasks.flatMap((tasks) => tasks.tags || []))
    );



    const handleUpdateDeadline = async (taskId, newDueDate) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ dueDate: newDueDate }),
                }
            );

            if (!response.ok) throw new Error("Ошибка обновления дедлайна");

            const updatedTask = await response.json();

            setTaskList((prevTasks) =>
                prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
            );
        } catch (err) {
            console.error(err);
            alert("Не удалось обновить дедлайн на сервере");
        }
    };



    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                🔮 Рекомендуемый день для новой задачи: <strong>{bestDay}</strong>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center">🧠 Мій планувальник</h1>
            <TaskForm onAdd={addTask} />
            <div className="flex space-x-4 mb-4">
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все приоритеты</option>
                    <option value="high">Высокий приоритет</option>
                    <option value="medium">Средний приоритет</option>
                    <option value="low">Низкий приоритет</option>
                </select>

                <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все теги</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={() =>
                    setViewMode((prev) => (prev === "list" ? "grid" : "list"))
                    }
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {viewMode === "list" ? "🧱 Сетка" : "📋 Список"}
                </button>
            </div>
            <TaskList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                onUpdateDeadline={handleUpdateDeadline}
                viewMode={viewMode}
            />
        </div>
    );
}
