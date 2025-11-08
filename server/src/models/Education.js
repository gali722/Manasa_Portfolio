import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    field: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    gpa: {
      type: String,
      trim: true,
    },
    coursework: [
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
    institutionLogo: {
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
educationSchema.index({ endDate: -1 });
educationSchema.index({ order: 1 });
addCommonIndexes(educationSchema);

// Add common methods
addCommonMethods(educationSchema);

const Education = mongoose.model('Education', educationSchema);

export default Education;
