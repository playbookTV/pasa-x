import React, { useState, useEffect } from 'react';
import JobDetectionCard from './JobDetectionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface JobInfo {
  title: string;
  company: string;
  location?: string;
  description: string;
  url: string;
  jobType?: string;
  salary?: string;
  saved?: boolean;
  applied?: boolean;
  notes?: string;
  lastDetected?: string;
}

interface StoredJob {
  url: string;
  saved?: boolean;
  applied?: boolean;
  [key: string]: any;
}

export const Popup: React.FC = () => {
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedJobs, setSavedJobs] = useState<JobInfo[]>([]);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    // Check auth status
    chrome.storage.local.get(['isAuthenticated'], (result) => {
      setIsAuthenticated(!!result.isAuthenticated);
    });

    // Load current job
    setLoading(true);
    chrome.runtime.sendMessage({ type: 'GET_CURRENT_JOB' }, (response) => {
      if (response && response.currentJob) {
        setJobInfo(response.currentJob);
      }
      setLoading(false);
    });

    // Load saved jobs
    chrome.storage.local.get(['detectedJobs'], (result) => {
      const jobs = result.detectedJobs || [];
      const saved = jobs.filter((job: StoredJob) => job.saved);
      setSavedJobs(saved);
    });
  }, []);

  const handleRefreshJobInfo = () => {
    setLoading(true);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.reload(tabs[0].id!);
      
      // Wait a moment for the content script to process the page
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'GET_CURRENT_JOB' }, (response) => {
          if (response && response.currentJob) {
            setJobInfo(response.currentJob);
          }
          setLoading(false);
        });
      }, 1000);
    });
  };

  const handleGenerateCoverLetter = () => {
    // Open cover letter page in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('cover-letter.html') });
  };

  return (
    <div className="w-[400px] p-4 bg-gray-50 min-h-[500px]">
      <Toaster position="top-right" />
      
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-indigo-600">Pasa</h1>
        {!isAuthenticated ? (
          <Button 
            size="sm" 
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('auth.html') })}
          >
            Sign In
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') })}
          >
            Dashboard
          </Button>
        )}
      </header>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="current" className="flex-1">Current Job</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            Saved Jobs
            {savedJobs.length > 0 && <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">{savedJobs.length}</span>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
              <p className="text-gray-500">Loading job information...</p>
            </div>
          ) : (
            <JobDetectionCard 
              jobInfo={jobInfo} 
              onGenerateCoverLetter={handleGenerateCoverLetter}
              onRefresh={handleRefreshJobInfo}
            />
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-4">
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
              <p className="text-gray-500 mb-4">
                Visit job sites and save interesting positions to see them here.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('current')}
              >
                Go to Current Job
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <div className="flex justify-between mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      View
                    </Button>
                    {job.applied ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Applied
                      </span>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => {
                          chrome.runtime.sendMessage({
                            type: 'MARK_APPLIED',
                            data: { url: job.url }
                          });
                          
                          // Update local state
                          setSavedJobs(savedJobs.map(j => 
                            j.url === job.url ? {...j, applied: true} : j
                          ));
                        }}
                      >
                        Mark Applied
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 