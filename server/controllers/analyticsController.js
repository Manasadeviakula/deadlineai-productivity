import { isMockDB, mockDB, db } from '../firebase/firebaseAdmin.js';

export const analyticsController = {
  async getAnalytics(req, res) {
    const userId = req.user.uid;
    let tasks = [];

    if (isMockDB) {
      tasks = Array.from(mockDB.tasks.values());
    } else {
      const snapshot = await db.collection('Tasks').where('userId', '==', userId).get();
      snapshot.forEach(doc => tasks.push(doc.data()));
    }

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const overdueTasks = tasks.filter(t => t.status === 'pending' && new Date(t.deadline) < new Date()).length;

    // Calculate category distribution
    const categoryDistribution = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    const weeklyProductivity = [
      { day: 'Mon', completed: 4, score: 85 },
      { day: 'Tue', completed: 6, score: 92 },
      { day: 'Wed', completed: 3, score: 78 },
      { day: 'Thu', completed: 5, score: 88 },
      { day: 'Fri', completed: 7, score: 95 },
      { day: 'Sat', completed: 2, score: 70 },
      { day: 'Sun', completed: 4, score: 84 }
    ];

    const analyticsData = {
      dailyScore: 88,
      weeklyScore: 90,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalTasks: tasks.length,
      categoryDistribution,
      weeklyProductivity,
      streaks: {
        current: 5,
        weekly: 3,
        longest: 14
      },
      badges: [
        { id: 1, name: "Deadline Slayer", desc: "Completed 5 tasks before deadline", icon: "⚔️", unlocked: true },
        { id: 2, name: "Early Bird", desc: "Finished a task before 9 AM", icon: "🌅", unlocked: true },
        { id: 3, name: "Focus Master", desc: "Completed 4 Pomodoro sessions", icon: "🎯", unlocked: true },
        { id: 4, name: "AI Explorer", desc: "Used Gemini Task Breakdown 5 times", icon: "🤖", unlocked: true },
        { id: 5, name: "Consistency King", desc: "Maintained a 7-day active streak", icon: "🔥", unlocked: false }
      ]
    };

    res.json({ success: true, analytics: analyticsData });
  }
};
