// Background script for Pasa Chrome Extension
console.log('Pasa background script initialized');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Pasa extension installed:', details.reason);
  
  // Initialize user storage
  chrome.storage.local.set({ 
    isAuthenticated: false,
    hasResume: false 
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  
  if (message.type === 'JOB_DETECTED') {
    // Update badge to show that a job was detected
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
    
    // Store job data
    chrome.storage.local.set({ 
      currentJob: {
        title: message.data.title,
        description: message.data.description,
        company: message.data.company,
        url: message.data.url
      }
    });
    
    sendResponse({ success: true });
  }
  
  // Return true to indicate that we will send a response asynchronously
  return true;
}); 