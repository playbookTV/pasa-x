"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ApplicationCard } from "./ApplicationCard"
import { ApplicationTracker } from "./ApplicationTracker"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { SavedJob } from "../lib/dashboard"

interface ApplicationsTabProps {
  applications: SavedJob[];
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ applications }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApps, setFilteredApps] = useState<SavedJob[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedApplication, setSelectedApplication] = useState<SavedJob | null>(null);
  
  // Filter applications based on search term and active filter
  useEffect(() => {
    let filtered = [...applications];
    
    // Apply status filter
    if (activeFilter !== "ALL") {
      filtered = filtered.filter(app => app.status === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(term) || 
        app.company.toLowerCase().includes(term) ||
        (app.location?.toLowerCase().includes(term) || false)
      );
    }
    
    setFilteredApps(filtered);
  }, [applications, searchTerm, activeFilter]);

  // Application status stages for the tracker
  const applicationStages = [
    { label: "Saved", value: "SAVED" },
    { label: "Applied", value: "APPLIED" },
    { label: "Interview", value: "INTERVIEW" },
    { label: "Offer", value: "OFFER" },
    { label: "Rejected", value: "REJECTED" }
  ];

  // Handle application status change
  const handleStatusChange = (value: string) => {
    if (selectedApplication) {
      // Convert value to the appropriate status type for SavedJob
      const status = value as 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
      
      // Update the status locally for now
      // In a real app, you would call an API to update the status
      const updatedApp = { ...selectedApplication, status };
      setSelectedApplication(updatedApp);
      
      // You would also update the applications list
      // This is a simplistic approach; in a real app, you'd use a state management solution
      const updatedApps = applications.map(app => 
        app.id === selectedApplication.id ? updatedApp : app
      );
      
      // You'd typically call a function like updateApplicationStatus(selectedApplication.id, value)
    }
  };

  if (selectedApplication) {
    return (
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {/* Back button */}
        <div className="self-stretch flex items-center gap-2 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedApplication(null)}
            className="p-0 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-neutral-800 text-xl font-bold font-['Inter']">
            Application Details
          </div>
        </div>
        
        {/* Application details */}
        <div className="w-full bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{selectedApplication.title}</h2>
          <p className="text-gray-600">{selectedApplication.company}</p>
          {selectedApplication.location && (
            <p className="text-gray-500 text-sm">{selectedApplication.location}</p>
          )}
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Application Status</h3>
            <ApplicationTracker 
              stages={applicationStages}
              onChange={handleStatusChange}
            />
          </div>
          
          {selectedApplication.url && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(selectedApplication.url, '_blank')}
              >
                View Job Posting
              </Button>
            </div>
          )}
          
          {selectedApplication.notes && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{selectedApplication.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
        Applications
      </div>
      
      {/* Search and Filters */}
      <div className="self-stretch flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={activeFilter === "ALL" ? "default" : "outline"}
            onClick={() => setActiveFilter("ALL")}
          >
            All ({applications.length})
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === "SAVED" ? "default" : "outline"}
            onClick={() => setActiveFilter("SAVED")}
          >
            Saved
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === "APPLIED" ? "default" : "outline"}
            onClick={() => setActiveFilter("APPLIED")}
          >
            Applied
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === "INTERVIEW" ? "default" : "outline"}
            onClick={() => setActiveFilter("INTERVIEW")}
          >
            Interviews
          </Button>
        </div>
      </div>
      
      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="self-stretch rounded-lg flex flex-col justify-center items-start gap-3">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              onClick={() => setSelectedApplication(app)}
              className="cursor-pointer w-full"
            >
              <ApplicationCard
                company={app.company}
                date={app.dateCreated ? new Date(app.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : ''}
                jobTitle={app.title}
                status={app.status}
                className="self-stretch"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="self-stretch text-neutral-600 text-center py-12">
          <p className="mb-2">No applications found</p>
          <p className="text-sm text-gray-500">
            {searchTerm || activeFilter !== "ALL" 
              ? "Try adjusting your search or filters" 
              : "Start by saving jobs with the Chrome extension or adding them manually"}
          </p>
          {applications.length === 0 && (
            <Button 
              className="mt-4"
              onClick={() => window.open('/import-jobs', '_blank')}
            >
              Import Jobs
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

