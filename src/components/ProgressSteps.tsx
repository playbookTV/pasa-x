import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  totalSteps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("h-2 flex gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 h-full rounded-full transition-colors duration-200",
            index < currentStep ? "bg-indigo-600" : "bg-gray-200"
          )}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${index + 1} of ${totalSteps}`}
        />
      ))}
    </div>
  );
};

