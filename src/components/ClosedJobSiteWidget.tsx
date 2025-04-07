import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface ClosedJobSiteWidgetProps {
  onClick: () => void;
  compatibility: number;
  title?: string;
}

export const ClosedJobSiteWidget: React.FC<ClosedJobSiteWidgetProps> = ({ 
  onClick, 
  compatibility,
  title = 'Job Detected'
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-3 cursor-pointer flex items-center space-x-3 hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="max-w-[200px] overflow-hidden">
        <p className="font-medium text-sm text-gray-800 truncate">{title}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${compatibility}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{compatibility}% match</p>
      </div>
    </div>
  );
};

