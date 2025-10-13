interface StorylineCardProps {
    title: string;
    hook: string;
    short_summary: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function StorylineCard({
    title,
    hook,
    short_summary,
    description,
    isSelected,
    onClick
}: StorylineCardProps) {
    return (
        <div
            className={`relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 ${
                isSelected
                    ? 'border-cyan-400 shadow-cyan-400/20'
                    : 'border-gray-600 hover:border-purple-400'
            }`}
            onClick={onClick}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
            )}

            <div className="pr-8">
                {/* Title */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                    {title}
                </h3>

                {/* Hook */}
                <div className="mb-4">
                    <p className="text-yellow-300 font-medium text-lg leading-relaxed">
                        {hook}
                    </p>
                </div>

                {/* Short Summary */}
                <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed">
                        {short_summary}
                    </p>
                </div>

                {/* Description */}
                <div className="text-gray-400 text-sm leading-relaxed">
                    {description}
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div
                className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${
                    isSelected
                        ? 'bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-100'
                        : 'bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-cyan-400/5 group-hover:opacity-100'
                }`}
            />
        </div>
    );
}