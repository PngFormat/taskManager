import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const linkClass =
        "block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium";

    return (
        <div className="w-60 bg-white border-r shadow-sm p-4">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Планувальник</h2>
            <nav className="space-y-2">
                <NavLink to="/" className={linkClass}>📊 Dashboard</NavLink>
                <NavLink to="/tasks" className={linkClass}>✅ Задачі</NavLink>
                <NavLink to="/calendar" className={linkClass}>🗓️ Календар</NavLink>
                <NavLink to="/settings" className={linkClass}>⚙️ Налаштування</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
