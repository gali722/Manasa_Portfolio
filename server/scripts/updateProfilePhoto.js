import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import Profile from '../src/models/Profile.js';

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

/**
 * Update profile photo
 */
const updateProfilePhoto = async () => {
  try {
    console.log('\n📸 Updating profile photo...\n');

    await connectDB();

    // Find the profile (there should only be one)
    const profile = await Profile.findOne();

    if (!profile) {
      console.error('✗ No profile found in database');
      process.exit(1);
    }

    // Update profile photo
    profile.profilePhoto = {
      url: '/images/Manasa_Photo.jpeg',
      uploadedAt: new Date(),
    };

    await profile.save();

    console.log('✓ Profile photo updated successfully!');
    console.log(`  Photo URL: ${profile.profilePhoto.url}`);
    console.log(`  Profile: ${profile.fullName}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating profile photo:', error.message);
    process.exit(1);
  }
};

// Run update
updateProfilePhoto();
