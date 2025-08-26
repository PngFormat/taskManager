import { useEffect, useState } from "react";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", content: "", taskId: "" });

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

    const handleAdd = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const newNote = await res.json();
        setNotes([...notes, newNote]);
        setForm({ title: "", content: "", taskId: "" });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📝 Нотатки / Журнал</h1>
            <form onSubmit={handleAdd} className="mb-6 space-y-2">
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

                <button className="bg-blue-500 text-white px-4 py-2 rounded">Додати</button>
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
                    </div>
                ))}
            </div>
        </div>
    );
}
