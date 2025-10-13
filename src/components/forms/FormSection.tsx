'use client';

import { useState, ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  icon?: string;
  onAutoFill?: () => void;
  autoFillText?: string;
  autoFillColorScheme?: 'purple' | 'cyan' | 'blue';
  children: ReactNode;
  collapsibleContent?: ReactNode;
  collapsibleTitle?: string;
}

const autoFillColors = {
  purple: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
  cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
  blue: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
};

export default function FormSection({
  title,
  icon,
  onAutoFill,
  autoFillText = "Auto-Fill Required",
  autoFillColorScheme = 'purple',
  children,
  collapsibleContent,
  collapsibleTitle = "Show More"
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {onAutoFill && (
          <button
            onClick={onAutoFill}
            className={`px-4 py-2 text-white rounded-lg transition-all duration-300 text-sm font-medium ${autoFillColors[autoFillColorScheme]}`}
          >
            {autoFillText}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {children}

        {collapsibleContent && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              {isExpanded ? `▼ Hide ${collapsibleTitle}` : `▶ ${collapsibleTitle}`}
            </button>

            <div className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-4 pt-4 border-t border-white/20">
                {collapsibleContent}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}