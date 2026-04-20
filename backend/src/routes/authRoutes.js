import express from 'express';
import { googleAuth, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/google
 * Authenticate user with Google OAuth token
 * Expected body: { token: "google-jwt-token" }
 * Returns: { token: "jwt-token", user: {...} }
 */
router.post('/google', googleAuth);

/**
 * GET /api/auth/profile
 * Get authenticated user's profile
 * Requires: Authorization header with JWT token
 * Returns: { user: {...} }
 */
router.get('/profile', verifyToken, getProfile);

export default router;
