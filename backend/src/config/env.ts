import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
  clientOrigin: string;
  nodeEnv: string;
  jwtSecret: string;
}

function validateEnv(): EnvConfig {
  const requiredVars = ['MONGODB_URI', 'CLIENT_ORIGIN', 'JWT_SECRET'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  const port = parseInt(process.env.PORT || '4000', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid number between 1 and 65535');
  }

  return {
    port,
    mongodbUri: process.env.MONGODB_URI!,
    clientOrigin: process.env.CLIENT_ORIGIN!,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET!,
  };
}

export const env = validateEnv();

