import ExportImport from "../components/ExportImport.tsx";
import Sidebar from "../components/Sidebar";

export default function ExportImportPage({ tasks, setTasks }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <ExportImport tasks={tasks} setTasks={setTasks} />
            </div>
        </div>
    );
}
