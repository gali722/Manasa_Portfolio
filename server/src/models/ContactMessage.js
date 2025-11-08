import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
},
baseSchemaOptions
);

// Add common methods
addCommonMethods(contactMessageSchema);

// Index for querying by status and date
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });
addCommonIndexes(contactMessageSchema);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
