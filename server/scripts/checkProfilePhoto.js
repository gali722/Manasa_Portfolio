import mongoose from 'mongoose';
import Profile from '../src/models/Profile.js';
import dotenv from 'dotenv';

dotenv.config();

const checkProfilePhoto = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    const profile = await Profile.findOne();
    
    if (!profile) {
      console.log('No profile found in database');
      process.exit(0);
    }

    console.log('\n=== Profile Photo Information ===');
    console.log('Profile Photo:', JSON.stringify(profile.profilePhoto, null, 2));
    console.log('\n=== Full Profile Data ===');
    console.log(JSON.stringify(profile, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProfilePhoto();
