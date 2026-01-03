const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL environment variable is not set');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URL, {
            bufferCommands: false, // Don't buffer commands - fail fast if not connected
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        }).then((mongoose) => {
            console.log('✅ MongoDB connected');
            return mongoose;
        }).catch((err) => {
            // Reset promise on error so we can retry
            cached.promise = null;
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
