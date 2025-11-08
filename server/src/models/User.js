import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { baseSchemaOptions, addCommonMethods, addCommonIndexes } from './baseSchema.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  baseSchemaOptions
);

// Add indexes
userSchema.index({ email: 1 });
addCommonIndexes(userSchema);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Method to remove sensitive data
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

// Add common methods
addCommonMethods(userSchema);

const User = mongoose.model('User', userSchema);

export default User;
