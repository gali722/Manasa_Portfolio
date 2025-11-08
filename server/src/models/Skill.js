import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency level is required'],
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 50,
    },
    icon: {
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
skillSchema.index({ category: 1 });
skillSchema.index({ order: 1 });
skillSchema.index({ isVisible: 1 });
addCommonIndexes(skillSchema);

// Add common methods
addCommonMethods(skillSchema);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
