import React from 'react';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  disabled = false,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "h-7 px-3 py-1.5 bg-white rounded-full border border-purple-200",
        "inline-flex items-center gap-1.5 transition-opacity",
        disabled && "opacity-40",
        className
      )}
    >
      <span className="text-stone-950 text-sm font-medium font-['Inter']">{label}</span>
      {(selected || disabled) && (
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <Circle 
            className={cn(
              "w-3 h-3 fill-current",
              selected && !disabled ? "text-green-500" : "text-gray-400"
            )}
          />
        </div>
      )}
    </button>
  );
};

