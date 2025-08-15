export default function TaskItem({ task, onToggle, onDelete, disabled, innerRef, dragProps,  onFocusSelect, isFocused }) {
    const priorityColors = {
        high: "text-red-600",
        medium: "text-yellow-600",
        low: "text-green-600",
    }

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
                <div className="font-sm text-gray-500">До: {task.dueDate}</div>
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
