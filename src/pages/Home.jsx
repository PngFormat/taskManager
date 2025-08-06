import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Home({ tasks, addTask, toggleTask, deleteTask, bestDay, reorderTasks }) {

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                🔮 Рекомендуемый день для новой задачи: <strong>{bestDay}</strong>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center">🧠 Мій планувальник</h1>
            <TaskForm onAdd={addTask} />
            <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
            />
        </div>

    );
}
