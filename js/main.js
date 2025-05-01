// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize all components
    initNavigation();
    initDarkMode();
    initScrollReveal();
    initBackToTop();
    initDynamicText();
    initPopups();

    // Add page-specific initializations
    if (document.querySelector('.stats-counter')) {
        initCounters();
    }

    if (document.querySelector('.faq-item')) {
        initFAQs();
    }

    if (document.querySelector('.portfolio-filter')) {
        initPortfolioFilter();
    }
});

// Navigation Functions
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
}

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Sticky header
    const header = document.querySelector('.header');
    let scrollPosition = window.scrollY;

    // Function to update header sticky state
    function updateHeaderState() {
        scrollPosition = window.scrollY;

        if (scrollPosition > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }

    // Initial check on page load
    updateHeaderState();

    // Update on scroll
    window.addEventListener('scroll', updateHeaderState);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

    // If the current theme is dark, apply dark mode
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Toggle dark mode on click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');

            // Save the theme preference
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;

            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    window.addEventListener('resize', checkReveal);

    // Initial check
    checkReveal();
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Animated Counter
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the value, the faster the animation

    // Function to animate a single counter
    function animateCounter(counter, target, duration) {
        let startValue = 0;
        let startTime = null;

        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * target);
            counter.innerText = currentValue;

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target; // Ensure we end at the exact target
            }
        }

        window.requestAnimationFrame(updateCounter);
    }

    // Start animation when the stats section is in view
    const statsSection = document.querySelector('.stats-counter');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate each counter individually
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-count');
                // Duration varies based on the target value for a smoother effect
                const duration = 2000 + (target / 100) * 500;
                animateCounter(counter, target, duration);
            });
            observer.unobserve(entries[0].target);
        }
    }, { threshold: 0.2 }); // Lower threshold to start animation earlier

    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Dynamic Text Animation
function initDynamicText() {
    const dynamicText = document.querySelector('.dynamic-text');

    if (dynamicText) {
        const words = ['Websites', 'E-commerce', 'Web Apps', 'Experiences'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                // Remove a character
                dynamicText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                // Add a character
                dynamicText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            // If word is complete, start deleting
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1000; // Pause at the end of the word
            }

            // If word is deleted, move to the next word
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing the next word
            }

            setTimeout(type, typeSpeed);
        }

        // Start the typing animation
        setTimeout(type, 1000);
    }
}

// Popup Functionality
function initPopups() {
    const quoteButtons = document.querySelectorAll('.quote-btn');
    const quotePopup = document.getElementById('quote-popup');
    const newsletterPopup = document.getElementById('newsletter-popup');
    const closeButtons = document.querySelectorAll('.close-popup');
    const popupOverlays = document.querySelectorAll('.popup-overlay');

    // Open quote popup when clicking on quote buttons
    quoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // If the button has a data-service attribute, pre-select that service in the dropdown
            const serviceValue = this.getAttribute('data-service');
            if (serviceValue && quotePopup) {
                const serviceSelect = quotePopup.querySelector('#service');
                if (serviceSelect) {
                    serviceSelect.value = serviceValue;
                }
            }

            if (quotePopup) {
                quotePopup.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    // Close popups when clicking on close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup-overlay');
            if (popup) {
                popup.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Close popups when clicking outside the popup content
    popupOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Show newsletter popup after 5 seconds or when scrolling to 50% of the page
    if (newsletterPopup) {
        let newsletterShown = sessionStorage.getItem('newsletterShown');

        if (!newsletterShown) {
            // Show after 5 seconds
            setTimeout(function() {
                newsletterPopup.classList.add('active');
                document.body.classList.add('no-scroll');
                sessionStorage.setItem('newsletterShown', 'true');
            }, 5000);

            // Or show when scrolling to 50% of the page
            window.addEventListener('scroll', function() {
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = document.documentElement.clientHeight;

                if ((scrollTop + clientHeight) > (scrollHeight * 0.5) && !newsletterShown) {
                    newsletterPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                    sessionStorage.setItem('newsletterShown', 'true');
                }
            });
        }
    }

    // Form submission handling
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Here you would typically send the form data to a server
                // For now, we'll just show a success message
                const formContainer = form.parentElement;
                formContainer.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank you!</h3><p>Your submission has been received. We\'ll get back to you shortly.</p></div>';

                // Close the popup after 3 seconds
                setTimeout(function() {
                    const popup = formContainer.closest('.popup-overlay');
                    if (popup) {
                        popup.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                }, 3000);
            }
        });
    });
}

// FAQ Accordion
function initFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggle = this.querySelector('.faq-toggle');

            // Toggle the current FAQ item
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            } else {
                answer.style.maxHeight = '0';
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
            }

            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-toggle').innerHTML = '<i class="fas fa-plus"></i>';
                }
            });
        });
    });
}

// Portfolio Filter
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Show/hide gallery items based on filter
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('show');
                    }, 10);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Portfolio item modal
    const projectLinks = document.querySelectorAll('.view-project');

    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const projectId = this.getAttribute('data-project');
            const projectModal = document.getElementById(`${projectId}-modal`);

            if (projectModal) {
                projectModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
}
