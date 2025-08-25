export default function TaskHistory({ tasks}) {
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📜 История выполнения</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Назва</th>
                            <th className="px-4 py-2 border">Пріоритет</th>
                            <th className="px-4 py-2 border">Дата завершення</th>
                            <th className="px-4 py-2 border">Час виконання</th>
                        </tr>
                    </thead>
                    <tbody>
                        { completedTasks.map( task => {
                            const start = new Date(task.startedAt || task.createdAt);
                            const end = task.completedAt ? new Date(task.completedAt) : null;


                            if (!end || isNaN(end.getTime())) {
                                return (
                                    <tr key={task._id || task.id}>
                                        <td className="px-4 py-2 border">{task.title}</td>
                                        <td className="px-4 py-2 border">{task.priority}</td>
                                        <td className="px-4 py-2 border">Не завершено</td>
                                        <td className="px-4 py-2 border">-</td>
                                    </tr>
                                )
                            }

                            const durationMs = end.getTime() - start.getTime();
                            const hours = Math.floor( durationMs / (1000 * 60 * 60));
                            const minutes = Math.floor((durationMs / (1000 * 60)) % 60);

                            return (
                                <tr key={task.id}>
                                    <td className="px-4 py-2 border">{task.title}</td>
                                    <td className="px-4 py-2 border">{task.priority}</td>
                                    <td className="px-4 py-2 border">{end.toLocaleString()}</td>
                                    <td className="px-4 py-2 border">
                                        {hours > 0 ? `${hours} ч `: ""}
                                        {minutes} мин
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}