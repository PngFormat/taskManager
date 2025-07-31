import React, {FC, useState } from "react";

import dayjs from "dayjs";

interface Task {
    id: number;
    title: string;
    completed: boolean;
    dueDate: string;
}

interface CalendarProps {
    tasks: Task[];
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const Calendar: FC<CalendarProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

    const calendarDays: (number | null) [] = [];



    for (let i = 0; i < startDay; i++ ) {
        calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++ ) {
        calendarDays.push(i);
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
                    const dateStr = day
                        ? currentDate.date(day).format("YYYY-MM-DD")
                        : null;

                    const tasksForday = dateStr
                        ? tasks.filter((task) => task.dueDate === dateStr)
                        : [];

                    return (
                        <div
                            key={index}
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
        </div>
    )
};

export default Calendar;
