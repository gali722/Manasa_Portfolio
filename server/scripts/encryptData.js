#!/usr/bin/env node

/**
 * CLI tool to encrypt sensitive data
 * Usage: node scripts/encryptData.js <data-to-encrypt>
 * Or: node scripts/encryptData.js --generate-key
 */

import { encrypt } from '../src/utils/encryption.js';
import { generateEncryptionKey, validateEncryptionKey, maskSensitiveData } from '../src/utils/configEncryption.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const args = process.argv.slice(2);

// Display help
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Encryption Utility
==================

Usage:
  node scripts/encryptData.js <data-to-encrypt>
  node scripts/encryptData.js --generate-key
  node scripts/encryptData.js --encrypt-email-password

Options:
  --generate-key              Generate a new encryption key
  --encrypt-email-password    Encrypt the email app password from .env
  --help, -h                  Show this help message

Examples:
  # Generate a new encryption key
  node scripts/encryptData.js --generate-key

  # Encrypt a value
  node scripts/encryptData.js "my-secret-password"

  # Encrypt email password from .env
  node scripts/encryptData.js --encrypt-email-password

Environment Variables:
  ENCRYPTION_KEY              Required: 64-character hex string (32 bytes)
  EMAIL_APP_PASSWORD          Email password to encrypt (for --encrypt-email-password)
  `);
  process.exit(0);
}

// Generate encryption key
if (args.includes('--generate-key')) {
  const key = generateEncryptionKey();
  console.log('\n✓ Generated new encryption key:');
  console.log(`\nENCRYPTION_KEY=${key}\n`);
  console.log('⚠️  IMPORTANT: Save this key securely in your .env file!');
  console.log('⚠️  Do not commit this key to version control!\n');
  process.exit(0);
}

// Validate encryption key
const encryptionKey = process.env.ENCRYPTION_KEY;
if (!validateEncryptionKey(encryptionKey)) {
  console.error('\n✗ Invalid or missing ENCRYPTION_KEY in .env file');
  console.error('  Run: node scripts/encryptData.js --generate-key\n');
  process.exit(1);
}

// Encrypt email password
if (args.includes('--encrypt-email-password')) {
  const emailPassword = process.env.EMAIL_APP_PASSWORD;
  
  if (!emailPassword) {
    console.error('\n✗ EMAIL_APP_PASSWORD not found in .env file\n');
    process.exit(1);
  }
  
  // Remove spaces from Gmail app password
  const cleanPassword = emailPassword.replace(/\s+/g, '');
  
  try {
    const encrypted = encrypt(cleanPassword);
    console.log('\n✓ Email password encrypted successfully:');
    console.log(`\nEMAIL_APP_PASSWORD=${encrypted}\n`);
    console.log('Original (masked):', maskSensitiveData(cleanPassword));
    console.log('\n⚠️  Replace EMAIL_APP_PASSWORD in your .env file with the encrypted value above\n');
  } catch (error) {
    console.error('\n✗ Encryption failed:', error.message, '\n');
    process.exit(1);
  }
  
  process.exit(0);
}

// Encrypt provided data
const dataToEncrypt = args[0];

if (!dataToEncrypt) {
  console.error('\n✗ No data provided to encrypt\n');
  console.error('Usage: node scripts/encryptData.js <data-to-encrypt>\n');
  process.exit(1);
}

try {
  const encrypted = encrypt(dataToEncrypt);
  console.log('\n✓ Data encrypted successfully:');
  console.log(`\n${encrypted}\n`);
  console.log('Original (masked):', maskSensitiveData(dataToEncrypt));
  console.log('\n⚠️  Store this encrypted value securely\n');
} catch (error) {
  console.error('\n✗ Encryption failed:', error.message, '\n');
  process.exit(1);
}
