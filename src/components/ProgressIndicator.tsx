import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 'personal' | 'resume' | 'password' | 'success';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = ['personal', 'resume', 'password'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="h-4 pt-2 justify-start items-start gap-2 flex">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`grow shrink basis-0 h-2 rounded-3xl shadow-[inset_17px_1px_8px_0px_rgba(0,0,0,0.15)] flex-col justify-start items-start gap-2.5 inline-flex overflow-hidden ${
            index <= currentIndex ? 'bg-indigo-600' : 'bg-neutral-800/10'
          }`}
        />
      ))}
    </div>
  );
};

