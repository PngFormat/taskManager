
export default function Stats({ stats, allTags, filterTag, setFilterTag }) {
    return (
        <div className="mb-6 p-3 bg-gray-100 rounded">
            <p className="font-medium">
                Збережено: {stats.total} ресурсів
            </p>
            <p className="text-sm text-gray-600">
                🔗 Посилань: {stats.counts.link || 0} •
                📄 Статей: {stats.counts.article || 0} •
                🎬 Відео: {stats.counts.video || 0} •
                📝 Нотаток: {stats.counts.note || 0}
            </p>

            {Object.keys(allTags).length > 0 && (
                <div className="mb-6">
                    <p className="font-medium mb-2">Теги:</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(allTags).map(([tag, count]) => (
                            <button
                                key={tag}
                                onClick={() =>
                                    setFilterTag(filterTag === tag ? null : tag)
                                }
                                className={`px-2 py-1 rounded text-sm ${
                                    filterTag === tag
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                #{tag} ({count})
                            </button>
                        ))}
                    </div>
                    {filterTag && (
                        <button
                            onClick={() => setFilterTag(null)}
                            className="mt-2 text-sm text-blue-600 underline"
                        >
                            Скинути фільтр
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
