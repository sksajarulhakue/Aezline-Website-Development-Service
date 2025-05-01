// Contact API - Connects the contact forms with the admin messages section
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact API initialized');
    
    // Initialize contact form if it exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initContactFormStorage(contactForm);
    }
    
    // Initialize quote form if it exists
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        initQuoteFormStorage(quoteForm);
    }
    
    // Initialize newsletter forms if they exist
    const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter-popup-form');
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            initNewsletterFormStorage(form);
        });
    }
});

// Initialize contact form with localStorage storage
function initContactFormStorage(contactForm) {
    // Override the default form submission
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
        
        // Save message to localStorage
        saveContactMessage({
            id: Date.now(),
            type: 'contact',
            name: formObject.name,
            email: formObject.email,
            phone: formObject.phone || 'Not provided',
            subject: formObject.subject || 'Contact Form Submission',
            message: formObject.message,
            date: new Date().toISOString(),
            read: false
        });
        
        // Simulate form submission delay
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
                const newContactForm = document.getElementById('contact-form');
                if (newContactForm) {
                    initContactFormStorage(newContactForm);
                }
            }, 5000);
        }, 2000);
    });
}

// Initialize quote form with localStorage storage
function initQuoteFormStorage(quoteForm) {
    // Override the default form submission
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
        
        // Save message to localStorage
        saveContactMessage({
            id: Date.now(),
            type: 'quote',
            name: formObject.name,
            email: formObject.email,
            phone: formObject.phone || 'Not provided',
            subject: 'Quote Request: ' + (formObject.service || 'General'),
            message: `Service: ${formObject.service || 'Not specified'}\nBudget: ${formObject.budget || 'Not specified'}\n\nMessage: ${formObject.message}`,
            date: new Date().toISOString(),
            read: false
        });
        
        // Simulate form submission delay
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
                        const newQuoteForm = document.getElementById('quote-form');
                        if (newQuoteForm) {
                            initQuoteFormStorage(newQuoteForm);
                        }
                    }, 500);
                }
            }, 3000);
        }, 2000);
    });
}

// Initialize newsletter form with localStorage storage
function initNewsletterFormStorage(form) {
    // Override the default form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get email value
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Get name value if it exists
        const nameInput = this.querySelector('input[type="text"]');
        const name = nameInput ? nameInput.value.trim() : 'Newsletter Subscriber';
        
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
        
        // Save message to localStorage
        saveContactMessage({
            id: Date.now(),
            type: 'newsletter',
            name: name,
            email: email,
            phone: 'Not provided',
            subject: 'Newsletter Subscription',
            message: 'This user has subscribed to the newsletter.',
            date: new Date().toISOString(),
            read: false
        });
        
        // Simulate form submission delay
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
                            const newForm = formContainer.querySelector('form');
                            if (newForm) {
                                initNewsletterFormStorage(newForm);
                            }
                        }, 500);
                    }
                }, 2000);
            } else {
                // Reset regular newsletter form after 3 seconds
                setTimeout(() => {
                    formContainer.innerHTML = originalContent;
                    const newForm = formContainer.querySelector('form');
                    if (newForm) {
                        initNewsletterFormStorage(newForm);
                    }
                }, 3000);
            }
        }, 1500);
    });
}

// Save contact message to localStorage
function saveContactMessage(message) {
    // Get existing messages
    const savedMessages = localStorage.getItem('contactMessages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    
    // Add new message
    messages.unshift(message);
    
    // Save updated messages
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Update message count in dashboard data
    updateMessageCount(messages.length);
    
    console.log('Message saved:', message);
}

// Update message count in dashboard data
function updateMessageCount(count) {
    // Load dashboard data
    const savedData = localStorage.getItem('dashboardData');
    const dashboardData = savedData ? JSON.parse(savedData) : {
        processSteps: 7,
        bannerImages: 4,
        contactMessages: 0,
        visitors: 152
    };
    
    // Update message count
    dashboardData.contactMessages = count;
    
    // Save updated data
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
}
