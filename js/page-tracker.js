// Page Tracker - Tracks page views and user activity
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page Tracker initialized');
    
    // Track page view
    trackPageView();
});

// Track page view
function trackPageView() {
    try {
        // Get current page URL
        const currentPage = window.location.pathname;
        
        // Get page views from localStorage
        const savedPageViews = localStorage.getItem('pageViewsData');
        let pageViewsData = savedPageViews ? JSON.parse(savedPageViews) : {
            totalViews: 0,
            pageViews: {},
            lastUpdated: new Date().toISOString()
        };
        
        // Increment total views
        pageViewsData.totalViews++;
        
        // Increment page-specific views
        if (pageViewsData.pageViews[currentPage]) {
            pageViewsData.pageViews[currentPage]++;
        } else {
            pageViewsData.pageViews[currentPage] = 1;
        }
        
        // Update last updated timestamp
        pageViewsData.lastUpdated = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('pageViewsData', JSON.stringify(pageViewsData));
        
        // Log activity
        logActivity('page_view', 'Page View', `Page viewed: ${currentPage}`);
        
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
}

// Log activity
function logActivity(type, title, description) {
    try {
        // Create activity object
        const activity = {
            id: generateId(),
            type: type,
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        // Load existing activities
        const savedActivities = localStorage.getItem('siteActivities');
        const activities = savedActivities ? JSON.parse(savedActivities) : [];
        
        // Add new activity at the beginning
        activities.unshift(activity);
        
        // Limit to 100 activities
        if (activities.length > 100) {
            activities.pop();
        }
        
        // Save updated activities
        localStorage.setItem('siteActivities', JSON.stringify(activities));
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
