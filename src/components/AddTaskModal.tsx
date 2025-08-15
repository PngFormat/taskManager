import {useState} from "react";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: { title: string; dueDate: string }) => void;
    selectedDate: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, selectedDate}) => {
    const [title, setTitle ] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd({ title, dueDate: selectedDate});
        setTitle("");
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Додати задачу</h2>
                <form
                    onSubmit={handleSubmit} className="space-y-3"
                >
                    <input
                        type="text"
                        placeholder="Назва задачі"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded"
                        autoFocus={true}
                    />
                    <div
                        className="text-sm text-gray-500"
                    >
                        Дата: {selectedDate}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Відміна
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Додати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;