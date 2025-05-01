// Serverless function to send WhatsApp messages
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { name, email, message } = data;

    // Validate the data
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Format the message for WhatsApp
    const formattedMessage = `New Contact Form Message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // In a real implementation, you would use a WhatsApp Business API or a service like Twilio
    // to send the message to your WhatsApp number
    
    // For demonstration purposes, we'll simulate a successful API call
    console.log('Sending WhatsApp message:', {
      to: '917076529970',
      message: formattedMessage
    });

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent to WhatsApp successfully!' 
      })
    };
  } catch (error) {
    // Log the error
    console.error('Error sending WhatsApp message:', error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send message', 
        details: error.message 
      })
    };
  }
};
