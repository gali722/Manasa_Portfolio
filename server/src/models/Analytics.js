import mongoose from 'mongoose';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
    },
    pageViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
      min: 0,
    },
    sections: {
      about: {
        type: Number,
        default: 0,
        min: 0,
      },
      skills: {
        type: Number,
        default: 0,
        min: 0,
      },
      projects: {
        type: Number,
        default: 0,
        min: 0,
      },
      experience: {
        type: Number,
        default: 0,
        min: 0,
      },
      education: {
        type: Number,
        default: 0,
        min: 0,
      },
      testimonials: {
        type: Number,
        default: 0,
        min: 0,
      },
      contact: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    resumeDownloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    contactFormSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  baseSchemaOptions
);

// Add indexes
analyticsSchema.index({ date: -1 });
addCommonIndexes(analyticsSchema);

// Add common methods
addCommonMethods(analyticsSchema);

// Static method to get or create today's analytics
analyticsSchema.statics.getTodayAnalytics = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let analytics = await this.findOne({ date: today });

  if (!analytics) {
    analytics = await this.create({ date: today });
  }

  return analytics;
};

// Static method to increment a counter
analyticsSchema.statics.incrementCounter = async function (field, subfield = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updateField = subfield ? `${field}.${subfield}` : field;

  const analytics = await this.findOneAndUpdate(
    { date: today },
    { $inc: { [updateField]: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return analytics;
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
