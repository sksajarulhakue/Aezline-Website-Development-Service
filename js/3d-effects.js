// 3D Effects for Premium Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Vanilla Tilt for hero image
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelector('.premium-hero-image'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            gyroscope: true,
            scale: 1.05,
            perspective: 1000
        });
        
        // Initialize tilt for buttons
        VanillaTilt.init(document.querySelectorAll('.premium-btn'), {
            max: 10,
            speed: 300,
            scale: 1.03,
            perspective: 500,
            transition: true
        });
    }
    
    // 3D Parallax Effect
    const heroSection = document.querySelector('.premium-hero');
    const heroTitle = document.querySelector('.premium-hero-title');
    const heroImage = document.querySelector('.premium-hero-image');
    const floatingElements = document.querySelectorAll('.premium-floating-element');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            // Calculate mouse position relative to the center of the section
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Move elements based on mouse position
            if (heroTitle) {
                heroTitle.style.transform = `translateX(${mouseX * 0.01}px) translateY(${mouseY * 0.01}px)`;
            }
            
            if (heroImage) {
                heroImage.style.transform = `translateX(${mouseX * -0.02}px) translateY(${mouseY * -0.02}px)`;
            }
            
            // Move floating elements with different speeds for parallax effect
            floatingElements.forEach((element, index) => {
                const speed = 0.03 + (index * 0.01);
                element.style.transform = `translateX(${mouseX * speed}px) translateY(${mouseY * speed}px)`;
            });
        });
    }
    
    // Add 3D hover effect to title spans
    const titleSpans = document.querySelectorAll('.premium-hero-title span');
    titleSpans.forEach(span => {
        span.addEventListener('mouseover', function() {
            this.style.transform = 'translateZ(30px) translateY(-5px)';
            this.style.textShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
        });
        
        span.addEventListener('mouseout', function() {
            if (this.classList.contains('highlight')) {
                // Reset to the animated state for highlight span
                this.style.transform = '';
                this.style.textShadow = '';
            } else {
                // Reset to normal state for regular spans
                this.style.transform = 'translateZ(10px)';
                this.style.textShadow = '';
            }
        });
    });
    
    // Add smooth scroll for the scroll indicator
    const scrollIndicator = document.querySelector('.premium-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll to the next section
            const nextSection = document.querySelector('.premium-hero + section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
