import nlp from 'compromise';

interface JobInfo {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
}

export class JobExtractor {
  private static extractTitle(document: Document): string {
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
      '[itemprop="title"]'
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

  private static extractCompany(document: Document): string {
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
      '[itemprop="name"]'
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

  private static extractLocation(document: Document): string {
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
      '[itemprop="address"]'
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

  private static extractJobType(text: string): string {
    console.log('🔍 DEBUG: Looking for job type');
    
    const doc = nlp(text);
    
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
      'on-site'
    ];

    // First try direct matches
    for (const type of jobTypes) {
      if (text.toLowerCase().includes(type)) {
        console.log('Found job type through direct match:', type);
        return type;
      }
    }

    // Then try NLP patterns
    const matches = doc.match('#Adjective #Noun').out('array');
    for (const match of matches) {
      const lowerMatch = match.toLowerCase();
      if (jobTypes.includes(lowerMatch)) {
        console.log('Found job type through NLP:', match);
        return match;
      }
    }

    return '';
  }

  private static extractSalary(text: string): string {
    console.log('🔍 DEBUG: Looking for salary');
    
    const doc = nlp(text);
    
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
      'earnings'
    ];

    for (const term of salaryTerms) {
      const matches = doc.match(`#Noun that contains '${term}'`).out('array');
      if (matches.length > 0) {
        const context = doc.match(`#Noun that contains '${term}'`).expand('right').out('text');
        const salaryMatch = context.match(currencyPatterns[0]);
        if (salaryMatch) {
          console.log('Found salary through context:', salaryMatch[0]);
          return salaryMatch[0];
        }
      }
    }

    return '';
  }

  private static extractDescription(document: Document): string {
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
      'main'
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

  public static extractJobInfo(document: Document): JobInfo {
    console.log('Starting job info extraction');
    
    const title = this.extractTitle(document);
    const company = this.extractCompany(document);
    const location = this.extractLocation(document);
    const description = this.extractDescription(document);
    
    // Use NLP to extract job type and salary from the description
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