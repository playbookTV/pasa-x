import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MenuPopover } from './MenuPopover';

interface AvatarButtonProps {
  fullName: string;
  role: string;
  initials: string;
  className?: string;
}

export const AvatarButton: React.FC<AvatarButtonProps> = ({
  fullName,
  role,
  initials,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 pl-3.5 pr-2.5 bg-white rounded-xl border border-slate-200 justify-end items-center gap-3 inline-flex cursor-pointer",
          className
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDarkMode(!isDarkMode);
          }}
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-px h-12 bg-slate-200" />
        <div className="h-12 py-1.5 flex items-center">
          <div className="h-10 w-10 px-2 py-3 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <div className="text-indigo-900 text-base font-semibold font-['Inter'] leading-7">{initials}</div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div ref={popoverRef} className="absolute right-0 mt-2 z-10">
          <MenuPopover fullName={fullName} role={role} />
        </div>
      )}
    </div>
  );
};

