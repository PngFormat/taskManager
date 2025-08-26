import { useEffect, useState } from "react";

type WeatherData = {
    temp: number;
    description: string;
};

export default function WeatherAdvice() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(true);

    const city = localStorage.getItem("city") || "Київ";

    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch("http://localhost:5000/api/weather", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ city }),
                });

                const data = await response.json();

                if (data.error) {
                    setWeather(null);
                    setAdvice("⚠️ Прогноз недоступен");
                    return;
                }

                setWeather({
                    temp: data.temp,
                    description: data.description,
                });

                if (data.weather.toLowerCase().includes("rain")) {
                    setAdvice("☔ Завтра дождь — займись домашними делами!");
                } else {
                    setAdvice("🌤 Отличная погода — самое время для прогулки или спорта!");
                }
            } catch (err) {
                console.error("Ошибка погоды:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [city]);

    return (
        <div className="p-4 bg-blue-50 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-2">Порада по погоді ({city})</h2>
            {loading ? (
                <p>Завантаження прогнозу...</p>
            ) : weather ? (
                <div>
                    <p>🌡 Температура: {weather.temp}°C</p>
                    <p>🌦 {weather.description}</p>
                    <p>{advice}</p>
                </div>
            ) : (
                <p>❌ Не удалось загрузить прогноз</p>
            )}
        </div>
    );
}
