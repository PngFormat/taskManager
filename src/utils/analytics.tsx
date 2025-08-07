import { startOfDay, format, isThisWeek, isSameDay } from "date-fns";

export default function getProductivityStats(tasks) {
    const completed = tasks.filter((t) => t.completed && t.completedAt);

    const perDay = {};
    let totalWeek = 0;

    completed.forEach((task) => {
        const day = format(new Date(task.completedAt), "yyyy-MM-dd");
        if (!perDay[day]) perDay[day] = 0;
        perDay[day]++;

        if (isThisWeek(new Date(task.completedAt))) {
            totalWeek++;
        }
    });

    return { perDay, totalWeek };
}
