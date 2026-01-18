// Content script that runs on job posting pages
(function() {
  'use strict';

  let button = null;
  let isProcessing = false;

  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Check if we're on a potential job posting page
    if (isJobPostingPage()) {
      createSaveButton();
    }
  }

  function isJobPostingPage() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();

    // Check URL patterns
    const jobUrlPatterns = [
      'jobs', 'careers', 'positions', 'opportunities',
      'job-posting', 'apply', 'application', 'vacancy',
      'linkedin.com/jobs', 'indeed.com', 'glassdoor.com',
      'lever.co', 'greenhouse.io', 'workday.com'
    ];

    const hasJobUrl = jobUrlPatterns.some(pattern => url.includes(pattern));

    // Check for job-related keywords in the page
    const jobKeywords = [
      'apply now', 'submit application', 'job description',
      'requirements', 'qualifications', 'responsibilities',
      'application submitted', 'thank you for applying'
    ];

    const hasJobKeywords = jobKeywords.some(keyword => 
      bodyText.includes(keyword) || title.includes(keyword)
    );

    return hasJobUrl || hasJobKeywords;
  }

  function createSaveButton() {
    if (button) return; // Button already exists

    // Create the floating button
    button = document.createElement('div');
    button.id = 'job-tracker-save-btn';
    button.innerHTML = `
      <div class="job-tracker-btn-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Save to Job Tracker</span>
      </div>
    `;

    button.addEventListener('click', handleSaveClick);
    document.body.appendChild(button);

    // Make button draggable
    makeDraggable(button);
  }

  function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      if (e.target === element || element.contains(e.target)) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, element);
      }
    }

    function dragEnd() {
      isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
  }

  async function handleSaveClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;
    isProcessing = true;

    // Show loading state
    const originalContent = button.innerHTML;
    button.innerHTML = `
      <div class="job-tracker-btn-content">
        <div class="job-tracker-spinner"></div>
        <span>Extracting...</span>
      </div>
    `;
    button.classList.add('job-tracker-loading');

    try {
      // Extract job data from the page
      const jobData = extractJobData();

      // Send to background script
      chrome.runtime.sendMessage({
        action: 'saveJobApplication',
        data: jobData
      }, (response) => {
        isProcessing = false;

        if (response && response.success) {
          // Show success state
          button.innerHTML = `
            <div class="job-tracker-btn-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Saved!</span>
            </div>
          `;
          button.classList.remove('job-tracker-loading');
          button.classList.add('job-tracker-success');

          // Reset after 2 seconds
          setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('job-tracker-success');
          }, 2000);
        } else {
          // Show error state
          showError(response?.error || 'Failed to save. Please try again.');
          button.innerHTML = originalContent;
          button.classList.remove('job-tracker-loading');
        }
      });
    } catch (error) {
      isProcessing = false;
      console.error('Error extracting job data:', error);
      showError('Failed to extract job data. Please try again.');
      button.innerHTML = originalContent;
      button.classList.remove('job-tracker-loading');
    }
  }

  function extractJobData() {
    const url = window.location.href;
    const data = {
      job_url: url,
      company: '',
      position: '',
      location: '',
      salary: '',
      notes: '',
      source_url: url,
      extracted_at: new Date().toISOString()
    };

    // Try multiple extraction strategies based on the site
    if (url.includes('linkedin.com')) {
      extractLinkedInData(data);
    } else if (url.includes('indeed.com')) {
      extractIndeedData(data);
    } else if (url.includes('glassdoor.com')) {
      extractGlassdoorData(data);
    } else if (url.includes('lever.co')) {
      extractLeverData(data);
    } else if (url.includes('greenhouse.io')) {
      extractGreenhouseData(data);
    } else {
      extractGenericData(data);
    }

    // Debug logging
    console.log('Job Tracker Extension - Extracted Data:', data);

    // Fallback: if still no company or position, try aggressive extraction
    if (!data.company && !data.position) {
      console.log('Job Tracker: No data found, trying aggressive extraction...');
      extractAggressively(data);
    }

    // Final fallback: use page title
    if (!data.position && !data.company) {
      const title = document.title;
      if (title) {
        // Try to split title by common separators
        const parts = title.split(/[-–|•]/);
        if (parts.length >= 2) {
          data.position = parts[0].trim();
          data.company = parts[1].trim();
        } else {
          data.position = title;
        }
      }
    }

    // Absolute last resort: prompt user
    if (!data.position && !data.company) {
      const userInput = prompt('Could not auto-detect job details.\nPlease enter either:\n- Job Title OR\n- Company Name\n\n(You can edit all details later in the dashboard)');
      if (userInput && userInput.trim()) {
        // Try to guess if it's a company or position
        if (userInput.toLowerCase().includes('engineer') || 
            userInput.toLowerCase().includes('developer') || 
            userInput.toLowerCase().includes('manager') ||
            userInput.toLowerCase().includes('designer') ||
            userInput.toLowerCase().includes('analyst')) {
          data.position = userInput.trim();
        } else {
          data.company = userInput.trim();
        }
      } else {
        // If user cancels, use URL as identifier
        data.position = 'Job from ' + new URL(url).hostname;
      }
    }

    // Add extraction quality note
    if (data.company || data.position) {
      data.notes = 'Auto-extracted from page. Please verify details.';
    } else {
      data.notes = 'Could not auto-extract. Please add details manually.';
    }

    console.log('Job Tracker Extension - Final Data:', data);
    return data;
  }

  function extractLinkedInData(data) {
    // LinkedIn specific selectors (updated for 2024)
    const companySelectors = [
      '.job-details-jobs-unified-top-card__company-name a',
      '.job-details-jobs-unified-top-card__company-name',
      '.topcard__org-name-link',
      '.jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__company-name',
      '.jobs-company__name',
      '.job-details-jobs-unified-top-card__primary-description a',
      'a.app-aware-link[href*="/company/"]'
    ];

    const positionSelectors = [
      '.job-details-jobs-unified-top-card__job-title h1',
      '.job-details-jobs-unified-top-card__job-title',
      '.topcard__title',
      '.jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title',
      'h1.t-24'
    ];

    const locationSelectors = [
      '.job-details-jobs-unified-top-card__bullet',
      '.job-details-jobs-unified-top-card__primary-description-container span.tvm__text',
      '.topcard__flavor--bullet',
      '.jobs-unified-top-card__bullet',
      '.jobs-unified-top-card__workplace-type'
    ];

    const salarySelectors = [
      '.job-details-jobs-unified-top-card__job-insight span',
      '.salary',
      '.compensation__salary',
      '[class*="salary"]',
      '[class*="compensation"]'
    ];

    // Extract company
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText) {
        data.company = element.innerText.trim();
        break;
      }
    }

    // Extract position
    for (const selector of positionSelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText) {
        data.position = element.innerText.trim();
        break;
      }
    }

    // Extract location
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText) {
        const text = element.innerText.trim();
        // LinkedIn shows location with bullet points, clean it up
        if (text && !text.includes('Reposted') && !text.includes('hour') && !text.includes('day')) {
          data.location = text.replace(/·/g, '').trim();
          break;
        }
      }
    }

    // Extract salary
    for (const selector of salarySelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText) {
        const text = element.innerText.trim();
        if (text.match(/\$|€|£|USD|EUR|salary|compensation/i)) {
          data.salary = text;
          break;
        }
      }
    }

    console.log('LinkedIn extraction result:', data);
  }

  function extractIndeedData(data) {
    // Indeed specific selectors
    const companyElement = document.querySelector('[data-testid="inlineHeader-companyName"], .jobsearch-CompanyInfoContainer a');
    const positionElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title');
    const locationElement = document.querySelector('[data-testid="inlineHeader-companyLocation"], .jobsearch-JobInfoHeader-subtitle div');
    const salaryElement = document.querySelector('[data-testid="inlineHeader-salary"], #salaryInfoAndJobType');

    data.company = companyElement?.innerText.trim() || '';
    data.position = positionElement?.innerText.trim() || '';
    data.location = locationElement?.innerText.trim() || '';
    data.salary = salaryElement?.innerText.trim() || '';
  }

  function extractGlassdoorData(data) {
    // Glassdoor specific selectors
    const companyElement = document.querySelector('[data-test="employer-name"], .employerName');
    const positionElement = document.querySelector('[data-test="job-title"], .jobTitle');
    const locationElement = document.querySelector('[data-test="location"], .location');
    const salaryElement = document.querySelector('[data-test="salary"], .salary');

    data.company = companyElement?.innerText.trim() || '';
    data.position = positionElement?.innerText.trim() || '';
    data.location = locationElement?.innerText.trim() || '';
    data.salary = salaryElement?.innerText.trim() || '';
  }

  function extractLeverData(data) {
    // Lever specific selectors
    const companyElement = document.querySelector('.main-header-text-company-name, .company-name');
    const positionElement = document.querySelector('.posting-headline h2, .posting-headline');
    const locationElement = document.querySelector('.location, .posting-categories .location');
    const salaryElement = document.querySelector('.salary, .compensation');

    data.company = companyElement?.innerText.trim() || '';
    data.position = positionElement?.innerText.trim() || '';
    data.location = locationElement?.innerText.trim() || '';
    data.salary = salaryElement?.innerText.trim() || '';
  }

  function extractGreenhouseData(data) {
    // Greenhouse specific selectors
    const companyElement = document.querySelector('#header .company-name, .company-name');
    const positionElement = document.querySelector('.app-title, h1.app-title');
    const locationElement = document.querySelector('.location, .app-location');
    const salaryElement = document.querySelector('.salary, .compensation');

    data.company = companyElement?.innerText.trim() || '';
    data.position = positionElement?.innerText.trim() || '';
    data.location = locationElement?.innerText.trim() || '';
    data.salary = salaryElement?.innerText.trim() || '';
  }

  function extractGenericData(data) {
    // Generic extraction for unknown sites
    const pageTitle = document.title;
    const metaTags = {
      company: document.querySelector('meta[property="og:site_name"]')?.content ||
                document.querySelector('meta[name="company"]')?.content,
      position: document.querySelector('meta[property="og:title"]')?.content ||
                document.querySelector('meta[name="title"]')?.content ||
                document.querySelector('meta[name="description"]')?.content
    };

    // Try to find company name with more selectors
    const companySelectors = [
      '.company-name', '.company', '.employer', '.employer-name',
      '[class*="company"]', '[class*="employer"]',
      '[data-test*="company"]', '[data-testid*="company"]',
      'a[href*="company"]', 'a[href*="employer"]'
    ];
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText && element.innerText.length < 100 && element.innerText.length > 2) {
        const text = element.innerText.trim();
        if (text && !text.includes('\n') && text.length < 100) {
          data.company = text;
          break;
        }
      }
    }

    // Try to find position/job title with more selectors
    const positionSelectors = [
      'h1', '.job-title', '.position', '.title', '.job-name',
      '[class*="job-title"]', '[class*="position"]', '[class*="job-name"]',
      '[data-test*="job-title"]', '[data-testid*="job-title"]'
    ];
    for (const selector of positionSelectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText && element.innerText.length < 200 && element.innerText !== data.company) {
        const text = element.innerText.trim();
        if (text && text.length > 3 && text.length < 200) {
          data.position = text;
          break;
        }
      }
    }

    // Try to find location with more selectors
    const locationSelectors = [
      '.location', '.job-location', '[class*="location"]',
      '[data-test*="location"]', '[data-testid*="location"]'
    ];
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.location = element.innerText.trim();
        break;
      }
    }

    // Try to find salary
    const salarySelectors = [
      '.salary', '.compensation', '.pay', '[class*="salary"]', '[class*="compensation"]'
    ];
    for (const selector of salarySelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.innerText.trim();
        if (text.match(/\$|€|£|USD|EUR/)) {
          data.salary = text;
          break;
        }
      }
    }

    // Fallback to meta tags
    if (!data.company && metaTags.company) {
      data.company = metaTags.company;
    }
    if (!data.position && metaTags.position) {
      data.position = metaTags.position;
    }
  }

  function extractAggressively(data) {
    // Last resort: search for any heading that might be a job title
    const headings = document.querySelectorAll('h1, h2, h3');
    for (const heading of headings) {
      const text = heading.innerText.trim();
      if (text && text.length > 5 && text.length < 150) {
        if (!data.position) {
          data.position = text;
        } else if (!data.company && text !== data.position) {
          data.company = text;
          break;
        }
      }
    }

    // Try to find text that looks like a company or position
    const allText = document.body.innerText;
    
    // Look for common job title patterns
    const jobPatterns = [
      /(?:^|\n)([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Coordinator)/i,
      /(?:Position|Role|Job):\s*([^\n]{5,100})/i,
      /(?:Title):\s*([^\n]{5,100})/i
    ];
    
    for (const pattern of jobPatterns) {
      const match = allText.match(pattern);
      if (match && match[1] && !data.position) {
        data.position = match[1].trim();
        break;
      }
    }

    // Look for company patterns
    const companyPatterns = [
      /(?:Company|Employer|Organization):\s*([^\n]{2,50})/i,
      /(?:at|@)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s*(?:\n|$)/
    ];
    
    for (const pattern of companyPatterns) {
      const match = allText.match(pattern);
      if (match && match[1] && !data.company) {
        data.company = match[1].trim();
        break;
      }
    }
  }

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'job-tracker-error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
})();
