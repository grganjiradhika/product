import jwt from 'jsonwebtoken';

/**
 * Verify JWT token middleware
 * Validates the token sent from frontend in Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract from "Bearer token"

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
