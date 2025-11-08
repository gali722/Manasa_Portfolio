import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import User from '../src/models/User.js';
import Profile from '../src/models/Profile.js';
import Skill from '../src/models/Skill.js';
import Project from '../src/models/Project.js';
import Experience from '../src/models/Experience.js';
import Education from '../src/models/Education.js';
import Certification from '../src/models/Certification.js';
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
 * Clear all collections
 */
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('✓ Database cleared');
  } catch (error) {
    console.error('✗ Error clearing database:', error.message);
    throw error;
  }
};

/**
 * Seed admin user
 */
const seedAdminUser = async () => {
  try {
    const adminUser = await User.create({
      email: 'galimanasa3@gmail.com',
      password: 'Admin@123', // Change this password after first login
      name: 'Manasa Gali',
      role: 'admin',
      isActive: true,
    });
    console.log('✓ Admin user created');
    console.log('  Email: galimanasa3@gmail.com');
    console.log('  Password: Admin@123 (CHANGE THIS AFTER FIRST LOGIN)');
    return adminUser;
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    throw error;
  }
};

/**
 * Seed profile data
 */
const seedProfile = async (userId) => {
  try {
    await Profile.create({
      userId,
      fullName: 'Manasa Gali',
      title: 'Data Analyst | Data Engineer | Business Analyst | Report Developer',
      summary: `Experienced data professional with expertise in data analysis, engineering, and business intelligence. 
      Passionate about transforming complex data into actionable insights and building scalable data solutions.`,
      email: 'galimanasa3@gmail.com',
      phone: '+1 (555) 123-4567',
      location: 'United States',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/manasagali',
        github: 'https://github.com/manasagali',
        twitter: 'https://twitter.com/manasagali',
      },
      yearsOfExperience: 5,
    });
    console.log('✓ Profile created');
  } catch (error) {
    console.error('✗ Error creating profile:', error.message);
    throw error;
  }
};

/**
 * Seed skills data
 */
const seedSkills = async () => {
  try {
    const skills = [
      // Data Analysis
      { name: 'Python', category: 'Data Analysis', proficiency: 90, order: 1 },
      { name: 'SQL', category: 'Data Analysis', proficiency: 95, order: 2 },
      { name: 'R', category: 'Data Analysis', proficiency: 80, order: 3 },
      { name: 'Excel', category: 'Data Analysis', proficiency: 90, order: 4 },
      { name: 'Tableau', category: 'Data Analysis', proficiency: 85, order: 5 },
      { name: 'Power BI', category: 'Data Analysis', proficiency: 88, order: 6 },
      
      // Data Engineering
      { name: 'Apache Spark', category: 'Data Engineering', proficiency: 85, order: 7 },
      { name: 'Apache Airflow', category: 'Data Engineering', proficiency: 80, order: 8 },
      { name: 'ETL/ELT', category: 'Data Engineering', proficiency: 90, order: 9 },
      { name: 'Data Warehousing', category: 'Data Engineering', proficiency: 85, order: 10 },
      
      // Databases
      { name: 'PostgreSQL', category: 'Databases', proficiency: 90, order: 11 },
      { name: 'MongoDB', category: 'Databases', proficiency: 85, order: 12 },
      { name: 'MySQL', category: 'Databases', proficiency: 88, order: 13 },
      { name: 'Snowflake', category: 'Databases', proficiency: 82, order: 14 },
      
      // Business Intelligence
      { name: 'Data Visualization', category: 'Business Intelligence', proficiency: 92, order: 15 },
      { name: 'Statistical Analysis', category: 'Business Intelligence', proficiency: 88, order: 16 },
      { name: 'Business Analytics', category: 'Business Intelligence', proficiency: 90, order: 17 },
      { name: 'KPI Development', category: 'Business Intelligence', proficiency: 85, order: 18 },
      
      // Tools & Technologies
      { name: 'Git', category: 'Tools', proficiency: 85, order: 19 },
      { name: 'Docker', category: 'Tools', proficiency: 75, order: 20 },
      { name: 'AWS', category: 'Tools', proficiency: 78, order: 21 },
      { name: 'Azure', category: 'Tools', proficiency: 75, order: 22 },
    ];

    await Skill.insertMany(skills);
    console.log(`✓ ${skills.length} skills created`);
  } catch (error) {
    console.error('✗ Error creating skills:', error.message);
    throw error;
  }
};

/**
 * Seed projects data
 */
const seedProjects = async () => {
  try {
    const projects = [
      {
        title: 'Sales Analytics Dashboard',
        shortDescription: 'Interactive dashboard for real-time sales performance tracking',
        fullDescription: `Developed a comprehensive sales analytics dashboard using Power BI and SQL Server. 
        The dashboard provides real-time insights into sales performance, customer behavior, and revenue trends. 
        Implemented automated data refresh and custom DAX measures for advanced analytics.`,
        technologies: ['Power BI', 'SQL Server', 'DAX', 'Python'],
        category: 'Data Analysis',
        links: {
          live: 'https://example.com/sales-dashboard',
          github: 'https://github.com/manasagali/sales-dashboard',
        },
        featured: true,
        status: 'published',
        order: 1,
      },
      {
        title: 'Customer Segmentation Analysis',
        shortDescription: 'Machine learning model for customer segmentation and targeting',
        fullDescription: `Built a customer segmentation model using K-means clustering and RFM analysis. 
        The project helped identify high-value customer segments and optimize marketing strategies. 
        Achieved 25% improvement in campaign conversion rates.`,
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'Tableau'],
        category: 'Data Analysis',
        links: {
          github: 'https://github.com/manasagali/customer-segmentation',
        },
        featured: true,
        status: 'published',
        order: 2,
      },
      {
        title: 'ETL Pipeline for E-commerce Data',
        shortDescription: 'Scalable ETL pipeline processing millions of transactions daily',
        fullDescription: `Designed and implemented an ETL pipeline using Apache Airflow and Python to process 
        e-commerce transaction data. The pipeline handles data extraction from multiple sources, transformation, 
        and loading into a data warehouse. Reduced data processing time by 60%.`,
        technologies: ['Apache Airflow', 'Python', 'PostgreSQL', 'AWS S3'],
        category: 'Data Engineering',
        links: {
          github: 'https://github.com/manasagali/etl-pipeline',
        },
        featured: false,
        status: 'published',
        order: 3,
      },
    ];

    await Project.insertMany(projects);
    console.log(`✓ ${projects.length} projects created`);
  } catch (error) {
    console.error('✗ Error creating projects:', error.message);
    throw error;
  }
};

/**
 * Seed experience data
 */
const seedExperience = async () => {
  try {
    const experiences = [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Data Analyst',
        location: 'New York, NY',
        startDate: new Date('2021-06-01'),
        endDate: null,
        isCurrent: true,
        description: 'Leading data analytics initiatives and business intelligence projects',
        responsibilities: [
          'Design and develop interactive dashboards using Power BI and Tableau',
          'Perform advanced statistical analysis to identify business trends',
          'Collaborate with stakeholders to define KPIs and metrics',
          'Mentor junior analysts and conduct training sessions',
        ],
        achievements: [
          'Reduced reporting time by 40% through automation',
          'Implemented predictive models that improved forecast accuracy by 25%',
        ],
        technologies: ['Python', 'SQL', 'Power BI', 'Tableau', 'Azure'],
        order: 1,
      },
      {
        company: 'Data Insights Corp.',
        position: 'Data Analyst',
        location: 'San Francisco, CA',
        startDate: new Date('2019-03-01'),
        endDate: new Date('2021-05-31'),
        isCurrent: false,
        description: 'Analyzed business data and created actionable insights',
        responsibilities: [
          'Conducted data analysis to support business decision-making',
          'Created and maintained SQL queries and stored procedures',
          'Developed automated reports and dashboards',
          'Performed data quality assessments and cleansing',
        ],
        achievements: [
          'Identified cost-saving opportunities worth $500K annually',
          'Improved data accuracy by 30% through quality initiatives',
        ],
        technologies: ['SQL', 'Python', 'Excel', 'Tableau'],
        order: 2,
      },
    ];

    await Experience.insertMany(experiences);
    console.log(`✓ ${experiences.length} experience entries created`);
  } catch (error) {
    console.error('✗ Error creating experience:', error.message);
    throw error;
  }
};

/**
 * Seed education data
 */
const seedEducation = async () => {
  try {
    const education = [
      {
        institution: 'University of Technology',
        degree: 'Master of Science',
        field: 'Data Science',
        location: 'Boston, MA',
        startDate: new Date('2017-09-01'),
        endDate: new Date('2019-05-31'),
        gpa: '3.9/4.0',
        coursework: [
          'Machine Learning',
          'Statistical Analysis',
          'Big Data Analytics',
          'Data Mining',
        ],
        achievements: [
          'Dean\'s List all semesters',
          'Graduate Research Assistant',
        ],
        order: 1,
      },
      {
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Chicago, IL',
        startDate: new Date('2013-09-01'),
        endDate: new Date('2017-05-31'),
        gpa: '3.7/4.0',
        coursework: [
          'Database Systems',
          'Algorithms',
          'Data Structures',
          'Software Engineering',
        ],
        achievements: [
          'Summa Cum Laude',
          'Computer Science Department Award',
        ],
        order: 2,
      },
    ];

    await Education.insertMany(education);
    console.log(`✓ ${education.length} education entries created`);
  } catch (error) {
    console.error('✗ Error creating education:', error.message);
    throw error;
  }
};

/**
 * Seed certifications data
 */
const seedCertifications = async () => {
  try {
    const certifications = [
      {
        name: 'AWS Certified Data Analytics - Specialty',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2022-08-15'),
        expiryDate: new Date('2025-08-15'),
        credentialId: 'AWS-DAS-12345',
        verificationUrl: 'https://aws.amazon.com/verification/AWS-DAS-12345',
        order: 1,
      },
      {
        name: 'Microsoft Certified: Azure Data Engineer Associate',
        issuer: 'Microsoft',
        issueDate: new Date('2022-03-20'),
        expiryDate: new Date('2024-03-20'),
        credentialId: 'MSFT-ADE-67890',
        verificationUrl: 'https://learn.microsoft.com/verify/MSFT-ADE-67890',
        order: 2,
      },
      {
        name: 'Tableau Desktop Specialist',
        issuer: 'Tableau',
        issueDate: new Date('2021-11-10'),
        expiryDate: null,
        credentialId: 'TAB-DS-54321',
        verificationUrl: 'https://www.tableau.com/verify/TAB-DS-54321',
        order: 3,
      },
    ];

    await Certification.insertMany(certifications);
    console.log(`✓ ${certifications.length} certifications created`);
  } catch (error) {
    console.error('✗ Error creating certifications:', error.message);
    throw error;
  }
};

/**
 * Seed testimonials data
 */
const seedTestimonials = async () => {
  try {
    const testimonials = [
      {
        authorName: 'John Smith',
        authorTitle: 'Director of Analytics',
        authorCompany: 'Tech Solutions Inc.',
        content: `Manasa is an exceptional data analyst with a keen eye for detail and a talent for 
        transforming complex data into actionable insights. Her work on our sales analytics dashboard 
        has been instrumental in driving business decisions.`,
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        relationship: 'Manager',
        order: 1,
        isVisible: true,
      },
      {
        authorName: 'Sarah Johnson',
        authorTitle: 'VP of Business Intelligence',
        authorCompany: 'Data Insights Corp.',
        content: `Working with Manasa was a pleasure. She consistently delivered high-quality analysis 
        and demonstrated strong problem-solving skills. Her ability to communicate technical concepts 
        to non-technical stakeholders is outstanding.`,
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
        relationship: 'Manager',
        order: 2,
        isVisible: true,
      },
      {
        authorName: 'Michael Chen',
        authorTitle: 'Senior Data Engineer',
        authorCompany: 'Tech Solutions Inc.',
        content: `Manasa is a collaborative team player with deep technical expertise. Her contributions 
        to our ETL pipeline project were invaluable, and she always brings innovative solutions to 
        challenging problems.`,
        linkedinUrl: 'https://linkedin.com/in/michaelchen',
        relationship: 'Colleague',
        order: 3,
        isVisible: true,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log(`✓ ${testimonials.length} testimonials created`);
  } catch (error) {
    console.error('✗ Error creating testimonials:', error.message);
    throw error;
  }
};

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data in order
    const adminUser = await seedAdminUser();
    await seedProfile(adminUser._id);
    await seedSkills();
    await seedProjects();
    await seedExperience();
    await seedEducation();
    await seedCertifications();
    await seedTestimonials();

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('⚠️  IMPORTANT: Change the admin password after first login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
