"use client"

import type React from "react"
import { useState } from "react"
import { Logo } from "./Logo"
import { Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApplicationItem {
  company: string
  date: string
  jobTitle: string
  status: string
  statusColor: string
}

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const upcomingApplications: ApplicationItem[] = [
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
      statusColor: "blue",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
      statusColor: "blue",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
      statusColor: "blue",
    },
  ]

  const renderApplicationItem = (item: ApplicationItem, index: number) => (
    <div
      key={index}
      className="self-stretch pt-2 pb-4 bg-white shadow-[0px_3px_2.5px_0px_rgba(220,217,231,1.00)] border-b-[0.70px] border-slate-200 flex flex-col justify-start items-start gap-2 overflow-hidden"
    >
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="justify-center text-neutral-800/50 text-[10px] font-semibold font-['Inter'] uppercase">
          {item.company}
        </div>
        <div className="justify-center text-neutral-800/50 text-[10px] font-semibold font-['Inter'] uppercase">
          {item.date}
        </div>
      </div>
      <div className="self-stretch justify-center text-neutral-800 text-sm font-semibold font-['Inter']">
        {item.jobTitle}
      </div>
      <div
        className={`px-2 py-1 bg-${item.statusColor}-100 rounded-lg inline-flex justify-center items-center gap-2.5 overflow-hidden`}
      >
        <div className={`justify-start text-${item.statusColor}-700 text-[9px] font-bold font-['Inter']`}>
          {item.status}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-96 p-2.5 bg-slate-100 inline-flex justify-start items-start gap-2.5 overflow-hidden">
      <div className="flex-1 pt-4 rounded-xl inline-flex flex-col justify-start items-start gap-4">
        {/* Header with Logo and Avatar */}
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
            <Logo variant="noText" className="w-14 h-12" />
          </div>
          <div className="pl-3.5 pr-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-end items-center gap-3">
            <div className="size-6 relative overflow-hidden">
              <Moon className="size-5 text-indigo-600" />
            </div>
            <div className="w-px self-stretch relative bg-slate-200" />
            <div className="w-10 py-1.5 flex justify-start items-center gap-2.5">
              <div className="flex-1 h-10 px-2 py-3 bg-indigo-100 rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5">
                <div className="justify-start text-indigo-900 text-base font-semibold font-['Inter'] leading-7">CN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="self-stretch px-3 py-3.5 bg-white rounded-xl flex flex-col justify-start items-start gap-6">
          {/* Tabs */}
          <div className="self-stretch h-11 px-[3px] py-1 bg-gray-200 rounded-lg inline-flex justify-between items-center">
            <div
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "flex-1 self-stretch p-2.5 rounded-md flex justify-center items-center gap-2.5 cursor-pointer",
                activeTab === "dashboard"
                  ? "bg-white shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13)] shadow-[0px_0px_0px_1px_rgba(193,188,219,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(193,196,228,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(231,129,52,0.85)] outline outline-[0.70px] outline-offset-[-0.70px] outline-gray-300"
                  : "bg-white/0",
              )}
            >
              <div
                className={cn(
                  "justify-start text-base font-semibold font-['Inter'] leading-tight",
                  activeTab === "dashboard" ? "text-indigo-600" : "text-gray-700",
                )}
              >
                Dashboard
              </div>
            </div>
            <div
              onClick={() => setActiveTab("applications")}
              className={cn(
                "flex-1 self-stretch px-4 rounded-sm flex justify-center items-center gap-2 cursor-pointer",
                activeTab === "applications"
                  ? "bg-white shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13)] shadow-[0px_0px_0px_1px_rgba(193,188,219,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(193,196,228,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(231,129,52,0.85)] outline outline-[0.70px] outline-offset-[-0.70px] outline-gray-300"
                  : "bg-white/0",
              )}
            >
              <div
                className={cn(
                  "justify-start text-base font-semibold font-['Inter'] leading-tight",
                  activeTab === "applications" ? "text-indigo-600" : "text-gray-700",
                )}
              >
                Applications
              </div>
            </div>
            <div
              onClick={() => setActiveTab("coverletters")}
              className={cn(
                "flex-1 self-stretch px-4 rounded-sm flex justify-center items-center gap-2 cursor-pointer",
                activeTab === "coverletters"
                  ? "bg-white shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13)] shadow-[0px_0px_0px_1px_rgba(193,188,219,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(193,196,228,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(231,129,52,0.85)] outline outline-[0.70px] outline-offset-[-0.70px] outline-gray-300"
                  : "bg-white/0",
              )}
            >
              <div
                className={cn(
                  "justify-start text-base font-semibold font-['Inter'] leading-tight",
                  activeTab === "coverletters" ? "text-indigo-600" : "text-gray-700",
                )}
              >
                Coverletters
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
              Overview
            </div>
            <div className="self-stretch py-0.5 flex flex-col justify-center items-start">
              {/* Applications Card */}
              <div className="self-stretch rounded-tl-lg rounded-tr-lg inline-flex justify-start items-start gap-2">
                <div className="flex-1 px-3 pt-3 pb-6 bg-white rounded-tl-lg rounded-tr-lg shadow-[0px_0px_1.100000023841858px_0px_rgba(191,185,214,1.00)] shadow-[inset_0px_-3px_0px_-1px_rgba(220,217,231,1.00)] border-l border-r border-t border-slate-200 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-center text-neutral-800 text-sm font-semibold font-['Inter']">
                      Applications
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-end gap-2">
                    <div className="w-10 justify-center text-black text-3xl font-extrabold font-['Inter']">15</div>
                    <div className="justify-center text-neutral-800 text-xs font-normal font-['Inter']">Total </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="self-stretch shadow-[0px_3px_2.5px_0px_rgba(220,217,231,1.00)] outline outline-[0.70px] outline-offset-[-0.70px] inline-flex justify-start items-center overflow-hidden">
                <div className="flex-1 self-stretch px-3 py-2 rounded-bl-lg outline outline-[0.70px] outline-offset-[-0.70px] outline-slate-200 inline-flex flex-col justify-start items-start gap-2">
                  <div className="justify-center text-neutral-800 text-xs font-semibold font-['Inter']">Pending</div>
                  <div className="self-stretch justify-center text-neutral-800 text-xl font-semibold font-['Inter']">
                    15
                  </div>
                </div>
                <div className="flex-1 self-stretch px-3 py-2 border-t-[0.70px] border-b-[0.70px] border-slate-200 inline-flex flex-col justify-start items-start gap-2">
                  <div className="justify-center text-neutral-800 text-xs font-semibold font-['Inter']">Interviews</div>
                  <div className="self-stretch justify-center text-neutral-800 text-xl font-semibold font-['Inter']">
                    15
                  </div>
                </div>
                <div className="flex-1 self-stretch px-3 py-2 rounded-br-lg outline outline-[0.70px] outline-offset-[-0.70px] outline-slate-200 inline-flex flex-col justify-start items-start gap-2">
                  <div className="justify-center text-neutral-800 text-xs font-semibold font-['Inter']">Offers</div>
                  <div className="self-stretch justify-center text-neutral-800 text-xl font-semibold font-['Inter']">
                    15
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Section */}
          <div className="self-stretch pt-3 flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-neutral-800 text-base font-bold font-['Inter']">
              Upcoming
            </div>
            <div className="self-stretch rounded-lg flex flex-col justify-center items-start">
              {upcomingApplications.map(renderApplicationItem)}
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-slate-200"></div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

