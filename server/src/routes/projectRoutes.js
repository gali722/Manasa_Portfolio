import express from 'express';
import {
  getPublicProjects,
  getPublicProject,
  getAdminProjects,
  getAdminProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  deleteProjectImage,
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateMultipleImages } from '../middleware/fileValidation.js';
import { validateProject, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/projects', getPublicProjects);
router.get('/public/projects/:id', validateObjectId, getPublicProject);

// Admin routes
router.get('/admin/projects', authenticate, getAdminProjects);
router.get('/admin/projects/:id', authenticate, validateObjectId, getAdminProject);
router.post('/admin/projects', authenticate, validateProject, createProject);
router.put('/admin/projects/:id', authenticate, validateObjectId, validateProject, updateProject);
router.delete('/admin/projects/:id', authenticate, validateObjectId, deleteProject);
router.post(
  '/admin/projects/:id/images',
  authenticate,
  upload.array('images', 10),
  validateMultipleImages,
  uploadProjectImages
);
router.delete('/admin/projects/:id/images', authenticate, deleteProjectImage);

export default router;
