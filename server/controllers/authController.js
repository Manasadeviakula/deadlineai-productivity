import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { db, isMockDB, mockDB } from '../firebase/firebaseAdmin.js';

export const authController = {
  async register(req, res) {
    const { name, email, password } = req.body;
    const uid = `user_${Date.now()}`;
    const userData = {
      uid,
      name: name || 'Productivity Champ',
      email,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
      createdAt: new Date().toISOString()
    };

    if (isMockDB) {
      mockDB.users.set(uid, userData);
    } else {
      await db.collection('Users').doc(uid).set(userData);
    }

    const token = jwt.sign(userData, config.jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ success: true, user: userData, token });
  },

  async login(req, res) {
    const { email } = req.body;
    const userData = {
      uid: 'demo_user_123',
      name: 'Alex Vance',
      email: email || 'user@deadline.ai',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      createdAt: new Date().toISOString()
    };

    const token = jwt.sign(userData, config.jwtSecret, { expiresIn: '7d' });
    res.json({ success: true, user: userData, token });
  },

  async logout(req, res) {
    res.json({ success: true, message: 'Logged out successfully' });
  }
};
