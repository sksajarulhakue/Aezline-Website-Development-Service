// Banner API - Connects the admin banner manager with the main website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Banner API initialized');
    
    // Function to load banners from localStorage
    function loadBannersFromStorage() {
        try {
            // Check if we have banners in localStorage (from admin panel)
            const savedBanners = localStorage.getItem('banners');
            
            if (savedBanners) {
                // Parse the saved banners
                const banners = JSON.parse(savedBanners);
                
                // Filter only active banners
                const activeBanners = banners.filter(banner => banner.active);
                
                if (activeBanners.length > 0) {
                    console.log(`Found ${activeBanners.length} active banners in localStorage`);
                    return activeBanners;
                }
            }
            
            // If no banners in localStorage or no active banners, return null
            return null;
        } catch (error) {
            console.error('Error loading banners from localStorage:', error);
            return null;
        }
    }
    
    // Function to update banner slider with banners from localStorage
    function updateBannerSlider() {
        // Get the banner slider container
        const sliderContainer = document.querySelector('.ad-banner-slider');
        if (!sliderContainer) {
            console.log('Banner slider not found on this page');
            return;
        }
        
        // Load banners from localStorage
        const banners = loadBannersFromStorage();
        if (!banners) {
            console.log('No custom banners found, using default banners');
            return;
        }
        
        // Clear existing slides
        sliderContainer.innerHTML = '';
        
        // Create new slides from banners
        banners.forEach(banner => {
            const slide = document.createElement('div');
            slide.className = 'ad-banner-slide';
            
            const link = document.createElement('a');
            link.href = banner.link;
            
            const img = document.createElement('img');
            img.src = banner.image;
            img.alt = banner.alt;
            
            link.appendChild(img);
            slide.appendChild(link);
            sliderContainer.appendChild(slide);
        });
        
        console.log(`Updated banner slider with ${banners.length} banners`);
        
        // Reinitialize the slider
        // We need to wait a moment for the DOM to update
        setTimeout(() => {
            // Check if simple-slider.js has already been loaded
            if (typeof initSimpleSlider === 'function') {
                initSimpleSlider();
            } else {
                // If not, we need to manually initialize it
                const slides = document.querySelectorAll('.ad-banner-slide');
                const progressBar = document.querySelector('.ad-banner-progress-bar');
                
                if (slides.length > 0) {
                    let currentSlide = 0;
                    const intervalTime = 4000; // 4 seconds
                    
                    // Set initial styles
                    slides.forEach((slide, index) => {
                        if (index === 0) {
                            slide.style.display = 'block';
                        } else {
                            slide.style.display = 'none';
                        }
                    });
                    
                    // Function to show a specific slide
                    function showSlide(index) {
                        // Handle loop
                        if (index < 0) index = slides.length - 1;
                        if (index >= slides.length) index = 0;
                        
                        currentSlide = index;
                        
                        // Hide all slides
                        slides.forEach(slide => {
                            slide.style.display = 'none';
                        });
                        
                        // Show current slide
                        slides[currentSlide].style.display = 'block';
                        
                        // Update progress bar
                        if (progressBar) {
                            // Reset progress
                            progressBar.style.width = '0%';
                            
                            // Animate progress
                            let width = 0;
                            const increment = 100 / (intervalTime / 100);
                            
                            const progressInterval = setInterval(() => {
                                width += increment;
                                
                                if (width >= 100) {
                                    clearInterval(progressInterval);
                                    return;
                                }
                                
                                progressBar.style.width = width + '%';
                            }, 100);
                        }
                    }
                    
                    // Start auto-sliding
                    setInterval(() => {
                        showSlide(currentSlide + 1);
                    }, intervalTime);
                }
            }
        }, 100);
    }
    
    // Update banner slider when page loads
    updateBannerSlider();
});
