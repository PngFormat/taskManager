import {useEffect} from "react";


export default function PomodoroSettings({settings, setSettings}) {
    const updateSetting = (key: string, value: number) => {
        setSettings((prev: any) => ({...prev, [key]: value}));
    };

    useEffect(() => {
        localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }, [settings]);

    return (
        <div className="flex flex-wrap gap-4 justify-center mb-4">
            <label>
                Фокус:
                <input
                    type="number"
                    min="1"
                    value={settings.focus}
                    onChange={(e) => updateSetting("focus", Number(e.target.value))}
                    className="w-16 border p-1 ml-1"
                /> мин
            </label>
            <label>
                Перерва:
                <input
                    type="number"
                    min="1"
                    value={settings.shortBreak}
                    onChange={(e) => updateSetting("shortBreak", Number(e.target.value))}
                    className="w-16 border p-1 ml-1"
                /> мин
            </label>
            <label>
                Довгий:
                <input
                    type="number"
                    min="1"
                    value={settings.longBreak}
                    onChange={(e) => updateSetting("longBreak", Number(e.target.value))}
                    className="w-16 border p-1 ml-1"
                /> мин
            </label>

            <label>
                Циклів:
                <input
                    type="number"
                    min="1"
                    value={settings.cyclesBeforeLongBreak}
                    onChange={(e) => updateSetting("cyclesBeforeLongBreak", Number(e.target.value))}
                    className="w-16 border p-1 ml-1"
                />
            </label>
        </div>
    )

}