interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = "focus:ring-purple-500"
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 resize-none ${className}`}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}