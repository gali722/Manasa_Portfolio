import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    links: {
      live: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      demo: {
        type: String,
        trim: true,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  baseSchemaOptions
);

// Add indexes
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ order: 1 });
projectSchema.index({ title: 'text', shortDescription: 'text', fullDescription: 'text' });
addCommonIndexes(projectSchema);

// Add common methods
addCommonMethods(projectSchema);

const Project = mongoose.model('Project', projectSchema);

export default Project;
