import type React from "react"
import { cn } from "@/lib/utils"

interface ApplicationItemCompactProps {
  company: string
  date: string
  jobTitle: string
  status: string
  className?: string
}

export const ApplicationItemCompact: React.FC<ApplicationItemCompactProps> = ({
  company,
  date,
  jobTitle,
  status,
  className,
}) => {
  // Get status background and text color
  const getStatusClasses = (status: string): { bg: string; text: string } => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "interview":
        return { bg: "bg-blue-100", text: "text-blue-700" }
      case "applied":
        return { bg: "bg-orange-100", text: "text-yellow-900" }
      case "offer":
        return { bg: "bg-green-100", text: "text-teal-800" }
      case "declined":
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-900" }
      case "screening":
        return { bg: "bg-violet-100", text: "text-slate-500" }
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" }
    }
  }

  const { bg, text } = getStatusClasses(status)

  return (
    <div
      className={cn(
        "pt-2 pb-4 px-4 bg-white shadow-[0px_3px_2.5px_0px_rgba(220,217,231,1.00)] border-b border-slate-200 flex-col justify-start items-start gap-2 inline-flex overflow-hidden",
        className,
      )}
    >
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="justify-center text-neutral-800/50 text-[10px] font-semibold font-['Inter'] uppercase">
          {company}
        </div>
        <div className="justify-center text-neutral-800/50 text-[10px] font-semibold font-['Inter'] uppercase">
          {date}
        </div>
      </div>
      <div className="self-stretch justify-center text-neutral-800 text-sm font-semibold font-['Inter']">
        {jobTitle}
      </div>
      <div className={cn("px-2 py-1 rounded-lg inline-flex justify-center items-center gap-2.5 overflow-hidden", bg)}>
        <div className={cn("justify-start text-[10px] font-bold font-['Inter'] uppercase", text)}>{status}</div>
      </div>
    </div>
  )
}

