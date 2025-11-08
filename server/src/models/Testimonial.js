import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const testimonialSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    authorTitle: {
      type: String,
      required: [true, 'Author title is required'],
      trim: true,
    },
    authorCompany: {
      type: String,
      trim: true,
    },
    authorPhoto: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  baseSchemaOptions
);

// Add indexes
testimonialSchema.index({ order: 1 });
testimonialSchema.index({ isVisible: 1 });
addCommonIndexes(testimonialSchema);

// Add common methods
addCommonMethods(testimonialSchema);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
