import { encrypt, decrypt } from './encryption.js';
import crypto from 'crypto';

/**
 * Generate a secure encryption key
 * @returns {string} 32-byte hex key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Encrypt sensitive configuration values
 * @param {Object} config - Configuration object
 * @param {Array<string>} sensitiveFields - Fields to encrypt
 * @returns {Object} Configuration with encrypted fields
 */
export const encryptConfig = (config, sensitiveFields = []) => {
  const encryptedConfig = { ...config };
  
  for (const field of sensitiveFields) {
    if (encryptedConfig[field]) {
      try {
        encryptedConfig[field] = encrypt(encryptedConfig[field]);
        console.log(`✓ Encrypted field: ${field}`);
      } catch (error) {
        console.error(`✗ Failed to encrypt field: ${field}`, error.message);
      }
    }
  }
  
  return encryptedConfig;
};

/**
 * Decrypt sensitive configuration values
 * @param {Object} config - Configuration object with encrypted fields
 * @param {Array<string>} sensitiveFields - Fields to decrypt
 * @returns {Object} Configuration with decrypted fields
 */
export const decryptConfig = (config, sensitiveFields = []) => {
  const decryptedConfig = { ...config };
  
  for (const field of sensitiveFields) {
    if (decryptedConfig[field]) {
      try {
        // Check if the value is encrypted (contains ':' separator)
        if (decryptedConfig[field].includes(':')) {
          decryptedConfig[field] = decrypt(decryptedConfig[field]);
        }
      } catch (error) {
        console.error(`Failed to decrypt field: ${field}`, error.message);
        // Keep original value if decryption fails
      }
    }
  }
  
  return decryptedConfig;
};

/**
 * Validate encryption key format
 * @param {string} key - Encryption key to validate
 * @returns {boolean} True if key is valid
 */
export const validateEncryptionKey = (key) => {
  if (!key) {
    console.error('Encryption key is not set');
    return false;
  }
  
  // Check if key is 64 hex characters (32 bytes)
  if (!/^[0-9a-f]{64}$/i.test(key)) {
    console.error('Encryption key must be 64 hexadecimal characters (32 bytes)');
    return false;
  }
  
  return true;
};

/**
 * Check if a value is encrypted
 * @param {string} value - Value to check
 * @returns {boolean} True if value appears to be encrypted
 */
export const isEncrypted = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  // Encrypted values have format: iv:encryptedData (both hex strings)
  const parts = value.split(':');
  if (parts.length !== 2) {
    return false;
  }
  
  // Check if both parts are valid hex strings
  return /^[0-9a-f]+$/i.test(parts[0]) && /^[0-9a-f]+$/i.test(parts[1]);
};

/**
 * Securely store sensitive data with encryption
 * @param {string} data - Data to encrypt and store
 * @returns {string} Encrypted data
 */
export const secureStore = (data) => {
  if (!data) {
    throw new Error('No data provided for encryption');
  }
  
  return encrypt(data);
};

/**
 * Retrieve and decrypt sensitive data
 * @param {string} encryptedData - Encrypted data to retrieve
 * @returns {string} Decrypted data
 */
export const secureRetrieve = (encryptedData) => {
  if (!encryptedData) {
    throw new Error('No encrypted data provided');
  }
  
  if (!isEncrypted(encryptedData)) {
    console.warn('Data does not appear to be encrypted, returning as-is');
    return encryptedData;
  }
  
  return decrypt(encryptedData);
};

/**
 * Mask sensitive data for logging
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of characters to show at start and end
 * @returns {string} Masked data
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars * 2) {
    return '***';
  }
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const masked = '*'.repeat(Math.max(data.length - visibleChars * 2, 3));
  
  return `${start}${masked}${end}`;
};

export default {
  generateEncryptionKey,
  encryptConfig,
  decryptConfig,
  validateEncryptionKey,
  isEncrypted,
  secureStore,
  secureRetrieve,
  maskSensitiveData,
};
