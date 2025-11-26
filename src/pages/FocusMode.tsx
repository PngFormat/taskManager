import { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import PomodoroTimer from "../components/PomodoroTimer.tsx";
import useFocusStats from "../hooks/useFocusStats.tsx";

export default function FocusMode({ tasks, setTasks, toggleTask, deleteTask, updateTask }) {
    const [isFocusActive, setIsFocusActive] = useState(false);
    const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
    const {sessions, addSession , totalTime, avgSession} = useFocusStats();
    const [startTime, setStartTime] = useState<number | null>(null);

    const startFocus = (taskId: string) => {
        setFocusedTaskId(taskId);
        setIsFocusActive(true);
        setStartTime(Date.now());
    };

    const stopFocus = () => {
        if (focusedTaskId && startTime) {
            const duration = Date.now() - startTime
            addSession(duration);
        }
        setIsFocusActive(false);
        setFocusedTaskId(null);
        setStartTime(null);

    }

    const completeTask = async (taskId: string) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: true, completedAt: new Date().toISOString() }),
            });

            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: true } : t));

            stopFocus();

        } catch (err) {
            console.error("Не удалось завершить задачу", err);
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">🧘‍♀️ Режим фокуса</h1>

            {focusedTaskId && (
                <div className="mb-8">
                    <PomodoroTimer
                        task={tasks.find(t => t._id === focusedTaskId)}
                        onStop={stopFocus}
                        onCompleteTask={completeTask}
                    />
                </div>
            )}
            <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-indigo-500/20 shadow-md">
                    <p className="text-lg font-semibold text-indigo-600">
                         {(totalTime / 60000).toFixed(1)} хв
                    </p>
                    <span className="text-sm text-gray-600">Всього у фокусі</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-500/20 shadow-md">
                    <p className="text-lg font-semibold text-green-600">
                        {(avgSession / 60000).toFixed(1)} хв
                    </p>
                    <span className="text-sm text-gray-600">Середня сесія</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-pink-500/20 shadow-md">
                    <p className="text-lg font-semibold text-pink-600">{sessions.length}</p>
                    <span className="text-sm text-gray-600">Сессій</span>
                </div>
            </div>

            {isFocusActive && (
                <p className="text-center text-red-600 font-semibold mb-6">
                    🚫 Доступне лише завдання у фокусі.
                </p>
            )}


            <div className={`transition-all duration-500 ${
                isFocusActive ? "opacity-40 blur-sm pointer-events-none" : ""
            }`}>
                <TaskList
                    tasks={tasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    disabled={isFocusActive}
                    focusedTaskId={focusedTaskId}
                    onFocusSelect={startFocus}
                />
            </div>
        </div>
    );
}

