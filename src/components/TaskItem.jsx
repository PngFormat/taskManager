import {useState} from "react";

export default function TaskItem({
                                     task,
                                     onToggle,
                                     onDelete,
                                     onUpdateDeadline,
                                     disabled,
                                     innerRef,
                                     dragProps,
                                     onFocusSelect,
                                     isFocused }) {

    const [editingDeadline , setEditingDeadline] = useState(false);
    const [newDeadline, setNewDeadline] = useState(task.dueDate || "")

    const priorityColors = {
        high: "text-red-600",
        medium: "text-yellow-600",
        low: "text-green-600",
    }

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
            className={`p-3 rounded border shadow-sm flex justify-between items-center 
            ${task.completed ? "bg-green-100 line-through text-gray-500" : "bg-white"} 
            ${disabled && !isFocused ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div
                className={`flex-1 ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
                onClick={() => !(disabled && !isFocused) && onToggle()}
            >
                <div className="font-medium">{task.title}</div>
                <div className={`font-semibold ${priorityColors[task.priority]}`}>
                    {task.priority === "high" ? "🔥" : task.priority === "medium" ? "⚡" : "✅" }
                </div>

                <div className="flex items-center space-x-2">
                    {editingDeadline ? (
                        <div className="flex items-center space-x-1">
                            <input
                                type="date"
                                value={newDeadline ? newDeadline.split("T")[0] : ""}
                                onChange={(e) => setNewDeadline(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="border rounded p-1"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveDeadline();
                                }}
                                className="text-green-600 font-bold"
                            >
                                ✔
                            </button>
                            <button
                                onClick={(e) =>  {
                                    e.stopPropagation();
                                    setEditingDeadline(false)
                                }}
                                className="text-red-500 font-bold"
                            >
                                ✖
                            </button>
                        </div>
                    ) : (
                        <>
                        <span className="text-sm text-gray-500">
                            📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "нет срока"}
                        </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDeadline(true)
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Изм.
                            </button>
                        </>
                    )}

                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:underline"
                    >
                        ❌
                    </button>
                </div>
            </div>
            {!isFocused && !disabled && (
                <button
                    onClick={onFocusSelect}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                >
                    🎯
                </button>
            )}

            <button
                onClick={onDelete}
                className={`text-sm ml-4 ${disabled ? "text-gray-500" : "text-red-600 hover:underline ml-4"}`}
                disabled={disabled}
            >
                🗑 Видалити
            </button>
        </div>
    );
}
