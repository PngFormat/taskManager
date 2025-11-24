interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
}

export default function SelectField({ label, value, onChange, options}: SelectFieldProps) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}