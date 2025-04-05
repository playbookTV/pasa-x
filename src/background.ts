// Background script for Pasa Chrome Extension
console.log('Pasa background script initialized');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Pasa extension installed');
    // Set initial state
    chrome.storage.local.set({
      hasUploadedResume: false,
      applications: [],
      settings: {
        theme: 'light',
      }
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.type === 'JOB_DETECTED') {
    // Notify user that a job form was detected
    console.log('Job form detected:', message.data);
    sendResponse({ success: true });
  }
  
  // Return true to indicate we'll respond asynchronously
  return true;
}); 