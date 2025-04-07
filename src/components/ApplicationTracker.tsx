
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type Stage = {
  label: string;
  value: string;
};

interface ApplicationTrackerProps {
  stages: Stage[];
  className?: string;
  onChange?: (value: string) => void;
}

export function ApplicationTracker({ stages, className, onChange }: ApplicationTrackerProps) {
  const [selectedStage, setSelectedStage] = useState(stages[0].value);

  const handleChange = (value: string) => {
    setSelectedStage(value);
    onChange?.(value);
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {stages.map((stage, index) => (
        <div key={stage.value} className="flex items-center">
          <div className="relative">
            <input
              type="radio"
              id={stage.value}
              name="application-stage"
              value={stage.value}
              checked={selectedStage === stage.value}
              onChange={() => handleChange(stage.value)}
              className="sr-only"
            />
            <label
              htmlFor={stage.value}
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center cursor-pointer",
                {
                  "bg-green-500 border-green-500": selectedStage !== stage.value && index < stages.findIndex(s => s.value === selectedStage), // Passed
                  "bg-indigo-600 border-indigo-600": selectedStage === stage.value, // Active
                  "bg-white border-2 border-gray-300": selectedStage !== stage.value && index > stages.findIndex(s => s.value === selectedStage), // Default
                }
              )}
            >
              {selectedStage === stage.value ? (
                <span className="w-2 h-2 rounded-full bg-white" />
              ) : index < stages.findIndex(s => s.value === selectedStage) ? (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </label>
            {index < stages.length - 1 && (
              <div className={cn(
                "absolute top-5 left-2.5 w-0.5 h-5",
                index < stages.findIndex(s => s.value === selectedStage) ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </div>
          <label
            htmlFor={stage.value}
            className={cn(
              "ml-3 text-sm font-medium cursor-pointer",
              selectedStage === stage.value ? "text-indigo-600" : "text-gray-500"
            )}
          >
            {stage.label}
          </label>
        </div>
      ))}
    </div>
  );
}

