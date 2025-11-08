import path from 'path';
import { fileURLToPath } from 'url';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { fileExists, getMimeType } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @route   GET /api/files/:folder/:filename
 * @desc    Serve uploaded files
 * @access  Public
 */
export const serveFile = asyncHandler(async (req, res) => {
  const { folder, filename } = req.params;

  // Validate folder to prevent directory traversal
  const allowedFolders = [
    'profile',
    'resume',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
  ];

  if (!allowedFolders.includes(folder)) {
    throw new AppError('Invalid folder', 400, 'INVALID_FOLDER');
  }

  // Construct file path
  const filePath = path.join(__dirname, '../../uploads', folder, filename);

  // Check if file exists
  const exists = await fileExists(filePath);

  if (!exists) {
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }

  // Set appropriate headers
  const mimeType = getMimeType(filename);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

  // Send file
  res.sendFile(filePath);
});

/**
 * @route   GET /api/files/download/:folder/:filename
 * @desc    Download file with Content-Disposition header
 * @access  Public
 */
export const downloadFile = asyncHandler(async (req, res) => {
  const { folder, filename } = req.params;

  // Validate folder
  const allowedFolders = [
    'profile',
    'resume',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
  ];

  if (!allowedFolders.includes(folder)) {
    throw new AppError('Invalid folder', 400, 'INVALID_FOLDER');
  }

  // Construct file path
  const filePath = path.join(__dirname, '../../uploads', folder, filename);

  // Check if file exists
  const exists = await fileExists(filePath);

  if (!exists) {
    throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
  }

  // Set download headers
  const mimeType = getMimeType(filename);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Send file
  res.sendFile(filePath);
});
