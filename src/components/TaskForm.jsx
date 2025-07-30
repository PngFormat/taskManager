import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title);
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input
                type="text"
                placeholder="Нова задача..."
                className="flex-1 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
