// Client WhatsApp Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get the WhatsApp form and elements
    const whatsappForm = document.getElementById('direct-whatsapp-form');
    const formStatus = document.getElementById('form-status');
    const fallbackDiv = document.getElementById('whatsapp-fallback');
    const fallbackLink = document.getElementById('fallback-link');

    // Handle form submission
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Get form data
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate form data
            if (!name || !phone || !email || !message) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill in all fields.';
                    formStatus.className = 'form-status error';
                }
                return;
            }

            // Validate phone number format (basic validation)
            const phoneRegex = /^[+]?[0-9\s-()]{8,20}$/;
            if (!phoneRegex.test(phone)) {
                if (formStatus) {
                    formStatus.textContent = 'Please enter a valid phone number.';
                    formStatus.className = 'form-status error';
                }
                return;
            }

            // Show sending status
            if (formStatus) {
                formStatus.textContent = 'Opening WhatsApp...';
                formStatus.className = 'form-status success';
            }

            // Format the message for WhatsApp
            const formattedMessage = `Hello, I'm ${name}.\n\nEmail: ${email}\nPhone: ${phone}\n\n${message}`;

            // Create the WhatsApp URL with your number and the formatted message
            const whatsappURL = `https://wa.me/917076529970?text=${encodeURIComponent(formattedMessage)}`;

            // Set up fallback link
            if (fallbackLink) {
                fallbackLink.href = whatsappURL;
            }

            // Open WhatsApp in a new tab
            window.open(whatsappURL, '_blank');

            // Show success message
            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = 'WhatsApp opened successfully! Please send your message.';
                }

                // Reset the form
                whatsappForm.reset();

                // Show fallback if needed
                if (fallbackDiv && !navigator.onLine) {
                    fallbackDiv.style.display = 'block';

                    if (formStatus) {
                        formStatus.textContent = 'If WhatsApp didn\'t open, please use the button below:';
                    }
                }
            }, 1000);
        });
    }
});
