/**
 * Base email styles
 */
const baseStyles = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #2563EB;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin: 15px 0;
      color: #555;
    }
    .message-box {
      background-color: #f9fafb;
      border-left: 4px solid #2563EB;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-row {
      margin: 10px 0;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
      display: inline-block;
      min-width: 100px;
    }
    .info-value {
      color: #6b7280;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563EB;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 500;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
    }
    .contact-info {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .contact-info p {
      margin: 5px 0;
      font-size: 14px;
    }
    .timestamp {
      color: #9ca3af;
      font-size: 14px;
      font-style: italic;
    }
  </style>
`;

/**
 * Replace template variables with actual values
 * @param {string} template - Template string
 * @param {Object} variables - Variables to replace
 * @returns {string} Rendered template
 */
const renderTemplate = (template, variables) => {
  let rendered = template;
  
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, variables[key] || '');
  });
  
  return rendered;
};

/**
 * Contact form notification email template (to admin)
 * @param {Object} data - Email data
 * @param {string} data.name - Sender name
 * @param {string} data.email - Sender email
 * @param {string} data.subject - Message subject
 * @param {string} data.message - Message content
 * @param {string} data.timestamp - Submission timestamp
 * @returns {string} HTML email template
 */
const contactFormNotification = (data) => {
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <h2>You have a new message from your portfolio!</h2>
            
            <div class="info-row">
              <span class="info-label">From:</span>
              <span class="info-value">{{name}}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{email}}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Subject:</span>
              <span class="info-value">{{subject}}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Submitted:</span>
              <span class="info-value timestamp">{{timestamp}}</span>
            </div>
            
            <h3 style="color: #374151; margin-top: 25px; margin-bottom: 10px;">Message:</h3>
            <div class="message-box">
              {{message}}
            </div>
            
            <a href="mailto:{{email}}?subject=Re: {{subject}}" class="button">
              Reply to {{name}}
            </a>
          </div>
          <div class="footer">
            <p>This email was sent from your portfolio contact form.</p>
            <p>Portfolio: <a href="{{siteUrl}}">{{siteUrl}}</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return renderTemplate(template, {
    name: data.name,
    email: data.email,
    subject: data.subject || 'No subject',
    message: data.message.replace(/\n/g, '<br>'),
    timestamp: data.timestamp,
    siteUrl: process.env.FRONTEND_URL || 'https://manasagali.com',
  });
};

/**
 * Contact form confirmation email template (to visitor)
 * @param {Object} data - Email data
 * @param {string} data.name - Visitor name
 * @param {string} data.message - Original message
 * @returns {string} HTML email template
 */
const contactFormConfirmation = (data) => {
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Message</title>
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Thank You for Reaching Out!</h1>
          </div>
          <div class="content">
            <h2>Hi {{name}},</h2>
            
            <p>
              Thank you for reaching out through my portfolio. I have received your message 
              and will get back to you within <strong>24-48 hours</strong>.
            </p>
            
            <p>
              I appreciate your interest and look forward to connecting with you soon!
            </p>
            
            <h3 style="color: #374151; margin-top: 25px; margin-bottom: 10px;">Your message:</h3>
            <div class="message-box">
              {{message}}
            </div>
            
            <div class="contact-info">
              <p style="margin-bottom: 15px;"><strong>Best regards,</strong><br>Manasa Gali</p>
              <p><strong>Email:</strong> {{adminEmail}}</p>
              <p><strong>LinkedIn:</strong> <a href="{{linkedinUrl}}">Connect with me</a></p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated confirmation email.</p>
            <p>Portfolio: <a href="{{siteUrl}}">{{siteUrl}}</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return renderTemplate(template, {
    name: data.name,
    message: data.message.replace(/\n/g, '<br>'),
    adminEmail: process.env.EMAIL_USER || 'galimanasa3@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/manasagali',
    siteUrl: process.env.FRONTEND_URL || 'https://manasagali.com',
  });
};

export {
  contactFormNotification,
  contactFormConfirmation,
  renderTemplate,
};
