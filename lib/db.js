const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Check if already connected and connection is ready
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If connection exists but is not ready, wait for it
    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            return cached.conn;
        } catch (e) {
            // If connection failed, reset and try again
            cached.promise = null;
        }
    }

    // Create new connection promise
    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Enable buffering for serverless
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((mongoose) => {
            console.log('✅ MongoDB connected');
            return mongoose;
        }).catch((err) => {
            cached.promise = null;
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Helper function to ensure connection is ready
async function ensureConnection() {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            return true;
        }

        // Try to connect
        await connectDB();
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        return false;
    }
}

module.exports = { connectDB, ensureConnection };
