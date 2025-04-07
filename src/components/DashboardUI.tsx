import type React from "react"
import { useState, useEffect } from "react"
import { Logo } from "./Logo"
import { AvatarButton } from "./AvatarButton"
import { NavTab } from "./NavTab"
import { Overview } from "./Overview"
import { ApplicationItemCompact } from "./ApplicationItemCompact"
import { ApplicationsTab } from "./ApplicationsTab"
import { Todo } from "./Todo"
import { useDashboard } from "../hooks/useDashboard"
import { useAuthContext } from "../lib/auth-context"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"

interface DetectedJob {
  saved: boolean;
  title?: string;
  company?: string;
  description?: string;
  url?: string;
  location?: string;
  jobType?: string;
}

export const DashboardUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAuthContext()
  const { 
    loading, 
    error, 
    stats, 
    upcomingApplications, 
    allApplications, 
    coverLetters,
    importJobsFromExtension,
    refreshData
  } = useDashboard()

  const tabs = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Applications", value: "applications" },
    { label: "Coverletters", value: "coverletters" },
    { label: "Development", value: "development" },
  ]

  // Import jobs on initial load
  useEffect(() => {
    // Check if there are Chrome extension jobs to import
    if (typeof chrome !== 'undefined' && chrome.storage && allApplications.length === 0 && !loading) {
      chrome.storage.local.get(['detectedJobs'], (result) => {
        const jobs = result.detectedJobs || [];
        const savedJobs = jobs.filter((job: DetectedJob) => job.saved);
        
        if (savedJobs.length > 0) {
          // Show notification about importing jobs
          const shouldImport = window.confirm(
            `Found ${savedJobs.length} saved job(s) from the Chrome extension. Would you like to import them?`
          );
          
          if (shouldImport) {
            importJobsFromExtension();
          }
        }
      });
    }
  }, [allApplications.length, loading]);

  // Render the content based on the active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
          <p className="text-gray-500">Loading your dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-2">Error loading data</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refreshData}>Try Again</Button>
        </div>
      );
    }

    switch (activeTab) {
      case "applications":
        return <ApplicationsTab applications={allApplications} />
      case "coverletters":
        return (
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
              Coverletters
            </div>
            {coverLetters.length > 0 ? (
              <div className="self-stretch grid grid-cols-1 gap-4">
                {coverLetters.map((letter, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium">{letter.title || `Cover Letter ${index + 1}`}</h3>
                    <p className="text-sm text-gray-500">{new Date(letter.createdAt).toLocaleDateString()}</p>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/cover-letters/${letter.id}`, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="self-stretch text-neutral-600 text-sm">
                No cover letters yet. Generate one from the job application page!
              </div>
            )}
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
              <Overview 
                totalApplications={stats.totalApplications}
                pending={stats.pending}
                interviews={stats.interviews}
                offers={stats.offers}
                className="self-stretch" 
              />
            </div>

            {/* Upcoming Section */}
            <div className="self-stretch pt-3 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-center text-neutral-800 text-base font-bold font-['Inter']">
                Upcoming
              </div>
              {upcomingApplications.length > 0 ? (
                <div className="self-stretch rounded-lg flex flex-col justify-center items-start">
                  {upcomingApplications.map((app) => (
                    <ApplicationItemCompact
                      key={app.id}
                      company={app.company}
                      date={app.date}
                      jobTitle={app.jobTitle}
                      status={app.status}
                      className="self-stretch px-4"
                    />
                  ))}
                  <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-slate-200"></div>
                </div>
              ) : (
                <div className="self-stretch text-neutral-600 text-sm">
                  No upcoming interviews or events scheduled.
                </div>
              )}
            </div>

            {/* Chrome Extension Integration */}
            {typeof chrome !== 'undefined' && chrome.storage && (
              <div className="self-stretch mt-4 pt-3 flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-center text-neutral-800 text-base font-bold font-['Inter']">
                  Chrome Extension
                </div>
                <div className="self-stretch bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-700 mb-2">
                    Use the Pasa Chrome extension to automatically detect and save jobs from popular job boards.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={importJobsFromExtension}
                  >
                    Import Saved Jobs from Extension
                  </Button>
                </div>
              </div>
            )}
          </>
        )
    }
  }

  return (
    <div className="w-full min-w-[430px] max-w-3xl mx-auto p-2.5 bg-slate-100 inline-flex justify-start items-start gap-2.5 overflow-hidden">
      <div className="flex-1 pt-4 rounded-xl inline-flex flex-col justify-start items-start gap-4">
        {/* Header with Logo and Avatar */}
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
            <div className="w-14 h-12 bg-white flex items-center justify-center">
              <Logo variant="noText" />
            </div>
          </div>
          <AvatarButton
            fullName={user?.name || "User"}
            role={user?.email || ""}
            initials={user?.name?.charAt(0) || "U"}
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

