import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { api } from '../services/api';
import { 
  LuCalendarDays, 
  LuSparkles, 
  LuClock, 
  LuCoffee, 
  LuTarget, 
  LuCheck, 
  LuRefreshCw 
} from 'react-icons/lu';
import { motion } from 'framer-motion';

export const DailyPlanner = () => {
  const { tasks } = useTasks();
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);

  const fetchDailySchedule = async (regenerate = false) => {
    setLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const res = await api.post('/ai/daily-plan', { currentTime, regenerate });
      if (res.data.success) {
        setScheduleData(res.data.schedule);
      }
    } catch (err) {
      console.warn("Daily plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySchedule(false);
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white gradient-text flex items-center gap-2">
            <LuCalendarDays /> AI Daily Schedule Optimizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Algorithmic timeline tailored for deep work and fatigue management</p>
        </div>

        <button
          onClick={() => fetchDailySchedule(true)}
          disabled={loading}
          className="px-5 py-2.5 rounded-2xl gradient-btn font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg"
        >
          <LuRefreshCw className={loading ? "animate-spin" : ""} /> Regenerate Schedule
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center glass-panel rounded-3xl space-y-4">
          <LuSparkles className="text-4xl text-indigo-400 animate-spin mx-auto" />
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Synthesizing optimized timeline...</p>
        </div>
      ) : scheduleData ? (
        <div className="space-y-6">
          
          {/* Productivity Forecast Header */}
          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-slate-100/50 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Forecasted Daily Output</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{scheduleData.productivityScoreForecast}% Target Score</h2>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-bold text-sm sm:text-base">
              🎯 Optimized
            </div>
          </div>

          {/* Timeline Stack */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Today's Timeline Blocks</h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700/50">
              {scheduleData.timeline?.map((item, idx) => {
                const isBreak = item.type === 'break';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative pl-12 p-4 rounded-2xl border transition-colors ${
                      isBreak 
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200' 
                        : 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-500/40 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div className={`absolute left-3.5 top-5 h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isBreak ? 'bg-amber-500 border-amber-400 text-amber-950 dark:text-slate-950' : 'bg-indigo-600 border-indigo-400 text-white'
                    }`}>
                      {isBreak ? <LuCoffee className="text-[10px]" /> : <LuTarget className="text-[10px]" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <LuClock className="text-xs" /> {item.timeSlot}
                        </span>
                        <h4 className="font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">{item.activity}</h4>
                      </div>

                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold self-start sm:self-auto ${
                        isBreak ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300'
                      }`}>
                        {item.priority ? `${item.priority} Priority` : 'Energy Rest'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Daily Tips */}
          {scheduleData.tips && (
            <div className="glass-panel p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">💡 Mentor Tips for Today</h4>
              <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {scheduleData.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
