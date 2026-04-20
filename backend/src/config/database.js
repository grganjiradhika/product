import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✅ MongoDB Disconnected');
    } catch (error) {
        console.error(`❌ Disconnect Error: ${error.message}`);
        process.exit(1);
    }
};
