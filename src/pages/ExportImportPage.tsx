import ExportImport from "../components/ExportImport.tsx";
import Sidebar from "../components/Sidebar";
import ExportSettings from "../components/ExportSettings.tsx";
import { useState } from "react";

export default function ExportImportPage({ tasks, setTasks }) {
    const [exportSettings, setExportSettings] = useState({
        includeCompleted: true,
        includeDeleted: false,
        removeSystemFields: false,
        onlyTitleDate: false,
    });

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 p-6">
                <ExportSettings onApply={setExportSettings} />
                <ExportImport
                    tasks={tasks}
                    setTasks={setTasks}
                    exportSettings={exportSettings}
                />
            </div>
        </div>
    );
}
