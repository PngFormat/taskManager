import { useState } from "react";
import { Calendar, Trash2, Target, Check, X } from "lucide-react";

export default function TaskItem({
                                     task,
                                     onToggle,
                                     onDelete,
                                     onUpdateDeadline,
                                     disabled,
                                     innerRef,
                                     dragProps,
                                     onFocusSelect,
                                     isFocused,
                                 }) {
    const [editingDeadline, setEditingDeadline] = useState(false);
    const [newDeadline, setNewDeadline] = useState(task.dueDate || "");

    const priorityStyles: Record<string, string> = {
        high: "bg-red-100 text-red-700 border border-red-300",
        medium: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        low: "bg-green-100 text-green-700 border border-green-300",
    };

    const handleSaveDeadline = () => {
        if (newDeadline) {
            const isoDate = new Date(newDeadline).toISOString();
            onUpdateDeadline(task._id, isoDate);
        }
        setEditingDeadline(false);
    };

    return (
        <div
            ref={innerRef}
            {...dragProps}
            className={`p-4 rounded-2xl shadow-sm relative transition-all duration-300 
                ${task.completed ? "bg-gray-100 text-gray-400" : "bg-white dark:bg-gray-900"} 
                ${disabled && !isFocused ? "opacity-50 pointer-events-none" : ""}
                hover:shadow-md`}
        >
            <div
                className={`flex flex-col gap-2 ${
                    disabled ? "pointer-events-none" : "cursor-pointer"
                }`}
                onClick={() => !(disabled && !isFocused) && onToggle(task._id)}
            >
                <div className="flex items-center justify-between">
                    <div
                        className="flex items-center gap-2"
                    >
                        <h3
                            className={`font-semibold text-base ${
                                task.completed ? "line-through" : ""
                            }`}
                        >
                            {task.title}
                        </h3>

                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
                        >
                            {task.priority === "high"
                                ? "🔥 Високий"
                                : task.priority === "medium"
                                    ? "⚡ Середній"
                                    : "✅ Низький"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {editingDeadline ? (
                        <>
                            <input
                                type="date"
                                value={newDeadline ? newDeadline.split("T")[0] : ""}
                                onChange={(e) => setNewDeadline(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="border rounded p-1 text-sm"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveDeadline();
                                }}
                                className="text-green-600 hover:text-green-800"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDeadline(false);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-600">
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString()
                                    : "немає"}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDeadline(true);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Змінити
                            </button>
                        </>
                    )}
                </div>
            </div>


            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {!isFocused && !disabled && (
                    <button
                        onClick={onFocusSelect}
                        className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
                        title="Сфокусироваться"
                    >
                        <Target className="w-4 h-4" />
                    </button>
                )}

                <button
                    onClick={onDelete}
                    className={`p-2 rounded-full transition ${
                        disabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-100"
                    }`}
                    disabled={disabled}
                    title="Удалить"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
