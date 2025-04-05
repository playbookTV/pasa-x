// Content script for Pasa Chrome Extension
console.log('Pasa content script initialized');

// Job sites patterns
const JOB_SITES = {
  linkedin: {
    hostname: 'linkedin.com',
    paths: ['/jobs/view/', '/jobs/collections/'],
    titleSelector: '.job-details-jobs-unified-top-card__job-title',
    descriptionSelector: '.jobs-description__content',
    companySelector: '.job-details-jobs-unified-top-card__company-name'
  },
  indeed: {
    hostname: 'indeed.com',
    paths: ['/viewjob', '/job/'],
    titleSelector: '.jobsearch-JobInfoHeader-title',
    descriptionSelector: '#jobDescriptionText',
    companySelector: '.jobsearch-InlineCompanyRating-companyName'
  },
  glassdoor: {
    hostname: 'glassdoor.com',
    paths: ['/job-listing/'],
    titleSelector: '.job-title',
    descriptionSelector: '.jobDescriptionContent',
    companySelector: '.employer-name'
  }
};

// Function to check if the current page is a job listing
function isJobListing() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  for (const site in JOB_SITES) {
    const siteInfo = JOB_SITES[site];
    if (hostname.includes(siteInfo.hostname)) {
      for (const path of siteInfo.paths) {
        if (url.includes(path)) {
          return site;
        }
      }
    }
  }
  
  return false;
}

// Function to extract job information from the page
function extractJobInfo(site) {
  const siteInfo = JOB_SITES[site];
  
  const title = document.querySelector(siteInfo.titleSelector)?.textContent?.trim() || '';
  const description = document.querySelector(siteInfo.descriptionSelector)?.textContent?.trim() || '';
  const company = document.querySelector(siteInfo.companySelector)?.textContent?.trim() || '';
  
  return {
    title,
    description,
    company,
    url: window.location.href
  };
}

// Function to notify the background script about a detected job
function notifyJobDetected(jobInfo) {
  chrome.runtime.sendMessage({
    type: 'JOB_DETECTED',
    data: jobInfo
  }, response => {
    console.log('Job detected notification response:', response);
  });
}

// Main execution
function init() {
  // Check if the current page is a job listing
  const site = isJobListing();
  if (site) {
    console.log(`Detected ${site} job listing`);
    
    // Give the page time to fully load
    setTimeout(() => {
      const jobInfo = extractJobInfo(site);
      console.log('Extracted job info:', jobInfo);
      
      // Notify the background script
      notifyJobDetected(jobInfo);
      
      // Inject the floating widget
      injectFloatingWidget();
    }, 1500);
  }
}

// Function to inject the floating widget
function injectFloatingWidget() {
  // Check if the widget already exists
  if (document.getElementById('pasa-floating-widget')) {
    return;
  }
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'pasa-floating-widget';
  
  // Widget will be injected by the extension popup.js
  document.body.appendChild(widgetContainer);
}

// Initialize
init();

// Listen for URL changes (for single-page applications)
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href;
    console.log('URL changed, reinitializing Pasa');
    init();
  }
}).observe(document, { subtree: true, childList: true }); 