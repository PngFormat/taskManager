import {useState} from "react";
import {parseQuickTask} from "../utils/quickParse";

interface QuickAddProps {
    onAdd: (t: { title: string; dueDate: string; priority?: string; tags?: string[]}) => void;
}

export default function QuickAdd({ onAdd } : QuickAddProps) {
    const [value, setValue] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        const parsed = parseQuickTask(value);

        const titleWithTime = parsed.time ? `${parsed.title} (${parsed.time})` : parsed.title;

        onAdd({
            title: titleWithTime,
            dueDate: parsed.dueDate,
            priority: "medium",
            tags: []
        });

        setValue("");
    };

    return (
        <form onSubmit={submit} className="flext gap-2 mb-3">
            <input
                type="text"
                className="flex-1 border p-2 rounded"
                placeholder="Наприклад: Завтра об 15:00 дзвінок з клієнтом"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Додати</button>
        </form>
    )
}