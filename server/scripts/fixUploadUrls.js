import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Profile model
import Profile from '../src/models/Profile.js';

const fixUploadUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manasa-portfolio');
    console.log('✓ MongoDB Connected');

    // Get all profiles
    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profile(s)`);

    for (const profile of profiles) {
      let updated = false;

      // Fix profile photo URL
      if (profile.profilePhoto?.url) {
        const oldUrl = profile.profilePhoto.url;
        // Check if URL doesn't already have subdirectory
        if (oldUrl.startsWith('/uploads/') && !oldUrl.includes('/uploads/profile/')) {
          const filename = oldUrl.replace('/uploads/', '');
          const filePath = path.join(__dirname, '../uploads/profile', filename);
          
          // Check if file exists in profile subdirectory
          if (fs.existsSync(filePath)) {
            profile.profilePhoto.url = `/uploads/profile/${filename}`;
            updated = true;
            console.log(`✓ Fixed profile photo URL: ${oldUrl} -> ${profile.profilePhoto.url}`);
          }
        }
      }

      // Fix resume URL
      if (profile.resume?.url) {
        const oldUrl = profile.resume.url;
        // Check if URL doesn't already have subdirectory
        if (oldUrl.startsWith('/uploads/') && !oldUrl.includes('/uploads/resume/')) {
          const filename = oldUrl.replace('/uploads/', '');
          const filePath = path.join(__dirname, '../uploads/resume', filename);
          
          // Check if file exists in resume subdirectory
          if (fs.existsSync(filePath)) {
            profile.resume.url = `/uploads/resume/${filename}`;
            updated = true;
            console.log(`✓ Fixed resume URL: ${oldUrl} -> ${profile.resume.url}`);
          }
        }
      }

      // Save if updated
      if (updated) {
        await profile.save();
        console.log(`✓ Profile updated for user: ${profile.userId}`);
      }
    }

    console.log('\n✅ Upload URLs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing upload URLs:', error);
    process.exit(1);
  }
};

fixUploadUrls();
