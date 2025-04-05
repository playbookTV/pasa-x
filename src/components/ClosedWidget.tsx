import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface ClosedWidgetProps {
  onClick: () => void;
}

export const ClosedWidget: React.FC<ClosedWidgetProps> = ({ onClick }) => {
  return (
    <motion.div
      layout
      className="h-20 p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden"
      onClick={onClick}
    >
      <motion.div
        layout
        className="p-3 bg-white rounded-3xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden cursor-pointer"
      >
        <motion.div layout className="justify-start items-center gap-4 inline-flex">
          <motion.div layout className="w-11 h-11 relative">
            <Logo variant="noText" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

