import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface ClosedJobSiteWidgetProps {
  onClick: () => void;
  compatibility: number;
}

export const ClosedJobSiteWidget: React.FC<ClosedJobSiteWidgetProps> = ({ onClick, compatibility }) => {
  return (
    <motion.div
      layout
      className="w-64 h-20 p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden"
      onClick={onClick}
    >
      <motion.div
        layout
        className="grow shrink basis-0 p-3 bg-white rounded-3xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden cursor-pointer"
      >
        <motion.div layout className="self-stretch justify-start items-center gap-4 inline-flex">
          <motion.div layout className="w-11 h-11 relative">
            <Logo variant="noText" />
          </motion.div>
          <motion.div layout className="grow shrink basis-0 h-5 justify-end items-center gap-1.5 flex">
            <motion.div layout>
              <motion.span layout className="text-zinc-900 text-sm font-bold font-['Inter'] leading-tight">{compatibility}%</motion.span>
              <motion.span layout className="text-zinc-900 text-sm font-normal font-['Inter'] leading-tight"> compatible</motion.span>
            </motion.div>
            <motion.div layout className="w-5 h-5 relative">
              <motion.div layout className="w-5 h-5 left-0 top-0 absolute rounded-full border-4 border-black/10" />
              <motion.div
                layout
                className="w-5 h-5 left-0 top-0 absolute rounded-full border-4 border-amber-400"
                style={{ clipPath: `inset(0 ${100 - compatibility}% 0 0)` }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

