import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");
    const [repeat, setRepeat] = useState("none");

    const handleSubmit = (e) => {
        e.preventDefault();

        const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);

        onAdd({
            title,
            dueDate,
            priority,
            tags,
            repeat
        });

        setTitle("");
        setDueDate("");
        setPriority("medium");
        setTagsInput("");
        setRepeat("none")
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

            <select
                value={repeat}
                onChange={e => setRepeat(e.target.value)}
                className="w-full border p-2 rounded"
            >
                <option value="none">Без повторення</option>
                <option value="daily">Кожен день</option>
                <option value="weekly">Кожного тижня</option>
                <option value="monthly">Кожного місяця</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Добавить задачу
            </button>
        </form>
    );
}
