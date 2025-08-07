import ProductivityAnalytics from "../components/Analytics.tsx";

export default function ProductivityPage({tasks}) {
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">📊 Аналітика продуктивності</h1>
            <ProductivityAnalytics tasks={tasks}/>
        </div>
    );
}