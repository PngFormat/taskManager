import { useState } from "react";
import {TASK_TEMPLATES} from "../utils/templates";
import {parseQuickTask} from "../utils/quickParse.ts";
import InputField from "../components/InputField.tsx"
import SelectField from "./SelectField.tsx";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");
    const [repeat, setRepeat] = useState("none");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [method, setMethod] = useState("")
    const [estimatedMinutes, setEstimatedMinutes] = useState("");
    const [importance, setImportance] = useState("");
    const [urgency, setUrgency] = useState("");


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
            repeat,
            method,
            estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : 25,
            importance: importance ? Number(importance) : 3,
            urgency: urgency ? Number(urgency) : 3,
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
        <form onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-200"
        >
            <h3 className="text-xl font-semibold text-blue-600">➕ Нова задача</h3>

            <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Використати шаблон
                </label>

                <select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Необов'язково</option>
                    {TASK_TEMPLATES.map(t => (
                        <option key={t.name} value={t.name}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <InputField
                    label="Назва"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Наприклад: зробити звіт"
                    error={submitted && !title.trim()}
                />
            </div>

            <div>
                <InputField
                    label="Дедлайн"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    error={submitted && !title.trim()}
                />
            </div>

            <SelectField
                label="Пріоритет"
                value={priority}
                onChange={setPriority}
                options={[
                    { value: "high", label: "🔴 Високий" },
                    { value: "medium", label: "🟡 Середній" },
                    { value: "low", label: "🟢 Низький" },
                ]}
            />

            <div>
                <InputField
                    label="Теги"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="робота,навчання"
                    error={submitted && !title.trim()}
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Повторення</label>
                <select
                    value={repeat}
                    onChange={e => setRepeat(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="none">Без повторення</option>
                    <option value="daily">Щодня</option>
                    <option value="weekly">Щотижня</option>
                    <option value="monthly">Щомісяця</option>
                </select>
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Метод</label>
                <select
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                    className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"

                >
                    <option value="Pomodoro">🍅 Pomodoro</option>
                    <option value="GTD">📌 GTD</option>
                    <option value="Kanban">📊 Kanban</option>
                    <option value="Eisenhower">⏳ Eisenhower</option>
                </select>
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Оцінка (хвилини)
                </label>

                <input
                    type="number"
                    min={5}
                    step={5}
                    placeholder="Оцінка (хв)"
                    value={estimatedMinutes}
                    onChange={e => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Важливість</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={importance}
                        onChange={(e) => setImportance(Number(e.target.value))}
                        className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Терміновість</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={urgency}
                        onChange={(e) => setUrgency(Number(e.target.value))}
                        className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Добавить задачу
            </button>
        </form>
    );
}
