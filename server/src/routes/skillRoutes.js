import express from 'express';
import {
  getPublicSkills,
  getAdminSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';
import { validateSkill, validateSkillUpdate, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/skills', getPublicSkills);

// Admin routes
router.get('/admin/skills', authenticate, getAdminSkills);
router.get('/admin/skills/:id', authenticate, validateObjectId, getSkill);
router.post('/admin/skills', authenticate, validateSkill, createSkill);
router.put('/admin/skills/:id', authenticate, validateObjectId, validateSkillUpdate, updateSkill);
router.delete('/admin/skills/:id', authenticate, validateObjectId, deleteSkill);
router.put('/admin/skills/reorder', authenticate, reorderSkills);

export default router;
