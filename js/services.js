// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize services page functionality
    initServicesNav();
    initFAQAccordion();
    initScrollReveal();
    initFloatingCards();
});

// Services Navigation
function initServicesNav() {
    const servicesNav = document.querySelector('.services-nav');
    const navLinks = document.querySelectorAll('.services-nav-link');

    if (!servicesNav) return;

    // Sticky services navigation
    const navTop = servicesNav.offsetTop;

    window.addEventListener('scroll', function() {
        if (window.scrollY >= navTop) {
            servicesNav.classList.add('sticky-nav');
        } else {
            servicesNav.classList.remove('sticky-nav');
        }

        // Highlight active section in nav
        const scrollPosition = window.scrollY + 100;

        document.querySelectorAll('section[id], div[id="services-overview"]').forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = servicesNav.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Floating Cards Animation
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');

    if (floatingCards.length === 0) return;

    // Add mouse parallax effect to floating cards
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        floatingCards.forEach(card => {
            const speedFactor = card.classList.contains('card-1') ? 20 :
                              card.classList.contains('card-2') ? 15 : 25;

            const moveX = mouseX * speedFactor;
            const moveY = mouseY * speedFactor;

            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        // Set initial state
        answer.style.maxHeight = '0';

        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-toggle').innerHTML = '<i class="fas fa-plus"></i>';
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            } else {
                answer.style.maxHeight = '0';
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
            }
        });
    });

    // Open first FAQ item by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        const firstToggle = firstItem.querySelector('.faq-toggle');

        firstItem.classList.add('active');
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        firstToggle.innerHTML = '<i class="fas fa-minus"></i>';
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Service Item Hover Effect
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.classList.add('hovered');
    });

    item.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
    });
});

// Technology Grid Animation
const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Process Timeline Animation
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.classList.add('reveal', 'fade-left');
});
