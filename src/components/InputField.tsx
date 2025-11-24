export default function InputField({label, type= "text", value, onChange, placeholder, error, ...props}) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                {...props}
            />
        </div>
    )
}