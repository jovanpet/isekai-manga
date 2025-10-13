interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  className?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  min,
  max,
  className = "focus:ring-purple-500"
}: FormInputProps) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
}