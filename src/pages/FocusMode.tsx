import PomodoroTimer from "../components/PomodoroTimer.tsx";
import {useState} from "react";
import TaskList from "../components/TaskList";

export default function FocusMode({ tasks, toggleTask, deleteTask}) {
    const [isFocusActive, setIsFocusActive] = useState<boolean>(false);
    const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

    const startFocus = (taskId: string) => {
        setFocusedTaskId(taskId);
        setIsFocusActive(true);
    };

    const stopFocus = () => {
        setIsFocusActive(false);
        setFocusedTaskId(null);
    }


    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">🧘‍♀️ Режим фокуса</h1>

            {focusedTaskId && (
                <PomodoroTimer
                    onStop={() => {
                        setIsFocusActive(false);
                        setFocusedTaskId(null);
                    }}
                />
            )}

            {isFocusActive && (
                <p className="text-center text-red-600 font-semibold">
                    🚫 Доступна тільки задача у фокусі.
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
    )
}