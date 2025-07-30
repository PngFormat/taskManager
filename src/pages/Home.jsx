import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Home({ tasks, addTask, toggleTask, deleteTask }) {

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">🧠 Мій планувальник</h1>
            <TaskForm onAdd={addTask} />
            <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
    );
}
