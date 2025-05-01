// Newsletter API - Handles newsletter subscriptions
document.addEventListener('DOMContentLoaded', function() {
    console.log('Newsletter API initialized');
    
    // Initialize newsletter functionality
    initNewsletter();
    
    // Check for newsletter popup trigger
    checkNewsletterPopupTrigger();
});

// Initialize newsletter functionality
function initNewsletter() {
    // Initialize footer newsletter form
    initFooterNewsletterForm();
    
    // Initialize popup newsletter form
    initPopupNewsletterForm();
    
    // Initialize newsletter popup trigger
    initNewsletterPopupTrigger();
}

// Initialize footer newsletter form
function initFooterNewsletterForm() {
    const footerForm = document.querySelector('.newsletter-form');
    if (!footerForm) return;
    
    footerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get email input
        const emailInput = this.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Subscribe to newsletter
        subscribeToNewsletter(email);
        
        // Clear form
        emailInput.value = '';
    });
}

// Initialize popup newsletter form
function initPopupNewsletterForm() {
    const popupForm = document.querySelector('.newsletter-popup-form');
    if (!popupForm) return;
    
    popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const nameInput = document.getElementById('newsletter-name');
        const emailInput = document.getElementById('newsletter-email');
        
        if (!nameInput || !emailInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        // Validate inputs
        if (!name) {
            showToast('Please enter your name', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Subscribe to newsletter
        subscribeToNewsletter(email, name);
        
        // Close popup
        closeNewsletterPopup();
        
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
    });
    
    // Add close button functionality
    const closeButton = document.querySelector('#newsletter-popup .close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeNewsletterPopup();
        });
    }
    
    // Close popup when clicking on overlay
    const overlay = document.getElementById('newsletter-popup');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeNewsletterPopup();
            }
        });
    }
}

// Initialize newsletter popup trigger
function initNewsletterPopupTrigger() {
    // Show popup after 5 seconds on the page if user hasn't subscribed yet
    if (!hasUserSubscribed() && !hasPopupBeenShown()) {
        setTimeout(function() {
            showNewsletterPopup();
        }, 5000);
    }
    
    // Add newsletter links functionality
    const newsletterLinks = document.querySelectorAll('a[href="#newsletter"]');
    newsletterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNewsletterPopup();
        });
    });
}

// Check for newsletter popup trigger in URL
function checkNewsletterPopupTrigger() {
    if (window.location.hash === '#newsletter') {
        showNewsletterPopup();
    }
}

// Show newsletter popup
function showNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;
    
    popup.style.display = 'flex';
    document.body.classList.add('popup-open');
    
    // Mark popup as shown
    localStorage.setItem('newsletterPopupShown', 'true');
    
    // Focus on name input
    setTimeout(() => {
        const nameInput = document.getElementById('newsletter-name');
        if (nameInput) nameInput.focus();
    }, 100);
}

// Close newsletter popup
function closeNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;
    
    popup.style.display = 'none';
    document.body.classList.remove('popup-open');
}

// Subscribe to newsletter
function subscribeToNewsletter(email, name = '') {
    try {
        // Get existing subscribers
        const savedSubscribers = localStorage.getItem('newsletterSubscribers');
        const subscribers = savedSubscribers ? JSON.parse(savedSubscribers) : [];
        
        // Check if email already exists
        const existingSubscriber = subscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            showToast('You are already subscribed to our newsletter!', 'info');
            return;
        }
        
        // Add new subscriber
        const newSubscriber = {
            id: generateId(),
            email: email,
            name: name,
            date: new Date().toISOString(),
            active: true
        };
        
        subscribers.push(newSubscriber);
        
        // Save to localStorage
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        
        // Mark user as subscribed
        localStorage.setItem('userSubscribed', 'true');
        
        // Log activity
        logActivity('subscribe', 'Newsletter Subscription', `New subscriber: ${email}`);
        
        // Show success message
        showToast('Thank you for subscribing to our newsletter!', 'success');
        
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        showToast('Error subscribing to newsletter. Please try again.', 'error');
    }
}

// Unsubscribe from newsletter
function unsubscribeFromNewsletter(email) {
    try {
        // Get existing subscribers
        const savedSubscribers = localStorage.getItem('newsletterSubscribers');
        if (!savedSubscribers) return false;
        
        const subscribers = JSON.parse(savedSubscribers);
        
        // Find subscriber
        const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
        if (subscriberIndex === -1) return false;
        
        // Update subscriber status
        subscribers[subscriberIndex].active = false;
        subscribers[subscriberIndex].unsubscribeDate = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        
        // Log activity
        logActivity('unsubscribe', 'Newsletter Unsubscription', `Unsubscribed: ${email}`);
        
        return true;
    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        return false;
    }
}

// Get all subscribers
function getSubscribers(activeOnly = true) {
    try {
        // Get existing subscribers
        const savedSubscribers = localStorage.getItem('newsletterSubscribers');
        if (!savedSubscribers) return [];
        
        const subscribers = JSON.parse(savedSubscribers);
        
        // Filter active subscribers if needed
        return activeOnly ? subscribers.filter(sub => sub.active) : subscribers;
    } catch (error) {
        console.error('Error getting subscribers:', error);
        return [];
    }
}

// Check if user has subscribed
function hasUserSubscribed() {
    return localStorage.getItem('userSubscribed') === 'true';
}

// Check if popup has been shown
function hasPopupBeenShown() {
    return localStorage.getItem('newsletterPopupShown') === 'true';
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .toast {
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.3s ease-out forwards;
                max-width: 300px;
            }
            
            .toast-success {
                background-color: #10b981;
            }
            
            .toast-error {
                background-color: #ef4444;
            }
            
            .toast-info {
                background-color: #3b82f6;
            }
            
            .toast-icon {
                margin-right: 10px;
                font-size: 16px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle toast-icon"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle toast-icon"></i>';
            break;
    }
    
    toast.innerHTML = `${icon}${message}`;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Log activity
function logActivity(type, title, description) {
    try {
        // Create activity object
        const activity = {
            type: type,
            icon: 'fa-envelope',
            iconClass: 'icon-primary',
            title: title,
            description: description,
            time: 'Just now'
        };
        
        // Load existing activities
        const savedActivities = localStorage.getItem('activities');
        const activities = savedActivities ? JSON.parse(savedActivities) : [];
        
        // Add new activity at the beginning
        activities.unshift(activity);
        
        // Limit to 10 activities
        if (activities.length > 10) {
            activities.pop();
        }
        
        // Save updated activities
        localStorage.setItem('activities', JSON.stringify(activities));
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}
