import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../services/emailService.js';
import {
  contactFormNotification,
  contactFormConfirmation,
} from '../templates/emailTemplates.js';

/**
 * Submit contact form
 * @route POST /api/public/contact
 * @access Public
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, email, and message are required',
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please provide a valid email address',
        },
      });
    }

    // Validate message length
    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MESSAGE_TOO_LONG',
          message: 'Message cannot exceed 2000 characters',
        },
      });
    }

    // Get client information
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create contact message record
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      ipAddress,
      userAgent,
    });

    // Prepare email data
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const emailData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp,
    };

    // Send notification email to admin
    const adminEmail = process.env.EMAIL_USER || 'galimanasa3@gmail.com';
    const notificationResult = await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission - ${name}`,
      html: contactFormNotification(emailData),
    });

    // Send confirmation email to visitor
    const confirmationResult = await sendEmail({
      to: email,
      subject: 'Thank you for reaching out - Manasa Gali',
      html: contactFormConfirmation(emailData),
    });

    // Update contact message with email status
    if (notificationResult.success || confirmationResult.success) {
      contactMessage.emailSent = true;
      contactMessage.emailSentAt = new Date();
      await contactMessage.save();
    }

    // Return success even if emails fail (message is saved)
    res.status(201).json({
      success: true,
      message:
        'Thank you for your message! I will get back to you within 24-48 hours.',
      data: {
        id: contactMessage._id,
        emailSent: notificationResult.success && confirmationResult.success,
      },
    });
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errors.join(', '),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to submit contact form. Please try again later.',
      },
    });
  }
};

/**
 * Get all contact messages (admin only)
 * @route GET /api/admin/contact
 * @access Private
 */
const getContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to retrieve contact messages',
      },
    });
  }
};

/**
 * Update contact message status (admin only)
 * @route PUT /api/admin/contact/:id
 * @access Private
 */
const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Status must be one of: new, read, replied',
        },
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact message not found',
        },
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Update contact message error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update contact message',
      },
    });
  }
};

/**
 * Delete contact message (admin only)
 * @route DELETE /api/admin/contact/:id
 * @access Private
 */
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact message not found',
        },
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete contact message',
      },
    });
  }
};

export {
  submitContactForm,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};
