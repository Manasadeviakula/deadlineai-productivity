import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Route mounts
app.use('/api', authRoutes); // /api/register, /api/login, /api/logout
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', analyticsRoutes); // /api/analytics

// Root health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'DeadlineAI Backend API Service',
    timestamp: new Date().toISOString()
  });
});

app.listen(config.port, () => {
  console.log(`🚀 DeadlineAI Express server running on port ${config.port}`);
});
