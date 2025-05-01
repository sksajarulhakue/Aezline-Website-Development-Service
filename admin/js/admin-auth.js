// Admin Authentication

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin login
    initAdminLogin();
});

// Initialize admin login
function initAdminLogin() {
    const loginForm = document.getElementById('admin-login-form');
    const loginMessage = document.getElementById('login-message');

    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Simple validation
        if (!username || !password) {
            showLoginMessage('Please enter both username and password.', 'error');
            return;
        }

        // For demo purposes, hardcoded credentials
        // In a real application, this would be handled securely on the server
        if (username === 'admin' && password === 'admin123') {
            showLoginMessage('Login successful! Redirecting...', 'success');

            // Set admin session in localStorage
            setAdminSession();

            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showLoginMessage('Invalid username or password.', 'error');
        }
    });
}

// Show login message
function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('login-message');
    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
}

// Set admin session
function setAdminSession() {
    const adminSession = {
        username: 'admin',
        name: 'Admin User',
        role: 'administrator',
        loggedIn: true,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    };

    localStorage.setItem('adminSession', JSON.stringify(adminSession));
}

// Check if admin is logged in
function isAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSession');

    if (!adminSession) {
        return false;
    }

    try {
        const session = JSON.parse(adminSession);

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            // Session expired, clear it
            localStorage.removeItem('adminSession');
            return false;
        }

        return session.loggedIn === true;
    } catch (error) {
        console.error('Error parsing admin session:', error);
        return false;
    }
}

// Logout admin
function logoutAdmin() {
    localStorage.removeItem('adminSession');
    window.location.href = 'login.html';
}

// Protect admin pages
function protectAdminPage() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// If not on login page, check if admin is logged in
if (!window.location.pathname.includes('login.html')) {
    // Check if we're coming from the dashboard
    const referrer = document.referrer;
    const isFromDashboard = referrer &&
        (referrer.includes('dashboard.html') ||
         referrer.includes('index.html'));

    // If we're coming from the dashboard, set the admin session
    if (isFromDashboard && !isAdminLoggedIn()) {
        setAdminSession();
    } else {
        // Otherwise, protect the page as usual
        protectAdminPage();
    }
}
