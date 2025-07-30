export default function TaskItem({ task, onToggle, onDelete }) {
    return (
        <div
            className={`p-3 rounded border shadow-sm flex justify-between items-center ${
                task.completed ? "bg-green-100 line-through text-gray-500" : "bg-white"
            }`}
        >
      <span onClick={onToggle} className="cursor-pointer flex-1">
        {task.title}
      </span>
            <button
                onClick={onDelete}
                className="text-sm text-red-600 hover:underline ml-4"
            >
                🗑 Видалити
            </button>
        </div>
    );
}
