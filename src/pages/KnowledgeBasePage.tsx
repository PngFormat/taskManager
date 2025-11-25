import {useEffect, useMemo, useState} from "react";
import Sidebar from "../components/Sidebar";
import Stats from "../components/ResourceStats.tsx";

export default function KnowledgeBase() {
    const [resources, setResources] = useState([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("link");
    const [tags, setTags] = useState("");
    const [filterTag, setFilterTag] = useState(null);

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

    const stats = useMemo(() => {
        const counts = resources.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});
        return { total: resources.length, counts };
    }, [resources]);

    const allTags = useMemo(() => {
        const tagMap = {};
        resources.forEach(r =>
            r.tags.forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            })
        );
        return tagMap;
    }, [resources]);

    const filteredResources = filterTag
        ? resources.filter(r => r.tags.includes(filterTag))
        : resources;

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex-1 p-8 text-gray-900 dark:text-gray-100">
                <h2 className="text-3xl font-bold mb-8">
                    📚 База знань
                </h2>
                <div className="mb-8">
                    <Stats
                        stats={stats}
                        allTags={allTags}
                        filterTag={filterTag}
                        setFilterTag={setFilterTag}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-10 spacy-y-4">
                    <h3 className="text-xl font-semibold mb-2">➕ Додати ресурс</h3>
                    <input
                        className="border border-gray-300 dark:border-gray-700
                        bg-gray-50 dark:bg-gray-700
                        p-3 w-full rounded-lg focus:outline-none"
                        placeholder="Назва"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 dark:border-gray-700
                        bg-gray-50 dark:bg-gray-700
                        p-3 w-full rounded-lg focus:outline-none"
                        placeholder="Посилання або нотатка"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700
                        bg-gray-50 dark:bg-gray-700
                        p-3 w-full rounded-lg focus:outline-none"
                    >
                        <option value="link">🔗 Посилання</option>
                        <option value="video">🎬 Відео</option>
                        <option value="article">📄 Стаття</option>
                        <option value="note">📝 Нотатка</option>
                    </select>

                    <input
                        className="border border-gray-300 dark:border-gray-700
                        bg-gray-50 dark:bg-gray-700
                        p-3 w-full rounded-lg focus:outline-none"
                        placeholder="Теги (через кому)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <button
                        onClick={addResources}
                        className="bg-blue-600 hover:bg-blue-700
                            text-white px-5 py-3 rounded-lg mt-2
                            transition-all w-full
                        "
                    >
                        ➕ Додати ресурс
                    </button>
                </div>

                <div className="space-y-4">
                    {resources.map((res) => (
                        <div
                            key={res.id}
                            className="border rounded p-3 flex justify-between items-center"
                        >
                            <div
                                key={res.id}
                                className="border border-gray-300 dark:border-gray-800
                                            border border-gray-200 dark:border-gray-700
                                            rounded-xl p-5 shadow flex justify-between
                                            items-start"
                            >
                                <div className="pr-4">
                                    <h3 className="text-lg font-semibold mb-1">{res.title}</h3>
                                    {res.url && (
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underlin break-all"
                                        >
                                            {res.url}
                                        </a>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        <span className="font-medium">{res.type.toUpperCase()}</span> •{" "}
                                        {res.type.toUpperCase()} • {res.tags.join(", ")}
                                    </p>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-400 transition"
                                    onClick={() => removeResource(res.id)}
                                >
                                    ❌
                                </button>
                                </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}