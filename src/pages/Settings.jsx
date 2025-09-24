import {useEffect, useState} from "react";

export default function Settings({ maxTasksPerDay, setMaxTasksPerDay }) {
    const [username, setUsername] = useState("Ім'я користувача");
    const [email, setEmail] = useState("example@gmail.com");
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("ua");
    const [localMaxTasks, setLocalMaxTasks] = useState(maxTasksPerDay);
    const [city, setCity] = useState(() => {
        return localStorage.getItem("city") || "Київ";
    });


    const handleReset = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Ви впевнені, що хочете скинути всі задачі?")) {
            localStorage.removeItem("tasks");
            alert("Усі задачі видалено!");
        }
    };

    const handleSave = () => {
        setMaxTasksPerDay(localMaxTasks);
        localStorage.setItem("maxTasksPerDay", localMaxTasks.toString());
        setCity(localStorage.getItem("city"))
        alert("Налаштування збережено!");
    };

    const toggleDarkMode = () => {
        const overlay = document.createElement("div");
        overlay.className = "theme-transition";
        document.body.appendChild(overlay);

        setDarkMode(!darkMode);

        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 800); // столько же, сколько длится animation
    };

    useEffect(() => {
        const saveLimit = localStorage.getItem("maxTasksPerDay");
        if (saveLimit) setMaxTasksPerDay(Number(saveLimit))
    }, []);

    useEffect(() => {
        localStorage.setItem("maxTasksPerDay", maxTasksPerDay.toString());
    },[maxTasksPerDay]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("darkMode");
        if (savedTheme === "true") {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);



    return (
        <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ Налаштування</h2>

            <div>
                <label className="block font-semibold mb-1">Ім'я</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Пошта</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1 ">📍 Місто</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">📅 Максимум задач на день</label>
                <input
                    type="number"
                    min={1}
                    max={50}
                    value={localMaxTasks}
                    onChange={(e) => {
                        const value = Math.max(1, Math.min(50, Number(e.target.value)));
                        setLocalMaxTasks(value);
                    }}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div className="flex items-center justify-between">
                <span>🌙 Темна тема</span>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="h-5 w-5"
                />
            </div>

            <div className="flex items-center justify-between">
                <span>🔔 Повідомлення</span>
                <input
                    type="checkbox"
                    value={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="h-5 w-5"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">🌐 Мова інтерфейсу</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="ua">Українська</option>
                    <option value="en">Англійська</option>
                    <option value="fr">Французська</option>
                </select>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    🗑 Скинути всі задачі
                </button>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    🗑 Зберегти зміни
                </button>
            </div>
        </div>
    )

};


