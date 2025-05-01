// Form Validation and Submission

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize contact form if it exists
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    // Initialize quote form if it exists
    if (document.getElementById('quote-form')) {
        initQuoteForm();
    }
    
    // Initialize newsletter forms
    initNewsletterForms();
});

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add validation classes and messages
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Create validation message element
            const validationMessage = document.createElement('div');
            validationMessage.className = 'validation-message';
            input.parentNode.appendChild(validationMessage);
            
            // Add event listeners for validation
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling as user types
                this.classList.remove('error');
                this.parentNode.querySelector('.validation-message').textContent = '';
            });
        });
        
        // Prevent form submission if validation fails
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate all inputs
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to the first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    });
}

// Validate individual input
function validateInput(input) {
    const validationMessage = input.parentNode.querySelector('.validation-message');
    let isValid = true;
    
    // Skip validation for non-required empty fields
    if (!input.hasAttribute('required') && !input.value.trim()) {
        input.classList.remove('error');
        validationMessage.textContent = '';
        return true;
    }
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('error');
        validationMessage.textContent = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
            input.classList.add('error');
            validationMessage.textContent = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation (optional)
    if (input.type === 'tel' && input.value.trim()) {
        const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phonePattern.test(input.value)) {
            input.classList.add('error');
            validationMessage.textContent = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    // If valid, remove error styling
    if (isValid) {
        input.classList.remove('error');
        validationMessage.textContent = '';
    }
    
    return isValid;
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual AJAX call in production)
        setTimeout(() => {
            // Show success message
            const formContainer = contactForm.parentElement;
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p>Thank you for contacting us. We'll get back to you shortly.</p>
                </div>
            `;
            
            // Reset form after 5 seconds
            setTimeout(() => {
                formContainer.innerHTML = contactForm.outerHTML;
                initContactForm(); // Re-initialize the form
            }, 5000);
        }, 2000);
    });
}

// Quote Form
function initQuoteForm() {
    const quoteForm = document.getElementById('quote-form');
    
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual AJAX call in production)
        setTimeout(() => {
            // Show success message
            const formContainer = quoteForm.parentElement;
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Quote Request Received!</h3>
                    <p>Thank you for your interest. We'll prepare a custom quote and contact you soon.</p>
                </div>
            `;
            
            // Close popup after 3 seconds
            setTimeout(() => {
                const popup = document.getElementById('quote-popup');
                if (popup) {
                    popup.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    
                    // Reset form after popup is closed
                    setTimeout(() => {
                        formContainer.innerHTML = quoteForm.outerHTML;
                        initQuoteForm(); // Re-initialize the form
                    }, 500);
                }
            }, 3000);
        }, 2000);
    });
}

// Newsletter Forms
function initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter-popup-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Validate email
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailInput.classList.add('error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                // Show success message
                const formContainer = form.parentElement;
                const originalContent = formContainer.innerHTML;
                
                formContainer.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <p>Thank you for subscribing!</p>
                    </div>
                `;
                
                // If this is the popup newsletter form, close the popup after 2 seconds
                if (form.classList.contains('newsletter-popup-form')) {
                    setTimeout(() => {
                        const popup = document.getElementById('newsletter-popup');
                        if (popup) {
                            popup.classList.remove('active');
                            document.body.classList.remove('no-scroll');
                            
                            // Reset form after popup is closed
                            setTimeout(() => {
                                formContainer.innerHTML = originalContent;
                            }, 500);
                        }
                    }, 2000);
                } else {
                    // Reset regular newsletter form after 3 seconds
                    setTimeout(() => {
                        formContainer.innerHTML = originalContent;
                    }, 3000);
                }
            }, 1500);
        });
    });
}
