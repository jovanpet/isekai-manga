interface FormSelectProps<T> {
  label: string;
  value: T | '';
  onChange: (value: T | undefined) => void;
  options: T[];
  required?: boolean;
  placeholder?: string;
  className?: string;
  getDisplayText?: (option: T) => string;
}

export default function FormSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Select...",
  className = "focus:ring-purple-500",
  getDisplayText
}: FormSelectProps<T>) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T || undefined)}
        className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 ${className}`}
      >
        {!required && (
          <option value="" className="bg-gray-800">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {getDisplayText ? getDisplayText(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}