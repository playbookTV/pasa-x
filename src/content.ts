// Content script for Pasa Chrome Extension
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingWidget } from './components/FloatingWidget';
import './styles/globals.css';

console.log('Pasa content script initialized');

// Function to detect if current page is a job application page
const isJobApplicationPage = (): boolean => {
  const url = window.location.href.toLowerCase();
  const keywords = ['job', 'career', 'apply', 'application', 'linkedin.com/jobs', 'indeed.com', 'wellfound.com'];
  
  // Check URL for job-related keywords
  if (keywords.some(keyword => url.includes(keyword))) {
    return true;
  }
  
  // Check for form elements that might indicate a job application
  const forms = document.querySelectorAll('form');
  for (const form of forms) {
    const formText = form.innerText.toLowerCase();
    if (formText.includes('apply') || formText.includes('job') || formText.includes('resume')) {
      return true;
    }
  }
  
  return false;
};

// Create container for the widget
const createWidgetContainer = (): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = 'pasa-widget-container';
  document.body.appendChild(container);
  return container;
};

// Main initialization
const init = () => {
  // Only inject the widget if we detect a job page
  if (isJobApplicationPage()) {
    console.log('Job application page detected');
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'JOB_DETECTED',
      data: {
        url: window.location.href,
        title: document.title
      }
    });
    
    // Create widget container and render the floating widget
    const container = createWidgetContainer();
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(FloatingWidget));
  }
};

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 