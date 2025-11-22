import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📊 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

