import {useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";

export default function KnowledgeBase() {
    const [resources, setResources] = useState([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("link");
    const [tags, setTags] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("resources");
        if (saved) setResources((JSON.parse(saved)));
    }, []);

    const addResources = () => {
        const newRes = {
            id: Date.now().toString(),
            title,
            url,
            type,
            tags: tags.split(",").map(t => t.trim()),
            createdAt: new Date().toISOString(),
        };
        const updated = [...resources, newRes];
        setResources(updated);
        localStorage.setItem("resources", JSON.stringify(updated));
        setTitle("");
        setUrl("");
        setTags("");
    };

    const removeResource = (id) => {
        const updated = resources.filter(r => r.id !== id);
        setResources(updated);
        localStorage.setItem("resources", JSON.stringify(updated));
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">📚 База знань</h2>


                <div className="space-y-2 mb-6">
                    <input
                        className="border p-2 w-full"
                        placeholder="Назва"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="border p-2 w-full"
                        placeholder="Посилання або нотатка"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <select>
                        <option value="link">🔗 Посилання</option>
                        <option value="video">🎬 Відео</option>
                        <option value="article">📄 Стаття</option>
                        <option value="note">📝 Нотатка</option>
                    </select>
                    <input
                        className="border p-2 w-full"
                        placeholder="Теги (через кому)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <button
                        onChange={addResources}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        ➕ Додати
                    </button>
                </div>

                <div className="space-y-4">
                    {resources.map((res) => (
                        <div
                            key={res.id}
                            className="border rounded p-3 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold">{res.title}</h3>
                                {res.url && (
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {res.url}
                                    </a>
                                )}
                                <p className="text-sm text-gray-500">
                                    {res.type.toUpperCase()} • {res.tags.join(", ")}
                                </p>
                            </div>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => removeResource(res.id)}
                            >
                                ❌ Видалити
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}