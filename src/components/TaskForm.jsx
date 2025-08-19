import { useState } from "react";
import {TASK_TEMPLATES} from "../utils/templates";
import {parseQuickTask} from "../utils/quickParse.ts";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");
    const [repeat, setRepeat] = useState("none");
    const [selectedTemplate, setSelectedTemplate] = useState("")

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

    const handleTitleChange = (e) => {
        const inputText = e.target.value;
        setTitle(inputText);

        const parsed = parseQuickTask(inputText);
        if (parsed.dueDateTime) setDueDate(parsed.dueDateTime.substring(0,16));
        if (parsed.title !== inputText) setTitle(parsed.title);
    };


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
        setSelectedTemplate("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
            <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full border p-2 rounded"
            >
                <option value="">Выбрати шаблок (необов'язково)</option>
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
