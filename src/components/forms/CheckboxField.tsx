interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  colorScheme?: 'purple' | 'cyan' | 'blue';
}

const colorClasses = {
  purple: 'text-purple-600 focus:ring-purple-500',
  cyan: 'text-cyan-600 focus:ring-cyan-500',
  blue: 'text-blue-600 focus:ring-blue-500'
};

export default function CheckboxField({
  label,
  checked,
  onChange,
  id,
  colorScheme = 'purple'
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`w-5 h-5 bg-white/20 border-white/30 rounded ${colorClasses[colorScheme]}`}
      />
      <label htmlFor={id} className="text-white text-sm font-medium">
        {label}
      </label>
    </div>
  );
}