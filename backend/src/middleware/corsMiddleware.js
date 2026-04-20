import cors from 'cors';

/**
 * CORS configuration to allow requests from frontend
 * Solves the CORS error issue
 */
export const corsConfig = cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600, // 1 hour
});
