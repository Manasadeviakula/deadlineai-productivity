import admin from 'firebase-admin';
import { config } from '../config/config.js';

let db = null;
let isMockDB = true;

// In-Memory Mock Database for robust standalone local development
export const mockDB = {
  users: new Map(),
  tasks: new Map([
    ["task_demo_1", {
      id: "task_demo_1",
      userId: "demo_user_123",
      title: "Complete OS Assignment 3",
      description: "Implement page replacement algorithms (FIFO, LRU, Optimal) in C++",
      deadline: "2026-06-30T23:59:00Z",
      priority: "Critical",
      estimatedHours: 4,
      status: "pending",
      category: "College",
      createdAt: new Date().toISOString()
    }],
    ["task_demo_2", {
      id: "task_demo_2",
      userId: "demo_user_123",
      title: "Design Hackathon Pitch Deck",
      description: "Create sleek slides for DeadlineAI presentation and prototype demo",
      deadline: "2026-07-01T18:00:00Z",
      priority: "High",
      estimatedHours: 3,
      status: "pending",
      category: "Projects",
      createdAt: new Date().toISOString()
    }],
    ["task_demo_3", {
      id: "task_demo_3",
      userId: "demo_user_123",
      title: "Morning 30-min Workout",
      description: "Cardio and strength exercises",
      deadline: "2026-06-29T10:00:00Z",
      priority: "Medium",
      estimatedHours: 0.5,
      status: "completed",
      category: "Health",
      createdAt: new Date().toISOString()
    }]
  ]),
  plans: new Map(),
  analytics: new Map([
    ["demo_user_123", {
      dailyScore: 85,
      weeklyScore: 88,
      completedTasks: 14,
      pendingTasks: 4,
      overdueTasks: 1,
      streaks: { current: 5, weekly: 3, longest: 12 },
      badges: ["Early Bird", "Deadline Slayer", "Focus Master", "AI Explorer"]
    }]
  ])
};

try {
  if (config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
    db = admin.firestore();
    isMockDB = false;
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.log('Firebase credentials not provided. Running server with In-Memory Database Mode.');
  }
} catch (error) {
  console.warn('Failed to initialize Firebase Admin SDK, falling back to In-Memory DB Mode:', error.message);
}

export { admin, db, isMockDB };
