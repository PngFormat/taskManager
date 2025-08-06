import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);

        onAdd({ title, dueDate, priority, tags });

        setTitle("");
        setDueDate("");
        setPriority("medium");
        setTagsInput("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
            <input
                type="text"
                placeholder="Новая задача"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full border p-2 rounded"
            />
            <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border p-2 rounded"
            />
            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full border p-2 rounded"
            >
                <option value="high">Высокий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="low">Низкий приоритет</option>
            </select>
            <input
                type="text"
                placeholder="Теги через запятую (например: работа, учеба)"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full border p-2 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Добавить задачу
            </button>
        </form>
    );
}
