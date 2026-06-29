import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Fallback demo user for hackathon showcase ease
    req.user = { uid: 'demo_user_123', email: 'user@deadline.ai', name: 'Alex Vance' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    // Graceful demo fallback on invalid/mock token
    req.user = { uid: 'demo_user_123', email: 'user@deadline.ai', name: 'Alex Vance' };
    next();
  }
};
