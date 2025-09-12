import {useState} from "react";

export default function FocusStatsCard({sessions, totalTime, avgSession, onReset}) {

    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100
            rounded-2xl shadow-md border border-yellow-200
            transition transform hover:scale-[1.02 hover:shadow-lg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <h3 className="font-bold mb-2">⏱ Focus Mode Stats</h3>
            <p>Усього: {(totalTime / 3600000).toFixed(1)} ч</p>
            <p>Середня сессія: {(avgSession / 60000).toFixed(1)} хв</p>
            <p> Сессій: {sessions.length}</p>
        </div>
    )
}