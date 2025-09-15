import {useMemo, useState} from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";
import {Link} from "react-router-dom";

export default function TaskHistory({ tasks}) {
    const completedTasks = tasks.filter(task => task.completed);
    const [filter, setFilter] = useState("all");
    const now = new Date();

    const getPriorityIcon = (priority: string) => {
        switch ( priority ) {
            case "high" : return "🔥";
            case "medium": return "⚡";
            case "low": return "💤";
            default: return "📌";
        }
    }

    const getStatus = (task) => {
        if (!task.completed) return "⏳ У процессі";
        return "✅ Завершено";
    }

    const chartData = useMemo(() => {
        const grouped: Record<string, number[]> = {};


        completedTasks.forEach(task => {
            const end = task.completed ? new Date(task.completedAt) : null
            if (!end) return;
            const day = end.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
            const start = new Date(task.startedAt || task.createdAt);
            const duration = end.getTime() - start.getTime();

            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(duration / 60000);
        });

        return Object.keys(grouped).map(day => {
            const durations = grouped[day];
            const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
            return {
                day,
                count: durations.length,
                avg: parseFloat(avg.toFixed(1))
            };
        });
    }, [completedTasks]);

    const filteredTasks = completedTasks.filter(task => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);

        switch (filter) {
            case "today": {
                return completedDate.toDateString() === now.toDateString()
            }
            case "week": {
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return completedDate >= weekAgo && completedDate <= now;
            }
            case "month": {
                return (
                    completedDate.getMonth() === now.getMonth() &&
                        completedDate.getFullYear() === now.getFullYear()
                );
            }
            default:
                return true;
        }
    })

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📜 История выполнения</h2>

            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-2 py-1"
            >
                <option value="all">Все</option>
                <option value="today">Сьогодні</option>
                <option value="week">Ця неділя</option>
                <option value="month">Цей місяць</option>
            </select>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-300 mt-5 ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Назва</th>
                            <th className="px-4 py-2 border">Пріоритет</th>
                            <th className="px-4 py-2 border">Дата завершення</th>
                            <th className="px-4 py-2 border">Час виконання</th>
                            <th className="px-4 py-2 border">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map(task => {
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
                        const hours = Math.floor(durationMs / (1000 * 60 * 60));
                        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
                            return (
                                <tr key={task.id}>
                                    <td className="px-4 py-2 border">{task.title}</td>
                                    <td className="px-4 py-2 border">{getPriorityIcon(task.priority)}</td>
                                    <td className="px-4 py-2 border">{end.toLocaleString()}</td>
                                    <td className="px-4 py-2 border">
                                        {hours > 0 ? `${hours} ч `: ""}
                                        {minutes} мин
                                    </td>
                                    <td className="px-4 py-2 border">{getStatus(task)}</td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="font-bold mb-2">📊 Заверешені задачі по дням</h3>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="day"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="font-bold mb-2">⏱ Середній час виконання </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="day"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="avg" stroke="#16a34a" strokeWidth={2} dot/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}