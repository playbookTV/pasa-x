import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  compact?: boolean;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  icon,
  onClose,
  compact = false,
  className,
}) => {
  return (
    <div className={cn(
      "w-96 bg-white rounded-2xl justify-start items-start inline-flex overflow-hidden",
      className
    )}>
      <div className={cn(
        "grow shrink basis-0 px-4 py-3 rounded-2xl border border-gray-200 justify-start items-start gap-3 flex overflow-hidden",
        compact ? "h-14" : "h-16"
      )}>
        {icon && (
          <div className="w-8 h-8 p-1 justify-center items-center flex overflow-hidden">
            {icon}
          </div>
        )}
        <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-0.5 inline-flex">
          {title && !compact && (
            <div className="self-stretch text-gray-900 text-sm font-semibold font-['Inter'] leading-tight">
              {title}
            </div>
          )}
          <div className="self-stretch text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
            {message}
          </div>
        </div>
        {onClose && (
          <div className="self-stretch justify-start items-center gap-3 flex">
            <div className="justify-center items-center gap-2 flex">
              <button
                onClick={onClose}
                className="w-5 h-5 p-1 justify-center items-center flex overflow-hidden text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

