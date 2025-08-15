import React, {FC, useState } from "react";
import AddTaskModal from "../components/AddTaskModal.tsx";
import dayjs from "dayjs";


interface Task {
    id: number;
    title: string;
    completed: boolean;
    dueDate: string;
    repeat?: "none" | "daily" | "weekly" | "monthly";
}

interface CalendarProps {
    tasks: Task[];
    onAddTask: (task: {title: string; dueDate: string}) => void;
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const Calendar: FC<CalendarProps> = ({ tasks,onAddTask }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

    const calendarDays: (number | null) [] = [];

    const isTaskOnDate = (task: Task & {repeat?: String}, date: dayjs.Dayjs) => {
        const taskDate = dayjs(task.dueDate);

        if (!task.repeat || task.repeat === "none") {
           return taskDate.isSame(date, "day");
        }

        if (task.repeat === "daily") {
            return taskDate.isSameOrAfter(taskDate, "day");
        }

        if (task.repeat === "weekly") {
            return taskDate.isSameOrAfter(taskDate, "day") && date.day() === taskDate.day();
        }

        if (task.repeat === "monthly") {
            return taskDate.isSameOrAfter(taskDate, "day") && date.day() === taskDate.day();
        }

        return false;

    }

    for (let i = 0; i < startDay; i++ ) {
        calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++ ) {
        calendarDays.push(i);
    }

    const openAddModal = (day: number) => {
        const dateStr = currentDate.date(day).format("YYYY-MM-DD")
        setSelectedDate(dateStr);
        setIsModalOpen(true);
    }



    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">🗓️ Календар</h1>

            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                >
                    ⬅ Попередній
                </button>
                <h2 className="text-xl font-semibold">
                    {currentDate.format("MMMM YYYY")}
                </h2>
                <button
                    onClick={nextMonth}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                >
                    Наступний ➡
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-700">
                {daysOfWeek.map((day) => (
                    <div key={day} className="uppercase text-sm">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2">
                {calendarDays.map((day,index) => {
                    if (!day) {
                        return (
                            <div
                                key={index}
                                className="min-h-[100px] p-1 rounded-lg border bg-transparent border-none"
                            >
                            </div>
                        );
                    }

                    const dateObj = currentDate.date(day);

                    const tasksForday = tasks.filter((task) => isTaskOnDate(task, dateObj));

                    return (
                        <div
                            key={index}
                            onClick={() => openAddModal(day)}
                            className={`min-h-[100px] p-1 rounded-lg border ${
                            day
                                ?  "bg-white hover:bg-blue-50 cursor-pointer"
                                : "bg-transparent border-none"
                            }`}
                        >
                            {day && (
                                <>
                                    <div className="text-sm font-semibold">{day}</div>
                                    <ul className="text-xs mt-1 space-y-1">
                                        {tasksForday.map((task) => (
                                            <li
                                                key={task.id}
                                                className={`truncate ${
                                                    task.completed
                                                    ? "text-green-600 line-through" 
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                • {task.title}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={onAddTask}
                selectedDate={selectedDate || ""}
            />
        </div>
    )
};

export default Calendar;
