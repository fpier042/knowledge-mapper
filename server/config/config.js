import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5002,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmark-manager',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
  nodeEnv: process.env.NODE_ENV || 'development'
};