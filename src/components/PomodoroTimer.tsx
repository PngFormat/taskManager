import {useEffect, useRef, useState} from "react";
import {useMethodTracking} from "../hooks/useMethodTracking.tsx";
import next from "ajv/dist/vocabularies/next";

const TIMER_MODES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export default function PomodoroTimer({onCycleComplete, onStart, onStop}) {
    const [seconds, setSeconds] = useState(TIMER_MODES.focus);
    const [mode, setMode] = useState("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef(null);
    const { log } = useMethodTracking();

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

    const handle

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

    const handleFinish = () => {

        setIsRunning(false);
        logEvent("complete", mode);

        if (mode === "focus") {
            const newCycles = cycles + 1;
            setCycles(newCycles);
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

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");


    return (
        <div className="p-3 border rounded flex flex-col items-center gap-3">
            <h2 className="text-xl font-bold capitalize">
                {mode === "focus"
                    ? "Фокус"
                : mode === "shortBreak"
                    ? "Перерва"
                    : "Довга перерва"}
            </h2>

            <div className="text-4xl"> {mm}: {ss}</div>

            <div className="flex gap-2">
                <button
                    onClick={start}
                    className="px-4 py-1 bg-green-600 text-white rounded"
                >
                    Старт
                </button>

                <button
                    onClick={pause}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                    Пауза
                </button>
                <button
                    onClick={reset}
                    className="px-3 py-1 bg-gray-600 text-white rounded"
                >
                    Скинути
                </button>

                <button
                    onClick={interrupt}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                >
                    Перерва
                </button>
            </div>
        </div>
    );
}