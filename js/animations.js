// Animations JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize animations
    initScrollAnimations();
    initCounterAnimations();
    initTypingAnimation();
    initParallaxEffect();
});

// Scroll-based animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-up, .animate-fade-left, .animate-fade-right');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // 10% of the item visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is in view
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add staggered animations to lists and grids
    const staggerContainers = document.querySelectorAll('.services-grid, .features-grid, .stats-grid, .footer-grid');
    
    staggerContainers.forEach(container => {
        const items = container.children;
        
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add animation class if not already present
            if (!item.classList.contains('animate-fade-in') && 
                !item.classList.contains('animate-slide-up') && 
                !item.classList.contains('animate-scale-up')) {
                item.classList.add('animate-slide-up');
            }
            
            observer.observe(item);
        });
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = Math.ceil(target / (duration / 16)); // 16ms per frame (approx 60fps)
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = current;
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Typing animation
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.display = 'inline-block';
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let i = 0;
                const timer = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(timer);
                    }
                }, 100);
                
                observer.unobserve(element);
            }
        }, {
            threshold: 0.5
        });
        
        observer.observe(element);
    });
}

// Parallax effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const offset = scrollY * speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Run animation on scroll
window.addEventListener('scroll', animateOnScroll);

// Initial check for animations
animateOnScroll();
