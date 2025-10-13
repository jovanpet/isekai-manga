interface ToggleButtonGroupProps<T> {
  label: string;
  selectedItems: T[];
  onToggle: (item: T) => void;
  options: T[];
  required?: boolean;
  colorScheme?: 'purple' | 'cyan' | 'red' | 'indigo' | 'green';
  getDisplayText?: (option: T) => string;
  helpText?: string;
}

const colorClasses = {
  purple: {
    selected: 'bg-purple-500 text-white border-purple-400 shadow-lg transform scale-105',
    unselected: 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:border-white/50'
  },
  cyan: {
    selected: 'bg-cyan-500 text-white border-cyan-400 shadow-lg transform scale-105',
    unselected: 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:border-white/50'
  },
  red: {
    selected: 'bg-red-500 text-white border-red-400 shadow-lg transform scale-105',
    unselected: 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:border-white/50'
  },
  indigo: {
    selected: 'bg-indigo-500 text-white border-indigo-400 shadow-lg transform scale-105',
    unselected: 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:border-white/50'
  },
  green: {
    selected: 'bg-green-500 text-white border-green-400 shadow-lg transform scale-105',
    unselected: 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:border-white/50'
  }
};

export default function ToggleButtonGroup<T extends string>({
  label,
  selectedItems,
  onToggle,
  options,
  required = false,
  colorScheme = 'purple',
  getDisplayText,
  helpText
}: ToggleButtonGroupProps<T>) {
  const colors = colorClasses[colorScheme];

  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && '*'}
      </label>
      <div className="flex flex-wrap gap-2 p-3 bg-white/10 border border-white/20 rounded-lg min-h-[80px]">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
              selectedItems.includes(option) ? colors.selected : colors.unselected
            }`}
          >
            {getDisplayText ? getDisplayText(option) : option.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
      {helpText && (
        <p className="text-gray-300 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
}