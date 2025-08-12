import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
    return (
        <div
            className="flex h-screen bg-no-repeat bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('https://img.freepik.com/free-photo/aisle-blur_1127-392.jpg?semt=ais_hybrid&w=740')",
            }}
        >
            <div className="flex flex-1 bg-black/40">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
