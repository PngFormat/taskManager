import {useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";

type ReportItem = {
    method: "Pomodoro" | "GTD" | "Kanban" | "Eisenhower";
    completed: number;
    onTimeRate: number;
    avgCycleMinutes: number;
    interruptions: number;
};

export default function ResearchPage() {
    const [report, setReport] = useState<ReportItem[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/experiment/report")
            .then((r) => r.json())
            .then((d) => setReport(d.report || []));
    }, [])

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">📚 Дослідження методів</h1>
                <p className="text-gray-600 mb-4">
                    Порівнюємо Pomodoro, GTD, Kanban та Eisenhower за метриками: on-time
                    rate, середній цикл, кількість перерв.
                </p>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 border">Метод</th>
                            <th className="px-3 py-2 border">Виконано</th>
                            <th className="px-3 py-2 border">On-time</th>
                            <th className="px-3 py-2 border">Avg цикл (хв)</th>
                            <th className="px-3 py-2 border">Перерви</th>
                        </tr>
                        </thead>
                        <tbody>
                        {report.map((r) => (
                            <tr key={r.method}>
                                <td className="px-3 py-2 border font-semibold">{r.method}</td>
                                <td className="px-3 py-2 border">{r.completed}</td>
                                <td className="px-3 py-2 border">
                                    {Math.round(r.onTimeRate * 100)}%
                                </td>
                                <td className="px-3 py-2 border">{r.avgCycleMinutes}</td>
                                <td className="px-3 py-2 border">{r.interruptions}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}