// Content script for handling application form auto-filling
console.log('Pasa auto-fill content script initialized');

// Common field selectors by job site
const FORM_FIELD_SELECTORS = {
  linkedin: {
    firstName: 'input[name*="first"][name*="name"], input[id*="first"][id*="name"], input[placeholder*="First"]',
    lastName: 'input[name*="last"][name*="name"], input[id*="last"][id*="name"], input[placeholder*="Last"]',
    email: 'input[name*="email"], input[id*="email"], input[type="email"]',
    phone: 'input[name*="phone"], input[id*="phone"], input[type="tel"]',
    resume: 'input[name*="resume"], input[id*="resume"], input[type="file"][accept*="pdf"]',
    coverLetter: 'input[name*="cover"], input[id*="cover"], textarea[name*="cover"], textarea[id*="cover"]',
    linkedIn: 'input[name*="linkedin"], input[id*="linkedin"], input[placeholder*="LinkedIn"]',
    github: 'input[name*="github"], input[id*="github"], input[placeholder*="GitHub"]',
    website: 'input[name*="website"], input[id*="website"], input[placeholder*="Website"], input[name*="portfolio"], input[id*="portfolio"]',
    yearsOfExperience: 'input[name*="experience"], input[id*="experience"], select[name*="experience"], select[id*="experience"]',
    education: 'input[name*="education"], input[id*="education"], select[name*="education"], select[id*="education"]',
    address: 'input[name*="address"], input[id*="address"]',
    city: 'input[name*="city"], input[id*="city"]',
    state: 'input[name*="state"], input[id*="state"], select[name*="state"], select[id*="state"]',
    zip: 'input[name*="zip"], input[id*="zip"], input[name*="postal"], input[id*="postal"]',
    country: 'input[name*="country"], input[id*="country"], select[name*="country"], select[id*="country"]'
  },
  indeed: {
    firstName: 'input[name*="first"][name*="name"], input[id*="first"][id*="name"]',
    lastName: 'input[name*="last"][name*="name"], input[id*="last"][id*="name"]',
    email: 'input[name*="email"], input[id*="email"], input[type="email"]',
    phone: 'input[name*="phone"], input[id*="phone"], input[type="tel"]',
    resume: 'input[name*="resume"], input[id*="resume"], input[type="file"][accept*="pdf"]',
    coverLetter: 'input[name*="cover"], input[id*="cover"], textarea[name*="cover"], textarea[id*="cover"]'
  },
  greenhouse: {
    firstName: '#first_name',
    lastName: '#last_name',
    email: '#email',
    phone: '#phone',
    resume: '#resume',
    coverLetter: '#cover_letter',
    linkedIn: '#job_application_answers_attributes_0_text_value',
    website: '#job_application_answers_attributes_1_text_value'
  },
  lever: {
    firstName: 'input[name="name"]',
    lastName: '', // Lever often has a single "Full Name" field
    email: 'input[name="email"]',
    phone: 'input[name="phone"]',
    resume: 'input[name="resume"]',
    coverLetter: 'textarea[name="coverLetter"]',
    linkedIn: 'input[name="urls[LinkedIn]"]',
    website: 'input[name="urls[Portfolio]"]'
  },
  workday: {
    firstName: 'input[aria-label*="First Name"], input[id*="first"][id*="name"]',
    lastName: 'input[aria-label*="Last Name"], input[id*="last"][id*="name"]',
    email: 'input[aria-label*="Email"]',
    phone: 'input[aria-label*="Phone"]',
    resume: 'input[type="file"][accept*="pdf"]',
    address: 'input[aria-label*="Address"]'
  }
};

// User profile data from storage
let userProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  resumeUrl: '',
  linkedIn: '',
  github: '',
  website: '',
  yearsOfExperience: '',
  education: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  coverLetter: ''
};

// Load user profile from storage
function loadUserProfile() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userProfile'], (result) => {
      if (result.userProfile) {
        userProfile = result.userProfile;
      }
      resolve(userProfile);
    });
  });
}

// Determine which job site/ATS we're on
function detectJobSite() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  if (hostname.includes('linkedin.com')) return 'linkedin';
  if (hostname.includes('indeed.com')) return 'indeed';
  if (hostname.includes('greenhouse.io')) return 'greenhouse';
  if (hostname.includes('lever.co')) return 'lever';
  if (hostname.includes('workday.com')) return 'workday';
  
  // Generic detection for common ATS systems
  if (document.querySelector('div[data-qa="Greenhouse"]')) return 'greenhouse';
  if (document.querySelector('div[data-qa="Lever"]')) return 'lever';
  
  return 'generic';
}

// Fill a text input field
function fillTextField(selector, value) {
  const field = document.querySelector(selector);
  if (!field) return false;
  
  // Focus field
  field.focus();
  
  // Set value
  field.value = value;
  
  // Dispatch input event for React forms
  field.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Dispatch change event for standard forms
  field.dispatchEvent(new Event('change', { bubbles: true }));
  
  return true;
}

// Auto-fill the form
async function autoFillForm(jobInfo) {
  // Load user profile
  await loadUserProfile();
  
  // Detect job site
  const jobSite = detectJobSite();
  console.log(`Detected job site: ${jobSite}`);
  
  // Get appropriate selectors
  const selectors = FORM_FIELD_SELECTORS[jobSite] || FORM_FIELD_SELECTORS.generic;
  
  // Set up a counter to track successful fills
  let filledFields = 0;
  
  // Fill personal info
  if (fillTextField(selectors.firstName, userProfile.firstName)) filledFields++;
  if (fillTextField(selectors.lastName, userProfile.lastName)) filledFields++;
  if (fillTextField(selectors.email, userProfile.email)) filledFields++;
  if (fillTextField(selectors.phone, userProfile.phone)) filledFields++;
  
  // Fill professional info
  if (fillTextField(selectors.linkedIn, userProfile.linkedIn)) filledFields++;
  if (fillTextField(selectors.github, userProfile.github)) filledFields++;
  if (fillTextField(selectors.website, userProfile.website)) filledFields++;
  
  // Fill address info
  if (fillTextField(selectors.address, userProfile.address)) filledFields++;
  if (fillTextField(selectors.city, userProfile.city)) filledFields++;
  if (fillTextField(selectors.state, userProfile.state)) filledFields++;
  if (fillTextField(selectors.zip, userProfile.zip)) filledFields++;
  if (fillTextField(selectors.country, userProfile.country)) filledFields++;
  
  // Fill cover letter if available
  if (userProfile.coverLetter && fillTextField(selectors.coverLetter, userProfile.coverLetter)) filledFields++;
  
  // Show success or failure message
  if (filledFields > 0) {
    // Create a temporary success message
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4F46E5;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;
    successMessage.innerText = `✅ Auto-filled ${filledFields} fields`;
    document.body.appendChild(successMessage);
    
    // Remove after 3 seconds
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 500);
    }, 3000);
    
    return { success: true, filledFields };
  } else {
    return { success: false, message: "Couldn't find any form fields to fill" };
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content-autofill:', message);
  
  if (message.type === 'AUTO_FILL_FORM') {
    autoFillForm(message.data)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        console.error('Error auto-filling form:', error);
        sendResponse({ success: false, message: error.message });
      });
      
    return true; // Indicates async response
  }
}); 