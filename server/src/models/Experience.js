import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    companyLogo: {
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
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ endDate: -1 });
experienceSchema.index({ isCurrent: 1 });
experienceSchema.index({ order: 1 });
addCommonIndexes(experienceSchema);

// Add common methods
addCommonMethods(experienceSchema);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
