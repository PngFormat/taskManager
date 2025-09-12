import {str} from "ajv";

interface KeyMetricsProps {
    tasks: any[];
    period: "day" | "week" | "month";
}

export default function KeyMetrics({ tasks, period }: KeyMetricsProps ) {
    const now = new Date()

    const filtered = tasks.filter(task => {
        const date = new Date(task.completedAt || task.updatedAt || task.dueDate);
        if (period === "day") {
            return date.toDateString() === now.toDateString();
        }
        if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo && date <= now;
        }
        if (period === "month") {
            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        }
        return true;
    });

    const completed = filtered.filter(t => t.completed);
    const total = filtered.length;

    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;
    const onTime = completed.filter(t => t.dueDate && new Date(t.completedAt) <= new Date(t.dueDate));

    const onTimeRate = completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 0;
    const avgTime = completed.length > 0
    ? Math.round(
        completed.reduce((acc, t) => {
            const created = new Date(t.createdAt).getTime();
            const finished = new Date(t.completedAt).getTime();
            return acc + (finished - created);
        }, 0) /
            completed.length /
            (1000 * 60 * 60)
        )
        : 0;

    const dates = Array.from(
        new Set(completed.map(t => new Date(t.completedAt).toDateString()))
    ).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    let streak = 0;
    let maxStreak = 0;
    for (let i = 0; i < dates.length; i++ ){
        if (i === 0) {
            streak = 1;
        } else {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
            }else {
                maxStreak = Math.max(maxStreak, streak);
                streak = 1;
            }
        }
    }
    maxStreak = Math.max(maxStreak, streak);

    let prevFiltered: any[] = [];
    if (period === "week") {
        const prevWeekStart = new Date();
        prevWeekStart.setDate(now.getDate() - 14);
        const prevWeekEnd = new Date();
        prevWeekEnd.setDate(now.getDate() - 7);

        prevFiltered = tasks.filter(t => {
            const date = new Date(t.completedAt || t.updatedAt || t.dueDate);
            return date >= prevWeekStart && date < prevWeekEnd;
        });
    }

    const prevCompleted = prevFiltered.filter(t => t.completed).length;
    const diff = prevCompleted > 0
    ? Math.round(((completed.length - prevCompleted) / prevCompleted) * 100)
        : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-blue-100 rounded-2xl shadow-md text-center flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{completionRate}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="p-4 bg-yellow-100 rounded-2xl shadow-md text-center flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{onTimeRate}%</div>
                <div className="text-sm text-gray-600">Вчасно виконані</div>
            </div>
            <div className="p-4 bg-purple-100 rounded-2xl shadow-md text-center flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{avgTime} год</div>
                <div className="text-sm text-gray-600">Середній час виконання</div>
            </div>
            <div className="p-4 bg-blue-100 rounded-2xl shadow-md text-center flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{maxStreak} дн.</div>
                <div className="text-sm text-gray-600">Streak</div>
            </div>
            {period === "week" && (
                <div className="col-span-2 md:col-span-4 p-4 bg-pink-100 rounded-lg shadow text-center">
                    <div className="text-lg font-bold">
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                    </div>
                    <div className="text-sm text-gray-600">Порівняно з минулим тижнем</div>
                </div>
            )}
        </div>
    );
}