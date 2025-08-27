import { useEffect, useState } from "react";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", content: "", taskId: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/notes")
            .then(res => res.json())
            .then(data => setNotes(data));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
            .then(res => res.json())
            .then(data => setTasks(data));
    }, []);

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();

        if (editingId) {
            const res = await fetch(`http://localhost:5000/api/notes/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const updateNote = await res.json();

            setNotes(notes.map(note => note._id === editingId ? updateNote : note));
            setEditingId(null);
        } else {
            const res = await fetch("http://localhost:5000/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const newNote = await res.json();
            setNotes([...notes, newNote]);
        }

        setForm({title: "", content: "", taskId: ""})
    };

    const handleEdit = (note) => {
        setForm({
            title: note.title,
            content: note.content,
            taskId: note.taskId || "",
        });
        setEditingId(note._id);
    }

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/notes/${id}`, {
            method: "DELETE",
        });
        setNotes(notes.filter(note => note._id !== id));
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📝 Нотатки / Журнал</h1>
            <form onSubmit={handleAddOrUpdate} className="mb-6 space-y-2">
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <textarea
                    placeholder="Текст замітки"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <select
                    value={form.taskId || ""}
                    onChange={(e) => setForm({ ...form, taskId: e.target.value })}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Без задачи</option>
                    {tasks.map(task => (
                        <option key={task._id} value={task._id}>
                            {task.title}
                        </option>
                    ))}
                </select>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingId ? "Зберегти зміни" : "Додати"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setForm({ title: "", content: "", taskId: "" });
                        }}
                        className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Скасувати
                    </button>
                )}
            </form>


            <div className="grid gap-4">
                {notes.map(note => (
                    <div key={note._id} className="p-4 border rounded shadow sm bg-white">
                        <h2 className="text-lg font-semibold">{note.title}</h2>
                        <p className="text-gray-700">{note.content}</p>

                        {note.taskId && (
                            <p className="text-sm text-blue-600">
                                🔗 Прив’язано до задачі:{" "}
                                {tasks.find(t => t._id === note.taskId)?.title || "невідома задача"}
                            </p>
                        )}

                        <div className="mt-2 flex gap-2 ">
                            <button
                                onClick={() => handleEdit(note)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"

                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => handleDelete(note._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"

                            >
                                Видалити
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
