import { NavLink } from "react-router-dom";


const Sidebar = () => {
    const linkClass =
        "block px-4 py-2 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800";

    return (
        <div className="w-60 bg-white dark:bg-gray-900 border-r shadow-sm dark:border-gray-700 p-4">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Планувальник</h2>
            <nav className="space-y-2">
                <NavLink to="/" className={linkClass}>📊 Dashboard</NavLink>
                <NavLink to="/tasks" className={linkClass}>✅ Задачі</NavLink>
                <NavLink to="/calendar" className={linkClass}>🗓️ Календар</NavLink>
                <NavLink to="/settings" className={linkClass}>⚙️ Налаштування</NavLink>
                <NavLink to="/focus-mode" className={linkClass}>👩‍💻  Фокус мод</NavLink>
                <NavLink to="/productivity" className={linkClass}>⚡️Продуктивність</NavLink>
                <NavLink to="/archive" className={linkClass}>🗂️️Архів</NavLink>
                <NavLink to="/notes" className={linkClass}>📝 Нотатки</NavLink>
                <NavLink to="/export-import" className={linkClass}>💾 Экспорт/Импорт</NavLink>
                <NavLink to="/research" className={linkClass}>💾 Порівняння</NavLink>
                <NavLink to="/knowledge" className={linkClass}>📚 База знань</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
