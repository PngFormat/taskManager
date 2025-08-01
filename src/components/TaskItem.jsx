export default function TaskItem({ task, onToggle, onDelete }) {
    return (
        <div
            className={`p-3 rounded border shadow-sm flex justify-between items-center ${
                task.completed ? "bg-green-100 line-through text-gray-500" : "bg-white"
            }`}
        >
        <div
            className="flex-1 cursor-pointer"
            onClick={onToggle}
        >
            <div className="font-medium">{task.title}</div>
            <div className="font-sm text-gray-500">До: {task.dueDate}</div>

        </div>
            <button
                onClick={onDelete}
                className="text-sm text-red-600 hover:underline ml-4"
            >
                🗑 Видалити
            </button>
        </div>
    );
}
