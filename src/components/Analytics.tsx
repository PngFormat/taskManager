import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import TaskHistory from "./TaskHistory.tsx";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ff6f91", "#00c49f", "#ffbb28"];

export default function ProductivityAnalytics({ tasks }) {
    const completedTasks = tasks.filter(task => task.completed);

    const tasksByDay = completedTasks.reduce((acc, task) => {
        const date = new Date(task.completedAt || task.updatedAt || task.dueDate);
        const day = date.toLocaleDateString("ru-RU", { weekday: "long" });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.entries(tasksByDay).map(([day, count]) => ({
        name: day,
        tasks: count
    }));

    const priorityData = completedTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(priorityData).map(([priority, value]) => ({
        name: priority,
        value
    }));

    const now = new Date();
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.filter(t => !t.completed && new Date(t.dueDate) >= now).length;
    const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length;

    const statusData = [
        { name: "Виконано", value: completedCount },
        { name: "У процесі", value: pendingCount },
        { name: "Просрочено", value: overdueCount },
    ]


    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📊 Аналитика продуктивности</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tasks" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8">
                    <TaskHistory tasks={tasks} />
                </div>
            </div>
        </div>
    );
}
