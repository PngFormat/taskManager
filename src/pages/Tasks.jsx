import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const Tasks = ({ tasks }) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const upcoming = tasks.slice(0, 3);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">🎯 Панель керування</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-semibold">Всього завдань</h2>
                    <p className="text-2xl text-blue-600 font-bold">{total}</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-semibold">Завершено</h2>
                    <p className="text-2xl text-green-600 font-bold">{completed}</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-semibold">До виконання</h2>
                    <p className="text-2xl text-yellow-600 font-bold">{total - completed}</p>
                </div>
            </div>

            <div className="mb-6">
                <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                    ➕ Додати нове завдання
                </Link>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">📌 Найближчі завдання</h2>
                {upcoming.length > 0 ? (
                    <ul className="space-y-2">
                        {upcoming.map((task) => (
                            <li
                                key={task.id}
                                className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                            >
                                <span className={task.completed ? "line-through text-gray-500" : ""}>
                                    {task.title}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {task.completed ? "✅" : "⏳"}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Завдань немає.</p>
                )}
            </div>
        </div>
    );
};

export default Tasks;

