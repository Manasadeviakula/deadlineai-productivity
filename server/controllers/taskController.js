import { db, isMockDB, mockDB } from '../firebase/firebaseAdmin.js';
import { calendarService } from '../services/calendarService.js';

export const taskController = {
  async getTasks(req, res) {
    const userId = req.user.uid;
    let tasks = [];

    if (isMockDB) {
      tasks = Array.from(mockDB.tasks.values()).filter(t => t.userId === userId || userId === 'demo_user_123');
    } else {
      const snapshot = await db.collection('Tasks').where('userId', '==', userId).get();
      snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
    }

    res.json({ success: true, tasks });
  },

  async createTask(req, res) {
    const userId = req.user.uid;
    const { title, description, deadline, priority, estimatedHours, category } = req.body;

    const newTask = {
      id: `task_${Date.now()}`,
      userId,
      title,
      description: description || '',
      deadline: deadline || new Date(Date.now() + 86400000).toISOString(),
      priority: priority || 'Medium',
      estimatedHours: Number(estimatedHours) || 1,
      status: 'pending',
      category: category || 'Personal',
      createdAt: new Date().toISOString()
    };

    if (isMockDB) {
      mockDB.tasks.set(newTask.id, newTask);
    } else {
      const ref = await db.collection('Tasks').add(newTask);
      newTask.id = ref.id;
    }

    res.status(201).json({ success: true, task: newTask });
  },

  async updateTask(req, res) {
    const { id } = req.params;
    const updates = req.body;

    if (isMockDB) {
      if (mockDB.tasks.has(id)) {
        const existing = mockDB.tasks.get(id);
        const updated = { ...existing, ...updates };
        mockDB.tasks.set(id, updated);
        return res.json({ success: true, task: updated });
      }
    } else {
      await db.collection('Tasks').doc(id).update(updates);
      return res.json({ success: true, message: 'Task updated' });
    }

    res.status(404).json({ success: false, message: 'Task not found' });
  },

  async deleteTask(req, res) {
    const { id } = req.params;

    if (isMockDB) {
      mockDB.tasks.delete(id);
    } else {
      await db.collection('Tasks').doc(id).delete();
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  },

  async syncCalendar(req, res) {
    const userId = req.user.uid;
    let tasks = [];
    if (isMockDB) {
      tasks = Array.from(mockDB.tasks.values());
    } else {
      const snapshot = await db.collection('Tasks').where('userId', '==', userId).get();
      snapshot.forEach(doc => tasks.push(doc.data()));
    }

    const result = await calendarService.syncTasksToCalendar(userId, tasks);
    res.json(result);
  }
};
