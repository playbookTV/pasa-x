import React from 'react';
import { cn } from '@/lib/utils';

interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
};

