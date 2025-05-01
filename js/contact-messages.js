// Contact Form and Message History Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const messageHistory = document.getElementById('message-history');
    const noMessagesElement = document.querySelector('.no-messages');
    
    // Load messages from localStorage
    loadMessages();
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form data
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Create message object
            const newMessage = {
                id: Date.now(),
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Save message to localStorage
            saveMessage(newMessage);
            
            // Add message to the UI
            addMessageToUI(newMessage);
            
            // Show success message
            showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Hide no messages element if it's visible
            if (noMessagesElement) {
                noMessagesElement.style.display = 'none';
            }
        });
    }
    
    // Function to show form message
    function showFormMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = 'form-message-display ' + type;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Function to save message to localStorage
    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.unshift(message); // Add new message at the beginning
        
        // Keep only the last 10 messages
        if (messages.length > 10) {
            messages = messages.slice(0, 10);
        }
        
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
    
    // Function to load messages from localStorage
    function loadMessages() {
        if (messageHistory) {
            const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            
            // If there are messages, hide the no messages element
            if (messages.length > 0 && noMessagesElement) {
                noMessagesElement.style.display = 'none';
            }
            
            // Add messages to the UI
            messages.forEach(message => {
                addMessageToUI(message);
            });
        }
    }
    
    // Function to add message to the UI
    function addMessageToUI(message) {
        if (messageHistory) {
            // Create message element
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.dataset.id = message.id;
            
            // Format date
            const date = new Date(message.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Set message HTML
            messageElement.innerHTML = `
                <div class="message-header">
                    <div class="message-sender">${escapeHTML(message.name)}</div>
                    <div class="message-time">${formattedDate}</div>
                </div>
                <div class="message-content">${escapeHTML(message.message)}</div>
            `;
            
            // Add delete button for admin (could be expanded later)
            // const deleteButton = document.createElement('button');
            // deleteButton.className = 'message-delete';
            // deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            // deleteButton.addEventListener('click', () => deleteMessage(message.id));
            // messageElement.appendChild(deleteButton);
            
            // Insert at the beginning of the message history
            if (messageHistory.firstChild && messageHistory.firstChild.className === 'no-messages') {
                messageHistory.removeChild(messageHistory.firstChild);
            }
            
            messageHistory.insertBefore(messageElement, messageHistory.firstChild);
        }
    }
    
    // Function to delete message (for future admin functionality)
    function deleteMessage(id) {
        // Remove from UI
        const messageElement = document.querySelector(`.message-item[data-id="${id}"]`);
        if (messageElement) {
            messageHistory.removeChild(messageElement);
        }
        
        // Remove from localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages = messages.filter(message => message.id !== id);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show no messages element if there are no messages
        if (messages.length === 0 && noMessagesElement) {
            noMessagesElement.style.display = 'block';
        }
    }
    
    // Helper function to escape HTML
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
