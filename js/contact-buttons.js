// Contact Buttons Switcher
document.addEventListener('DOMContentLoaded', function() {
    // Get all contact buttons
    const contactButtons = [
        document.getElementById('contact-btn-1'),
        document.getElementById('contact-btn-2'),
        document.getElementById('contact-btn-3'),
        document.getElementById('contact-btn-4'),
        document.getElementById('contact-btn-5')
    ];
    
    // Current button index
    let currentButtonIndex = 0;
    
    // Function to switch to the next button style
    function switchButtonStyle() {
        // Hide current button
        contactButtons[currentButtonIndex].style.display = 'none';
        
        // Move to next button (or back to first)
        currentButtonIndex = (currentButtonIndex + 1) % contactButtons.length;
        
        // Show new button
        contactButtons[currentButtonIndex].style.display = 'flex';
    }
    
    // Add click event to each button to switch styles
    contactButtons.forEach(button => {
        if (button) {
            button.addEventListener('dblclick', function(e) {
                e.preventDefault(); // Prevent the default action (opening WhatsApp)
                switchButtonStyle();
            });
        }
    });
    
    // Add keyboard shortcut (Ctrl+Shift+B) to switch button styles
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
            switchButtonStyle();
        }
    });
    
    // Show the first button style initially
    if (contactButtons[0]) {
        contactButtons[0].style.display = 'flex';
    }
    
    // Add a small floating indicator to show how to change styles
    const header = document.querySelector('.header');
    if (header) {
        const styleIndicator = document.createElement('div');
        styleIndicator.className = 'style-indicator';
        styleIndicator.innerHTML = 'Double-click to change button style';
        styleIndicator.style.position = 'absolute';
        styleIndicator.style.top = '80px';
        styleIndicator.style.right = '20px';
        styleIndicator.style.background = 'rgba(0,0,0,0.7)';
        styleIndicator.style.color = '#fff';
        styleIndicator.style.padding = '5px 10px';
        styleIndicator.style.borderRadius = '4px';
        styleIndicator.style.fontSize = '12px';
        styleIndicator.style.zIndex = '1000';
        styleIndicator.style.opacity = '0';
        styleIndicator.style.transition = 'opacity 0.3s ease';
        
        header.appendChild(styleIndicator);
        
        // Show the indicator when hovering over the contact button
        contactButtons.forEach(button => {
            if (button) {
                button.addEventListener('mouseenter', function() {
                    styleIndicator.style.opacity = '1';
                });
                
                button.addEventListener('mouseleave', function() {
                    styleIndicator.style.opacity = '0';
                });
            }
        });
        
        // Hide the indicator after 5 seconds
        setTimeout(function() {
            styleIndicator.style.opacity = '0';
        }, 5000);
    }
});
