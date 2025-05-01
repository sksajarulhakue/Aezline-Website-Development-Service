// Portfolio Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize portfolio page functionality
    initPortfolioFilter();
    initProjectModals();
    initMasonry();
    initLazyLoading();
    animateOnScroll();
});

// Portfolio Filter
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    // Make sure all items are visible
    galleryItems.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.display = 'flex';
    });

    // Filter items when clicking on filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach((item, index) => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    setTimeout(() => {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Re-initialize masonry layout after filtering
            setTimeout(() => {
                if (typeof initMasonry === 'function') {
                    initMasonry();
                }
            }, galleryItems.length * 50 + 300);
        });
    });

    // Ensure featured project is properly sized on load
    const featuredProject = document.querySelector('.featured-project');
    if (featuredProject) {
        featuredProject.style.gridColumn = 'span 2';
    }
}

// Project Modals
function initProjectModals() {
    const projectLinks = document.querySelectorAll('.view-project');
    const projectModals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    if (!projectLinks.length) return;

    // Open modal when clicking on project link
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const projectId = this.getAttribute('data-project');
            const targetModal = document.getElementById(`${projectId}-modal`);

            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Initialize gallery slider if exists
                const gallery = targetModal.querySelector('.modal-gallery');
                if (gallery && typeof initGallerySlider === 'function') {
                    initGallerySlider(gallery);
                }
            }
        });
    });

    // Close modal when clicking on close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.project-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal when clicking outside the modal content
    projectModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            projectModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

// Gallery Slider for Project Modals
function initGallerySlider(gallery) {
    const slides = gallery.querySelectorAll('img');
    if (slides.length <= 1) return;

    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'gallery-dots';

    // Create navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'gallery-arrow gallery-prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const nextArrow = document.createElement('button');
    nextArrow.className = 'gallery-arrow gallery-next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

    // Add navigation to gallery
    gallery.appendChild(dotsContainer);
    gallery.appendChild(prevArrow);
    gallery.appendChild(nextArrow);

    // Create dots for each slide
    slides.forEach((slide, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'gallery-dot active' : 'gallery-dot';
        dotsContainer.appendChild(dot);

        // Hide all slides except the first one
        if (index > 0) {
            slide.style.display = 'none';
        }

        // Click event for dots
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    let currentSlide = 0;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Show selected slide
        slides[index].style.display = 'block';

        // Update active dot
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // Event listeners for arrows
    prevArrow.addEventListener('click', () => {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    });

    nextArrow.addEventListener('click', () => {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    });

    // Add keyboard navigation
    gallery.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            showSlide(newIndex);
        } else if (e.key === 'ArrowRight') {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        }
    });

    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left (next)
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right (previous)
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            showSlide(newIndex);
        }
    }
}

// Masonry Layout
function initMasonry() {
    // We're using CSS Grid for this layout instead of Masonry
    // This function is kept for compatibility with existing code
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Make sure all images are loaded before applying any layout adjustments
    if (typeof imagesLoaded === 'function') {
        imagesLoaded(gallery, function() {
            // Ensure the featured project spans two columns
            const featuredProject = document.querySelector('.featured-project');
            if (featuredProject) {
                featuredProject.style.gridColumn = 'span 2';
            }

            // Add a class to indicate images are loaded
            gallery.classList.add('images-loaded');
        });
    } else {
        // Fallback if imagesLoaded is not available
        console.log('Using CSS grid for portfolio layout');
        gallery.classList.add('images-loaded');
    }
}

// Lazy Loading for Images - Simplified version
function initLazyLoading() {
    // This is now a simplified version that doesn't use lazy loading
    // since we're loading images directly with src attribute
    console.log('Image loading initialized');
}

// Animate on scroll
function animateOnScroll() {
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
}
