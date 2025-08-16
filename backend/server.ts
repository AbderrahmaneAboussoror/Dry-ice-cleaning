import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import mongoose from 'mongoose';
import {initializeEmailSystem} from "./utils/emailUtils";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI!;

// Initialize email system and start server only after MongoDB connects
const startServer = async () => {
    try {
        await initializeEmailSystem();
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Startup error:', err);
        process.exit(1);
    }
};

startServer();