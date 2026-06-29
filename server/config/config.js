import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'deadline_ai_super_secret_jwt_key_2026',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'deadline-ai-dev',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  }
};
