import { useState } from "react";
import {TASK_TEMPLATES} from "../utils/templates";
import {parseQuickTask} from "../utils/quickParse.ts";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");
    const [repeat, setRepeat] = useState("none");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleTemplateChange = (e) => {
        const templateName = e.target.value;
        setSelectedTemplate(templateName);

        const template = TASK_TEMPLATES.find(t => t.name === templateName);
        if (template) {
            setTitle(template.title);
            setPriority(template.priority);
            setTagsInput(template.tags.join(", "));
            setRepeat(template.repeat);
            setDueDate("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!title.trim() || !dueDate.trim()) return;

        const tags = tagsInput
            .split(",")
            .map(t => t.trim())
            .filter(t => t);

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
        setRepeat("none");
        setSelectedTemplate("");
        setSubmitted(false);
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
            <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full border p-2 rounded"
            >
                <option value="">Выбрати шаблон (необов'язково)</option>
                {TASK_TEMPLATES.map(t => (
                    <option key={t.name} value={t.name}>
                        {t.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Новая задача"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full border p-2 rounded  ${ 
                    submitted && !title.trim() ? "border-red-500 bg-red-100" : ""}`}
            />
            <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={`w-full border p-2 rounded ${
                    submitted && !dueDate.trim() ? "border-red-500 bg-red-100" : ""
                }`}
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
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Добавить задачу
            </button>
        </form>
    );
}
