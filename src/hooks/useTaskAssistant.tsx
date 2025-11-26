import {useMemo} from "react";

export default function useTaskAssistant (tasks) {
    return useMemo(() => {
        if (!tasks.length) return "Добавьте задачи, чтобы я мог помочь  😉 ";

        const now = new Date();
        const overdue = tasks.filter(t => new Date(t.dueDate) < now && !t.completed);
        const highPriority = tasks.filter(t => t.priority === "hight" && !t.completed);
        const soonDeadline = tasks
            .filter(t => !t.completed)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

        const completedCount = tasks.filter(t => t.completed).length;
        const completionRate = Math.round((completedCount / tasks.length) * 100);
        const overloadDays = Object.values(
            tasks.reduce((acc, t) => {
                const date = new Date(t.dueDate).toDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {})
        ).filter(count => count > 3).length;

        const recommendations = [];

        if (overdue.length) {
            recommendations.push(`⚠️ У вас ${overdue.length} протермінованих задач. Почніть з "${overdue[0].title}".`);
        }
        if (highPriority.length) {
            recommendations.push(`🔥 Порада: візьміться за задачу з высоким пріорітетом ${highPriority[0].title}`)
        }
        if (soonDeadline) {
            recommendations.push(`⏳ Раджу зробити "${soonDeadline.title}", термін — ${soonDeadline.dueDate}.`);
        }


        if (overloadDays > 0 ) {
            recommendations.push(`🛑 У ${overloadDays} дн. дуже багато задач.Подумайте о перенесенні частини`)
        }

        if (!overdue.length && completionRate > 80) {
            recommendations.push("🎉 Чудова робота! Тримайте темп.");

        }

        return {recommendations, progress: completionRate }

    }, [tasks])
}