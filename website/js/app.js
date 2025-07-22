// App.js - Progressive Enhancement JavaScript for the Marketing Microsite

// Utility functions
const utils = {
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // Simple email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Animation helper
  animateElement: (element, className, duration = 1000) => {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }
};

// Analytics and tracking
const analytics = {
  // Track events (integrates with Application Insights)
  trackEvent: (eventName, properties = {}) => {
    // Use the global trackEvent function from Application Insights
    if (typeof window.trackEvent === 'function') {
      window.trackEvent(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    } else if (window.appInsights && window.appInsights.trackEvent) {
      // Direct Application Insights call
      window.appInsights.trackEvent({
        name: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      });
    }
    
    // Fallback console logging for development
    console.log('Analytics Event:', eventName, properties);
  },

  // Track page interactions
  trackInteraction: (element, action) => {
    analytics.trackEvent('user_interaction', {
      element: element.tagName.toLowerCase(),
      elementId: element.id,
      elementClass: element.className,
      action: action
    });
  },

  // Track form submissions
  trackFormSubmission: (formName, success = true, errorMessage = '') => {
    analytics.trackEvent('form_submission', {
      formName: formName,
      success: success,
      errorMessage: errorMessage
    });
  }
};

// Form handling
const formHandler = {
  // Validate individual field
  validateField: (field, showError = true) => {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';

    // Reset previous error state
    field.classList.remove('error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }

    // Validation rules
    switch (fieldName) {
      case 'company':
        if (!value) {
          isValid = false;
          errorMessage = 'Company name is required';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'Company name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value) {
          isValid = false;
          errorMessage = 'Email address is required';
        } else if (!utils.isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        // Phone is optional, but if provided, should be valid
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;

      case 'privacy':
        if (!field.checked) {
          isValid = false;
          errorMessage = 'You must agree to the privacy policy';
        }
        break;
    }

    // Show error if validation failed and showError is true
    if (!isValid && showError && errorElement) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }

    return { isValid, errorMessage };
  },

  // Validate entire form
  validateForm: (form) => {
    const fields = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    const errors = [];

    fields.forEach(field => {
      const validation = formHandler.validateField(field, true);
      if (!validation.isValid) {
        isFormValid = false;
        errors.push({
          field: field.name,
          message: validation.errorMessage
        });
      }
    });

    return { isValid: isFormValid, errors };
  },

  // Submit form data
  submitForm: async (formData) => {
    try {
      // In a real implementation, this would submit to Azure Functions or another API
      // For now, we'll simulate a successful submission
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional failures for testing
      if (Math.random() < 0.05) { // 5% failure rate
        throw new Error('Server temporarily unavailable. Please try again.');
      }
      
      // Track successful submission
      analytics.trackFormSubmission('early_access_form', true);
      
      return {
        success: true,
        message: 'Thank you for your interest! We will contact you soon.'
      };
      
    } catch (error) {
      analytics.trackFormSubmission('early_access_form', false, error.message);
      throw error;
    }
  }
};

// Modal functionality
const modal = {
  show: (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.add('show');
      
      // Trap focus within modal
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      analytics.trackInteraction(modalElement, 'modal_opened');
    }
  },

  hide: (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('show');
      document.body.style.overflow = '';
      
      analytics.trackInteraction(modalElement, 'modal_closed');
    }
  }
};

// Smooth scrolling for navigation links
const smoothScroll = {
  init: () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          analytics.trackInteraction(this, 'navigation_click');
        }
      });
    });
  }
};

// Performance monitoring
const performance = {
  init: () => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with actual Web Vitals library
      console.log('Web Vitals monitoring initialized');
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      analytics.trackEvent('page_load_time', {
        loadTime: Math.round(loadTime),
        timestamp: new Date().toISOString()
      });
      
      // Warn if page load is slow
      if (loadTime > 3000) {
        console.warn('Page load time exceeded 3 seconds:', loadTime);
      }
    });
  }
};

// Accessibility enhancements
const accessibility = {
  init: () => {
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
    
    // Handle keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          modal.hide(openModal.id);
        }
      }
    });
  }
};

// Global functions (called from HTML)
window.showNotifyForm = () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = contactSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Focus on the first form field after scrolling
    setTimeout(() => {
      const firstField = contactSection.querySelector('input, select, textarea');
      if (firstField) {
        firstField.focus();
      }
    }, 500);
    
    analytics.trackInteraction(document.querySelector('.hero .btn-primary'), 'cta_click');
  }
};

window.closeModal = () => {
  const openModal = document.querySelector('.modal.show');
  if (openModal) {
    modal.hide(openModal.id);
  }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Company Ads Initiative - Microsite Loaded');
  
  // Initialize modules
  smoothScroll.init();
  performance.init();
  accessibility.init();
  
  // Handle form submission
  const earlyAccessForm = document.getElementById('early-access-form');
  if (earlyAccessForm) {
    // Real-time validation
    const formFields = earlyAccessForm.querySelectorAll('input, select');
    formFields.forEach(field => {
      field.addEventListener('blur', () => {
        formHandler.validateField(field, true);
      });
      
      // Clear errors on input
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          formHandler.validateField(field, false);
        }
      });
    });
    
    // Form submission
    earlyAccessForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = earlyAccessForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Validate form
      const validation = formHandler.validateForm(earlyAccessForm);
      if (!validation.isValid) {
        // Focus first error field
        const firstErrorField = earlyAccessForm.querySelector('.error');
        if (firstErrorField) {
          firstErrorField.focus();
        }
        
        window.announceToScreenReader('Please correct the errors in the form');
        return;
      }
      
      // Show loading state
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
      
      try {
        // Collect form data
        const formData = new FormData(earlyAccessForm);
        const data = Object.fromEntries(formData.entries());
        
        // Submit form
        const result = await formHandler.submitForm(data);
        
        if (result.success) {
          // Show success modal
          modal.show('success-modal');
          
          // Reset form
          earlyAccessForm.reset();
          
          // Announce success
          window.announceToScreenReader('Form submitted successfully');
          
          // Track conversion
          analytics.trackEvent('conversion', {
            type: 'early_access_signup',
            company: data.company,
            budget: data.budget || 'not_specified'
          });
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        alert('There was an error submitting your request. Please try again.');
        
        window.announceToScreenReader('There was an error submitting the form. Please try again.');
        
      } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }
  
  // Track page view
  analytics.trackEvent('page_view', {
    page: 'home',
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });
  
  // Track scroll depth
  let maxScrollDepth = 0;
  const trackScrollDepth = utils.throttle(() => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      
      // Track milestone scroll depths
      if (scrollPercent >= 25 && maxScrollDepth < 25) {
        analytics.trackEvent('scroll_depth', { depth: 25 });
      } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
        analytics.trackEvent('scroll_depth', { depth: 50 });
      } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
        analytics.trackEvent('scroll_depth', { depth: 75 });
      } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
        analytics.trackEvent('scroll_depth', { depth: 90 });
      }
    }
  }, 1000);
  
  window.addEventListener('scroll', trackScrollDepth);
  
  // Track time on page
  let startTime = Date.now();
  
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    analytics.trackEvent('time_on_page', {
      seconds: timeOnPage,
      maxScrollDepth: maxScrollDepth
    });
  });
  
  // Handle visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      analytics.trackEvent('page_hidden');
    } else {
      analytics.trackEvent('page_visible');
    }
  });
  
  console.log('Application initialized successfully');
});

// Announcements Management
const announcements = {
  // Load announcements from JSON file
  async loadAnnouncements() {
    try {
      const response = await fetch('/data/announcements.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.filter(announcement => announcement.active);
    } catch (error) {
      console.error('Error loading announcements:', error);
      return [];
    }
  },

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Render a single announcement
  renderAnnouncement(announcement) {
    return `
      <div class="announcement-card type-${announcement.type}" data-id="${announcement.id}">
        <div class="announcement-header">
          <h3 class="announcement-title">${announcement.title}</h3>
          <span class="announcement-date">${this.formatDate(announcement.date)}</span>
        </div>
        <p class="announcement-content">${announcement.content}</p>
        <span class="announcement-type type-${announcement.type}">${announcement.type}</span>
      </div>
    `;
  },

  // Render all announcements
  async renderAnnouncements() {
    const container = document.getElementById('announcements-list');
    if (!container) return;

    try {
      const announcementData = await this.loadAnnouncements();
      
      if (announcementData.length === 0) {
        container.innerHTML = '<div class="announcement-loading">No announcements at this time.</div>';
        return;
      }

      // Sort by priority (ascending) and then by date (descending)
      announcementData.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return new Date(b.date) - new Date(a.date);
      });

      // Render announcements
      const announcementsHTML = announcementData
        .map(announcement => this.renderAnnouncement(announcement))
        .join('');

      container.innerHTML = announcementsHTML;

      // Track announcement views
      analytics.trackEvent('announcements_loaded', {
        count: announcementData.length,
        types: announcementData.map(a => a.type)
      });

      // Add click tracking to announcement cards
      container.querySelectorAll('.announcement-card').forEach(card => {
        card.addEventListener('click', () => {
          const announcementId = card.dataset.id;
          analytics.trackEvent('announcement_clicked', {
            announcement_id: announcementId
          });
        });
      });

    } catch (error) {
      console.error('Error rendering announcements:', error);
      container.innerHTML = '<div class="announcement-loading">Error loading announcements. Please try again later.</div>';
    }
  },

  // Initialize announcements when DOM is ready
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderAnnouncements());
    } else {
      this.renderAnnouncements();
    }
  }
};

// Initialize announcements
announcements.init();
