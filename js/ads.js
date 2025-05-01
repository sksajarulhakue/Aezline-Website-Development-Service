// Ad Banner Slider with Auto-Infinity Loop
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize ad banner slider
    console.log('DOM loaded, initializing ad banner slider');
    initAdBannerSlider();
});

// Ad Banner Slider Function
function initAdBannerSlider() {
    const slider = document.querySelector('.ad-banner-slider');
    const slides = document.querySelectorAll('.ad-banner-slide');
    const progressBar = document.querySelector('.ad-banner-progress-bar');

    // Exit if slider or slides don't exist
    if (!slider || slides.length <= 1) return;

    // Variables
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 4000; // 4 seconds between slides

    // Initialize
    function init() {
        // Set initial active slide
        slides[0].classList.add('active');

        // Start auto sliding
        startAutoSlide();

        // Start progress bar
        updateProgressBar();
    }

    // Go to specific slide
    function goToSlide(index) {
        // Handle loop
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Update current slide index
        currentSlide = index;
        console.log('Going to slide', currentSlide, 'of', slides.length);

        // Move slider
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        console.log('Slider transform set to', `translateX(-${currentSlide * 100}%)`);

        // Update active class
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Reset and start progress bar
        updateProgressBar();
    }

    // Auto slide function
    function startAutoSlide() {
        // Clear any existing interval
        if (slideInterval) {
            clearInterval(slideInterval);
            console.log('Cleared existing slide interval');
        }

        // Set new interval
        console.log('Setting slide interval for', intervalTime, 'ms');
        slideInterval = setInterval(() => {
            console.log('Auto-advancing to next slide');
            goToSlide(currentSlide + 1);
        }, intervalTime);
    }

    // Progress bar
    function updateProgressBar() {
        if (!progressBar) return;

        // Reset progress
        progressBar.style.width = '0%';

        // Animate progress
        let width = 0;
        const increment = 100 / (intervalTime / 100); // For smooth animation

        const progressInterval = setInterval(() => {
            width += increment;

            if (width >= 100) {
                clearInterval(progressInterval);
                return;
            }

            progressBar.style.width = width + '%';
        }, 100);
    }

    // Initialize the slider
    init();

    // Log for debugging
    console.log('Ad banner initialized with ' + slides.length + ' slides');
}
