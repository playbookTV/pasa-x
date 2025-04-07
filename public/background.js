// Background script for Pasa Chrome Extension
console.log('Pasa background script initialized');

// Store detected jobs
let detectedJobs = [];
const MAX_STORED_JOBS = 50;

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Pasa extension installed:', details.reason);
  
  // Initialize user storage
  chrome.storage.local.set({ 
    isAuthenticated: false,
    hasResume: false,
    detectedJobs: []
  });
});

// Helper function to save detected job
function saveDetectedJob(jobInfo) {
  // Get current jobs
  chrome.storage.local.get(['detectedJobs'], (result) => {
    let jobs = result.detectedJobs || [];
    
    // Check if job URL already exists
    const existingJobIndex = jobs.findIndex(job => job.url === jobInfo.url);
    
    if (existingJobIndex >= 0) {
      // Update existing job
      jobs[existingJobIndex] = {
        ...jobs[existingJobIndex],
        ...jobInfo,
        lastDetected: new Date().toISOString()
      };
    } else {
      // Add new job
      jobs.unshift({
        ...jobInfo,
        saved: false,
        applied: false,
        notes: '',
        lastDetected: new Date().toISOString()
      });
      
      // Limit size of stored jobs
      if (jobs.length > MAX_STORED_JOBS) {
        jobs = jobs.slice(0, MAX_STORED_JOBS);
      }
    }
    
    // Save back to storage
    chrome.storage.local.set({ detectedJobs: jobs });
    
    // Update badge count
    const unsavedCount = jobs.filter(job => !job.saved && !job.applied).length;
    updateBadge(unsavedCount);
  });
}

// Update browser action badge
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Open popup programmatically
function openPopup() {
  chrome.windows.getCurrent((window) => {
    chrome.action.openPopup({ windowId: window.id });
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  // Handle different message types
  switch (message.type) {
    case 'JOB_DETECTED':
      console.log('Job detected:', message.data);
      // Update badge to show that a job was detected
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
      
      // Acknowledge receipt immediately
      sendResponse({ status: 'received' });
      
      // Perform any additional processing asynchronously
      handleJobDetected(message.data);
      break;
      
    case 'AUTO_FILL_FORM':
      console.log('Auto-fill form requested');
      sendResponse({ status: 'received' });
      break;
      
    case 'GENERATE_COVER_LETTER':
      console.log('Generate cover letter requested');
      sendResponse({ status: 'received' });
      break;
      
    case 'SAVE_JOB':
      console.log('Save job requested');
      // Mark a job as saved
      chrome.storage.local.get(['detectedJobs'], (result) => {
        const jobs = result.detectedJobs || [];
        const jobIndex = jobs.findIndex(job => job.url === message.data.url);
        
        if (jobIndex >= 0) {
          jobs[jobIndex].saved = true;
          chrome.storage.local.set({ detectedJobs: jobs });
          
          // Update badge count
          const unsavedCount = jobs.filter(job => !job.saved && !job.applied).length;
          updateBadge(unsavedCount);
        }
        
        sendResponse({ success: true });
      });
      return true; // Required for async response
      
    case 'OPEN_POPUP':
      // Try to open the popup
      openPopup();
      sendResponse({ success: true });
      break;
      
    case 'GET_CURRENT_JOB':
      // Send the most recently detected job to the popup
      chrome.storage.local.get(['detectedJobs'], (result) => {
        const jobs = result.detectedJobs || [];
        const latestJob = jobs.length > 0 ? jobs[jobs.length - 1] : null;
        sendResponse({ job: latestJob });
      });
      return true; // Required for async response
      
    case 'MARK_APPLIED':
      // Mark a job as applied
      chrome.storage.local.get(['detectedJobs'], (result) => {
        const jobs = result.detectedJobs || [];
        const jobIndex = jobs.findIndex(job => job.url === message.data.url);
        
        if (jobIndex >= 0) {
          jobs[jobIndex].applied = true;
          chrome.storage.local.set({ detectedJobs: jobs });
          
          // Update badge count
          const unsavedCount = jobs.filter(job => !job.saved && !job.applied).length;
          updateBadge(unsavedCount);
        }
        
        sendResponse({ success: true });
      });
      return true; // Required for async response
      
    default:
      console.log('Unknown message type:', message.type);
      sendResponse({ status: 'unknown_type' });
  }
  
  // Return true to indicate we'll send a response asynchronously
  return true;
});

// Handle job detection
function handleJobDetected(jobInfo) {
  console.log('Processing detected job:', jobInfo);
  
  // Save to storage
  chrome.storage.local.get(['detectedJobs'], (result) => {
    const jobs = result.detectedJobs || [];
    
    // Check if this job is already saved (based on URL)
    const isDuplicate = jobs.some(job => job.url === jobInfo.url);
    
    if (!isDuplicate) {
      jobs.push(jobInfo);
      chrome.storage.local.set({ detectedJobs: jobs }, () => {
        console.log('Job saved to storage');
        
        // Update badge to show number of unprocessed jobs
        const unsavedCount = jobs.filter(job => !job.saved && !job.applied).length;
        updateBadge(unsavedCount);
      });
    } else {
      console.log('Job already in storage, skipping');
    }
  });
}

// Log when the background script starts
console.log('Pasa background script ready'); 