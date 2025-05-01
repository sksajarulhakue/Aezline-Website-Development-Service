# WhatsApp Integration for Contact Form

This document explains how to set up the WhatsApp integration for the contact form on the Aezline website.

## Overview

The contact form is designed to send messages directly to your WhatsApp without requiring the client to open WhatsApp. When a client submits the form, they see a success message on the website, while you receive the message on your WhatsApp.

## Setup Instructions

### Option 1: Using Netlify Functions (Recommended)

1. **Deploy to Netlify**:
   - Sign up for a Netlify account if you don't have one: https://app.netlify.com/signup
   - Connect your GitHub repository to Netlify
   - Deploy your website to Netlify

2. **Set up WhatsApp Business API**:
   - Sign up for WhatsApp Business API: https://www.whatsapp.com/business/api
   - Follow their instructions to get API credentials
   - Note your API key and phone number

3. **Update the Serverless Function**:
   - Open `functions/send-whatsapp.js`
   - Replace the placeholder code with actual WhatsApp API integration
   - Add your WhatsApp Business API credentials

4. **Enable the Form**:
   - Uncomment the fetch API code in `js/whatsapp-form.js`
   - Update the API URL to point to your deployed Netlify function

### Option 2: Using a Third-Party Service

If you prefer not to use Netlify Functions, you can use a third-party service like Twilio or MessageBird:

1. **Sign up for Twilio**:
   - Create an account at https://www.twilio.com/
   - Set up WhatsApp messaging in your Twilio account
   - Get your Account SID, Auth Token, and WhatsApp-enabled phone number

2. **Create a Twilio Function**:
   - Set up a Twilio Function to handle the form submission
   - Configure it to send WhatsApp messages to your number

3. **Update the Form Handler**:
   - Modify `js/whatsapp-form.js` to call your Twilio Function
   - Add your Twilio credentials (securely)

### Option 3: Using a No-Code Solution

For a simpler setup without coding:

1. **Use IFTTT or Zapier**:
   - Create an account on IFTTT (https://ifttt.com/) or Zapier (https://zapier.com/)
   - Create a webhook that sends WhatsApp messages
   - Connect your form to the webhook

2. **Update the Form Handler**:
   - Modify `js/whatsapp-form.js` to call your webhook URL
   - Configure the data format according to your webhook requirements

## Testing

After setting up the integration, test the form by:

1. Fill out the form with test data
2. Submit the form
3. Verify that you receive the message on your WhatsApp
4. Check that the client sees the success message

## Troubleshooting

If messages are not being received:

1. Check your API credentials
2. Verify that your WhatsApp number is correctly configured
3. Look for errors in the browser console
4. Check the Netlify Function logs (if using Option 1)

## Support

For assistance with setting up the WhatsApp integration, contact:

- Email: support@aezline.com
- WhatsApp: +91 7076529970
