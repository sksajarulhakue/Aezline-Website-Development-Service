// Interactive Portfolio Showcase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio items with 3D tilt effect
    initPortfolioTilt();

    // Initialize portfolio filtering
    initPortfolioFilter();

    // Initialize portfolio modal
    initPortfolioModal();
});

// Function to initialize 3D tilt effect on portfolio items
function initPortfolioTilt() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach((item, index) => {
        // Add tilt class for 3D effect
        item.classList.add('tilt');

        // Add animation delay based on index
        item.style.animation = `scaleIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards ${index * 0.1}s`;
        item.style.opacity = '0'; // Start with opacity 0

        // Mouse enter event
        item.addEventListener('mouseenter', function(e) {
            // Get item dimensions
            const rect = this.getBoundingClientRect();

            // Add mousemove event listener
            this.addEventListener('mousemove', handleMouseMove);

            // Mouse move handler function
            function handleMouseMove(e) {
                // Calculate mouse position relative to the item
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate rotation values based on mouse position
                const rotateY = ((x / rect.width) - 0.5) * 15; // -7.5 to 7.5 degrees
                const rotateX = ((y / rect.height) - 0.5) * -15; // 7.5 to -7.5 degrees

                // Calculate distance from center for intensity
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
                const intensity = distance / maxDistance;

                // Apply 3D rotation with dynamic intensity
                this.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05) translateZ(10px)`;

                // Move the content for parallax effect
                const content = this.querySelector('.portfolio-content');
                if (content) {
                    content.style.transform = `translateZ(50px) translateX(${rotateY * -1}px) translateY(${rotateX}px)`;
                }

                // Add dynamic shadow based on tilt
                this.style.boxShadow = `
                    ${rotateY * -1}px ${rotateX}px 30px rgba(0, 0, 0, ${0.2 + intensity * 0.1}),
                    0 0 0 5px rgba(30, 136, 229, ${0.05 + intensity * 0.05})
                `;
            }

            // Bind the handler to the item
            this.handleMouseMove = handleMouseMove.bind(this);
            this.addEventListener('mousemove', this.handleMouseMove);
        });

        // Mouse leave event
        item.addEventListener('mouseleave', function() {
            // Remove mousemove event listener
            this.removeEventListener('mousemove', this.handleMouseMove);

            // Reset transform with smooth transition
            this.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateZ(0)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1), 0 0 0 5px rgba(30, 136, 229, 0.05)';

            // Reset content position
            const content = this.querySelector('.portfolio-content');
            if (content) {
                content.style.transform = 'translateZ(30px) translateX(0) translateY(0)';
            }
        });
    });
}

// Function to initialize portfolio filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // Add animation to filter buttons
    filterButtons.forEach((button, index) => {
        button.style.animation = `fadeInUp 0.5s ease forwards ${0.1 + index * 0.1}s`;
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
    });

    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Add animation class to grid
            portfolioGrid.classList.add('filtering');

            // Count visible items for layout adjustment
            let visibleCount = 0;

            // Filter portfolio items
            portfolioItems.forEach((item, index) => {
                // If filter is 'all' or item category matches filter
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    visibleCount++;

                    // Show item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';

                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                            // Add staggered animation delay
                            item.style.transition = `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.05}s`;
                        }, 50);
                    }, 300);
                } else {
                    // Hide item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Show message if no items match the filter
            const noResultsMessage = document.querySelector('.portfolio-no-results');
            if (visibleCount === 0) {
                if (!noResultsMessage) {
                    const message = document.createElement('div');
                    message.className = 'portfolio-no-results';
                    message.textContent = 'No projects found in this category.';
                    message.style.textAlign = 'center';
                    message.style.padding = '50px 0';
                    message.style.color = '#666';
                    message.style.fontStyle = 'italic';
                    message.style.animation = 'fadeIn 0.5s ease forwards';
                    portfolioGrid.appendChild(message);
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }

            // Remove animation class after transition
            setTimeout(() => {
                portfolioGrid.classList.remove('filtering');
            }, 600);
        });
    });

    // Set 'All' as default active filter
    if (filterButtons.length > 0) {
        // Delay initial filter to allow page to load
        setTimeout(() => {
            filterButtons[0].click();
        }, 300);
    }
}

// Function to initialize portfolio modal
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');

    if (!modal) return;

    const modalContent = modal.querySelector('.portfolio-modal-content');
    const modalTitle = modal.querySelector('.portfolio-modal-title');
    const modalImage = modal.querySelector('.portfolio-modal-image');
    const modalDescription = modal.querySelector('.portfolio-modal-description');
    const modalClose = modal.querySelector('.portfolio-modal-close');
    const modalDetails = modal.querySelector('.portfolio-modal-details');

    // Open modal when portfolio item is clicked
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get item data
            const title = this.getAttribute('data-title');
            const image = this.querySelector('.portfolio-image').getAttribute('src');
            const description = this.getAttribute('data-description');
            const client = this.getAttribute('data-client');
            const date = this.getAttribute('data-date');
            const category = this.getAttribute('data-category');
            const link = this.getAttribute('data-link');

            // Set modal content
            modalTitle.textContent = title;
            modalImage.setAttribute('src', image);
            modalDescription.textContent = description;

            // Set modal details
            modalDetails.innerHTML = `
                <div class="portfolio-modal-detail-item">
                    <span class="portfolio-modal-detail-label">Client:</span>
                    <span class="portfolio-modal-detail-value">${client}</span>
                </div>
                <div class="portfolio-modal-detail-item">
                    <span class="portfolio-modal-detail-label">Date:</span>
                    <span class="portfolio-modal-detail-value">${date}</span>
                </div>
                <div class="portfolio-modal-detail-item">
                    <span class="portfolio-modal-detail-label">Category:</span>
                    <span class="portfolio-modal-detail-value">${category}</span>
                </div>
                <div class="portfolio-modal-actions">
                    <a href="${link}" class="portfolio-modal-btn" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Visit Website
                    </a>
                </div>
            `;

            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal when close button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Function to handle portfolio navigation
function navigatePortfolio(direction) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const scrollAmount = direction === 'next' ? 400 : -400;

    portfolioGrid.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
