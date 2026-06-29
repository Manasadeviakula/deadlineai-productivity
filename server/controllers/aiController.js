import { geminiService } from '../services/geminiService.js';
import { isMockDB, mockDB, db } from '../firebase/firebaseAdmin.js';

export const aiController = {
  async generatePlan(req, res) {
    try {
      const { title, description, category, deadline } = req.body;
      const plan = await geminiService.generateTaskBreakdown({ title, description, category, deadline });
      res.json({ success: true, plan });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async dailyPlan(req, res) {
    try {
      const { currentTime } = req.body;
      const userId = req.user.uid;
      let tasks = [];
      if (isMockDB) {
        tasks = Array.from(mockDB.tasks.values()).filter(t => t.status === 'pending');
      } else {
        const snapshot = await db.collection('Tasks').where('userId', '==', userId).where('status', '==', 'pending').get();
        snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
      }

      const dailySchedule = await geminiService.generateDailySchedule({ currentTime: currentTime || new Date().toLocaleTimeString(), tasks });
      res.json({ success: true, schedule: dailySchedule });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async chat(req, res) {
    try {
      const { message, history } = req.body;
      const userId = req.user.uid;
      let userTasks = [];
      if (isMockDB) {
        userTasks = Array.from(mockDB.tasks.values());
      } else {
        const snapshot = await db.collection('Tasks').where('userId', '==', userId).get();
        snapshot.forEach(doc => userTasks.push(doc.data()));
      }

      const response = await geminiService.chatWithAICoach({ message, history, userTasks });
      res.json({ success: true, ...response });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async smartNotification(req, res) {
    try {
      const { task } = req.body;
      const notification = await geminiService.generateSmartNotification(task);
      res.json({ success: true, notification });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
