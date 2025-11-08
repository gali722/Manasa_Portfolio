import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import Skill from '../src/models/Skill.js';
import Project from '../src/models/Project.js';
import Experience from '../src/models/Experience.js';
import Education from '../src/models/Education.js';
import Testimonial from '../src/models/Testimonial.js';
import Profile from '../src/models/Profile.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected\n');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const debugData = async () => {
  await connectDB();

  console.log('=== DATA DEBUG ===\n');

  const skills = await Skill.find();
  console.log(`Skills: ${skills.length} total`);
  console.log(`  - Visible: ${skills.filter(s => s.isVisible).length}`);
  console.log(`  - Hidden: ${skills.filter(s => !s.isVisible).length}\n`);

  const projects = await Project.find();
  console.log(`Projects: ${projects.length} total`);
  console.log(`  - Published: ${projects.filter(p => p.status === 'published').length}`);
  console.log(`  - Draft: ${projects.filter(p => p.status === 'draft').length}\n`);

  const experience = await Experience.find();
  console.log(`Experience: ${experience.length} total\n`);

  const education = await Education.find();
  console.log(`Education: ${education.length} total\n`);

  const testimonials = await Testimonial.find();
  console.log(`Testimonials: ${testimonials.length} total`);
  console.log(`  - Visible: ${testimonials.filter(t => t.isVisible).length}`);
  console.log(`  - Hidden: ${testimonials.filter(t => !t.isVisible).length}\n`);

  const profiles = await Profile.find();
  console.log(`Profiles: ${profiles.length} total\n`);

  if (profiles.length > 0) {
    console.log('Profile Data:');
    console.log(`  - Full Name: ${profiles[0].fullName}`);
    console.log(`  - Email: ${profiles[0].email}`);
    console.log(`  - Summary: ${profiles[0].summary ? 'Present' : 'Missing'}\n`);
  }

  process.exit(0);
};

debugData();
