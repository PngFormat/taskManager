import ProductivityAnalytics from "../components/Analytics.tsx";
import useTaskAssistant from "../hooks/useTaskAssistant.tsx";
import {useState} from "react";


export default function ProductivityPage({tasks}) {
    const [showProgress , setShowProgress] = useState(false);
    const { recommendations, progress} = useTaskAssistant(tasks)
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">📊 Аналітика продуктивності</h1>
            <ProductivityAnalytics tasks={tasks}/>
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
                🤖 AI-помощник: <strong>{recommendations}</strong>
            </div>
            <button
                onClick={() => setShowProgress(!showProgress)}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {showProgress ? "Скрыть прогресс" : "Показать прогресс"}
            </button>

            {showProgress && (
                <div
                    className="mb-4 p-3 bg-green-100 border border-green-300 rounded"
                >
                    📈 Выполнено: <strong>{progress}%</strong> задач
                </div>
            )}
        </div>
    );
}