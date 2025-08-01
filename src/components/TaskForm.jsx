import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({
            title: title.trim(),
            dueDate,
        });
        setTitle("");
        setDueDate(new Date().toISOString().split("T")[0]);
    };

    console.log("Current dueDate:", dueDate);

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input
                type="text"
                placeholder="Нова задача..."
                className="flex-1 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="date"
                className="p-2 border rounded cursor-pointer"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Додати
            </button>
        </form>
    );
}
