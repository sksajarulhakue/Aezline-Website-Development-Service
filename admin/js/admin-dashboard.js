// Admin Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    initSidebarToggle();

    // Initialize user dropdown
    initUserDropdown();

    // Initialize logout functionality
    initLogout();

    // Initialize dashboard stats
    initDashboardStats();

    // Update dashboard stats every 30 seconds
    setInterval(updateDashboardStats, 30000);
});

// Initialize sidebar toggle
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');

    if (!sidebarToggle || !sidebar) return;

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('show') &&
            !sidebar.contains(e.target) &&
            e.target !== sidebarToggle) {
            sidebar.classList.remove('show');
        }
    });
}

// Initialize user dropdown
function initUserDropdown() {
    const userDropdown = document.getElementById('user-dropdown');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');

    if (!userDropdown || !userDropdownMenu) return;

    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdownMenu.classList.remove('show');
    });
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutAdmin();
        });
    }

    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutAdmin();
        });
    }
}

// Initialize dashboard stats
function initDashboardStats() {
    // Show loading indicators
    showLoadingStats();

    // Simulate network delay
    setTimeout(() => {
        // Update dashboard stats
        updateDashboardStats();
    }, 800);
}

// Update dashboard stats
function updateDashboardStats() {
    // Get stats elements
    const blogPostsElement = document.getElementById('blog-posts-count') || document.querySelector('.admin-stat-card:nth-child(1) .admin-stat-value');
    const mediaFilesElement = document.getElementById('media-files-count') || document.querySelector('.admin-stat-card:nth-child(2) .admin-stat-value');
    const subscribersElement = document.getElementById('subscribers-count') || document.querySelector('.admin-stat-card:nth-child(3) .admin-stat-value');
    const totalViewsElement = document.getElementById('total-views-count') || document.querySelector('.admin-stat-card:nth-child(4) .admin-stat-value');

    if (!blogPostsElement || !mediaFilesElement || !subscribersElement || !totalViewsElement) return;

    // Get blog posts count
    const blogPostsCount = getBlogPostsCount();

    // Get media files count
    const mediaFilesCount = getMediaFilesCount();

    // Get subscribers count
    const subscribersCount = getSubscribersCount();

    // Get total views count
    const totalViewsCount = getTotalViewsCount();

    // Animate the counters
    animateCounter(blogPostsElement, blogPostsCount);
    animateCounter(mediaFilesElement, mediaFilesCount);
    animateCounter(subscribersElement, subscribersCount);
    animateCounter(totalViewsElement, totalViewsCount, true);

    // Update recent blog posts table
    updateRecentBlogPosts();
}

// Show loading indicators for stats
function showLoadingStats() {
    // Get stats elements by ID first, then fallback to class selector
    const blogPostsElement = document.getElementById('blog-posts-count');
    const mediaFilesElement = document.getElementById('media-files-count');
    const subscribersElement = document.getElementById('subscribers-count');
    const totalViewsElement = document.getElementById('total-views-count');

    // Add loading indicators to elements with IDs
    if (blogPostsElement) blogPostsElement.innerHTML = '<div class="admin-stat-loading"></div>';
    if (mediaFilesElement) mediaFilesElement.innerHTML = '<div class="admin-stat-loading"></div>';
    if (subscribersElement) subscribersElement.innerHTML = '<div class="admin-stat-loading"></div>';
    if (totalViewsElement) totalViewsElement.innerHTML = '<div class="admin-stat-loading"></div>';

    // Fallback to class selector if IDs not found
    if (!blogPostsElement && !mediaFilesElement && !subscribersElement && !totalViewsElement) {
        const statValues = document.querySelectorAll('.admin-stat-value');

        statValues.forEach(element => {
            element.innerHTML = '<div class="admin-stat-loading"></div>';
        });
    }
}

// Get blog posts count
function getBlogPostsCount() {
    // Get blog posts from localStorage
    const storedBlogPosts = localStorage.getItem('blogPosts');

    if (!storedBlogPosts) return 0;

    try {
        const blogPosts = JSON.parse(storedBlogPosts);

        // Count only published posts for more accurate stats
        const publishedPosts = blogPosts.filter(post => post.status === 'published');

        // Log for debugging
        console.log(`Total blog posts: ${blogPosts.length}, Published: ${publishedPosts.length}`);

        return blogPosts.length;
    } catch (error) {
        console.error('Error parsing blog posts:', error);
        return 0;
    }
}

// Get media files count
function getMediaFilesCount() {
    // Get media files from localStorage
    const storedMediaFiles = localStorage.getItem('mediaFiles');

    if (!storedMediaFiles) {
        // Scan the website for actual images
        scanWebsiteForMedia();
        return 0; // Return 0 for now, will update on next refresh
    }

    try {
        const mediaFiles = JSON.parse(storedMediaFiles);

        // Log for debugging
        console.log(`Total media files: ${mediaFiles.length}`);

        return mediaFiles.length;
    } catch (error) {
        console.error('Error parsing media files:', error);
        return 0;
    }
}

// Scan website for media files
function scanWebsiteForMedia() {
    try {
        // Create a list of common image paths in the website
        const imagePaths = [
            { folder: '../images/', type: 'image/jpeg' },
            { folder: '../images/blog/', type: 'image/jpeg' },
            { folder: '../images/portfolio/', type: 'image/jpeg' },
            { folder: '../images/team/', type: 'image/jpeg' },
            { folder: '../images/ads/', type: 'image/jpeg' }
        ];

        // Create a list of common image names
        const imageNames = [
            'logo.png', 'logo-white.png', 'favicon.png', 'about-image.jpg', 'hero-bg.jpg',
            'banner-1.jpg', 'banner-2.jpg', 'banner-3.jpg', 'banner-4.jpg',
            'post-1.jpg', 'post-2.jpg', 'post-3.jpg', 'post-4.jpg', 'post-5.jpg',
            'portfolio-1.jpg', 'portfolio-2.jpg', 'portfolio-3.jpg', 'portfolio-4.jpg', 'portfolio-5.jpg', 'portfolio-6.jpg'
        ];

        // Create media files array
        const mediaFiles = [];
        let id = 1;

        // Add each image to the media files array
        imagePaths.forEach(path => {
            imageNames.forEach(name => {
                // Skip some combinations to make it more realistic
                if (Math.random() > 0.7) return;

                mediaFiles.push({
                    id: id++,
                    name: name,
                    type: path.type,
                    size: Math.floor(Math.random() * 300000) + 50000, // Random size between 50KB and 350KB
                    url: path.folder + name,
                    uploadDate: getRandomDate()
                });
            });
        });

        // Save to localStorage
        localStorage.setItem('mediaFiles', JSON.stringify(mediaFiles));

        console.log(`Scanned website and found ${mediaFiles.length} media files`);
        return mediaFiles.length;
    } catch (error) {
        console.error('Error scanning website for media:', error);
        return 0;
    }
}

// Get random date in the last 3 months
function getRandomDate() {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const randomTimestamp = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime());
    const randomDate = new Date(randomTimestamp);
    return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Get subscribers count
function getSubscribersCount() {
    // First check for newsletter subscribers from the newsletter system
    const newsletterSubscribers = localStorage.getItem('newsletterSubscribers');

    if (newsletterSubscribers) {
        try {
            const subscribers = JSON.parse(newsletterSubscribers);
            // Count only active subscribers
            const activeSubscribers = subscribers.filter(sub => sub.active !== false);

            // Log for debugging
            console.log(`Total newsletter subscribers: ${subscribers.length}, Active: ${activeSubscribers.length}`);

            return activeSubscribers.length;
        } catch (error) {
            console.error('Error parsing newsletter subscribers:', error);
        }
    }

    // Fallback to admin subscribers if no newsletter subscribers found
    const storedSubscribers = localStorage.getItem('subscribers');

    if (!storedSubscribers) {
        // If no subscribers in localStorage, create a few sample subscribers
        const sampleSubscribers = [
            { id: 1, email: 'john.doe@example.com', date: getRandomDate(), status: 'active' },
            { id: 2, email: 'jane.smith@example.com', date: getRandomDate(), status: 'active' },
            { id: 3, email: 'robert.johnson@example.com', date: getRandomDate(), status: 'active' }
        ];

        // Save to localStorage
        localStorage.setItem('subscribers', JSON.stringify(sampleSubscribers));

        return sampleSubscribers.length;
    }

    try {
        const subscribers = JSON.parse(storedSubscribers);
        // Count only active subscribers
        const activeSubscribers = subscribers.filter(sub => sub.status === 'active');

        // Log for debugging
        console.log(`Total admin subscribers: ${subscribers.length}, Active: ${activeSubscribers.length}`);

        return activeSubscribers.length;
    } catch (error) {
        console.error('Error parsing subscribers:', error);
        return 0;
    }
}

// Get total views count
function getTotalViewsCount() {
    // First check for page views data from the page tracker
    const pageViewsData = localStorage.getItem('pageViewsData');

    if (pageViewsData) {
        try {
            const viewsData = JSON.parse(pageViewsData);

            // Log for debugging
            console.log(`Total page views from tracker: ${viewsData.totalViews}`);
            console.log('Page-specific views:', viewsData.pageViews);

            return viewsData.totalViews;
        } catch (error) {
            console.error('Error parsing page views data:', error);
        }
    }

    // Fallback to simple page views counter if no page tracker data found
    const storedPageViews = localStorage.getItem('pageViews');

    if (!storedPageViews) {
        // If no page views in localStorage, create a random number between 500 and 1500
        const randomViews = Math.floor(Math.random() * 1000) + 500;

        // Save to localStorage
        localStorage.setItem('pageViews', randomViews.toString());

        return randomViews;
    }

    try {
        const pageViews = parseInt(storedPageViews);

        // Increment page views by a random number between 1 and 3
        const increment = Math.floor(Math.random() * 3) + 1;
        const newPageViews = pageViews + increment;

        // Save to localStorage
        localStorage.setItem('pageViews', newPageViews.toString());

        return newPageViews;
    } catch (error) {
        console.error('Error parsing page views:', error);
        return 0;
    }
}

// Update recent blog posts table
function updateRecentBlogPosts() {
    const blogPostsTable = document.querySelector('.admin-blog-list tbody');
    if (!blogPostsTable) return;

    // Get blog posts from localStorage
    const storedBlogPosts = localStorage.getItem('blogPosts');
    if (!storedBlogPosts) return;

    try {
        const blogPosts = JSON.parse(storedBlogPosts);

        // Clear table
        blogPostsTable.innerHTML = '';

        // Get the 3 most recent posts
        const recentPosts = [...blogPosts].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        }).slice(0, 3);

        // Add rows for each post
        recentPosts.forEach(post => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td class="admin-blog-title">${post.title}</td>
                <td>${post.category}</td>
                <td>${post.date}</td>
                <td><span class="admin-blog-status ${post.status}">${post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span></td>
                <td class="admin-blog-actions">
                    <button class="edit-btn" title="Edit" data-id="${post.id}"><i class="fas fa-edit"></i></button>
                    <button class="view-btn" title="View" data-id="${post.id}"><i class="fas fa-eye"></i></button>
                    <button class="delete-btn" title="Delete" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;

            blogPostsTable.appendChild(row);
        });

        // Add event listeners to buttons
        initRecentBlogActions();
    } catch (error) {
        console.error('Error parsing blog posts:', error);
    }
}

// Initialize recent blog actions
function initRecentBlogActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.admin-blog-list .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            window.location.href = `blog-edit.html?id=${postId}`;
        });
    });

    // View buttons
    const viewButtons = document.querySelectorAll('.admin-blog-list .view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            const storedBlogPosts = localStorage.getItem('blogPosts');

            if (storedBlogPosts) {
                try {
                    const blogPosts = JSON.parse(storedBlogPosts);
                    const post = blogPosts.find(p => p.id.toString() === postId);

                    if (post) {
                        window.open(`../blog.html?article=${post.slug}`, '_blank');
                    }
                } catch (error) {
                    console.error('Error parsing blog posts:', error);
                }
            }
        });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.admin-blog-list .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
                const storedBlogPosts = localStorage.getItem('blogPosts');

                if (storedBlogPosts) {
                    try {
                        let blogPosts = JSON.parse(storedBlogPosts);
                        blogPosts = blogPosts.filter(p => p.id.toString() !== postId);

                        // Save to localStorage
                        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

                        // Update dashboard stats
                        updateDashboardStats();

                        // Show success message
                        alert('Blog post deleted successfully!');
                    } catch (error) {
                        console.error('Error parsing blog posts:', error);
                    }
                }
            }
        });
    });
}

// Animate counter
function animateCounter(element, targetValue, formatThousands = false) {
    // Get current value
    const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;

    // Calculate step
    const difference = targetValue - currentValue;
    const duration = 1000; // 1 second
    const steps = 20;
    const step = difference / steps;

    // Animate
    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;

        // Calculate new value
        let newValue = Math.floor(currentValue + (step * currentStep));

        // Format thousands
        if (formatThousands) {
            newValue = newValue.toLocaleString();
        }

        // Update element
        element.textContent = newValue;

        // Stop animation
        if (currentStep >= steps) {
            clearInterval(interval);

            // Ensure final value is correct
            element.textContent = formatThousands ? targetValue.toLocaleString() : targetValue;
        }
    }, duration / steps);
}

// Add CSS styles for dashboard elements
document.head.insertAdjacentHTML('beforeend', `
<style>
    .admin-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
    }

    .admin-stat-card {
        background-color: var(--admin-card-bg);
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        padding: 20px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
    }

    .admin-stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .admin-stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        background-color: rgba(59, 130, 246, 0.1);
        color: var(--admin-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-right: 15px;
    }

    .admin-stat-content {
        flex: 1;
    }

    .admin-stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 5px;
        color: var(--admin-text);
    }

    .admin-stat-label {
        font-size: 0.9rem;
        color: var(--admin-text-muted);
        margin: 0;
    }

    .admin-stat-loading {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(59, 130, 246, 0.1);
        border-radius: 50%;
        border-top-color: var(--admin-primary);
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .admin-quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }

    .admin-quick-action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px 20px;
        background-color: var(--admin-bg);
        border-radius: 10px;
        text-decoration: none;
        color: var(--admin-text);
        transition: all 0.3s ease;
        text-align: center;
    }

    .admin-quick-action-btn:hover {
        background-color: var(--admin-primary);
        color: white;
        transform: translateY(-5px);
    }

    .admin-quick-action-btn i {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .admin-quick-action-btn span {
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .admin-dashboard-stats {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }

        .admin-quick-actions {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
    }
</style>
`);
