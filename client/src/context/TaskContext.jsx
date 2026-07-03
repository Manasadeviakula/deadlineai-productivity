import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    {
      id: "task_demo_1",
      title: "Complete OS Assignment 3",
      description: "Implement page replacement algorithms (FIFO, LRU, Optimal) in C++",
      deadline: "2026-06-30T23:59:00Z",
      priority: "Critical",
      estimatedHours: 4,
      status: "pending",
      category: "College",
      createdAt: new Date().toISOString()
    },
    {
      id: "task_demo_2",
      title: "Design Hackathon Pitch Deck",
      description: "Create sleek slides for DeadlineAI presentation and prototype demo",
      deadline: "2026-07-01T18:00:00Z",
      priority: "High",
      estimatedHours: 3,
      status: "pending",
      category: "Projects",
      createdAt: new Date().toISOString()
    },
    {
      id: "task_demo_3",
      title: "Morning 30-min Workout",
      description: "Cardio and strength exercises",
      deadline: "2026-06-29T10:00:00Z",
      priority: "Medium",
      estimatedHours: 0.5,
      status: "completed",
      category: "Health",
      createdAt: new Date().toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [activePlanModalTask, setActivePlanModalTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      if (res.data.success && res.data.tasks.length > 0) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.warn("API task fetch fallback to local state:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    const trimmedTitle = (taskData.title || '').trim();
    
    // 1. Local frontend deduplication check
    const isDuplicate = tasks.some(t => 
      t.title.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
      t.deadline === taskData.deadline
    );
    if (isDuplicate) {
      throw new Error('A task with this title and deadline already exists.');
    }

    try {
      const res = await api.post('/tasks', taskData);
      if (res.data.success) {
        setTasks(prev => [res.data.task, ...prev]);
        return res.data.task;
      }
    } catch (err) {
      // Propagate API response errors (e.g. 409 Conflict, 400 Bad Request)
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      
      // Fallback only for network errors
      console.warn("API task creation failed (network), falling back to local task:", err.message);
      const newTask = {
        id: `task_local_${Date.now()}`,
        ...taskData,
        title: trimmedTitle,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
  };

  const updateTask = async (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await api.put(`/tasks/${id}`, updates);
    } catch (err) {
      console.warn("API update failed, updated locally.");
    }
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.warn("API delete failed, deleted locally.");
    }
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      updateTask(id, { status: newStatus });
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      activePlanModalTask,
      setActivePlanModalTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
