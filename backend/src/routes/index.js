import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

/**
 * Mount all routes
 * /api/auth/* -> Auth routes (Google OAuth, profile, etc.)
 */
router.use('/auth', authRoutes);

export default router;
