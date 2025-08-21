import {useState, useEffect, useMemo} from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Home({ tasks, addTask, toggleTask, deleteTask, bestDay, reorderTasks, onUpdateDeadline  }) {
    const [filterPriority, setFilterPriority] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [taskList, setTaskList] = useState(tasks);

    const priorityOrder = {high: 1, medium: 2, low: 3}

    const filteredTasks = useMemo(() => {
        return taskList
            .filter(task => (filterPriority ? task.priority === filterPriority : true))
            .filter(task => (filterTag ? task.tags?.includes(filterTag) : true))
            .sort((a, b) => {
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
    }, [taskList, filterPriority, filterTag]);


    const allTags = Array.from(
        new Set(tasks.flatMap(tasks => tasks.tags || []))
    );

    const handleUpdateDeadline = ( taskId, newDueDate) => {
        const updatedTasks = taskList.map(t =>
            t._id === taskId ? {...t, dueDate: newDueDate} : t
        );
        setTaskList(updatedTasks);
    }

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
                    onChange={e => setFilterPriority(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все приоритеты</option>
                    <option value="high">Высокий приоритет</option>
                    <option value="medium">Средний приоритет</option>
                    <option value="low">Низкий приоритет</option>
                </select>

                <select
                    value={filterTag}
                    onChange={e => setFilterTag(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все теги</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>
            <TaskList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                onUpdateDeadline={handleUpdateDeadline}
            />
        </div>

    );
}
