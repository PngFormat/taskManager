import {useEffect, useState} from "react";

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
        if (mode === "focus") {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            setMode(newCycles % 4 === 0 ? "longBreak" : "shortBreak");
            setSeconds(newCycles % 4 === 0 ? TIMER_MODES.longBreak : TIMER_MODES.shortBreak);
        }
        else {
            setMode("focus");
            setSeconds(TIMER_MODES.focus);
        }
        setIsRunning(false);
        onStop?.();
        onCycleComplete?.(mode);
    };

    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return (
        <div className="text-center space-y-4">
            <h2 className="text-xl font-bold capitalize">{mode === "focus" ? "Фокус"
                : mode === "shortBreak"
                    ? "Перерва"
                    : "Довга перерва"}</h2>
            <div className="text-4xl"> {minutes}: {secs}</div>
            <div className="space-x-2">
                <button
                    onClick={() => {
                        setIsRunning(true);
                        onStart?.();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Старт
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        onStop?.();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                    Пауза
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setSeconds(TIMER_MODES[mode]);
                        onStop?.();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Скинути
                </button>
            </div>
        </div>
    );
}