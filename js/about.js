// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize about page functionality
    initAnimations();
    initTestimonialSlider();
});

// Animate elements on scroll
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
            // Add animation class for styling
            item.classList.add('fade-in');
        });
    }
    
    // Animate value cards
    const valueCards = document.querySelectorAll('.value-card');
    
    if (valueCards.length) {
        const valueObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    valueObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        valueCards.forEach(card => {
            valueObserver.observe(card);
            // Add animation class for styling
            card.classList.add('fade-in-up');
        });
    }
    
    // Animate team members
    const teamMembers = document.querySelectorAll('.team-member');
    
    if (teamMembers.length) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    teamObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        teamMembers.forEach(member => {
            teamObserver.observe(member);
            // Add animation class for styling
            member.classList.add('fade-in-up');
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = [
        {
            text: "Working with Aezline was a game-changer for our business. They took the time to understand our unique needs and delivered a website that not only looks stunning but also performs exceptionally well. The increase in conversions since launch has been remarkable.",
            name: "Jennifer Adams",
            position: "CEO, Adams Enterprises",
            image: "images/about/client-1.jpg"
        },
        {
            text: "The team at Aezline exceeded our expectations in every way. From the initial consultation to the final launch, they were professional, responsive, and incredibly talented. Our new e-commerce site has significantly increased our online sales and customer engagement.",
            name: "Michael Thompson",
            position: "Founder, Thompson Retail",
            image: "images/about/client-2.jpg"
        },
        {
            text: "As a startup, we needed a website that would help us stand out in a crowded market. Aezline delivered exactly that. Their strategic approach to web design and development has helped us establish a strong online presence and attract investors. Highly recommended!",
            name: "Sarah Johnson",
            position: "Co-founder, TechStart",
            image: "images/about/client-3.jpg"
        },
        {
            text: "We've worked with several web development agencies in the past, but none have matched the level of expertise and dedication that Aezline brings to the table. They truly care about our success and have become an invaluable partner in our digital journey.",
            name: "David Rodriguez",
            position: "Marketing Director, Global Solutions",
            image: "images/about/client-4.jpg"
        }
    ];
    
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (!sliderContainer) return;
    
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    // Create navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'slider-arrow slider-prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextArrow = document.createElement('button');
    nextArrow.className = 'slider-arrow slider-next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add navigation to slider
    sliderContainer.appendChild(dotsContainer);
    sliderContainer.appendChild(prevArrow);
    sliderContainer.appendChild(nextArrow);
    
    // Create dots for each slide
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'slider-dot active' : 'slider-dot';
        dotsContainer.appendChild(dot);
        
        // Click event for dots
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Function to show a specific slide
    function showSlide(index) {
        const testimonialItem = sliderContainer.querySelector('.testimonial-item');
        testimonialItem.style.opacity = '0';
        
        setTimeout(() => {
            const testimonial = testimonials[index];
            
            // Update testimonial content
            testimonialItem.innerHTML = `
                <div class="testimonial-quote">"</div>
                <p class="testimonial-text">${testimonial.text}</p>
                <div class="testimonial-author">
                    <div class="author-image">
                        <img src="${testimonial.image}" alt="${testimonial.name}">
                    </div>
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <div class="author-position">${testimonial.position}</div>
                    </div>
                </div>
            `;
            
            // Update active dot
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            testimonialItem.style.opacity = '1';
            currentSlide = index;
        }, 300);
    }
    
    // Event listeners for arrows
    prevArrow.addEventListener('click', () => {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = totalSlides - 1;
        showSlide(newIndex);
    });
    
    nextArrow.addEventListener('click', () => {
        let newIndex = currentSlide + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showSlide(newIndex);
    });
    
    // Auto-rotate slides
    let slideInterval = setInterval(() => {
        let newIndex = currentSlide + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showSlide(newIndex);
    }, 5000);
    
    // Pause auto-rotation on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume auto-rotation on mouse leave
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            let newIndex = currentSlide + 1;
            if (newIndex >= totalSlides) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left (next)
            let newIndex = currentSlide + 1;
            if (newIndex >= totalSlides) newIndex = 0;
            showSlide(newIndex);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right (previous)
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = totalSlides - 1;
            showSlide(newIndex);
        }
    }
}
