import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import Skill from '../src/models/Skill.js';
import Project from '../src/models/Project.js';
import Testimonial from '../src/models/Testimonial.js';

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
 * Fix visibility for all items
 */
const fixVisibility = async () => {
  try {
    console.log('\n🔧 Fixing visibility settings...\n');

    await connectDB();

    // Update all skills to be visible
    const skillsResult = await Skill.updateMany(
      {},
      { $set: { isVisible: true } }
    );
    console.log(`✓ Updated ${skillsResult.modifiedCount} skills to be visible`);

    // Update all testimonials to be visible
    const testimonialsResult = await Testimonial.updateMany(
      {},
      { $set: { isVisible: true } }
    );
    console.log(`✓ Updated ${testimonialsResult.modifiedCount} testimonials to be visible`);

    // Update all projects to be published
    const projectsResult = await Project.updateMany(
      {},
      { $set: { status: 'published' } }
    );
    console.log(`✓ Updated ${projectsResult.modifiedCount} projects to published status`);

    console.log('\n✅ Visibility settings fixed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error fixing visibility:', error);
    process.exit(1);
  }
};

fixVisibility();
