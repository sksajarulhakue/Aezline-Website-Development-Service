// Blog Page JavaScript - Fresh Modern Design 2024

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlog();
});

// Initialize blog functionality
function initBlog() {
    // Initialize category filter
    initCategoryFilter();



    // Initialize pagination
    initPagination();

    // Initialize newsletter form
    initNewsletterForm();
}



// Initialize category filter
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const featuredPost = document.querySelector('.featured-post');

    if (!categoryButtons.length || !blogCards.length) return;

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get category value
            const category = this.getAttribute('data-category');

            // Hide featured post if filtering (except for 'all')
            if (featuredPost && category !== 'all') {
                featuredPost.style.display = 'none';
            } else if (featuredPost) {
                featuredPost.style.display = 'grid';
            }

            // Filter blog cards
            blogCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    if (card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}



// Initialize pagination
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');

    if (!paginationLinks.length) return;

    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            paginationLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Scroll to top of blog section
            document.querySelector('.blog-section').scrollIntoView({
                behavior: 'smooth'
            });

            // Show toast notification
            showToast('Loading page ' + (this.textContent || '...'), 'info');
        });
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('blog-newsletter-form');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = document.getElementById('blog-newsletter-email');
        const messageContainer = document.getElementById('blog-newsletter-message');

        if (!emailInput || !messageContainer) return;

        const email = emailInput.value.trim();

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageContainer.textContent = 'Please enter a valid email address.';
            messageContainer.className = 'newsletter-message error';
            return;
        }

        // Simulate API call
        messageContainer.textContent = 'Subscribing...';
        messageContainer.className = 'newsletter-message info';

        setTimeout(() => {
            // Success message
            messageContainer.textContent = 'Thank you for subscribing to our newsletter!';
            messageContainer.className = 'newsletter-message success';

            // Clear input
            emailInput.value = '';

            // Clear message after 5 seconds
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'newsletter-message';
            }, 5000);
        }, 1500);
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
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



