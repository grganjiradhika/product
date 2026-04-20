import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './config/database.js';
import { corsConfig } from './middleware/corsMiddleware.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - FIXES CORS ERROR
app.use(corsConfig);

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ==================== SERVER STARTUP ====================

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║  🚀 Server Running Successfully!       ║
║  📍 URL: http://localhost:${PORT}         ║
║  🔐 Google OAuth Endpoint: /api/auth/google ║
║  👤 Profile Endpoint: /api/auth/profile   ║
╚════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
