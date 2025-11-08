import express from 'express';
import { serveFile, downloadFile } from '../controllers/fileController.js';

const router = express.Router();

// Serve file
router.get('/:folder/:filename', serveFile);

// Download file
router.get('/download/:folder/:filename', downloadFile);

export default router;
