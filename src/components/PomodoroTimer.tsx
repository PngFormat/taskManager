import {useEffect, useRef, useState} from "react";
import {useMethodTracking} from "../hooks/useMethodTracking.tsx";
import PomodoroProgress from "./PomodoroProgress.tsx";
import PomodoroSettings from "./PomodoroSettings.tsx";
import PomodoroControls from "./PomodoroControls.tsx";

export default function PomodoroTimer({ task, onStop, onCompleteTask }) {

    const defaultSettings = {
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
        cyclesBeforeLongBreak: 4,
    };

    const [settings, setSettings] = useState(() => {
        return { ...defaultSettings, ...JSON.parse(localStorage.getItem("pomodoroSettings") || "{}") };
    });

    const [seconds, setSeconds] = useState(settings.focus * 60);
    const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
    const [isRunning, setIsRunning] = useState(false);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef(null);
    const { log } = useMethodTracking();
    const [animate, setAnimate] = useState(false);


    useEffect(() => clearInterval(intervalRef.current), []);

    useEffect(() => {
        if (mode === "focus") setSeconds(settings.focus * 60);
        if (mode === "shortBreak") setSeconds(settings.shortBreak * 60);
        if (mode === "longBreak") setSeconds(settings.longBreak * 60);
    }, [settings, mode]);

    const getModeTime = (m) => {
        if (m === "focus") return settings.focus * 60;
        if (m === "shortBreak") return settings.shortBreak * 60;
        if (m === "longBreak") return settings.longBreak * 60;
        return 0;
    };

    const start = () => {
        if (isRunning) return;
        setIsRunning(true);
        logEvent("start");

    };

    const pause = () => {
        if (!isRunning) return;
        setIsRunning(false);
        logEvent("pause");
    };

    const reset = () => {
        setIsRunning(false);
        setSeconds(getModeTime(mode));
        logEvent("reset");
    };

    const interrupt = () => {
        setIsRunning(false);
        logEvent("interrupt");
    }

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current!);
    }, [isRunning]);

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

            if (task) {
                await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pomodoroCycles: newCycles }),
                });
            }

            const nextMode =
                newCycles % settings.cyclesBeforeLongBreak === 0 ? "longBreak" : "shortBreak";
            setMode(nextMode);
            setSeconds(getModeTime(nextMode));
        } else {
            setMode("focus");
            setSeconds(getModeTime("focus"));
        }
    };

    const logEvent = (event: string, extraMode: string | null = null) => {
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
        clearInterval(intervalRef.current!);
        logEvent("complete", mode);

        if (onCompleteTask && task) {
            onCompleteTask(task._id);
        }
        onStop?.(task);
    };

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const totalTime = getModeTime(mode);
    const progress = Math.min(((totalTime - seconds) / totalTime) * 100, 100);

    const bgColors = {
        focus: isRunning ? "bg-red-200" : "bg-red-300",
        shortBreak: isRunning ? "bg-green-200" : "bg-green-300",
        longBreak: isRunning ? "bg-blue-200" : "bg-blue-300",
    };


    return (
        <div
            className={`p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 transition-colors duration-700 ${bgColors[mode]}`}
        >
            <h2 className="text-lg font-bold text-center">
                Задача: <span className="text-blue-600">{task?.title}</span>
                <PomodoroSettings settings={settings} setSettings={setSettings} />
            </h2>

            <h2 className="text-xl font-bold capitalize">
                {mode === "focus"
                    ? "Фокус"
                    : mode === "shortBreak"
                        ? "Перерва"
                        : "Довга перерва"}
            </h2>

            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="90"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-300"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="90"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-green-500 transition-all duration-500"
                        strokeDasharray={2 * Math.PI * 90}
                        strokeDashoffset={
                            2 * Math.PI * 90 * (1 - progress / 100)
                        }
                    />
                </svg>
                <div className="absolute text-3xl font-bold">
                    {mm}:{ss}
                </div>
            </div>

            <PomodoroProgress
                cycles={cycles}
                cyclesBeforeLongBreak={settings.cyclesBeforeLongBreak}
            />

            <p className="text-sm text-gray-700">
                Завершено циклів: {cycles} з {settings.cyclesBeforeLongBreak}
            </p>

            <PomodoroControls
                start={start}
                pause={pause}
                reset={reset}
                interrupt={interrupt}
                finishTask={finishTask}
                onStop={onStop}
            />
        </div>
    );
}