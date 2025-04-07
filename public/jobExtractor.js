// Browser-compatible version of JobExtractor
class JobExtractor {
  static extractTitle(document) {
    console.log('🔍 DEBUG: Looking for title');
    
    // Try common title selectors
    const selectors = [
      'h1[class*="title"]',
      'h1[class*="job"]',
      'h1[class*="header"]',
      'h1',
      '[data-test="job-title"]',
      '[data-testid="job-title"]',
      '[class*="job-title"]',
      '[class*="jobTitle"]',
      '.job-title',
      '.position-title',
      '#job-title',
      '[itemprop="title"]',
      // Add more specific selectors for different job boards
      '.job-details-jobs-unified-top-card__job-title',
      '.top-card-layout__title',
      '.jobsearch-JobInfoHeader-title',
      '.jcs-JobTitle',
      '.job-title',
      '.css-1sqqqs3'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        console.log('Found title using selector:', selector);
        return element.textContent.trim();
      }
    }

    // Fallback to document title if no specific element found
    const docTitle = document.title;
    if (docTitle && !docTitle.includes('404') && !docTitle.includes('Error')) {
      console.log('Using document title as fallback');
      return docTitle;
    }

    return '';
  }

  static extractCompany(document) {
    console.log('🔍 DEBUG: Looking for company');
    
    const selectors = [
      '[data-test="company-name"]',
      '[data-testid="company-name"]',
      '[class*="company-name"]',
      '[class*="companyName"]',
      'a[class*="company"]',
      'span[class*="company"]',
      '.company-name',
      '.employer-name',
      '[itemprop="hiringOrganization"]',
      '[itemprop="name"]',
      // Add more specific selectors for different job boards
      '.job-details-jobs-unified-top-card__company-name',
      '.topcard__org-name-link',
      '.jobsearch-InlineCompanyRating-companyName',
      '.jobsearch-JobInfoHeader-companyName',
      '.employer-name',
      '.css-87uc0g'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        console.log('Found company using selector:', selector);
        return element.textContent.trim();
      }
    }

    return '';
  }

  static extractLocation(document) {
    console.log('🔍 DEBUG: Looking for location');
    
    const selectors = [
      '[data-test="location"]',
      '[data-testid="location"]',
      '[class*="location"]',
      '[class*="job-location"]',
      'span[class*="location"]',
      '.location',
      '.job-location',
      '[itemprop="jobLocation"]',
      '[itemprop="address"]',
      // Add more specific selectors for different job boards
      '.job-details-jobs-unified-top-card__bullet',
      '.topcard__flavor--bullet',
      '.jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-iconLabel',
      '.location',
      '.css-3g3psg'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        console.log('Found location using selector:', selector);
        return element.textContent.trim();
      }
    }

    return '';
  }

  static extractJobType(text) {
    console.log('🔍 DEBUG: Looking for job type');
    
    // Look for common job type indicators
    const jobTypes = [
      'full-time',
      'full time',
      'part-time',
      'part time',
      'contract',
      'temporary',
      'permanent',
      'internship',
      'freelance',
      'remote',
      'hybrid',
      'on-site',
      'onsite',
      'flexible',
      'flexible hours'
    ];

    // First try direct matches
    for (const type of jobTypes) {
      if (text.toLowerCase().includes(type)) {
        console.log('Found job type through direct match:', type);
        return type;
      }
    }

    return '';
  }

  static extractSalary(text) {
    console.log('🔍 DEBUG: Looking for salary');
    
    // Look for currency patterns
    const currencyPatterns = [
      /\$[\d,]+(?:\.\d{2})?(?:\s*(?:-|to)\s*\$[\d,]+(?:\.\d{2})?)?/g,
      /£[\d,]+(?:\.\d{2})?(?:\s*(?:-|to)\s*£[\d,]+(?:\.\d{2})?)?/g,
      /€[\d,]+(?:\.\d{2})?(?:\s*(?:-|to)\s*€[\d,]+(?:\.\d{2})?)?/g,
      /[\d,]+(?:\.\d{2})?\s*(?:USD|GBP|EUR)(?:\s*(?:-|to)\s*[\d,]+(?:\.\d{2})?\s*(?:USD|GBP|EUR))?/g,
      /[\d,]+(?:\.\d{2})?\s*k(?:\s*(?:-|to)\s*[\d,]+(?:\.\d{2})?\s*k)?/g
    ];

    for (const pattern of currencyPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        console.log('Found salary through pattern match:', matches[0]);
        return matches[0];
      }
    }

    // Look for salary-related terms
    const salaryTerms = [
      'salary',
      'compensation',
      'pay',
      'wage',
      'remuneration',
      'rate',
      'earnings',
      'package',
      'benefits'
    ];

    for (const term of salaryTerms) {
      if (text.toLowerCase().includes(term)) {
        const context = text.substring(text.toLowerCase().indexOf(term));
        for (const pattern of currencyPatterns) {
          const salaryMatch = context.match(pattern);
          if (salaryMatch) {
            console.log('Found salary through context:', salaryMatch[0]);
            return salaryMatch[0];
          }
        }
      }
    }

    return '';
  }

  static extractDescription(document) {
    console.log('🔍 DEBUG: Looking for description');
    
    const selectors = [
      '[data-test="job-description"]',
      '[data-testid="job-description"]',
      '[class*="job-description"]',
      '[class*="description"]',
      'div[class*="description"]',
      'section[class*="description"]',
      '.job-description',
      '#job-description',
      '[itemprop="description"]',
      'article',
      'main',
      // Add more specific selectors for different job boards
      '.jobs-description__content',
      '.description__text',
      '#jobDescriptionText',
      '.jobDescriptionContent',
      '.desc',
      '.css-1k5huso',
      '.jobDescriptionSection'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        console.log('Found description using selector:', selector);
        return element.textContent.trim();
      }
    }

    return '';
  }

  static extractJobInfo(document) {
    console.log('Starting job info extraction');
    
    const title = this.extractTitle(document);
    const company = this.extractCompany(document);
    const location = this.extractLocation(document);
    const description = this.extractDescription(document);
    
    // Extract job type and salary from the description
    const jobType = this.extractJobType(description);
    const salary = this.extractSalary(description);

    const jobInfo = {
      title,
      company,
      location,
      jobType,
      salary,
      description
    };

    console.log('Extracted job info:', jobInfo);
    return jobInfo;
  }
}

// Make JobExtractor available globally
window.JobExtractor = JobExtractor; 