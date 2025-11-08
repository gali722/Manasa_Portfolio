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
 * Seed data without clearing existing profile
 */
const seedCurrentData = async () => {
  try {
    console.log('\n🌱 Starting data seeding (preserving existing profile)...\n');

    await connectDB();
    
    // Get existing user and profile
    const existingUser = await User.findOne({ email: 'galimanasa3@gmail.com' });
    if (!existingUser) {
      console.error('✗ Admin user not found. Please run seedDatabase.js first.');
      process.exit(1);
    }
    console.log('✓ Found existing admin user');

    const existingProfile = await Profile.findOne({ userId: existingUser._id });
    if (!existingProfile) {
      console.error('✗ Profile not found. Please run seedDatabase.js first.');
      process.exit(1);
    }
    console.log('✓ Found existing profile');

    // Clear only the collections we want to reseed (not User or Profile)
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('✓ Cleared existing data (preserved profile)');

    // Seed Skills
    const skills = [
      // Programming & Analysis
      { name: 'Python', category: 'Programming', proficiency: 90, order: 1 },
      { name: 'SQL', category: 'Programming', proficiency: 95, order: 2 },
      { name: 'R', category: 'Programming', proficiency: 80, order: 3 },
      
      // BI Tools
      { name: 'Power BI', category: 'BI Tools', proficiency: 92, order: 4 },
      { name: 'Tableau', category: 'BI Tools', proficiency: 85, order: 5 },
      { name: 'Excel', category: 'BI Tools', proficiency: 95, order: 6 },
      { name: 'SSRS', category: 'BI Tools', proficiency: 88, order: 7 },
      
      // Databases
      { name: 'Snowflake', category: 'Databases', proficiency: 90, order: 8 },
      { name: 'PostgreSQL', category: 'Databases', proficiency: 88, order: 9 },
      { name: 'SQL Server', category: 'Databases', proficiency: 92, order: 10 },
      { name: 'MongoDB', category: 'Databases', proficiency: 75, order: 11 },
      
      // Data Analysis
      { name: 'Financial Analysis', category: 'Analysis', proficiency: 95, order: 12 },
      { name: 'Data Modeling', category: 'Analysis', proficiency: 90, order: 13 },
      { name: 'Statistical Analysis', category: 'Analysis', proficiency: 85, order: 14 },
      { name: 'Forecasting', category: 'Analysis', proficiency: 88, order: 15 },
      { name: 'Variance Analysis', category: 'Analysis', proficiency: 92, order: 16 },
      
      // Tools
      { name: 'Git', category: 'Tools', proficiency: 80, order: 17 },
      { name: 'Jira', category: 'Tools', proficiency: 85, order: 18 },
      { name: 'Azure DevOps', category: 'Tools', proficiency: 75, order: 19 },
    ];
    await Skill.insertMany(skills);
    console.log(`✓ ${skills.length} skills created`);

    // Seed Projects
    const projects = [
      {
        title: 'Financial Reporting Dashboard',
        shortDescription: 'Automated financial reporting system with real-time KPI tracking',
        fullDescription: `Developed comprehensive financial reporting dashboards using Power BI and SQL Server. 
        Automated monthly financial reports reducing manual effort by 70%. Implemented real-time KPI tracking 
        for revenue, expenses, and profitability metrics. Created interactive visualizations for executive 
        leadership enabling data-driven decision making.`,
        technologies: ['Power BI', 'SQL Server', 'DAX', 'Excel'],
        category: 'Financial Analysis',
        links: {},
        featured: true,
        status: 'published',
        order: 1,
      },
      {
        title: 'Sales Forecasting Model',
        shortDescription: 'Predictive analytics model for sales forecasting and trend analysis',
        fullDescription: `Built advanced sales forecasting model using Python and statistical methods. 
        Achieved 92% forecast accuracy through time series analysis and regression modeling. Integrated 
        model outputs into Power BI dashboards for business stakeholders. Reduced forecast variance by 35% 
        compared to previous manual methods.`,
        technologies: ['Python', 'Pandas', 'Scikit-learn', 'Power BI', 'SQL'],
        category: 'Predictive Analytics',
        links: {},
        featured: true,
        status: 'published',
        order: 2,
      },
      {
        title: 'Data Warehouse Migration',
        shortDescription: 'Migrated legacy data warehouse to Snowflake cloud platform',
        fullDescription: `Led migration of enterprise data warehouse from on-premise SQL Server to Snowflake. 
        Designed and implemented ETL pipelines for data consolidation. Optimized query performance resulting 
        in 60% faster report generation. Established data governance framework and documentation.`,
        technologies: ['Snowflake', 'SQL', 'Python', 'Azure', 'SSRS'],
        category: 'Data Engineering',
        links: {},
        featured: false,
        status: 'published',
        order: 3,
      },
      {
        title: 'Retail Analytics Platform',
        shortDescription: 'End-to-end analytics solution for retail performance tracking',
        fullDescription: `Created comprehensive retail analytics platform tracking store performance, 
        inventory levels, and customer behavior. Integrated data from multiple sources including POS systems, 
        inventory management, and customer databases. Delivered actionable insights leading to 15% improvement 
        in inventory turnover.`,
        technologies: ['Tableau', 'PostgreSQL', 'Python', 'Excel'],
        category: 'Retail Analytics',
        links: {},
        featured: false,
        status: 'published',
        order: 4,
      },
    ];
    await Project.insertMany(projects);
    console.log(`✓ ${projects.length} projects created`);

    // Seed Experience
    const experiences = [
      {
        company: 'Financial Services Corp',
        position: 'Financial Data Analyst',
        location: 'United States',
        startDate: new Date('2022-01-01'),
        endDate: null,
        isCurrent: true,
        description: 'Leading financial data analysis and reporting initiatives',
        responsibilities: [
          'Develop and maintain automated financial reports and dashboards using Power BI and SQL',
          'Perform variance analysis and forecasting for monthly financial planning',
          'Collaborate with finance teams to define KPIs and reporting requirements',
          'Optimize data models and queries for improved performance',
          'Create executive-level presentations and data visualizations',
        ],
        achievements: [
          'Reduced monthly reporting time by 70% through automation',
          'Improved forecast accuracy by 35% through advanced modeling techniques',
          'Implemented data quality checks reducing errors by 90%',
        ],
        technologies: ['Power BI', 'SQL Server', 'Excel', 'Python', 'SSRS'],
        order: 1,
      },
      {
        company: 'Retail Analytics Inc',
        position: 'Data Analyst',
        location: 'United States',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        isCurrent: false,
        description: 'Analyzed retail data and created insights for business optimization',
        responsibilities: [
          'Conducted data analysis to support merchandising and inventory decisions',
          'Created interactive dashboards for store performance tracking',
          'Performed customer segmentation and behavior analysis',
          'Developed SQL queries and stored procedures for data extraction',
        ],
        achievements: [
          'Identified cost-saving opportunities worth $200K annually',
          'Improved inventory turnover by 15% through data-driven recommendations',
          'Reduced dashboard load time by 50% through optimization',
        ],
        technologies: ['Tableau', 'PostgreSQL', 'Python', 'Excel'],
        order: 2,
      },
      {
        company: 'Tech Solutions LLC',
        position: 'Junior Data Analyst',
        location: 'United States',
        startDate: new Date('2019-01-01'),
        endDate: new Date('2020-05-31'),
        isCurrent: false,
        description: 'Supported data analysis and reporting activities',
        responsibilities: [
          'Assisted in creating reports and dashboards for various departments',
          'Performed data cleaning and validation',
          'Maintained documentation for data processes and reports',
          'Supported senior analysts with ad-hoc analysis requests',
        ],
        achievements: [
          'Automated 10+ manual reports saving 20 hours per month',
          'Improved data accuracy through systematic quality checks',
        ],
        technologies: ['Excel', 'SQL', 'Power BI'],
        order: 3,
      },
    ];
    await Experience.insertMany(experiences);
    console.log(`✓ ${experiences.length} experience entries created`);

    // Seed Education
    const education = [
      {
        institution: 'University of New Hampshire',
        degree: 'Master of Science',
        field: 'Data Analytics',
        location: 'New Hampshire, USA',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2023-05-31'),
        gpa: '3.8/4.0',
        coursework: [
          'Advanced Data Analytics',
          'Machine Learning',
          'Statistical Methods',
          'Business Intelligence',
          'Data Visualization',
        ],
        achievements: [
          'Dean\'s List',
          'Graduate Research Assistant',
        ],
        order: 1,
      },
      {
        institution: 'Osmania University',
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        location: 'Hyderabad, India',
        startDate: new Date('2015-08-01'),
        endDate: new Date('2019-05-31'),
        gpa: '3.6/4.0',
        coursework: [
          'Database Management Systems',
          'Data Structures and Algorithms',
          'Software Engineering',
          'Web Technologies',
        ],
        achievements: [
          'First Class with Distinction',
          'Department Topper in Database Systems',
        ],
        order: 2,
      },
    ];
    await Education.insertMany(education);
    console.log(`✓ ${education.length} education entries created`);

    // Seed Certifications
    const certifications = [
      {
        name: 'Microsoft Certified: Power BI Data Analyst Associate',
        issuer: 'Microsoft',
        issueDate: new Date('2023-03-15'),
        expiryDate: null,
        credentialId: 'MSFT-PBI-2023',
        verificationUrl: 'https://learn.microsoft.com/verify',
        order: 1,
      },
      {
        name: 'Snowflake SnowPro Core Certification',
        issuer: 'Snowflake',
        issueDate: new Date('2022-11-20'),
        expiryDate: new Date('2024-11-20'),
        credentialId: 'SNOW-CORE-2022',
        verificationUrl: 'https://www.snowflake.com/verify',
        order: 2,
      },
      {
        name: 'Tableau Desktop Specialist',
        issuer: 'Tableau',
        issueDate: new Date('2022-06-10'),
        expiryDate: null,
        credentialId: 'TAB-DS-2022',
        verificationUrl: 'https://www.tableau.com/verify',
        order: 3,
      },
      {
        name: 'SQL for Data Science',
        issuer: 'Coursera',
        issueDate: new Date('2021-08-05'),
        expiryDate: null,
        credentialId: 'COURSERA-SQL-2021',
        verificationUrl: 'https://www.coursera.org/verify',
        order: 4,
      },
    ];
    await Certification.insertMany(certifications);
    console.log(`✓ ${certifications.length} certifications created`);

    // Seed Testimonials
    const testimonials = [
      {
        authorName: 'Robert Anderson',
        authorTitle: 'Director of Finance',
        authorCompany: 'Financial Services Corp',
        content: `Manasa is an outstanding data analyst with exceptional technical skills and business acumen. 
        Her work on our financial reporting automation has transformed how we operate. She consistently delivers 
        high-quality insights that drive strategic decisions. Her ability to translate complex data into 
        actionable recommendations is truly impressive.`,
        linkedinUrl: 'https://linkedin.com/in/robertanderson',
        relationship: 'Manager',
        order: 1,
        isVisible: true,
      },
      {
        authorName: 'Jennifer Martinez',
        authorTitle: 'VP of Analytics',
        authorCompany: 'Retail Analytics Inc',
        content: `Working with Manasa was a pleasure. She has a rare combination of technical expertise and 
        communication skills. Her dashboards and analysis helped us make data-driven decisions that significantly 
        improved our business performance. She's detail-oriented, proactive, and always willing to go the extra mile.`,
        linkedinUrl: 'https://linkedin.com/in/jennifermartinez',
        relationship: 'Manager',
        order: 2,
        isVisible: true,
      },
      {
        authorName: 'David Chen',
        authorTitle: 'Senior Data Engineer',
        authorCompany: 'Financial Services Corp',
        content: `Manasa is a collaborative team player with strong analytical and problem-solving skills. 
        Her contributions to our data warehouse migration project were invaluable. She quickly learns new 
        technologies and applies them effectively. I highly recommend her for any data analytics role.`,
        linkedinUrl: 'https://linkedin.com/in/davidchen',
        relationship: 'Colleague',
        order: 3,
        isVisible: true,
      },
    ];
    await Testimonial.insertMany(testimonials);
    console.log(`✓ ${testimonials.length} testimonials created`);

    console.log('\n✅ Data seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Skills: ${skills.length}`);
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Experience: ${experiences.length}`);
    console.log(`   - Education: ${education.length}`);
    console.log(`   - Certifications: ${certifications.length}`);
    console.log(`   - Testimonials: ${testimonials.length}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Data seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run seeding
seedCurrentData();
