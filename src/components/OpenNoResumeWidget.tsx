import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { Button } from './Button';

interface OpenNoResumeWidgetProps {
  onClose: () => void;
  onAutoFill: () => void;
  onGenerateCoverLetter: () => void;
  onAnalyseResume: () => void;
}

export const OpenNoResumeWidget: React.FC<OpenNoResumeWidgetProps> = ({
  onClose,
  onAutoFill,
  onGenerateCoverLetter,
  onAnalyseResume,
}) => {
  return (
    <motion.div
      layout
      className="w-64 h-72 p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden"
    >
      <motion.div
        layout
        className="grow shrink basis-0 p-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden"
      >
        <motion.div layout className="justify-start items-center gap-4 inline-flex">
          <motion.div layout className="w-11 h-11 relative">
            <Logo variant="noText" />
          </motion.div>
        </motion.div>
        <motion.div
          layout
          className="self-stretch h-40 p-4 bg-stone-100 rounded-lg flex-col justify-start items-center gap-6 flex overflow-hidden"
        >
          <motion.div layout className="self-stretch h-32 flex-col justify-start items-start gap-4 flex">
            <Button variant="primary" onClick={onAutoFill} className="w-full">
              Auto-fill Application
            </Button>
            <Button variant="secondary-colored" onClick={onGenerateCoverLetter} className="w-full">
              Generate Cover Letter
            </Button>
            <Button variant="secondary-colored" onClick={onAnalyseResume} className="w-full">
              Analyse resume
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

