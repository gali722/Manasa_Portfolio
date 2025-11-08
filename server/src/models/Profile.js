import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
      uploadedAt: {
        type: Date,
      },
    },
    resume: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
      uploadedAt: {
        type: Date,
      },
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      medium: {
        type: String,
        trim: true,
      },
      stackoverflow: {
        type: String,
        trim: true,
      },
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  baseSchemaOptions
);

// Add indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ email: 1 });
addCommonIndexes(profileSchema);

// Add common methods
addCommonMethods(profileSchema);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
