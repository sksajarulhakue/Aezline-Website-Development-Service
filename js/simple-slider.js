// Simple Ad Banner Slider
// This is a modular slider that can be reinitialized when the banner content changes

// Global function to initialize the slider
function initSimpleSlider() {
    console.log('Initializing simple slider');

    // Get slider elements
    const slider = document.querySelector('.ad-banner-slider');
    const slides = document.querySelectorAll('.ad-banner-slide');
    const progressBar = document.querySelector('.ad-banner-progress-bar');

    // Exit if elements don't exist
    if (!slider || !slides.length) {
        console.error('Slider elements not found');
        return;
    }

    console.log('Found slider with', slides.length, 'slides');

    // Clear any existing intervals
    if (window.sliderInterval) {
        clearInterval(window.sliderInterval);
    }

    // Variables
    let currentSlide = 0;
    const intervalTime = 4000; // 4 seconds

    // Function to show a specific slide
    function showSlide(index) {
        // Handle loop
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentSlide = index;
        console.log('Showing slide', currentSlide + 1, 'of', slides.length);

        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Show current slide
        slides[currentSlide].style.display = 'block';

        // Update progress bar
        updateProgress();
    }

    // Function to advance to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Function to update progress bar
    function updateProgress() {
        if (!progressBar) return;

        // Reset progress
        progressBar.style.width = '0%';

        // Animate progress
        let width = 0;
        const increment = 100 / (intervalTime / 100);

        const progressInterval = setInterval(() => {
            width += increment;

            if (width >= 100) {
                clearInterval(progressInterval);
                return;
            }

            progressBar.style.width = width + '%';
        }, 100);
    }

    // Set initial styles
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.style.display = 'block';
        } else {
            slide.style.display = 'none';
        }
    });

    // Start auto-sliding
    window.sliderInterval = setInterval(nextSlide, intervalTime);
    console.log('Auto-sliding started with interval of', intervalTime, 'ms');

    // Start progress bar
    updateProgress();

    return {
        showSlide,
        nextSlide
    };
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing simple slider');
    initSimpleSlider();
});
