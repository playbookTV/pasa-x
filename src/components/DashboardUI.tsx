"use client"

import type React from "react"
import { useState } from "react"
import { Logo } from "./Logo"
import { AvatarButton } from "./AvatarButton"
import { NavTab } from "./NavTab"
import { Overview } from "./Overview"
import { ApplicationItemCompact } from "./ApplicationItemCompact"
import { ApplicationsTab } from "./ApplicationsTab"
import { Todo } from "./Todo"

export const DashboardUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Applications", value: "applications" },
    { label: "Coverletters", value: "coverletters" },
    { label: "Development", value: "development" },
  ]

  // Sample upcoming applications
  const upcomingApplications = [
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
    },
  ]

  // Render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "applications":
        return <ApplicationsTab />
      case "coverletters":
        return (
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
              Coverletters
            </div>
            <div className="self-stretch text-neutral-600 text-sm">Coming soon...</div>
          </div>
        )
      case "development":
        return <Todo />
      default: // dashboard
        return (
          <>
            {/* Overview Section */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
                Overview
              </div>
              <Overview totalApplications={15} pending={15} interviews={15} offers={15} className="self-stretch" />
            </div>

            {/* Upcoming Section */}
            <div className="self-stretch pt-3 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-center text-neutral-800 text-base font-bold font-['Inter']">
                Upcoming
              </div>
              <div className="self-stretch rounded-lg flex flex-col justify-center items-start">
                {upcomingApplications.map((app, index) => (
                  <ApplicationItemCompact
                    key={index}
                    company={app.company}
                    date={app.date}
                    jobTitle={app.jobTitle}
                    status={app.status}
                    className="self-stretch px-4"
                  />
                ))}
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-slate-200"></div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-slate-200"></div>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-2.5 bg-slate-100 inline-flex justify-start items-start gap-2.5 overflow-hidden">
      <div className="flex-1 pt-4 rounded-xl inline-flex flex-col justify-start items-start gap-4">
        {/* Header with Logo and Avatar */}
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
            <div className="w-14 h-12 bg-white flex items-center justify-center">
              <Logo variant="noText" />
            </div>
          </div>
          <AvatarButton
            fullName="Chris Nolan"
            role="Designer"
            initials="CN"
            className="h-12 pl-3.5 pr-2.5 bg-white rounded-xl border border-slate-200"
          />
        </div>

        {/* Main Content */}
        <div className="self-stretch px-3 py-3.5 bg-white rounded-xl flex flex-col justify-start items-start gap-6">
          {/* Tabs */}
          <NavTab
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="self-stretch h-11 px-[3px] py-1 bg-gray-200 rounded-lg"
          />

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

