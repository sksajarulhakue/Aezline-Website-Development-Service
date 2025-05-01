// This script creates a placeholder hero image if one doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    const heroImage = document.querySelector('.premium-hero-image img');
    
    if (heroImage) {
        // Check if the image fails to load
        heroImage.onerror = function() {
            // Create a canvas element for a placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 600, 400);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#2563eb');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 400);
            
            // Add some design elements
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(150, 100, 80, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(450, 300, 100, 0, Math.PI * 2);
            ctx.fill();
            
            // Add text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Premium Web Development', 300, 180);
            
            ctx.font = '20px Arial';
            ctx.fillText('Aezline', 300, 220);
            
            // Replace the image source with the canvas data URL
            heroImage.src = canvas.toDataURL('image/png');
        };
        
        // Force the error handler to run if we know the image doesn't exist
        if (!heroImage.complete || heroImage.naturalWidth === 0) {
            heroImage.src = 'images/hero-image-placeholder.png';
        }
    }
});
