import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handle Google OAuth authentication
 * Verifies Google token, creates/finds user, and returns JWT token
 * @param {Object} req - Express request with { token } in body
 * @param {Object} res - Express response
 */
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Verify Google token with Google's servers
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists, if not create new user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                googleId,
                email,
                displayName: name,
                picture,
            });
            await user.save();
            console.log(`✅ New user created: ${email}`);
        } else {
            // Update existing user with Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        // Generate JWT token for frontend
        const authToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                displayName: user.displayName,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token valid for 7 days
        );

        return res.status(200).json({
            message: 'Authentication successful',
            token: authToken,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                picture: user.picture,
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error.message);
        return res.status(401).json({
            message: 'Google authentication failed',
            error: error.message,
        });
    }
};

/**
 * Get current user profile
 * Requires valid JWT token
 * @param {Object} req - Express request with user from auth middleware
 * @param {Object} res - Express response
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                picture: user.picture,
            },
        });
    } catch (error) {
        console.error('Get Profile Error:', error.message);
        return res.status(500).json({ message: 'Failed to fetch profile' });
    }
};
