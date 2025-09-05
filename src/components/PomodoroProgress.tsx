
export default function PomodoroProgress({ cycles, cyclesBeforeLongBreak}) {
    const progress = Math.min((cycles / cyclesBeforeLongBreak) * 100, 100);

    return (
        <div className="w-full">
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mb-2">
                <div
                    className="bg-green-500 h-4 transition-all"
                    style={{width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-gray-700 text-center">
                Завешено циклів: {cycles} з {cyclesBeforeLongBreak}
            </p>
        </div>
    )
}