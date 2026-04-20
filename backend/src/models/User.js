import mongoose from 'mongoose';

/**
 * User Schema - Defines structure of user data in MongoDB
 * This works alongside Prisma schema for type safety
 */
const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allow null values for unique index
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            default: null,
        },
        picture: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const User = mongoose.model('User', userSchema);

export default User;
