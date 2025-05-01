// Statistics Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    // Check if the stats section exists
    const statsSection = document.querySelector('.stats-counter');
    if (!statsSection) return;

    // Get all counter elements
    const counters = document.querySelectorAll('.stat-number');

    // Flag to track if animation has been triggered
    let animated = false;

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Function to animate counter
    function animateCounter(counter, target, duration) {
        let startTime = null;
        const startValue = 0;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * (target - startValue) + startValue);

            counter.textContent = currentValue;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = target;

                // Add the plus sign if needed
                if (counter.dataset.suffix) {
                    counter.textContent += counter.dataset.suffix;
                }
            }
        }

        window.requestAnimationFrame(step);
    }

    // Function to start animation when section is in viewport
    function checkScroll() {
        if (animated) return;

        if (isInViewport(statsSection)) {
            animated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));

                // Different durations for different numbers creates a nice effect
                const duration = 2000 + (target / 50) * 100;

                animateCounter(counter, target, duration);
            });

            // Remove scroll listener once animation is triggered
            window.removeEventListener('scroll', checkScroll);
        }
    }

    // Check on scroll
    window.addEventListener('scroll', checkScroll);

    // Check immediately in case the section is already in view when page loads
    checkScroll();
});
