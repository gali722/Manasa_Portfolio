import mongoose from 'mongoose';

/**
 * Base schema options with timestamps
 */
export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

/**
 * Add common methods to schema
 */
export const addCommonMethods = (schema) => {
  // Add a method to get formatted timestamps
  schema.methods.getFormattedDates = function () {
    return {
      created: this.createdAt?.toISOString(),
      updated: this.updatedAt?.toISOString(),
    };
  };

  // Add a static method to find by ID with error handling
  schema.statics.findByIdOrFail = async function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const doc = await this.findById(id);
    if (!doc) {
      throw new Error(`${this.modelName} not found`);
    }
    return doc;
  };

  // Add a static method for paginated queries
  schema.statics.paginate = async function (query = {}, options = {}) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };

    const [results, total] = await Promise.all([
      this.find(query).sort(sort).skip(skip).limit(limit),
      this.countDocuments(query),
    ]);

    return {
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  };
};

/**
 * Create indexes for common fields
 */
export const addCommonIndexes = (schema) => {
  schema.index({ createdAt: -1 });
  schema.index({ updatedAt: -1 });
};
