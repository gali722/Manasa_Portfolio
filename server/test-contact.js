import dotenv from 'dotenv';
import { sendEmail, verifyEmailConfig } from './src/services/emailService.js';
import { contactFormNotification, contactFormConfirmation } from './src/templates/emailTemplates.js';

// Load environment variables
dotenv.config();

async function testEmailService() {
  console.log('Testing Email Service...\n');

  // Test 1: Verify email configuration
  console.log('1. Verifying email configuration...');
  const isValid = await verifyEmailConfig();
  if (isValid) {
    console.log('✓ Email configuration is valid\n');
  } else {
    console.log('✗ Email configuration is invalid\n');
    return;
  }

  // Test 2: Test email templates
  console.log('2. Testing email templates...');
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from the contact form.',
    timestamp: new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }),
  };

  const notificationHtml = contactFormNotification(testData);
  const confirmationHtml = contactFormConfirmation(testData);

  console.log('✓ Notification template generated');
  console.log('✓ Confirmation template generated\n');

  // Test 3: Send test email (optional - uncomment to actually send)
  /*
  console.log('3. Sending test email...');
  const result = await sendEmail({
    to: process.env.EMAIL_USER,
    subject: 'Test Email - Portfolio Contact Form',
    html: notificationHtml,
  });

  if (result.success) {
    console.log('✓ Test email sent successfully');
    console.log('Message ID:', result.messageId);
  } else {
    console.log('✗ Failed to send test email');
    console.log('Error:', result.error);
  }
  */

  console.log('\n✓ All tests completed successfully!');
}

testEmailService().catch(console.error);
