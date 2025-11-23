import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Correct event typing for TS
mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connected to host:', mongoose.connection.host);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error: Error) => {
  console.error('❌ MongoDB error:', error.message);
});
