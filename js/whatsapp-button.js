// WhatsApp Button Script
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing WhatsApp buttons with class 'whatsapp-theme'
    removeExistingWhatsAppButtons();

    // Create the new WhatsApp button
    createWhatsAppButton();
});

// Function to remove existing WhatsApp buttons
function removeExistingWhatsAppButtons() {
    // Find and remove any existing WhatsApp buttons in the footer
    const existingButtons = document.querySelectorAll('.whatsapp-theme');
    existingButtons.forEach(button => {
        button.remove();
    });
}

// Function to create WhatsApp floating button
function createWhatsAppButton() {
    // Create button element
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/917076529970';
    whatsappButton.target = '_blank';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';

    // Add the button to the document body
    document.body.appendChild(whatsappButton);
}
