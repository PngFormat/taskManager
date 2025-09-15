import {useState} from "react";


export default function useFocusStats() {
    const [sessions, setSessions] = useState<number[]>(() => {
        const saved = localStorage.getItem("focusSessions");
        return saved ? JSON.parse(saved) : [];
    });

    const addSession = (duration: number) => {
        const updated = [...sessions, duration];
        setSessions(updated);
        localStorage.setItem("focusSessions", JSON.stringify(updated));
    };

    const totalTime = sessions.reduce((sum, s) => sum + s, 0);
    const avgSession = sessions.length ? totalTime / sessions.length : 0;

    return {sessions, addSession, totalTime, avgSession}
}