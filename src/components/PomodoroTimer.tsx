import {useEffect, useRef, useState} from "react";
import {useMethodTracking} from "../hooks/useMethodTracking.tsx";

const TIMER_MODES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export default function PomodoroTimer({ task, onCycleComplete, onStart, onStop, onCompleteTask }) {
    const [seconds, setSeconds] = useState(TIMER_MODES.focus);
    const [mode, setMode] = useState("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef(null);
    const { log } = useMethodTracking();
    const [animate, setAnimate] = useState(false);

    useEffect(() => clearInterval(intervalRef.current), []);

    const start = () => {
        if (isRunning) return;
        setIsRunning(true);
        logEvent("start");

        intervalRef.current = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) {
                    clearInterval(intervalRef.current);
                    handleFinish();
                    return 0;
                }
                return s - 1;
            })

        }, 1000)
    };

    const pause = () => {
        if (!isRunning) return;
        setIsRunning(false);
        clearInterval(intervalRef.current);
        logEvent("pause");
    }

    const reset = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setSeconds(TIMER_MODES[mode])
        logEvent("reset");
    }

    const interrupt = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        logEvent("interrupt");
    }

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning])

    const handleFinish = async () => {

        setIsRunning(false);
        logEvent("complete", mode);

        const audio = new Audio("/notify.mp3");
        audio.play().catch(() => {});

        setAnimate(true);
        setTimeout(() => setAnimate(false), 1500);

        if (mode === "focus") {
            const newCycles = cycles + 1;
            setCycles(newCycles);

            if ( task ) {
                await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type" : "application/json" },
                    body: JSON.stringify({pomodoroCycles: newCycles}),
                });
            }
            const nextMode = newCycles % 4 === 0 ? "longBreak" : "shortBreak";
            setMode(nextMode);
            setSeconds(TIMER_MODES[nextMode]);
        } else {
            setMode("focus");
            setSeconds(TIMER_MODES.focus);
        }

        onCycleComplete?.(mode);
    };

    const logEvent = (event, extraMode = null) => {
        if (!task) return;
        log({
            taskId: task._id,
            method: task.method,
            event,
            mode: extraMode || mode,
        });
    };

    const finishTask = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        logEvent("complete", mode);

        if (onCompleteTask && task) {
            onCompleteTask(task._id);
        }
        onStop?.(task);
    }

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const totalTime = TIMER_MODES[mode];
    const progress = Math.min(((totalTime - seconds) / totalTime) * 100, 100);


    return (
        <div className={`p-3 border rounded flex flex-col items-center gap-3 transition ${animate ? "animate-pulse bg-green-100" : ""}`}>
            <h2 className="text-lg font-bold text-center">
                Задача: <span className="text-blue-600"> {task?.title}</span>
                {task?.dueDate && (
                    <span className="text-sm text-gray-500 ml-2">(Дедлайн: {new Date(task.dueDate).toLocaleDateString()})</span>
                )}
            </h2>
            <h2 className="text-xl font-bold capitalize">
                {mode === "focus"
                    ? "Фокус"
                : mode === "shortBreak"
                    ? "Перерва"
                    : "Довга перерва"}
            </h2>

            <div className="text-4xl"> {mm}: {ss}</div>

            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                <div
                    className="bg-green-500 h-4 transition-all"
                    style={{width: `${progress}%`}}
                />
            </div>
            <p className="text-sm text-gray-700">
                Заверешно циклів: {cycles} з 4
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={start} className="px-4 py-1 bg-green-600 text-white rounded">Старт</button>
                <button onClick={pause} className="px-4 py-1 bg-yellow-500 text-white rounded">Пауза</button>
                <button onClick={reset} className="px-3 py-1 bg-gray-600 text-white rounded">Скинути</button>
                <button onClick={interrupt} className="px-3 py-1 bg-red-600 text-white rounded">Перерва</button>
                <button onClick={finishTask} className="px-3 py-1 bg-blue-600 text-white rounded">Завершити задачу</button>
                <button onClick={onStop} className="px-3 py-1 bg-purple-600 text-white rounded">Снять фокус</button>
            </div>
        </div>
    );
}