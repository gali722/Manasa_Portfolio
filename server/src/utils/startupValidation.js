import { validateEncryptionKey } from './configEncryption.js';

/**
 * Validate required environment variables
 */
export const validateEnvironment = () => {
  const errors = [];
  const warnings = [];
  
  // Required variables
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
  ];
  
  for (const variable of required) {
    if (!process.env[variable]) {
      errors.push(`Missing required environment variable: ${variable}`);
    }
  }
  
  // Validate encryption key format
  if (process.env.ENCRYPTION_KEY && !validateEncryptionKey(process.env.ENCRYPTION_KEY)) {
    errors.push('ENCRYPTION_KEY must be 64 hexadecimal characters (32 bytes)');
    errors.push('Generate a key with: node scripts/encryptData.js --generate-key');
  }
  
  // Validate JWT secrets
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters for security');
  }
  
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    warnings.push('JWT_REFRESH_SECRET should be at least 32 characters for security');
  }
  
  // Email configuration (optional but recommended)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    warnings.push('Email configuration is not set - contact form will not work');
  }
  
  // Display results
  if (errors.length > 0) {
    console.error('\n❌ Environment Configuration Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\n');
    return false;
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('\n');
  }
  
  console.log('✓ Environment configuration validated successfully\n');
  return true;
};

/**
 * Validate security configuration
 */
export const validateSecurity = () => {
  const warnings = [];
  
  // Check if running in production
  if (process.env.NODE_ENV === 'production') {
    // Ensure HTTPS is configured
    if (!process.env.FORCE_HTTPS && !process.env.HTTPS) {
      warnings.push('HTTPS should be enabled in production');
    }
    
    // Check CORS origin
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*') {
      warnings.push('CORS_ORIGIN should be set to your frontend domain in production');
    }
    
    // Check if using default secrets
    if (process.env.JWT_SECRET === '1234567890' || 
        process.env.ENCRYPTION_KEY === '1234567890okjnbvfde45678ijnvcder5678ijhnbvcde45678ijhgfd') {
      warnings.push('Default secrets detected - generate new secrets for production!');
    }
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Security Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('\n');
  }
  
  return true;
};

/**
 * Run all startup validations
 */
export const runStartupValidations = () => {
  console.log('\n🔍 Running startup validations...\n');
  
  const envValid = validateEnvironment();
  if (!envValid) {
    console.error('❌ Startup validation failed - please fix environment configuration\n');
    process.exit(1);
  }
  
  validateSecurity();
  
  console.log('✓ All startup validations passed\n');
};

export default {
  validateEnvironment,
  validateSecurity,
  runStartupValidations,
};
