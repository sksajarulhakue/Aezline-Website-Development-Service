// Enhanced Pricing Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get toggle elements
    const toggleSwitch = document.querySelector('.pricing-toggle-switch');
    const monthlyLabel = document.querySelector('.pricing-toggle-monthly');
    const yearlyLabel = document.querySelector('.pricing-toggle-yearly');

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
        } else {
            document.body.classList.remove('yearly-pricing');
            toggleSwitch.classList.remove('yearly');
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');
        }

        // After a short delay, fade cards back in
        setTimeout(() => {
            pricingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50); // Staggered animation
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

    // Initialize display
    updatePricingDisplay();

    // Add smooth transitions to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.5s ease';
    });
});
