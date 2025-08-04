import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, disabled }) {
    if (tasks.length === 0)
        return <p className="text-center text-gray-500">Задач поки немає 🙌</p>;

    return (
        <div className="space-y-2">
            {tasks.map((task) => {
                return (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onToggle(task.id)}
                        onDelete={() => onDelete(task.id)}
                        disabled={disabled}
                    />
                );
            })}
        </div>
    );
}
