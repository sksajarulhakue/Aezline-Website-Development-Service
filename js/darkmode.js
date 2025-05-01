// Dark Mode Functionality

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize dark mode
    initDarkMode();
});

function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the current theme
    applyTheme(currentTheme);
    
    // Toggle dark mode on click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', function(e) {
        // Only apply system preference if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateMetaThemeColor('#111827'); // Update theme-color meta tag
    } else {
        document.body.classList.remove('dark-mode');
        updateMetaThemeColor('#ffffff'); // Update theme-color meta tag
    }
    
    // Update images for dark/light mode if needed
    updateImages(theme);
}

function updateMetaThemeColor(color) {
    // Update the theme-color meta tag for browser UI
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = color;
}

function updateImages(theme) {
    // Replace images that have dark/light versions
    const images = document.querySelectorAll('img[data-dark-src]');
    
    images.forEach(img => {
        const lightSrc = img.getAttribute('src');
        const darkSrc = img.getAttribute('data-dark-src');
        
        if (theme === 'dark' && darkSrc) {
            img.setAttribute('data-light-src', lightSrc);
            img.setAttribute('src', darkSrc);
        } else if (theme === 'light' && img.getAttribute('data-light-src')) {
            img.setAttribute('src', img.getAttribute('data-light-src'));
        }
    });
}
