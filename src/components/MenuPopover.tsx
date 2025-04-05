import React from 'react';
import { User, Settings, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuPopoverProps {
  fullName: string;
  role: string;
  className?: string;
  onClose?: () => void;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div className="self-stretch py-2 justify-start items-center gap-2 inline-flex cursor-pointer" onClick={onClick}>
    <div className="justify-start items-center gap-2 flex">
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-slate-700 text-xs font-semibold font-['Inter']">{label}</div>
    </div>
  </div>
);

export const MenuPopover: React.FC<MenuPopoverProps> = ({ fullName, role, className, onClose }) => {
  return (
    <div className={cn("w-44 px-1.5 pt-2.5 pb-2 bg-white rounded-md shadow-[0px_16px_17.100000381469727px_0px_rgba(220,217,231,1.00)] border border-slate-200 flex-col justify-start items-start gap-4 inline-flex", className)}>
      <div className="self-stretch h-8 px-1 flex-col justify-start items-start gap-2 flex">
        <div className="flex-col justify-start items-start gap-0.5 flex">
          <div className="text-neutral-800 text-sm font-semibold font-['Inter']">{fullName}</div>
          <div className="text-zinc-700/60 text-xs font-normal font-['Inter']">{role}</div>
        </div>
      </div>
      <div className="self-stretch px-2.5 py-1.5 bg-gray-200/50 rounded flex-col justify-start items-start gap-2 flex">
        <MenuItem icon={<User className="w-3.5 h-3.5" />} label="Manage Profile" onClick={onClose} />
        <MenuItem icon={<Settings className="w-3.5 h-3.5" />} label="Settings" onClick={onClose} />
        <MenuItem icon={<FileText className="w-3.5 h-3.5" />} label="Update Resume" onClick={onClose} />
        <MenuItem icon={<LogOut className="w-3.5 h-3.5" />} label="Sign out" onClick={onClose} />
      </div>
    </div>
  );
};

