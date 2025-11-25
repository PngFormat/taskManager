import {useState} from "react";

export default function ExportSettings({ onApply }) {
    const [includeCompleted, setIncludeCompleted] = useState(true);
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [removeSystemFields, setRemoveSystemFields] = useState(false);
    const [onlyTitleDate, setOnlyTitleDate] = useState(false);

    const applySettings = () => {
        onApply({includeCompleted, includeDeleted, removeSystemFields, onlyTitleDate});
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-2">⚙ Налаштування експорту</h3>

            <label className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    checked={includeCompleted}
                    onChange={(e) => setIncludeCompleted(e.target.checked)}
                />
                Включити виконані задачі
            </label>

            <label className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    checked={includeDeleted}
                    onChange={(e) => setIncludeDeleted(e.target.checked)}
                />
                Включити видалені задачі
            </label>

            <label className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    checked={removeSystemFields}
                    onChange={(e) => setRemoveSystemFields(e.target.checked)}
                />
                Видалити поля systemId, updatedAt
            </label>

            <label className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    checked={onlyTitleDate}
                    onChange={(e) => setOnlyTitleDate(e.target.checked)}
                />
                Видалити поля systemId, updatedAt
            </label>

            <button
                onClick={applySettings}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Застосувати
            </button>
        </div>
    );
}