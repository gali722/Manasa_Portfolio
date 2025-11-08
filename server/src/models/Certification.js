import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expiryDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    verificationUrl: {
      type: String,
      trim: true,
    },
    badge: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  baseSchemaOptions
);

// Add indexes
certificationSchema.index({ issueDate: -1 });
certificationSchema.index({ order: 1 });
addCommonIndexes(certificationSchema);

// Add common methods
addCommonMethods(certificationSchema);

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
