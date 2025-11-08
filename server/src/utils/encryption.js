import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text in format: iv:encryptedData
 */
const encrypt = (text) => {
  if (!text) return null;
  
  try {
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 * @param {string} text - Encrypted text in format: iv:encryptedData
 * @returns {string} Decrypted text
 */
const decrypt = (text) => {
  if (!text) return null;
  
  try {
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const parts = text.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

export {
  encrypt,
  decrypt,
};
