export default function PomodoroControls({ start, pause, reset, interrupt, finishTask, onStop }) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={start} className="px-4 py-1 bg-green-600 text-white rounded">
                Старт
            </button>
            <button onClick={pause} className="px-4 py-1 bg-yellow-500 text-white rounded">
                Пауза
            </button>
            <button onClick={reset} className="px-3 py-1 bg-gray-600 text-white rounded">
                Скинути
            </button>
            <button onClick={interrupt} className="px-3 py-1 bg-red-600 text-white rounded">
                Перерва
            </button>
            <button onClick={finishTask} className="px-3 py-1 bg-blue-600 text-white rounded">
                Завершити задачу
            </button>
            <button onClick={onStop} className="px-3 py-1 bg-purple-600 text-white rounded">
                Снять фокус
            </button>
        </div>
    );
}
