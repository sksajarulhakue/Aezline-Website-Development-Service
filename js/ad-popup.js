// Advertisement Popup Script
document.addEventListener('DOMContentLoaded', function() {
    // Create the ad popup
    createAdPopup();

    // Show popup after 3 seconds
    setTimeout(function() {
        showAdPopup();
    }, 3000);
});

// Function to create the ad popup
function createAdPopup() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'ad-popup-overlay';
    overlay.id = 'ad-popup-overlay';

    // Create popup content
    overlay.innerHTML = `
        <div class="ad-popup">
            <button class="ad-popup-close" id="ad-popup-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="ad-popup-content">
                <div class="ad-popup-image-container" style="background-image: url('images/ads/offer banner.jpg');"></div>
                <div class="ad-popup-text">
                    <h3 class="ad-popup-title">EXCLUSIVE DEAL</h3>
                    <p class="ad-popup-description">Get an amazing 30% OFF on all premium website packages!</p>
                    <a href="https://wa.me/917076529970" class="ad-popup-button" target="_blank">
                        GET STARTED
                    </a>
                </div>
            </div>
        </div>
    `;

    // Append overlay to body
    document.body.appendChild(overlay);

    // Add event listener to close button
    const closeButton = document.getElementById('ad-popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideAdPopup();
        });
    }

    // Close popup when clicking on overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hideAdPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAdPopup();
        }
    });
}

// Function to show the ad popup
function showAdPopup() {
    const overlay = document.getElementById('ad-popup-overlay');
    if (overlay) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

// Function to hide the ad popup
function hideAdPopup() {
    const overlay = document.getElementById('ad-popup-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}
