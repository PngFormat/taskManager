import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    LineChart
} from "recharts";
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

    const hoursData = completedTasks.reduce((acc, task) => {
        const hour = new Date(task.completedAt || task.updatedAt || task.dueDate).getHours();
        acc[hour] = (acc[hour] || 0 ) + 1;
        return acc;
    }, {} );

    const hoursChart = Object.entries(hoursData).map(([hour, count]) => ({
        hour: `${hour}:00`,
        tasks: count
    }));

    const weeklyData = completedTasks.reduce((acc, task) => {
        const date = new Date(task.completedAt || task.updateAt || task.dueDate);
        const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
        acc[week] = (acc[week] || 0) + 1;
        return acc;
    })

    const weeklyChart = Object.entries(weeklyData).map(([week, count]) => ({week, tasks: count}));

    const categoryData = tasks.reduce((acc, task) => {
        if (!task.category) return acc;
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

     const categoryChart = Object.entries(categoryData).map(([category, value]) => ({ name: category, value}));


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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hoursChart}>
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="tasks" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyChart}>
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type='monotone' dataKey="tasks" stroke='#ff6f91' />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {categoryChart.length > 0 && (
                    <div className="h-64 mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryChart} cx="50%" cy="50%" outerRadius={80} dataKey={value} label>
                                    {categoryChart.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="mt-8">
                    <TaskHistory tasks={tasks} />
                </div>
            </div>
        </div>
    );
}
