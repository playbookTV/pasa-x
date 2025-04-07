// Content script for Pasa Chrome Extension
console.log('Pasa content script initialized');

// IMMEDIATE VISUAL DEBUGGING - shows that the script loaded
(function debugScriptLoaded() {
  console.log('🔥 PASA DEBUGGER: Content script loaded on:', window.location.href);
  try {
    // Add a visual indicator that the script has loaded
    const debugElement = document.createElement('div');
    debugElement.id = 'pasa-debug-indicator';
    debugElement.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      background-color: red;
      color: white;
      padding: 5px;
      z-index: 999999;
      font-size: 12px;
    `;
    debugElement.textContent = 'PASA DEBUG: Script Loaded';
    document.body.appendChild(debugElement);
    
    // Also add a border to the whole page for easier debugging
    document.body.style.border = '5px solid red';
    
    // Log DOM elements we're looking for
    setTimeout(() => {
      console.log('🔍 DEBUG: Looking for title:', document.querySelector('h1')?.textContent);
      console.log('🔍 DEBUG: Looking for content:', document.querySelector('#content')?.textContent?.substring(0, 100));
      console.log('🔍 DEBUG: All H1 elements:', Array.from(document.querySelectorAll('h1')).map(el => el.textContent));
      console.log('🔍 DEBUG: All sections:', Array.from(document.querySelectorAll('section')).length);
    }, 1000);
  } catch (e) {
    console.error('PASA DEBUG ERROR:', e);
  }
})();

// Job sites patterns
const JOB_SITES = {
  linkedin: {
    hostname: 'linkedin.com',
    paths: ['/jobs/view/', '/jobs/collections/'],
    titleSelector: '.job-details-jobs-unified-top-card__job-title, .top-card-layout__title',
    descriptionSelector: '.jobs-description__content, .description__text',
    companySelector: '.job-details-jobs-unified-top-card__company-name, .topcard__org-name-link',
    locationSelector: '.job-details-jobs-unified-top-card__bullet, .topcard__flavor--bullet',
    jobTypeSelector: '.ember-view.job-details-jobs-unified-top-card__job-insight, .job-criteria__item'
  },
  indeed: {
    hostname: 'indeed.com',
    paths: ['/viewjob', '/job/'],
    titleSelector: '.jobsearch-JobInfoHeader-title, .jcs-JobTitle',
    descriptionSelector: '#jobDescriptionText',
    companySelector: '.jobsearch-InlineCompanyRating-companyName, .jobsearch-JobInfoHeader-companyName',
    locationSelector: '.jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-iconLabel',
    jobTypeSelector: '.jobsearch-JobDescriptionSection-sectionItem'
  },
  glassdoor: {
    hostname: 'glassdoor.com',
    paths: ['/job-listing/'],
    titleSelector: '.job-title, .css-1sqqqs3',
    descriptionSelector: '.jobDescriptionContent, .desc, .css-1k5huso',
    companySelector: '.employer-name, .css-87uc0g',
    locationSelector: '.location, .css-3g3psg',
    jobTypeSelector: '.css-1cz2wjh'
  },
  monster: {
    hostname: 'monster.com',
    paths: ['/job-detail/'],
    titleSelector: '.job-title',
    descriptionSelector: '#jobDescriptionText',
    companySelector: '.name',
    locationSelector: '.location',
    jobTypeSelector: '.badge'
  },
  ziprecruiter: {
    hostname: 'ziprecruiter.com',
    paths: ['/job/'],
    titleSelector: '.job_title',
    descriptionSelector: '.jobDescriptionSection',
    companySelector: '.hiring_company_text',
    locationSelector: '.hiring_location',
    jobTypeSelector: '.meta_block_1'
  },
  wellfound: {
    hostname: 'wellfound.com',
    paths: ['/jobs/'],
    titleSelector: '.styles-module_job__xxxxx h2',
    descriptionSelector: '.styles-module_jobDescription__xxxxx',
    companySelector: '.styles-module_companyInfo__xxxxx h3',
    locationSelector: '.styles-module_location__xxxxx',
    jobTypeSelector: '.styles-module_jobDetail__xxxxx'
  },
  greenhouse: {
    hostname: 'greenhouse.io',
    paths: ['/jobs/', '/job/', '/deliveroo/jobs/'],
    titleSelector: '.app-title, h1, h2',
    descriptionSelector: '#content, #job-content, .content',
    companySelector: '.company-name, .employer-logo + h3',
    locationSelector: '.location',
    jobTypeSelector: '.metadata-body, .job-info'
  },
  greenhouseBoards: {
    hostname: 'job-boards.greenhouse.io',
    paths: ['/deliveroo/jobs/', '/'],
    titleSelector: 'h1',
    descriptionSelector: '#content, #job-content, #app section',
    companySelector: 'h1 + p', 
    locationSelector: '.location, h1 ~ p',
    jobTypeSelector: '.metadata-body, .job-info'
  }
};

// Function to check if the current page is a job listing
function isJobListing() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  console.log('Checking if this is a job listing page:', url, hostname);
  
  // DEBUG MODE - force widget to appear for testing
  // Check for debug parameter or test domains
  if (url.includes('pasa-debug=true') || 
      hostname.includes('localhost') || 
      hostname.includes('127.0.0.1')) {
    console.log('DEBUG MODE ENABLED: Forcing widget to appear for testing');
    return 'debug';
  }
  
  // SPECIAL CASE: Always show on job-boards.greenhouse.io
  if (hostname.includes('job-boards.greenhouse.io') || hostname.includes('boards.greenhouse.io')) {
    console.log('🎯 Detected Greenhouse job board - forcing widget to appear');
    // Add a hidden DOM marker so we can verify the condition was triggered
    const marker = document.createElement('div');
    marker.id = 'pasa-greenhouse-detected';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    // Override default behavior to ensure a match
    return 'greenhouseBoards';
  }
  
  // More lenient job detection
  const possibleJobIndicators = ['/job/', '/jobs/', 'careers', 'career', 'position', 'opening', 'posting'];
  let isLikelyJobPage = false;
  
  for (const indicator of possibleJobIndicators) {
    if (url.toLowerCase().includes(indicator)) {
      console.log(`URL contains job indicator: ${indicator}`);
      isLikelyJobPage = true;
      break;
    }
  }
  
  // Check for known job sites
  for (const site in JOB_SITES) {
    const siteInfo = JOB_SITES[site];
    if (hostname.includes(siteInfo.hostname)) {
      console.log(`Hostname match: ${siteInfo.hostname}`);
      
      // Check for specific paths
      for (const path of siteInfo.paths) {
        if (url.includes(path)) {
          console.log(`Path match: ${path}, detected site: ${site}`);
          return site;
        }
      }
      
      // If we're on a matching hostname and the URL has job indicators, let's show the widget
      if (isLikelyJobPage) {
        console.log(`Detected potential job page for ${site} based on URL patterns`);
        return site;
      }
      
      console.log(`Hostname matched ${siteInfo.hostname}, but no path matches found in:`, siteInfo.paths);
    }
  }
  
  // If we're here but the page has strong job indicators, use a generic handler
  if (isLikelyJobPage) {
    console.log('Generic job page detected based on URL patterns');
    return 'generic';
  }
  
  console.log('No job site detected for this page');
  return false;
}

// Load JobExtractor script
function loadJobExtractor() {
  return new Promise((resolve, reject) => {
    if (window.JobExtractor) {
      console.log('JobExtractor already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('jobExtractor.js');
    script.onload = () => {
      if (window.JobExtractor) {
        console.log('JobExtractor loaded successfully');
        resolve();
      } else {
        console.error('JobExtractor not defined after loading');
        reject(new Error('JobExtractor not defined'));
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load JobExtractor:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
}

// Extract job info from the page
async function extractJobInfo() {
  try {
    await loadJobExtractor();
    
    if (!window.JobExtractor) {
      throw new Error('JobExtractor not available');
    }

    const jobInfo = window.JobExtractor.extractJobInfo(document);
    
    // Add metadata
    jobInfo.url = window.location.href;
    jobInfo.timestamp = new Date().toISOString();
    
    console.log('Extracted job info:', jobInfo);
    return jobInfo;
  } catch (error) {
    console.error('Error extracting job info:', error);
    return {
      title: document.title,
      company: '',
      location: '',
      jobType: '',
      salary: '',
      description: '',
      url: window.location.href,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
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

// Function to inject the React widget
function injectReactWidget(jobInfo) {
  console.log('Attempting to inject React widget with job info:', jobInfo);
  
  // Remove any existing widget container first to ensure clean state
  const existingContainer = document.getElementById('pasa-floating-widget-container');
  if (existingContainer) {
    console.log('Removing existing widget container');
    existingContainer.remove();
  }
  
  console.log('Creating new widget container');
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'pasa-floating-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    width: auto;
    height: auto;
  `;
  document.body.appendChild(container);
  
  // Get the URL for widget.html
  const widgetUrl = chrome.runtime.getURL('widget.html');
  console.log('Loading React widget from URL:', widgetUrl);
  
  // Create iframe to load the React widget
  const iframe = document.createElement('iframe');
  iframe.id = 'pasa-widget-iframe';
  iframe.style.cssText = `
    border: none;
    width: 400px;
    height: 500px;
    max-height: 0;
    transition: max-height 0.3s ease-in-out, width 0.3s ease-in-out;
    overflow: hidden;
    background: transparent;
  `;
  iframe.src = widgetUrl;
  container.appendChild(iframe);
  
  // Add a message passing system for iframe communication
  window.addEventListener('message', (event) => {
    // Verify the message is from our iframe
    if (event.data && event.data.source === 'pasa-widget') {
      console.log('Received message from widget iframe:', event.data);
      
      // Handle resize requests from the widget
      if (event.data.type === 'RESIZE') {
        iframe.style.maxHeight = `${event.data.height}px`;
        
        // Adjust width based on state (expanded or collapsed)
        if (event.data.height > 100) {
          iframe.style.width = '400px'; // Expanded state
        } else {
          iframe.style.width = '80px';  // Collapsed state (button only)
        }
      }
      
      // Handle widget actions
      if (event.data.type === 'PASA_WIDGET_ACTION') {
        console.log('Received widget action:', event.data.action);
        
        try {
          switch (event.data.action) {
            case 'AUTO_FILL':
              // Message content-autofill script to fill the form
              chrome.runtime.sendMessage({
                type: 'AUTO_FILL_FORM',
                data: jobInfo
              }, function(response) {
                // Always handle the response to avoid "message channel closed" errors
                if (chrome.runtime.lastError) {
                  console.log('Error sending message:', chrome.runtime.lastError);
                  return;
                }
                console.log('Auto-fill response:', response);
              });
              break;
              
            case 'GENERATE_COVER_LETTER':
              // Handle cover letter generation
              chrome.runtime.sendMessage({
                type: 'GENERATE_COVER_LETTER',
                data: jobInfo
              }, function(response) {
                if (chrome.runtime.lastError) {
                  console.log('Error sending message:', chrome.runtime.lastError);
                  return;
                }
                console.log('Cover letter response:', response);
              });
              break;
              
            case 'SAVE_JOB':
              // Save job to storage
              chrome.runtime.sendMessage({
                type: 'SAVE_JOB',
                data: jobInfo
              }, function(response) {
                if (chrome.runtime.lastError) {
                  console.log('Error sending message:', chrome.runtime.lastError);
                  return;
                }
                console.log('Save job response:', response);
              });
              break;
          }
        } catch (error) {
          console.error('Error handling widget action:', error);
        }
      }
    }
  });
  
  // Wait for iframe to load, then send job info
  iframe.onload = function() {
    console.log('Widget iframe loaded, sending job info');
    iframe.contentWindow.postMessage({
      source: 'pasa-content-script',
      type: 'JOB_INFO',
      data: jobInfo
    }, '*');
    
    // Set initial height after a short delay to allow widget to render
    setTimeout(() => {
      iframe.style.maxHeight = '500px';
    }, 100);
  };
  
  return iframe;
}

// Main execution
async function init() {
  console.log('Initializing Pasa content script');
  // Check if the current page is a job listing
  const site = isJobListing();
  if (site) {
    console.log(`Detected ${site} job listing`);
    
    // Give the page time to fully load
    console.log('Waiting for page to fully load before extracting job info...');
    setTimeout(async () => {
      console.log('Extracting job info for site:', site);
      try {
        const jobInfo = await extractJobInfo();
        console.log('Extracted job info:', jobInfo);
        
        // Notify the background script
        console.log('Notifying background script about job detection');
        notifyJobDetected(jobInfo);
        
        // Inject the React widget with job info for all sites
        console.log('Injecting React widget');
        injectReactWidget(jobInfo);
      } catch (error) {
        console.error('Error processing job info:', error);
        
        // If there was an error extracting job info, create a simple widget with mock data
        console.log('Creating fallback widget with mock data due to error');
        const mockJobInfo = {
          title: document.title || 'Job Listing',
          company: 'Company',
          location: 'Location',
          description: 'Could not extract job description',
          url: window.location.href,
          detectedOn: site,
          timestamp: new Date().toISOString()
        };
        createSimpleWidget(mockJobInfo);
      }
    }, 1500);
  } else {
    console.log('Not a job listing page, not injecting widget');
  }
}

// Add manual trigger function to window for debugging
window.triggerPasaWidget = function(forceSimple = false) {
  console.log('Manual widget trigger called, forceSimple:', forceSimple);
  
  // Create mock job data from the current page
  const mockJobInfo = {
    title: document.querySelector('h1')?.textContent || document.title || 'Job Position',
    company: document.querySelector('h1 + p')?.textContent || 'Company',
    location: document.querySelector('.location')?.textContent || 'Location',
    description: document.querySelector('#content, #job-content')?.textContent || 'Job Description',
    url: window.location.href,
    detectedOn: 'manual',
    timestamp: new Date().toISOString()
  };
  
  console.log('Created mock job info for manual trigger:', mockJobInfo);
  
  // Notify background script
  notifyJobDetected(mockJobInfo);
  
  // Create widget
  if (forceSimple) {
    createSimpleWidget(mockJobInfo);
  } else {
    injectReactWidget(mockJobInfo);
  }
  
  return 'Pasa widget manually triggered. Check bottom-right corner of page.';
};

// Add a function to toggle between simple and react widgets
window.toggleWidgetType = function() {
  console.log('Toggling widget type');
  
  // Remove any existing widget containers first
  const existingContainer = document.getElementById('pasa-floating-widget-container');
  if (existingContainer) {
    console.log('Removing existing widget container');
    existingContainer.remove();
  }
  
  // Get job info from the page again (for demo purposes, we don't save previous state)
  const mockJobInfo = {
    title: document.querySelector('h1')?.textContent || document.title || 'Job Position',
    company: document.querySelector('h1 + p')?.textContent || 'Company',
    location: document.querySelector('.location')?.textContent || 'Location',
    description: document.querySelector('#content, #job-content')?.textContent || 'Job Description',
    url: window.location.href,
    detectedOn: 'manual',
    timestamp: new Date().toISOString()
  };
  
  // Get the current widget type preference from localStorage or default to simple
  const currentType = localStorage.getItem('pasaWidgetType') || 'simple';
  const newType = currentType === 'simple' ? 'react' : 'simple';
  
  // Save the new preference
  localStorage.setItem('pasaWidgetType', newType);
  
  console.log(`Switching widget type from ${currentType} to ${newType}`);
  
  // Create the appropriate widget type
  if (newType === 'simple') {
    createSimpleWidget(mockJobInfo);
    return 'Switched to simple widget. Check bottom-right corner.';
  } else {
    injectReactWidget(mockJobInfo);
    return 'Switched to React widget. Check bottom-right corner.';
  }
};

// Add debug controls to switch between widget types
window.showPasaDebugControls = function() {
  // Create a debug control panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'pasa-debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: #2d3748;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999999;
    font-family: Arial, sans-serif;
    font-size: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
  debugPanel.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold;">Pasa Debug Controls</div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button id="pasa-debug-simple" style="padding: 4px 8px; background: #4F46E5; border: none; color: white; border-radius: 3px; cursor: pointer;">Simple Widget</button>
      <button id="pasa-debug-react" style="padding: 4px 8px; background: #4F46E5; border: none; color: white; border-radius: 3px; cursor: pointer;">React Widget</button>
      <button id="pasa-debug-hide" style="padding: 4px 8px; background: #EF4444; border: none; color: white; border-radius: 3px; cursor: pointer;">Hide Debug</button>
    </div>
  `;
  
  document.body.appendChild(debugPanel);
  
  // Add event listeners to buttons
  document.getElementById('pasa-debug-simple').addEventListener('click', () => {
    window.triggerPasaWidget(true);
  });
  
  document.getElementById('pasa-debug-react').addEventListener('click', () => {
    window.triggerPasaWidget(false);
  });
  
  document.getElementById('pasa-debug-hide').addEventListener('click', () => {
    debugPanel.remove();
  });
  
  return 'Debug controls added to top-left corner.';
};

// Add pasaWidget to window type for TypeScript
if (typeof window !== 'undefined') {
  window.pasaWidget = window.pasaWidget || {};
}

// Initialize
init();

// Show manual trigger instructions in the console for easy access
console.log(
  '%c 📢 Pasa Debug: If widget doesn\'t appear, run window.triggerPasaWidget() in console',
  'background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
);
console.log(
  '%c 📢 Pasa Debug: For simple widget, run window.triggerPasaWidget(true)',
  'background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
);
console.log(
  '%c 📢 Pasa Debug: To show visual debug controls, run window.showPasaDebugControls()',
  'background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
);

// Listen for URL changes (for single-page applications)
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href;
    console.log('URL changed, reinitializing Pasa');
    init();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for messages from the widget
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_JOB_INFO') {
    extractJobInfo().then(sendResponse);
    return true; // Keep the message channel open for async response
  }
}); 