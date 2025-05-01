// Admin API - Connects the main website with the admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin API initialized');

    // Initialize admin access (hidden by default)
    initAdminAccess();

    // Check if there's a login redirect
    checkLoginRedirect();

    // Add keyboard shortcut for admin access (Ctrl+Shift+A)
    addKeyboardShortcut();

    // Add double-click handler for the bottom-right corner
    addCornerClickHandler();

    // Add secret URL hash handler (#admin)
    addHashHandler();
});

// Initialize admin access (hidden by default)
function initAdminAccess() {
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .admin-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 999;
            transition: all 0.3s ease;
            opacity: 0.7;
            display: none; /* Hidden by default */
        }

        .admin-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            opacity: 1;
        }

        .admin-button i {
            font-size: 1.5rem;
        }

        .admin-login-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            padding: 30px;
            z-index: 1000;
            display: none;
        }

        .admin-login-popup h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #1f2937;
            font-size: 1.5rem;
            text-align: center;
        }

        .admin-login-popup .form-group {
            margin-bottom: 20px;
        }

        .admin-login-popup label {
            display: block;
            margin-bottom: 8px;
            color: #4b5563;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .admin-login-popup input {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .admin-login-popup input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .admin-login-popup button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .admin-login-popup button:hover {
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
            transform: translateY(-2px);
        }

        .admin-login-popup .error-message {
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: 15px;
            text-align: center;
            display: none;
        }

        .admin-login-popup .close-button {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
            width: auto;
            transition: color 0.3s ease;
        }

        .admin-login-popup .close-button:hover {
            color: #ef4444;
            box-shadow: none;
        }

        .admin-login-popup .login-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #6b7280;
        }

        .admin-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
        }

        .admin-notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #ef4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
        }
    `;

    document.head.appendChild(style);

    // Create admin button
    const adminButton = document.createElement('div');
    adminButton.className = 'admin-button';
    adminButton.innerHTML = '<i class="fas fa-user-shield"></i>';
    adminButton.title = 'Admin Panel';
    adminButton.id = 'admin-button';

    // Create login popup
    const loginPopup = document.createElement('div');
    loginPopup.className = 'admin-login-popup';
    loginPopup.id = 'admin-login-popup';
    loginPopup.innerHTML = `
        <button class="close-button"><i class="fas fa-times"></i></button>
        <h3>Admin Login</h3>
        <form id="admin-login-form">
            <div class="form-group">
                <label for="admin-username">Username</label>
                <input type="text" id="admin-username" placeholder="Enter username" required>
            </div>
            <div class="form-group">
                <label for="admin-password">Password</label>
                <input type="password" id="admin-password" placeholder="Enter password" required>
            </div>
            <button type="submit">Login</button>
            <div class="error-message" id="admin-login-error">Invalid username or password</div>
        </form>
        <div class="login-footer">
            <p>Secure admin access - Unauthorized access is prohibited</p>
        </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.id = 'admin-overlay';

    // Add to body
    document.body.appendChild(adminButton);
    document.body.appendChild(overlay);
    document.body.appendChild(loginPopup);

    // Admin button click event
    adminButton.addEventListener('click', function() {
        // If already logged in, redirect to admin dashboard
        if (localStorage.getItem('adminLoggedIn')) {
            window.location.href = 'admin/dashboard.html';
            return;
        }

        // Otherwise, show login popup
        showLoginPopup();
    });

    // Close button
    loginPopup.querySelector('.close-button').addEventListener('click', function() {
        closeLoginPopup();
    });

    // Close when clicking overlay
    overlay.addEventListener('click', function() {
        closeLoginPopup();
    });

    // Login form
    loginPopup.querySelector('#admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        // Get custom credentials if they exist
        let validUsername = 'admin';
        let validPassword = 'admin123';

        const adminCredentials = localStorage.getItem('adminCredentials');
        if (adminCredentials) {
            const credentials = JSON.parse(adminCredentials);
            validUsername = credentials.username;
            validPassword = credentials.password;
        }

        // Client-side authentication
        if (username === validUsername && password === validPassword) {
            // Store login state in localStorage
            localStorage.setItem('adminLoggedIn', 'true');

            // Redirect to dashboard
            window.location.href = 'admin/dashboard.html';
        } else {
            // Show error message
            document.getElementById('admin-login-error').style.display = 'block';

            // Clear password field
            document.getElementById('admin-password').value = '';
        }
    });
}

// No visible admin link in the footer for security
function addAdminLinkToFooter() {
    // We're not adding any visible admin link for security reasons
    // Admin access is only available through keyboard shortcut (Ctrl+Shift+A)
    // or direct URL access (?admin=login)
    console.log('Admin access secured - use Ctrl+Shift+A to access');
}

// Show login popup
function showLoginPopup() {
    // If already logged in, redirect to admin dashboard
    if (localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin/dashboard.html';
        return;
    }

    // Show overlay and popup
    document.getElementById('admin-overlay').style.display = 'block';
    document.getElementById('admin-login-popup').style.display = 'block';

    // Focus on username field
    setTimeout(() => {
        document.getElementById('admin-username').focus();
    }, 100);
}

// Close login popup
function closeLoginPopup() {
    document.getElementById('admin-overlay').style.display = 'none';
    document.getElementById('admin-login-popup').style.display = 'none';

    // Clear form
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-login-error').style.display = 'none';
}

// Check if there's a login redirect
function checkLoginRedirect() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const loginRedirect = urlParams.get('admin');

    // If login redirect parameter exists and user is not logged in
    if (loginRedirect === 'login' && !localStorage.getItem('adminLoggedIn')) {
        // Show login popup
        showLoginPopup();
    }
}

// Add keyboard shortcut for admin access (Ctrl+Shift+A)
function addKeyboardShortcut() {
    // Check if keyboard shortcut is enabled in settings
    const advancedSettings = localStorage.getItem('advancedSettings');
    if (advancedSettings) {
        const settings = JSON.parse(advancedSettings);
        if (settings.enableKeyboardShortcut === false) {
            return; // Keyboard shortcut is disabled
        }
    }

    document.addEventListener('keydown', function(e) {
        // Check for Ctrl+Shift+A (simpler combination that's easier to remember)
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
            e.preventDefault(); // Prevent default browser behavior
            showLoginPopup();
        }
    });
}

// Get unread message count
function getUnreadMessageCount() {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('contactMessages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];

    // Count unread messages
    const unreadCount = messages.filter(message => !message.read).length;

    return unreadCount;
}

// Update notification badge on admin button
function updateNotificationBadge() {
    const unreadCount = getUnreadMessageCount();
    const adminButton = document.getElementById('admin-button');

    if (!adminButton) return;

    // If there are unread messages, show notification badge
    if (unreadCount > 0) {
        // Create or update badge
        let badge = document.querySelector('.admin-notification-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'admin-notification-badge';
            adminButton.appendChild(badge);
        }

        // Update count
        badge.textContent = unreadCount;
    } else {
        // Remove badge if no unread messages
        const badge = document.querySelector('.admin-notification-badge');
        if (badge) {
            badge.remove();
        }
    }
}

// Check for new messages periodically
setInterval(updateNotificationBadge, 5000); // Check every 5 seconds

// Add double-click handler for the bottom-right corner
function addCornerClickHandler() {
    // Check if corner click is enabled in settings
    const advancedSettings = localStorage.getItem('advancedSettings');
    if (advancedSettings) {
        const settings = JSON.parse(advancedSettings);
        if (settings.enableCornerClick === false) {
            return; // Corner click is disabled
        }
    }

    // Create an invisible clickable area in the bottom-right corner
    const cornerArea = document.createElement('div');
    cornerArea.style.position = 'fixed';
    cornerArea.style.bottom = '0';
    cornerArea.style.right = '0';
    cornerArea.style.width = '100px';
    cornerArea.style.height = '100px';
    cornerArea.style.zIndex = '998'; // Below the admin button
    cornerArea.style.cursor = 'default'; // Default cursor so it doesn't look clickable

    document.body.appendChild(cornerArea);

    // Track clicks for double-click detection
    let clickCount = 0;
    let clickTimer = null;

    cornerArea.addEventListener('click', function(e) {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                // Single click - reset
                clickCount = 0;
            }, 300); // 300ms timeout for double-click
        } else if (clickCount === 2) {
            // Double click - open admin login popup directly
            clearTimeout(clickTimer);
            clickCount = 0;

            // Open the login popup directly
            showLoginPopup();
        }
    });
}

// Add URL hash handler for #admin
function addHashHandler() {
    // Check if hash access is enabled in settings
    const advancedSettings = localStorage.getItem('advancedSettings');
    if (advancedSettings) {
        const settings = JSON.parse(advancedSettings);
        if (settings.enableHashAccess === false) {
            return; // Hash access is disabled
        }
    }

    // Check if URL has #admin hash
    if (window.location.hash === '#admin') {
        // Open the login popup directly
        setTimeout(() => {
            showLoginPopup();
        }, 500);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#admin') {
            // Open the login popup directly
            showLoginPopup();
        }
    });
}
