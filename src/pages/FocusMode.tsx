import PomodoroTimer from "../components/PomodoroTimer.tsx";
import {useState} from "react";
import TaskList from "../components/TaskList";

export default function FocusMode({ tasks, toggleTask, deleteTask}) {
    const [isFocusActive, setIsFocusActive] = useState<boolean>(false);

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">🧘‍♀️ Режим фокуса</h1>
            <PomodoroTimer
                onStart={() => setIsFocusActive(true)}
                onStop={() =>  setIsFocusActive(false)}/>

            {isFocusActive && (
                <p className="text-center text-red-600 font-semibold">
                    🚫 Задачі тимчасово заблоковані. Завершіть сесію фокуса.
                </p>
            )}

            <div className={`${isFocusActive ? "opacity-50 pointer-events-none" : ""}`}>
                <TaskList
                    tasks={tasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    disabled={isFocusActive}
                />

            </div>
        </div>
    )
}