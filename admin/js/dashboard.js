// Admin Dashboard Data
const dashboardData = {
    processSteps: 7,
    bannerImages: 4,
    contactMessages: 0,
    visitors: 152,
    pageViews: 487,
    bounceRate: '42%',
    activities: [
        {
            type: 'edit',
            icon: 'fa-edit',
            iconClass: 'icon-primary',
            title: 'Process Steps Updated',
            description: 'The website development process steps were updated.',
            time: 'Just now'
        },
        {
            type: 'login',
            icon: 'fa-user',
            iconClass: 'icon-warning',
            title: 'Admin Login',
            description: 'Administrator logged into the system.',
            time: '5 minutes ago'
        },
        {
            type: 'upload',
            icon: 'fa-upload',
            iconClass: 'icon-success',
            title: 'Banner Image Uploaded',
            description: 'A new banner image was uploaded to the carousel.',
            time: '1 hour ago'
        },
        {
            type: 'message',
            icon: 'fa-envelope',
            iconClass: 'icon-warning',
            title: 'New Contact Message',
            description: 'A new message was received through the contact form.',
            time: '3 hours ago'
        },
        {
            type: 'settings',
            icon: 'fa-cog',
            iconClass: 'icon-primary',
            title: 'Settings Updated',
            description: 'Website settings were updated.',
            time: '1 day ago'
        }
    ]
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Load activity list
    loadActivityList();
    
    // Add click event to quick action cards
    document.querySelectorAll('.quick-action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                // Log the action in activity list
                addActivity({
                    type: 'action',
                    icon: 'fa-bolt',
                    iconClass: 'icon-warning',
                    title: 'Quick Action Clicked',
                    description: `The ${this.querySelector('.quick-action-title').textContent} action was clicked.`,
                    time: 'Just now'
                });
                alert('This feature is coming soon!');
            } else {
                // If it's not opening in a new tab, log the navigation
                if (!this.getAttribute('target')) {
                    // Save current page for navigation tracking
                    localStorage.setItem('lastPage', 'dashboard');
                    
                    // Log the action in activity list
                    const actionName = this.querySelector('.quick-action-title').textContent;
                    addActivity({
                        type: 'navigation',
                        icon: 'fa-link',
                        iconClass: 'icon-primary',
                        title: `Navigated to ${actionName}`,
                        description: `User navigated to the ${actionName} page.`,
                        time: 'Just now'
                    });
                }
            }
        });
    });
    
    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Log the logout action
        addActivity({
            type: 'logout',
            icon: 'fa-sign-out-alt',
            iconClass: 'icon-danger',
            title: 'Admin Logout',
            description: 'Administrator logged out of the system.',
            time: 'Just now'
        });
        
        // Save activities before logout
        saveActivities();
        
        // Perform logout
        setTimeout(() => {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        }, 500);
    });
    
    // Initialize real-time updates
    initRealTimeUpdates();
});

// Load dashboard data
function loadDashboardData() {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Update dashboard data with saved values
        dashboardData.processSteps = parsedData.processSteps || dashboardData.processSteps;
        dashboardData.bannerImages = parsedData.bannerImages || dashboardData.bannerImages;
        dashboardData.contactMessages = parsedData.contactMessages || dashboardData.contactMessages;
        dashboardData.visitors = parsedData.visitors || dashboardData.visitors;
    }
    
    // Update dashboard counters
    document.getElementById('process-steps-count').textContent = dashboardData.processSteps;
    document.getElementById('banner-count').textContent = dashboardData.bannerImages;
    document.getElementById('messages-count').textContent = dashboardData.contactMessages;
    document.getElementById('visitors-count').textContent = dashboardData.visitors;
}

// Load activity list
function loadActivityList() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    // Load activities from localStorage if available
    const savedActivities = localStorage.getItem('activities');
    const activities = savedActivities ? JSON.parse(savedActivities) : dashboardData.activities;
    
    // Display activities
    activities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

// Create activity item element
function createActivityItem(activity) {
    const activityItem = document.createElement('li');
    activityItem.className = 'activity-item';
    
    activityItem.innerHTML = `
        <div class="activity-icon ${activity.iconClass}">
            <i class="fas ${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;
    
    return activityItem;
}

// Add new activity
function addActivity(activity) {
    // Load existing activities
    const savedActivities = localStorage.getItem('activities');
    const activities = savedActivities ? JSON.parse(savedActivities) : dashboardData.activities;
    
    // Add new activity at the beginning
    activities.unshift(activity);
    
    // Limit to 10 activities
    if (activities.length > 10) {
        activities.pop();
    }
    
    // Save updated activities
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Update the activity list in the UI
    loadActivityList();
}

// Save activities to localStorage
function saveActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (!savedActivities) {
        localStorage.setItem('activities', JSON.stringify(dashboardData.activities));
    }
}

// Initialize real-time updates
function initRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        // Randomly update visitor count
        const visitorElement = document.getElementById('visitors-count');
        const currentVisitors = parseInt(visitorElement.textContent);
        const newVisitors = currentVisitors + Math.floor(Math.random() * 3);
        visitorElement.textContent = newVisitors;
        
        // Update dashboard data
        dashboardData.visitors = newVisitors;
        
        // Save updated data
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    }, 30000); // Update every 30 seconds
}
