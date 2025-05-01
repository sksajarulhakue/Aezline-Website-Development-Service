// Ultra Premium 3D Effects for Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    // Initialize Vanilla Tilt for hero card with device-specific settings
    if (typeof VanillaTilt !== 'undefined') {
        // Different settings for mobile vs desktop
        const cardTiltSettings = isMobile ? {
            max: 8,           // Less tilt on mobile
            speed: 300,       // Faster on mobile
            glare: true,
            'max-glare': 0.2, // Less glare on mobile
            gyroscope: true,  // Use gyroscope on mobile
            scale: 1.03,      // Less scale on mobile
            perspective: 1000 // Less perspective on mobile
        } : {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            gyroscope: true,
            scale: 1.05,
            perspective: 2000
        };

        VanillaTilt.init(document.querySelector('.ultra-hero-card'), cardTiltSettings);

        // Initialize tilt for buttons with device-specific settings
        const buttonTiltSettings = isMobile ? {
            max: 5,           // Less tilt on mobile
            speed: 200,       // Faster on mobile
            scale: 1.01,      // Less scale on mobile
            perspective: 300, // Less perspective on mobile
            transition: true
        } : {
            max: 10,
            speed: 300,
            scale: 1.03,
            perspective: 500,
            transition: true
        };

        VanillaTilt.init(document.querySelectorAll('.ultra-btn'), buttonTiltSettings);
    }

    // 3D Parallax Effect
    const heroSection = document.querySelector('.ultra-hero');
    const heroTitle = document.querySelector('.ultra-hero-title');
    const heroCard = document.querySelector('.ultra-hero-card');
    const floatingElements = document.querySelectorAll('.ultra-floating-element');

    if (heroSection) {
        // Use different event for mobile (device orientation) vs desktop (mouse)
        if (isMobile && window.DeviceOrientationEvent) {
            // For mobile devices with gyroscope
            window.addEventListener('deviceorientation', function(e) {
                // Get device orientation data
                const tiltX = e.beta;  // -90 to 90 (front-to-back tilt)
                const tiltY = e.gamma; // -90 to 90 (left-to-right tilt)

                // Only apply effect if we have valid tilt data
                if (tiltX !== null && tiltY !== null) {
                    // Normalize tilt values to similar range as mouse movement
                    const normalizedX = (tiltY / 45) * 30; // Convert -90:90 to roughly -60:60
                    const normalizedY = (tiltX / 45) * 30; // Convert -90:90 to roughly -60:60

                    // Apply subtle movement to title
                    if (heroTitle) {
                        heroTitle.style.transform = `translateX(${normalizedX * 0.3}px) translateY(${normalizedY * 0.3}px)`;
                    }

                    // Apply subtle rotation to card
                    if (heroCard) {
                        const cardInner = document.getElementById('card-inner');
                        if (cardInner) {
                            // Apply gentler rotation on mobile
                            cardInner.style.transform = `rotateY(${normalizedX * 0.2}deg) rotateX(${-normalizedY * 0.2}deg)`;
                        }
                    }

                    // Move floating elements with different speeds
                    floatingElements.forEach((element, index) => {
                        const speed = 0.01 + (index * 0.005); // Gentler on mobile
                        element.style.transform = `translateX(${normalizedX * speed}px) translateY(${normalizedY * speed}px)`;
                    });
                }
            });
        } else {
            // For desktop - use mouse movement
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

                if (heroCard) {
                    // Apply additional transform to the card
                    const cardInner = document.getElementById('card-inner');
                    if (cardInner) {
                        // Calculate rotation based on mouse position
                        const rotateY = mouseX * 0.01;
                        const rotateX = mouseY * -0.01;

                        // Apply the rotation
                        cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    }
                }

                // Move floating elements with different speeds for parallax effect
                floatingElements.forEach((element, index) => {
                    const speed = 0.03 + (index * 0.01);
                    element.style.transform = `translateX(${mouseX * speed}px) translateY(${mouseY * speed}px)`;
                });
            });

            // Reset transforms when mouse leaves the section
            heroSection.addEventListener('mouseleave', function() {
                if (heroTitle) {
                    heroTitle.style.transform = '';
                }

                const cardInner = document.getElementById('card-inner');
                if (cardInner) {
                    cardInner.style.transform = '';
                }

                floatingElements.forEach(element => {
                    element.style.transform = '';
                });
            });
        }
    }

    // Card Flip Effect - Improved for mobile
    const cardInner = document.getElementById('card-inner');
    const flipBackBtn = document.getElementById('flip-back-btn');

    if (cardInner) {
        // Use touchstart for mobile and click for desktop
        const flipEvent = isMobile ? 'touchstart' : 'click';

        cardInner.addEventListener(flipEvent, function(e) {
            // For touch events, prevent default to avoid scrolling issues
            if (e.type === 'touchstart') {
                e.preventDefault();
            }

            // Check if card is already flipped
            const isFlipped = this.style.transform === 'rotateY(180deg)';

            // Add a class to indicate the card is being flipped (for CSS transitions)
            this.classList.add('flipping');

            // Flip the card
            this.style.transform = isFlipped ? '' : 'rotateY(180deg)';

            // Remove the flipping class after transition completes
            setTimeout(() => {
                this.classList.remove('flipping');
            }, 800); // Match this to the transition duration in CSS
        });

        // Flip back when the button on the back is clicked/touched
        if (flipBackBtn) {
            flipBackBtn.addEventListener(flipEvent, function(e) {
                e.stopPropagation(); // Prevent the card click event from firing

                // For touch events, prevent default
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }

                // Add flipping class
                cardInner.classList.add('flipping');

                // Flip back
                cardInner.style.transform = '';

                // Remove class after transition
                setTimeout(() => {
                    cardInner.classList.remove('flipping');
                }, 800);
            });
        }

        // Add double-tap detection for mobile
        if (isMobile) {
            let lastTap = 0;
            cardInner.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                // If double-tap detected (within 300ms)
                if (tapLength < 300 && tapLength > 0) {
                    e.preventDefault();
                    const isFlipped = this.style.transform === 'rotateY(180deg)';
                    this.style.transform = isFlipped ? '' : 'rotateY(180deg)';
                }

                lastTap = currentTime;
            });
        }
    }

    // Enhanced Typing Effect for Subtitle
    const subtitleContainer = document.querySelector('.ultra-hero-subtitle-container');
    const subtitle = document.querySelector('.ultra-hero-subtitle');

    if (subtitle && subtitleContainer) {
        // Store the original text
        const originalText = subtitle.textContent;

        // Words to highlight
        const highlightWords = ['exceptional', 'cutting-edge', 'growth'];

        // Clear the subtitle container
        subtitleContainer.innerHTML = '';

        // Create a new paragraph for the typed text
        const typedText = document.createElement('p');
        typedText.className = 'ultra-hero-subtitle';
        subtitleContainer.appendChild(typedText);

        // Create cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        subtitleContainer.appendChild(cursor);

        // Split text into words for word-by-word typing
        const words = originalText.split(' ');
        let wordIndex = 0;
        let charIndex = 0;
        let currentWord = '';
        let currentText = '';

        // Function to check if a word should be highlighted
        function shouldHighlight(word) {
            return highlightWords.some(hw =>
                word.toLowerCase().includes(hw.toLowerCase()));
        }

        // Function to add the next character
        function typeNextChar() {
            if (wordIndex < words.length) {
                // If starting a new word
                if (charIndex === 0) {
                    currentWord = words[wordIndex];

                    // Check if this word should be highlighted
                    if (shouldHighlight(currentWord)) {
                        // Create a span for the highlighted word
                        const span = document.createElement('span');
                        span.className = 'highlight-word';
                        span.style.opacity = '0';
                        span.textContent = currentWord + ' ';
                        typedText.appendChild(span);

                        // Animate the word appearing
                        setTimeout(() => {
                            span.style.opacity = '1';
                            span.style.animation = 'fadeInWord 0.5s forwards';
                        }, 50);

                        // Move to next word
                        wordIndex++;
                        charIndex = 0;

                        // Schedule next character
                        setTimeout(typeNextChar, 120);
                    } else {
                        // For regular words, type character by character
                        currentText += currentWord.charAt(charIndex);
                        typedText.innerHTML = currentText;
                        charIndex++;
                        setTimeout(typeNextChar, 30); // Faster typing for regular text
                    }
                }
                // Continue typing current word
                else if (charIndex < currentWord.length) {
                    currentText += currentWord.charAt(charIndex);
                    typedText.innerHTML = currentText;
                    charIndex++;
                    setTimeout(typeNextChar, 30); // Faster typing for regular text
                }
                // Word complete, add space and move to next word
                else {
                    currentText += ' ';
                    typedText.innerHTML = currentText;
                    wordIndex++;
                    charIndex = 0;
                    setTimeout(typeNextChar, 80); // Slight pause between words
                }
            } else {
                // Typing complete
                setTimeout(() => {
                    // Keep cursor blinking at the end
                    cursor.style.display = 'inline-block';
                }, 500);
            }
        }

        // Start typing after a short delay
        setTimeout(typeNextChar, 500);
    }

    // Add smooth scroll for the scroll indicator
    const scrollIndicator = document.querySelector('.ultra-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll to the next section
            const nextSection = document.querySelector('.ultra-hero + section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add 3D hover effect to title spans
    const titleSpans = document.querySelectorAll('.ultra-hero-title span');
    titleSpans.forEach(span => {
        span.addEventListener('mouseover', function() {
            if (this.classList.contains('ultra-hero-title-top')) {
                this.style.transform = 'translateZ(40px) translateY(-5px)';
            } else if (this.classList.contains('ultra-hero-title-bottom')) {
                this.style.transform = 'translateZ(60px) translateY(-10px)';
            }
            this.style.textShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
        });

        span.addEventListener('mouseout', function() {
            this.style.transform = '';
            this.style.textShadow = '';
        });
    });

    // Simple placeholder for hero image if needed
    const heroImage = document.querySelector('.ultra-card-image');
    if (heroImage) {
        // Check if the image fails to load
        heroImage.onerror = function() {
            // Create a simple placeholder with a gradient background
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');

            // Create gradient background - simple and clean
            const gradient = ctx.createLinearGradient(0, 0, 600, 400);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#2563eb');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 400);

            // Replace the image source with the canvas data URL
            heroImage.src = canvas.toDataURL('image/png');
        };

        // Force the error handler to run if we know the image doesn't exist
        if (!heroImage.complete || heroImage.naturalWidth === 0) {
            heroImage.src = 'images/hero-image-placeholder.png';
        }
    }

    // Handle window resize to adjust for different screen sizes
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Clear the timeout if it exists
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }

        // Set a timeout to avoid excessive function calls during resize
        resizeTimeout = setTimeout(function() {
            // Update mobile detection
            const wasIsMobile = isMobile;
            isMobile = window.innerWidth <= 768;

            // Only reinitialize if mobile state changed
            if (wasIsMobile !== isMobile && typeof VanillaTilt !== 'undefined') {
                // Destroy existing instances
                VanillaTilt.init(document.querySelector('.ultra-hero-card')).destroy();
                VanillaTilt.init(document.querySelectorAll('.ultra-btn')).destroy();

                // Reinitialize with appropriate settings
                const cardTiltSettings = isMobile ? {
                    max: 8,
                    speed: 300,
                    glare: true,
                    'max-glare': 0.2,
                    gyroscope: true,
                    scale: 1.03,
                    perspective: 1000
                } : {
                    max: 15,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.3,
                    gyroscope: true,
                    scale: 1.05,
                    perspective: 2000
                };

                const buttonTiltSettings = isMobile ? {
                    max: 5,
                    speed: 200,
                    scale: 1.01,
                    perspective: 300,
                    transition: true
                } : {
                    max: 10,
                    speed: 300,
                    scale: 1.03,
                    perspective: 500,
                    transition: true
                };

                VanillaTilt.init(document.querySelector('.ultra-hero-card'), cardTiltSettings);
                VanillaTilt.init(document.querySelectorAll('.ultra-btn'), buttonTiltSettings);
            }
        }, 250); // Wait 250ms after resize ends
    });
});
