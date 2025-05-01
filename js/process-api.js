// Process API Handler
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Load process steps from API
    loadProcessSteps();

    // Initialize process animations after steps are loaded
    setTimeout(() => {
        initProcessAnimations();
    }, 500);
});

// Function to load process steps from localStorage or API
async function loadProcessSteps() {
    try {
        // First try to load from localStorage (this is where admin changes are stored)
        const savedSteps = localStorage.getItem('processSteps');

        if (savedSteps) {
            // If we have steps in localStorage, use those (admin changes)
            const processSteps = JSON.parse(savedSteps);
            renderProcessSteps(processSteps);
            console.log('Process steps loaded from localStorage successfully');
            return;
        }

        // If no localStorage data, try to fetch from API
        try {
            const response = await fetch('/api/process-steps');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const processSteps = await response.json();
            renderProcessSteps(processSteps);

            // Save to localStorage for future use
            localStorage.setItem('processSteps', JSON.stringify(processSteps));

            console.log('Process steps loaded from API successfully');
        } catch (apiError) {
            console.error('Error loading process steps from API:', apiError);
            // If API fails, use the static content already in the HTML
        }
    } catch (error) {
        console.error('Error loading process steps:', error);
        // If all else fails, the static HTML content will remain
    }
}

// Function to render process steps in the timeline
function renderProcessSteps(steps) {
    const processTimeline = document.querySelector('.process-timeline');

    if (!processTimeline) return;

    // Clear existing content
    processTimeline.innerHTML = '';

    // Render each step
    steps.forEach((step, index) => {
        const delayClass = index > 0 ? `delay-${index}00` : '';

        const stepHTML = `
            <div class="process-step">
                <div class="process-step-number">${step.id}</div>
                <div class="process-step-content fade-in ${delayClass}">
                    <div class="process-step-icon">
                        <i class="fas ${step.icon}"></i>
                    </div>
                    <h3 class="process-step-title">${step.title}</h3>
                    <p class="process-step-description">${step.description}</p>
                    <div class="process-step-highlight">${step.highlight}</div>
                </div>
            </div>
        `;

        processTimeline.innerHTML += stepHTML;
    });
}

// Function to handle process section animations
function initProcessAnimations() {
    const processSection = document.querySelector('.process-section');
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!processSection || !fadeElements.length) return;

    // Create an observer for the process section
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // When the section is visible, animate each element with a delay
            fadeElements.forEach(element => {
                element.classList.add('active');
            });

            // Unobserve after animation is triggered
            observer.unobserve(entries[0].target);
        }
    }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

    // Start observing the process section
    observer.observe(processSection);

    // Add hover effect to process steps
    const processSteps = document.querySelectorAll('.process-step');

    processSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            // Add a subtle pulse animation to the step number
            const stepNumber = this.querySelector('.process-step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'translateX(-50%) scale(1.1)';
                stepNumber.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }
        });

        step.addEventListener('mouseleave', function() {
            // Remove the pulse animation
            const stepNumber = this.querySelector('.process-step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'translateX(-50%) scale(1)';
                stepNumber.style.boxShadow = '0 5px 15px rgba(59, 130, 246, 0.3)';
            }
        });
    });
}
