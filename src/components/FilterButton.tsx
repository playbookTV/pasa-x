"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface FilterButtonProps {
  label: string
  active?: boolean
  onClick: () => void
  className?: string
}

export const FilterButton: React.FC<FilterButtonProps> = ({ label, active = false, onClick, className }) => {
  return (
    <div
      data-has-icon="False"
      data-icon-type="None"
      data-is-colored-text="False"
      data-size="Small"
      data-type={active ? "Ghost" : "Secondary"}
      onClick={onClick}
      className={cn(
        "size- px-2 py-3 rounded-sm shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13)] inline-flex justify-start items-center gap-2 overflow-hidden cursor-pointer",
        active
          ? "bg-indigo-50 shadow-[0px_0px_0px_1px_rgba(232,228,252,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(229,231,252,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(231,129,52,0.85)]"
          : "bg-white shadow-[0px_0px_0px_1px_rgba(224,220,240,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(233,235,255,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(231,129,52,0.85)]",
        className,
      )}
    >
      <div className="text-center justify-center text-slate-800 text-sm font-semibold font-['Inter']">{label}</div>
    </div>
  )
}

