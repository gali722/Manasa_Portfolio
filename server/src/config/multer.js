import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const createUploadDirs = () => {
  const dirs = [
    uploadsDir,
    path.join(uploadsDir, 'profile'),
    path.join(uploadsDir, 'resume'),
    path.join(uploadsDir, 'projects'),
    path.join(uploadsDir, 'experience'),
    path.join(uploadsDir, 'education'),
    path.join(uploadsDir, 'certifications'),
    path.join(uploadsDir, 'testimonials'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

/**
 * Storage configuration for Multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on field name
    let folder = 'profile';
    
    if (file.fieldname.includes('resume')) {
      folder = 'resume';
    } else if (file.fieldname.includes('project')) {
      folder = 'projects';
    } else if (file.fieldname.includes('company') || file.fieldname.includes('experience')) {
      folder = 'experience';
    } else if (file.fieldname.includes('education') || file.fieldname.includes('institution')) {
      folder = 'education';
    } else if (file.fieldname.includes('certification') || file.fieldname.includes('badge')) {
      folder = 'certifications';
    } else if (file.fieldname.includes('testimonial') || file.fieldname.includes('author')) {
      folder = 'testimonials';
    }

    cb(null, path.join(uploadsDir, folder));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter for images
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'), false);
  }
};

/**
 * File filter for documents
 */
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX) are allowed'), false);
  }
};

/**
 * Multer upload configurations
 */
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files
  },
});

/**
 * Generic upload (no filter)
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Get upload directory path
 */
export const getUploadDir = () => uploadsDir;
