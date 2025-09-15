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
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">🧘‍♀️ Режим фокуса</h1>

            {focusedTaskId && (
                <PomodoroTimer
                    task={tasks.find(t => t._id === focusedTaskId)}
                    onStop={stopFocus}
                    onCompleteTask={completeTask}
                />
            )}
            <div className="mt-4">
                <p>⏱ Всего времени в фокусе: {(totalTime / 60000).toFixed(1)} хв</p>
                <p>📊 Средняя сессия: {(avgSession / 60000).toFixed(1)} хв</p>
                <p>🔄 Количество сессий: {sessions.length}</p>

            </div>

            {isFocusActive && (
                <p className="text-center text-red-600 font-semibold">
                    🚫 Доступна только задача в фокусе.
                </p>
            )}


            <div className={`${isFocusActive ? "opacity-50 pointer-events-none" : ""}`}>
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

