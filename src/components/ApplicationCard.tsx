import React from 'react';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  company: string;
  date: string;
  jobTitle: string;
  status: string;
  className?: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  company,
  date,
  jobTitle,
  status,
  className,
}) => {
  return (
    <div className={cn("w-50 h-24 pt-2 pb-4 bg-white shadow-[0px_3px_2.5px_0px_rgba(220,217,231,1.00)] border-b border-slate-200 flex-col justify-start items-start gap-2 inline-flex overflow-hidden", className)}>
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="text-neutral-800/50 text-xs font-semibold font-['Inter'] uppercase">{company}</div>
        <div className="text-neutral-800/50 text-xs font-semibold font-['Inter'] uppercase">{date}</div>
      </div>
      <div className="self-stretch text-neutral-800 text-sm font-semibold font-['Inter']">{jobTitle}</div>
      <div className="px-2 py-1 bg-green-100 rounded-lg justify-center items-center gap-2.5 inline-flex overflow-hidden">
        <div className="text-teal-800 text-xs font-extrabold font-['Inter'] uppercase">{status}</div>
      </div>
    </div>
  );
};

