import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  LuCheck, 
  LuClock, 
  LuZap, 
  LuSparkles, 
  LuPlus, 
  LuTrendingUp, 
  LuArrowRight, 
  LuFlame, 
  LuCalendar
} from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TaskModal } from '../components/TaskModal';
import { AIBreakdownModal } from '../components/AIBreakdownModal';

export const Dashboard = () => {
  const { tasks, toggleComplete, activePlanModalTask, setActivePlanModalTask } = useTasks();
  const { user } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const totalCount = tasks.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const todayTasks = tasks.filter(t => t.status === 'pending').slice(0, 4);
  const upcomingDeadlines = [...tasks]
    .filter(t => t.status === 'pending')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <LuSparkles className="text-amber-300" /> AI Productivity Engine Online
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, <span className="gradient-text">{user?.name || 'Alex'}</span>! 🚀
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              You have <strong className="text-indigo-400 font-semibold">{pendingCount} pending tasks</strong> today. Gemini has calculated an optimal schedule to keep you ahead of every deadline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-5 py-3 rounded-2xl gradient-btn font-semibold text-xs text-white flex items-center gap-2 shadow-lg"
            >
              <LuPlus className="text-base" /> New Task
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-xs text-indigo-300 flex items-center gap-2 transition-colors"
            >
              <LuZap className="text-base text-amber-400" /> AI Daily Planner
            </button>
          </div>
        </div>
      </div>

      {/* Metrics & Productivity Score Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Productivity Score */}
        <motion.div whileHover={{ y: -3 }} className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Productivity Score</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">88 <span className="text-sm font-normal text-slate-400">/100</span></h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 text-xl">
              <LuTrendingUp />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500 font-semibold">
            <span>+12% vs last week</span>
          </div>
        </motion.div>

        {/* Task Completion Rate */}
        <motion.div whileHover={{ y: -3 }} className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completion Rate</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">{completionPercentage}%</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 text-xl">
              <LuCheck />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </motion.div>

        {/* Active Streak */}
        <motion.div whileHover={{ y: -3 }} className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Streak</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">5 Days</h3>
            </div>
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 text-xl animate-pulse">
              <LuFlame />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Personal record: 14 days</p>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div whileHover={{ y: -3 }} className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Tasks</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">{pendingCount}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 text-xl">
              <LuClock />
            </div>
          </div>
          <p className="mt-4 text-xs text-rose-400 font-medium">1 task due tomorrow</p>
        </motion.div>

      </div>

      {/* Main Grid: Today's Tasks & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Today's Focus Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LuCheck className="text-indigo-500" /> Today's Action Items
                </h2>
                <p className="text-xs text-slate-400">Tasks prioritized by Gemini urgency matrix</p>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
              >
                View All <LuArrowRight />
              </button>
            </div>

            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 hover:border-indigo-500/40 transition-colors">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                      <button
                        onClick={() => toggleComplete(t.id)}
                        className="h-5 w-5 rounded-lg border-2 border-slate-400 hover:border-indigo-500 flex items-center justify-center shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{t.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-medium">{t.category}</span>
                          <span>⏱️ {t.estimatedHours}h</span>
                          <span>📅 {new Date(t.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActivePlanModalTask(t)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-purple-500/20"
                    >
                      <LuSparkles /> AI Breakdown
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-slate-400 py-6">All caught up! No urgent pending tasks.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: AI Proactive Coach Tips & Upcoming Deadlines */}
        <div className="space-y-6">
          
          {/* AI Coach Suggestion Box */}
          <div className="glass-panel-glow p-6 rounded-3xl bg-gradient-to-b from-indigo-900/40 to-slate-900/60 text-white relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl gradient-btn text-white text-xl">
                <LuSparkles />
              </div>
              <div>
                <h3 className="font-bold text-sm gradient-text">Proactive AI Recommendation</h3>
                <p className="text-[11px] text-slate-400">Powered by Gemini 2.5 Flash</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              "Your <strong>OS Assignment 3</strong> is due in 30 hours. You perform best on complex logic in the morning. Schedule a 90-minute sprint before 12 PM."
            </p>
            <button
              onClick={() => navigate('/coach')}
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 flex items-center justify-center gap-2"
            >
              Ask AI Coach Anything <LuArrowRight />
            </button>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <LuZap className="text-amber-500" /> Closest Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.map(t => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                    <span className="text-[10px] text-rose-500 font-medium">Due {new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <AIBreakdownModal task={activePlanModalTask} onClose={() => setActivePlanModalTask(null)} />
    </div>
  );
};
