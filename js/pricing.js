// Pricing Page JavaScript

// Initialize the page when DOM is ready
function initPage() {
    // Initialize pricing tabs
    initPricingTabs();

    // Initialize pricing toggle
    initPricingToggle();

    // Initialize FAQ accordions
    initFaqAccordions();
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    // DOM already loaded
    initPage();
}

// Initialize pricing tabs
function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const cards = document.querySelectorAll('.pricing-card');

    if (!tabs.length || !cards.length) return;

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(function(t) { t.classList.remove('active'); });

            // Add active class to clicked tab
            this.classList.add('active');

            // Get selected category
            const category = this.getAttribute('data-tab');

            // Filter cards
            filterCards(category);
        });
    });

    // Initial filter (show all)
    filterCards('all');
}

// Enhanced filter for pricing cards with improved animations
function filterCards(category) {
    const cards = document.querySelectorAll('.pricing-card');
    let visibleCount = 0;

    // First, fade out all cards with a subtle staggered effect
    cards.forEach(function(card, index) {
        // Add transition property for smooth animations if not already present
        if (!card.style.transition) {
            card.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }

        // Stagger the fade out slightly
        setTimeout(function() {
            card.style.opacity = '0.2';
            card.style.transform = 'translateY(15px) scale(0.98)';
        }, index * 30);
    });

    // After a short delay, show matching cards with a more dramatic staggered effect
    setTimeout(function() {
        cards.forEach(function(card) {
            const cardCategories = card.getAttribute('data-category');
            const categoriesArray = cardCategories ? cardCategories.split(' ') : [];

            if (category === 'all' || categoriesArray.includes(category)) {
                // Show card
                card.style.display = 'flex';
                visibleCount++;

                // Add animation with enhanced staggered effect
                setTimeout(function() {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    card.classList.add('reveal', 'fade-bottom');
                }, visibleCount * 80); // More pronounced staggering
            } else {
                // Hide card
                setTimeout(function() {
                    card.style.display = 'none';
                    card.classList.remove('reveal', 'fade-bottom');
                }, 300);
            }
        });

        // If no cards match, show all cards
        if (visibleCount === 0) {
            cards.forEach(function(card, index) {
                card.style.display = 'flex';
                setTimeout(function() {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    card.classList.add('reveal', 'fade-bottom');
                }, index * 80);
                visibleCount++;
            });

            // Reset tab selection to 'all'
            const allTab = document.querySelector('.pricing-tab[data-tab="all"]');
            if (allTab) {
                document.querySelectorAll('.pricing-tab').forEach(function(tab) {
                    tab.classList.remove('active');
                });
                allTab.classList.add('active');
            }
        }

        // Update grid layout based on visible cards
        const cardsContainer = document.querySelector('.pricing-cards');
        if (cardsContainer) {
            if (visibleCount <= 2) {
                cardsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 400px))';
                cardsContainer.style.justifyContent = 'center';
            } else {
                cardsContainer.style.gridTemplateColumns = '';
                cardsContainer.style.justifyContent = '';
            }
        }
    }, 300); // Delay before showing cards
}

// Simple FAQ accordions
function initFaqAccordions() {
    console.log('Initializing FAQ accordions');
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) {
        console.log('No FAQ items found');
        return;
    }

    console.log('Found ' + faqItems.length + ' FAQ items');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');

        if (!question || !toggle || !answer) {
            console.log('FAQ item missing required elements');
            return;
        }

        // Set initial state
        answer.style.display = 'none';

        question.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');

                    if (otherAnswer) otherAnswer.style.display = 'none';
                    if (otherToggle) otherToggle.innerHTML = '<i class="fas fa-plus"></i>';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.display = 'none';
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
            } else {
                item.classList.add('active');
                answer.style.display = 'block';
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
    });

    // Open first FAQ item by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        const firstToggle = firstItem.querySelector('.faq-toggle');

        firstItem.classList.add('active');
        if (firstAnswer) firstAnswer.style.display = 'block';
        if (firstToggle) firstToggle.innerHTML = '<i class="fas fa-minus"></i>';
    }

    console.log('FAQ accordions initialized');
}

// Add animation to pricing cards on scroll with debounce for better performance
let scrollTimeout;
document.addEventListener('scroll', function() {
    // Clear the timeout if it exists
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    // Set a new timeout
    scrollTimeout = window.requestAnimationFrame(function() {
        const cards = document.querySelectorAll('.pricing-card');

        cards.forEach(function(card) {
            if (isElementInViewport(card) && card.style.display !== 'none') {
                card.classList.add('reveal', 'fade-bottom');
            }
        });
    });
});

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Add smooth scroll functionality for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just a '#' or the target doesn't exist
            if (targetId === '#' || !document.querySelector(targetId)) return;

            e.preventDefault();

            // Get the target element
            const targetElement = document.querySelector(targetId);

            // Calculate header height for offset
            const headerHeight = document.querySelector('header') ?
                document.querySelector('header').offsetHeight : 0;

            // Calculate the target position with offset
            const targetPosition = targetElement.getBoundingClientRect().top +
                window.pageYOffset - headerHeight - 20; // 20px extra padding

            // Smooth scroll with animation
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Add a highlight effect to the target element
            setTimeout(function() {
                targetElement.style.transition = 'box-shadow 0.5s ease';
                targetElement.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';

                // Remove the highlight after a delay
                setTimeout(function() {
                    targetElement.style.boxShadow = '';
                }, 1500);
            }, 800); // Delay to match scroll completion
        });
    });
}

// Pricing Toggle Functionality
function initPricingToggle() {
    const toggleSwitch = document.querySelector('.toggle-switch');
    const monthlyLabel = document.querySelector('.toggle-label.monthly');
    const yearlyLabel = document.querySelector('.toggle-label.yearly');
    const monthlyPrices = document.querySelectorAll('.pricing-card-price.monthly');
    const yearlyPrices = document.querySelectorAll('.pricing-card-price.yearly');

    // Check if elements exist (only on pricing page)
    if (!toggleSwitch) {
        console.log('Toggle switch not found');
        return;
    }

    if (!monthlyLabel || !yearlyLabel) {
        console.log('Toggle labels not found');
        return;
    }

    // Initialize toggle state
    let isYearly = false;

    // Function to update pricing display with animation
    function updatePricingDisplay() {
        // Get all pricing cards
        const pricingCards = document.querySelectorAll('.pricing-card');

        // First, fade out all cards
        pricingCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.transform = 'translateY(10px)';
        });

        // Update toggle UI
        if (isYearly) {
            document.body.classList.add('yearly-pricing');
            toggleSwitch.classList.add('yearly');
            yearlyLabel.classList.add('active');
            monthlyLabel.classList.remove('active');

            // Hide monthly prices, show yearly prices
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'flex');
        } else {
            document.body.classList.remove('yearly-pricing');
            toggleSwitch.classList.remove('yearly');
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');

            // Show monthly prices, hide yearly prices
            monthlyPrices.forEach(price => price.style.display = 'flex');
            yearlyPrices.forEach(price => price.style.display = 'none');
        }

        // After a short delay, fade cards back in
        setTimeout(() => {
            pricingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100); // Staggered animation
            });
        }, 300);
    }

    // Toggle switch click event
    toggleSwitch.addEventListener('click', function() {
        isYearly = !isYearly;
        updatePricingDisplay();
    });

    // Label click events
    monthlyLabel.addEventListener('click', function() {
        if (isYearly) {
            isYearly = false;
            updatePricingDisplay();
        }
    });

    yearlyLabel.addEventListener('click', function() {
        if (!isYearly) {
            isYearly = true;
            updatePricingDisplay();
        }
    });

    // Add smooth transitions to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.5s ease';
    });

    // Initialize display (hide yearly prices by default)
    yearlyPrices.forEach(price => price.style.display = 'none');
    updatePricingDisplay();

    console.log('Pricing toggle initialized');
}

// Initialize smooth scroll
initSmoothScroll();
