// Premium Pricing Page JavaScript - 2024

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPricingToggle();
    initFaqAccordion();
    initAnimations();
    initSmoothScroll();
});

// Pricing Toggle Functionality
function initPricingToggle() {
    const toggleSwitch = document.querySelector('.pricing-toggle-switch');
    const monthlyLabel = document.querySelector('.pricing-toggle-monthly');
    const yearlyLabel = document.querySelector('.pricing-toggle-yearly');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    // Check if elements exist (only on pricing page)
    if (!toggleSwitch || !monthlyLabel || !yearlyLabel) return;
    
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
}

// FAQ Accordion Functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');
        
        // Add transition styles
        if (answer) {
            answer.style.transition = 'max-height 0.4s ease-out, opacity 0.3s ease, padding 0.3s ease';
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
        }
        
        if (toggle) {
            toggle.style.transition = 'transform 0.3s ease';
        }
        
        question.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherToggle) {
                        otherToggle.innerHTML = '<i class="fas fa-plus"></i>';
                        otherToggle.style.transform = 'rotate(0deg)';
                    }
                    
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                        otherAnswer.style.paddingTop = '0';
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                // Close this item
                item.classList.remove('active');
                
                if (toggle) {
                    toggle.innerHTML = '<i class="fas fa-plus"></i>';
                    toggle.style.transform = 'rotate(0deg)';
                }
                
                if (answer) {
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                    answer.style.paddingTop = '0';
                }
            } else {
                // Open this item
                item.classList.add('active');
                
                if (toggle) {
                    toggle.innerHTML = '<i class="fas fa-minus"></i>';
                    toggle.style.transform = 'rotate(180deg)';
                }
                
                if (answer) {
                    answer.style.opacity = '1';
                    answer.style.paddingTop = '1rem';
                    answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
                }
            }
        });
    });
    
    // Open first FAQ item in each group by default
    document.querySelectorAll('.faq-group').forEach((group, index) => {
        setTimeout(() => {
            const firstItem = group.querySelector('.faq-item');
            if (firstItem) {
                firstItem.classList.add('active');
                
                const toggle = firstItem.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.innerHTML = '<i class="fas fa-minus"></i>';
                    toggle.style.transform = 'rotate(180deg)';
                }
                
                const answer = firstItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.opacity = '1';
                    answer.style.paddingTop = '1rem';
                    answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
                }
            }
        }, index * 200); // Staggered opening
    });
}

// Animations
function initAnimations() {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
