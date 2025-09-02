export function useMethodTracking() {
    const log = async ({taskId, method, event, payload = {}}) => {
        try {
            await fetch("http://localhost:5000/api/experiment/log", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({taskId, method, event, payload})
            });

        } catch (err) {
            console.log("log failed", err)
        }
    };
    return { log };
}
