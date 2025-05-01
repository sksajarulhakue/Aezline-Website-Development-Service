// Settings API - Connects the admin settings with the main website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings API initialized');

    // Apply settings from localStorage
    applySettings();
});

// Apply settings from localStorage to the website
function applySettings() {
    // Apply general settings
    applyGeneralSettings();

    // Apply appearance settings
    applyAppearanceSettings();

    // Apply performance settings
    applyPerformanceSettings();
}

// Apply general settings
function applyGeneralSettings() {
    // Load general settings from localStorage
    const generalSettings = localStorage.getItem('generalSettings');
    if (!generalSettings) return;

    const settings = JSON.parse(generalSettings);

    // Update website title
    document.title = settings.siteTitle || document.title;

    // Update contact information
    updateContactInfo(settings);

    // Update social media links
    updateSocialLinks(settings);

    console.log('General settings applied');
}

// Update contact information on the website
function updateContactInfo(settings) {
    // Update email addresses
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.href = `mailto:${settings.contactEmail}`;
    });

    // Update phone numbers
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = `tel:${settings.contactPhone.replace(/\D/g, '')}`; // Remove non-digits

        // If the link only contains a phone number, update the text too
        if (link.textContent.match(/^\+?[\d\s\(\)-]+$/)) {
            link.textContent = settings.contactPhone;
        }
    });

    // Update address in footer
    document.querySelectorAll('.footer-contact li:first-child').forEach(element => {
        if (element.querySelector('i.fa-map-marker-alt')) {
            // Keep the icon but update the text
            const icon = element.querySelector('i').outerHTML;
            element.innerHTML = icon + ' ' + settings.contactAddress;
        }
    });

    // Update email in footer
    document.querySelectorAll('.footer-contact li').forEach(element => {
        if (element.querySelector('i.fa-envelope')) {
            // Keep the icon but update the text
            const icon = element.querySelector('i').outerHTML;
            element.innerHTML = icon + ' ' + settings.contactEmail;
        }
    });

    // Update phone in footer
    document.querySelectorAll('.footer-contact li').forEach(element => {
        if (element.querySelector('i.fa-phone')) {
            // Keep the icon but update the text
            const icon = element.querySelector('i').outerHTML;
            element.innerHTML = icon + ' ' + settings.contactPhone;
        }
    });
}

// Update social media links
function updateSocialLinks(settings) {
    // Facebook
    document.querySelectorAll('a[href*="facebook.com"]').forEach(link => {
        link.href = settings.socialFacebook;
    });

    // Twitter
    document.querySelectorAll('a[href*="twitter.com"]').forEach(link => {
        link.href = settings.socialTwitter;
    });

    // Instagram
    document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
        link.href = settings.socialInstagram;
    });

    // LinkedIn
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => {
        link.href = settings.socialLinkedin;
    });
}

// Apply appearance settings
function applyAppearanceSettings() {
    // Load appearance settings from localStorage
    const appearanceSettings = localStorage.getItem('appearanceSettings');
    if (!appearanceSettings) return;

    const settings = JSON.parse(appearanceSettings);

    // Apply theme colors
    applyThemeColors(settings);

    // Apply dark mode settings
    applyDarkModeSettings(settings);

    console.log('Appearance settings applied');
}

// Apply theme colors
function applyThemeColors(settings) {
    // Create or update CSS variables
    let styleElement = document.getElementById('dynamic-theme-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-theme-styles';
        document.head.appendChild(styleElement);
    }

    // Set CSS variables
    styleElement.textContent = `
        :root {
            --primary-color: ${settings.primaryColor || '#3b82f6'};
            --secondary-color: ${settings.secondaryColor || '#8b5cf6'};
        }
    `;
}

// Apply dark mode settings
function applyDarkModeSettings(settings) {
    // Check if dark mode toggle is enabled
    if (settings.enableDarkMode === false) {
        // Hide dark mode toggle
        const darkModeToggle = document.querySelector('.theme-toggle');
        if (darkModeToggle) {
            darkModeToggle.style.display = 'none';
        }

        // Ensure light mode is active
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'light');
    } else {
        // Show dark mode toggle
        const darkModeToggle = document.querySelector('.theme-toggle');
        if (darkModeToggle) {
            darkModeToggle.style.display = 'block';
        }

        // Set default dark mode if specified
        if (settings.defaultDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'dark');
        }
    }
}

// Apply performance settings
function applyPerformanceSettings() {
    // Load advanced settings from localStorage
    const advancedSettings = localStorage.getItem('advancedSettings');
    if (!advancedSettings) return;

    const settings = JSON.parse(advancedSettings);

    // Apply animations setting
    applyAnimationSettings(settings.enableAnimations);

    // Apply lazy loading setting
    applyLazyLoadingSettings(settings.enableLazyLoading);

    // Apply preloading setting
    applyPreloadingSettings(settings.enablePreloading);

    console.log('Performance settings applied');
}

// Apply animation settings
function applyAnimationSettings(enableAnimations) {
    try {
        // Create or update CSS for animations
        let styleElement = document.getElementById('animation-settings');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'animation-settings';
            document.head.appendChild(styleElement);
        }

        if (enableAnimations === false) {
            // Disable all animations
            styleElement.textContent = `
                * {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                    animation-delay: 0s !important;
                    transition-delay: 0s !important;
                }
            `;
        } else {
            // Enable animations (remove disabling styles)
            styleElement.textContent = '';
        }
    } catch (error) {
        console.error('Error applying animation settings:', error);
    }
}

// Apply lazy loading settings
function applyLazyLoadingSettings(enableLazyLoading) {
    try {
        // Find all images that could be lazy loaded
        const images = document.querySelectorAll('img[data-src]');

        if (enableLazyLoading !== false) {
            // Enable lazy loading
            images.forEach(img => {
                // Don't load the image immediately
                if (!img.hasAttribute('src') || img.getAttribute('src') === '') {
                    img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E');
                }

                // Set up intersection observer if not already done
                if (!window.lazyLoadObserver) {
                    window.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.dataset.src;
                                observer.unobserve(img);
                            }
                        });
                    });
                }

                // Observe the image
                window.lazyLoadObserver.observe(img);
            });
        } else {
            // Disable lazy loading - load all images immediately
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }

                // Stop observing if we were
                if (window.lazyLoadObserver) {
                    window.lazyLoadObserver.unobserve(img);
                }
            });

            // Clean up observer
            if (window.lazyLoadObserver) {
                window.lazyLoadObserver.disconnect();
                window.lazyLoadObserver = null;
            }
        }
    } catch (error) {
        console.error('Error applying lazy loading settings:', error);
    }
}

// Apply preloading settings
function applyPreloadingSettings(enablePreloading) {
    try {
        // Remove any existing preload links
        document.querySelectorAll('link[rel="preload"][data-auto-preload]').forEach(link => {
            link.remove();
        });

        if (enablePreloading === true) {
            // Add preload links for key resources
            const resourcesToPreload = [
                { href: 'css/main.css', as: 'style' },
                { href: 'js/main.js', as: 'script' },
                { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' }
            ];

            resourcesToPreload.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                link.setAttribute('data-auto-preload', 'true');
                document.head.appendChild(link);
            });
        }
    } catch (error) {
        console.error('Error applying preloading settings:', error);
    }
}
