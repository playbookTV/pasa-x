import React from 'react';
import { cn } from '@/lib/utils';

interface OverviewProps {
  totalApplications: number;
  pending: number;
  interviews: number;
  offers: number;
  className?: string;
}

export const Overview: React.FC<OverviewProps> = ({
  totalApplications,
  pending,
  interviews,
  offers,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-neutral-800 text-xl font-bold font-['Inter']">Overview</h2>
      <div className="border rounded-lg border-slate-200 divide-y divide-slate-200">
        <div className="px-4 pt-4 pb-6">
          <div className="text-neutral-800 text-sm font-semibold font-['Inter']">Applications</div>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-black text-3xl font-extrabold font-['Inter']">{totalApplications}</div>
            <div className="text-neutral-800 text-xs font-normal font-['Inter']">Total</div>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-200">
          <div className="px-4 py-3">
            <div className="text-neutral-800 text-xs font-semibold font-['Inter']">Pending</div>
            <div className="mt-2 text-neutral-800 text-xl font-semibold font-['Inter']">{pending}</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-neutral-800 text-xs font-semibold font-['Inter']">Interviews</div>
            <div className="mt-2 text-neutral-800 text-xl font-semibold font-['Inter']">{interviews}</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-neutral-800 text-xs font-semibold font-['Inter']">Offers</div>
            <div className="mt-2 text-neutral-800 text-xl font-semibold font-['Inter']">{offers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

