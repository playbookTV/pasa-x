import React from 'react';
import { cn } from '@/lib/utils';

type Tab = {
  label: string;
  value: string;
};

interface NavTabProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const NavTab: React.FC<NavTabProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("relative w-96 h-11 p-1 bg-gray-200 rounded-lg inline-flex overflow-hidden", className)}>
      {/* Active tab indicator */}
      <div
        className="absolute h-9 transition-all duration-300 ease-in-out"
        style={{
          left: `${(100 / tabs.length) * tabs.findIndex(tab => tab.value === activeTab)}%`,
          width: `${100 / tabs.length}%`,
        }}
      >
        <div className="h-full bg-white rounded-[7px] border-[0.7px] border-[#D5D0E3] shadow-[0px_0px_0px_1px_#C1BCDB]" />
      </div>

      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "grow shrink basis-0 self-stretch z-10 transition-colors duration-300 ease-in-out",
            "hover:bg-white/50 rounded-[7px]",
            "justify-center items-center flex"
          )}
        >
          <div
            className={cn(
              "text-base font-semibold font-['Inter'] leading-tight transition-colors duration-300 ease-in-out",
              activeTab === tab.value ? "text-indigo-600" : "text-gray-950/90"
            )}
          >
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
}

