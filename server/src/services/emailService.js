import nodemailer from 'nodemailer';
import { decrypt } from '../utils/encryption.js';

// Email queue for retry mechanism
const emailQueue = [];
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Create nodemailer transporter with Gmail configuration
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  let emailPassword = process.env.EMAIL_APP_PASSWORD;
  
  // Remove spaces from app password (Gmail app passwords don't have spaces)
  if (emailPassword) {
    emailPassword = emailPassword.replace(/\s+/g, '');
  }
  
  // Decrypt password if it's encrypted (starts with hex pattern)
  if (emailPassword && emailPassword.includes(':')) {
    try {
      emailPassword = decrypt(emailPassword);
    } catch (error) {
      console.error('Failed to decrypt email password, using as-is');
    }
  }
  
  if (!emailUser || !emailPassword) {
    throw new Error('Email credentials are not configured');
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
  
  return transporter;
};

/**
 * Send email with retry mechanism
 * @param {Object} mailOptions - Email options
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} Email send result
 */
const sendEmailWithRetry = async (mailOptions, retryCount = 0) => {
  const transporter = createTransporter();
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error(`Email send failed (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      
      // Add to queue for retry
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await sendEmailWithRetry(mailOptions, retryCount + 1);
          resolve(result);
        }, RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      });
    }
    
    return {
      success: false,
      error: error.message,
      retries: retryCount,
    };
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} Email send result
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const fromName = process.env.EMAIL_FROM_NAME || 'Manasa Gali';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER;
  
  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };
  
  return await sendEmailWithRetry(mailOptions);
};

/**
 * Verify email configuration
 * @returns {Promise<boolean>} True if configuration is valid
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error.message);
    return false;
  }
};

/**
 * Add email to queue for processing
 * @param {Object} emailData - Email data
 */
const queueEmail = (emailData) => {
  emailQueue.push({
    ...emailData,
    attempts: 0,
    createdAt: new Date(),
  });
};

/**
 * Process email queue
 */
const processEmailQueue = async () => {
  if (emailQueue.length === 0) return;
  
  const email = emailQueue[0];
  
  if (email.attempts >= MAX_RETRIES) {
    console.error('Max retries reached for email:', email);
    emailQueue.shift();
    return;
  }
  
  email.attempts++;
  
  const result = await sendEmail(email);
  
  if (result.success) {
    emailQueue.shift();
  } else {
    // Keep in queue for retry
    console.log(`Email will be retried. Attempts: ${email.attempts}/${MAX_RETRIES}`);
  }
};

// Process queue every 30 seconds
setInterval(processEmailQueue, 30000);

export {
  sendEmail,
  verifyEmailConfig,
  queueEmail,
  createTransporter,
};
