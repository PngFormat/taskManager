import {useState} from "react";

export default function useFocusPenalty(getModeTime) {
    const [interruptions, setInterruptions] = useState(0);
    const [focusScore, setFocusScore] = useState(100);

    const calcEarlyStopPenalty = (mode, secondsRemaining) => {
        if (mode !== "focus") return 0;

        const total = getModeTime("focus");
        const completedPercent = ((total - secondsRemaining)  / total) * 100;

        if (completedPercent < 50) return 20;
        if (completedPercent < 100) return 10;

        return 0;
    };

    const registerPause = (mode, secondsRemaining) => {
        if (mode === "focus") {
            setInterruptions((prev) => prev + 1);
            const penalty = calcEarlyStopPenalty(mode, secondsRemaining);
            setFocusScore((prev) => Math.max(0, prev - penalty));
        }
    };

    const registerInterrupt = (mode, secondsRemaining) => {
        if (mode === "focus") {
            setInterruptions((prev) => prev + 1);
            const penalty = calcEarlyStopPenalty(mode, secondsRemaining);
            setFocusScore((prev) => Math.max(0, prev - penalty));
        }
    };

    const registerReset = (mode, secondsRemaining) => {
        if (mode === "focus" && secondsRemaining < getModeTime("focus")) {
            setInterruptions((prev) => prev + 1);
            const penalty = calcEarlyStopPenalty(mode, secondsRemaining);
            setFocusScore((prev) => Math.max(0, prev - penalty));
        }
    };

    const onSessionComplete = (mode) => {
        if (mode === "focus") {
            setFocusScore((prev) => Math.min(100, prev + 5));
        }
    };

    return {
        interruptions,
        focusScore,

        registerPause,
        registerReset,
        registerInterrupt,
        onSessionComplete,
    };
}