import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingWidget } from './components/FloatingWidget';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

// Flag to disable animations for troubleshooting
const DISABLE_ANIMATIONS = false;

// Create a mock AuthContext since some components might require it
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}>({
  isAuthenticated: true,
  user: { id: 'mock-user-id', email: 'user@example.com' },
  loading: false,
  login: async () => {},
  logout: () => {},
});

// Create a context to provide job info to the FloatingWidget
export const JobContext = createContext<{
  jobInfo: any;
  hasResume: boolean;
  actions: {
    saveJob: () => void;
    autoFill: () => void;
    generateCoverLetter: () => void;
  };
  disableAnimations: boolean;
}>({
  jobInfo: null,
  hasResume: false,
  actions: {
    saveJob: () => {},
    autoFill: () => {},
    generateCoverLetter: () => {}
  },
  disableAnimations: DISABLE_ANIMATIONS
});

// Get the container from the DOM
const container = document.getElementById('pasa-floating-widget-container');
if (!container) {
  console.error('Container element not found for Pasa widget');
}

// Check if Chrome APIs are available
const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

// Main Widget App component
const WidgetApp = () => {
  const [jobInfo, setJobInfo] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  
  // Track when component mounts
  useEffect(() => {
    console.log('WidgetApp component mounted');
    return () => console.log('WidgetApp component unmounted');
  }, []);
  
  // Check if user has a resume
  useEffect(() => {
    console.log('Checking if user has resume');
    if (isChromeExtension) {
      try {
        chrome.storage.local.get(['hasResume'], (result) => {
          console.log('Resume check result:', result);
          setHasResume(!!result.hasResume);
        });
      } catch (error) {
        console.error('Failed to access Chrome storage:', error);
      }
    } else {
      console.log('Chrome extension APIs not available');
    }
  }, []);

  // Add error handling for API calls
  const handleApiError = (error: { status?: number }) => {
    console.error('API Error:', error);
    // Show user-friendly error message
    if (error.status === 401) {
      return 'Please log in to use this feature';
    }
    return 'An error occurred. Please try again later.';
  };

  // Update the useEffect for job info
  useEffect(() => {
    const handleJobInfo = (event: MessageEvent) => {
      if (event.data && event.data.type === 'JOB_INFO') {
        console.log('Received job info:', event.data.data);
        setJobInfo(event.data.data);
      }
    };

    window.addEventListener('message', handleJobInfo);
    return () => window.removeEventListener('message', handleJobInfo);
  }, []);

  // Update the action handlers
  const saveJob = async () => {
    try {
      console.log('Save job action triggered');
      if (!jobInfo) {
        console.error('No job info available');
        return;
      }
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'SAVE_JOB',
        data: jobInfo
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error saving job:', chrome.runtime.lastError);
          return;
        }
        console.log('Save job response:', response);
      });
    } catch (error) {
      console.error('Save job error:', error);
      // Show error message to user
    }
  };

  const autoFill = async () => {
    try {
      console.log('Auto-fill action triggered');
      if (!jobInfo) {
        console.error('No job info available');
        return;
      }
      
      // Check if we're on a supported job site
      const supportedSites = ['greenhouse', 'lever', 'workday'];
      if (!supportedSites.includes(jobInfo.detectedOn)) {
        console.log('Auto-fill not supported for this job site');
        return;
      }
      
      // Send message to content script
      window.parent.postMessage({
        type: 'AUTO_FILL',
        data: jobInfo
      }, '*');
    } catch (error) {
      console.error('Auto-fill error:', error);
      // Show error message to user
    }
  };

  const generateCoverLetter = async () => {
    try {
      console.log('Generate cover letter action triggered');
      if (!jobInfo) {
        console.error('No job info available');
        return;
      }
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'GENERATE_COVER_LETTER',
        data: jobInfo
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error generating cover letter:', chrome.runtime.lastError);
          return;
        }
        console.log('Cover letter response:', response);
      });
    } catch (error) {
      console.error('Cover letter generation error:', error);
      // Show error message to user
    }
  };

  // Track FloatingWidget changes to update iframe size
  useEffect(() => {
    // Set up a MutationObserver to watch for DOM changes in the widget
    const observer = new MutationObserver((mutations) => {
      // Get current widget height
      const widgetElement = document.querySelector('.pasa-floating-widget');
      if (widgetElement) {
        const height = widgetElement.getBoundingClientRect().height;
        console.log('Widget height changed:', height);
        
        // Send resize message to content script
        window.parent.postMessage({
          source: 'pasa-widget',
          type: 'RESIZE',
          height: height + 20 // Add padding
        }, '*');
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: true,
      user: { id: 'mock-user-id', email: 'user@example.com' },
      loading: false,
      login: async () => {},
      logout: () => {}
    }}>
      <JobContext.Provider value={{ jobInfo, hasResume, actions: { saveJob, autoFill, generateCoverLetter }, disableAnimations: DISABLE_ANIMATIONS }}>
        <Toaster position="top-right" />
        <FloatingWidget />
      </JobContext.Provider>
    </AuthContext.Provider>
  );
};

// Create a React root and render the FloatingWidget with JobContext
console.log('Creating React root in container:', container);
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <WidgetApp />
  </React.StrictMode>
);

// Define custom window interface to include pasaWidget
declare global {
  interface Window {
    pasaWidget: {
      updateJobInfo: (jobInfo: any) => void;
    };
  }
}

// Export a function to be called from the content script
// Use direct window assignment to ensure it's available even when loaded as a module
window.pasaWidget = {
  updateJobInfo: (jobInfo: any) => {
    // Post a message to the window so our React app can receive it
    console.log('pasaWidget.updateJobInfo called with:', jobInfo);
    window.postMessage({ 
      source: 'pasa-widget',
      type: 'PASA_JOB_INFO', 
      jobInfo 
    }, '*');
  }
};

console.log('Pasa widget initialized, pasaWidget:', window.pasaWidget); 