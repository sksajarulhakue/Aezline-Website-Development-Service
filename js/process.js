// Process Section Animation
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize process section animations
    initProcessAnimations();
});

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
