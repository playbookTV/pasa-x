import { useState, useEffect } from 'react';
import { useAuthContext } from '../lib/auth-context';
import { 
  getDashboardStats,
  getUpcomingApplications,
  getAllApplications,
  getCoverLetters,
  updateApplicationStatus,
  addApplicationFromDetectedJob,
  syncDetectedJobs,
  ApplicationStats,
  UpcomingApplication,
  SavedJob
} from '../lib/dashboard';

interface DetectedJob {
  saved: boolean;
  title: string;
  company: string;
  description: string;
  url: string;
  location?: string;
  jobType?: string;
}

export function useDashboard() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ApplicationStats>({
    totalApplications: 0,
    pending: 0,
    interviews: 0,
    offers: 0
  });
  const [upcomingApplications, setUpcomingApplications] = useState<UpcomingApplication[]>([]);
  const [allApplications, setAllApplications] = useState<SavedJob[]>([]);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);

  // Load all dashboard data
  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // If we're in the extension, try to sync chrome storage jobs with the database
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await syncDetectedJobs(user.id);
      }
      
      const [statsData, upcomingData, applicationsData, coverLettersData] = await Promise.all([
        getDashboardStats(user.id),
        getUpcomingApplications(user.id),
        getAllApplications(user.id),
        getCoverLetters(user.id)
      ]);
      
      setStats(statsData);
      setUpcomingApplications(upcomingData);
      setAllApplications(applicationsData);
      setCoverLetters(coverLettersData);
    } catch (err) {
      console.error('Error loading dashboard data', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  // Update an application status
  const updateStatus = async (applicationId: string, status: string) => {
    if (!user?.id) return;
    
    try {
      await updateApplicationStatus(applicationId, status);
      
      // Update the local state to reflect the change
      setAllApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: status as any } 
            : app
        )
      );
      
      // Reload dashboard data to get updated stats
      loadDashboardData();
      
      return true;
    } catch (err) {
      console.error('Error updating application status', err);
      return false;
    }
  };

  // Add a new application from a detected job
  const addApplication = async (jobData: {
    title: string;
    company: string;
    location?: string;
    description: string;
    url: string;
    jobType?: string;
  }) => {
    if (!user?.id) return;
    
    try {
      await addApplicationFromDetectedJob(user.id, jobData);
      
      // Reload dashboard data to include the new application
      loadDashboardData();
      
      return true;
    } catch (err) {
      console.error('Error adding application', err);
      return false;
    }
  };

  // Import jobs from Chrome extension storage
  const importJobsFromExtension = async () => {
    if (!user?.id || typeof chrome === 'undefined' || !chrome.storage) {
      return false;
    }
    
    try {
      // Get detected jobs from Chrome storage
      chrome.storage.local.get(['detectedJobs'], async (result) => {
        const jobs = result.detectedJobs || [];
        const savedJobs = jobs.filter((job: DetectedJob) => job.saved);
        
        // Add each saved job as an application
        for (const job of savedJobs) {
          await addApplicationFromDetectedJob(user.id, {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            jobType: job.jobType
          });
        }
        
        // Reload dashboard data
        loadDashboardData();
      });
      
      return true;
    } catch (err) {
      console.error('Error importing jobs from extension', err);
      return false;
    }
  };

  return {
    loading,
    error,
    stats,
    upcomingApplications,
    allApplications,
    coverLetters,
    updateStatus,
    addApplication,
    importJobsFromExtension,
    refreshData: loadDashboardData
  };
} 