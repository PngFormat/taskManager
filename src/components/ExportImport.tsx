import {useState} from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function ExportImport({ tasks, setTasks }) {
    const [file, setFile] = useState(null);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        XLSX.writeFile(workbook, "tasks.xlsx");
    };

    const exportToCSV = () => {
        const csv = Papa.unparse(tasks);
        const blob = new Blob([csv], {type: "text/csv;charset=uft-8;"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a")
        a.href = url;
        a.download = "tasks.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    const backupJSON = () => {
        const json = JSON.stringify(tasks, null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a")
        a.href = url;
        a.download = "tasks-backup.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    const importFromExcel = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Unit8Array(evt.target.result);
            const workbook = XLSX.read(data, {type: "array"});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const importedTasks = XSLX.utils.sheet_to_json(sheet);
            console.log("Імпортовані задачі:", importedTasks);
        };
        reader.readAsArrayBuffer(file);
    }

    const restoreJSON = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const importedTasks = JSON.parse(evt.target.result);
                if (Array.isArray(importedTasks)) {
                    setTasks(importedTasks);
                    alert("✅ Данні успішно востановлені!");

                }
                else {
                    alert("❌ Невірний формат файлу");
                }
            } catch (err) {
                alert("❌ Помилка при зчитуванні файлу");
                console.error(err);
            }
        };
        reader.readAsText(file)
    }

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">📤 Експорт / 📥 Імпорт</h2>

            <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
                Експорт в Excel
            </button>

            <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
                Експорт в CSV
            </button>

            <button
                onClick={backupJSON}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
                Backup в JSON
            </button>

            <label
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                Restore JSON
                <input
                    type="file"
                    accept="application/json"
                    onChange={restoreJSON}
                    className="hidden"/>
            </label>

            <label
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                Імпорт з Excel
                <input type="file" onChange={importFromExcel} className="hidden"/>
            </label>

        </div>
    )

}