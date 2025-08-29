import React from 'react';

export default function TopProductiveDays({tasks}) {
    const completedTasks = tasks.filter(task => task.completed);

    const tasksByDay = completedTasks.reduce((acc, task) => {
        const date = new Date(task.completedAt || task.updatedAt || task.dueDate);
        const day = date.toLocaleDateString("ru-RU", { weekday: "long" });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});

    const sortedDays = Object.entries(tasksByDay)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-semibold mb-3"> Найбільш продуктивні дні</h3>
            {sortedDays.length === 0 ? (
                <p className="text-gray-500">Поки що немає заверешених задач</p>
            ) : (
                <ul className="space-y-2">
                    {sortedDays.map(([day, count], i) => (
                        <li key={day} className="flex justify-between">
                            <span>
                                {i + 1}. {day}
                            </span>
                            <span className="font-bold">{count} задач</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}