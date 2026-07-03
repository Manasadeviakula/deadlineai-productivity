import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSparkles, LuX, LuClock, LuCheck, LuListOrdered, LuCoffee } from 'react-icons/lu';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const AIBreakdownModal = ({ task, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!task) return;
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await api.post('/ai/generate-plan', {
          title: task.title,
          description: task.description,
          category: task.category,
          deadline: task.deadline
        });
        if (res.data.success) {
          setPlan(res.data.plan);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      } catch (e) {
        console.warn("AI Plan fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [task]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl gradient-btn text-white text-xl shadow-lg shadow-indigo-500/30">
              <LuSparkles />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">Gemini AI Task Plan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Deconstructed subtasks & optimal work schedule</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
            <LuX className="text-xl" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-4">
            <div className="inline-block p-4 rounded-full bg-indigo-500/10 text-indigo-400 animate-bounce">
              <LuSparkles className="text-4xl" />
            </div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Gemini is analyzing task complexity...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Formulating optimal subtasks, time blocks, and energy breaks.</p>
          </div>
        ) : plan ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            
            {/* AI Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/50 dark:to-purple-900/50 border border-indigo-200 dark:border-indigo-500/30">
              <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">{plan.summary}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 bg-indigo-100/60 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-700/50">
                  <LuClock className="text-indigo-600 dark:text-indigo-400" /> Est. Time: {plan.totalEstimatedHours} hours
                </span>
                <span className="flex items-center gap-1.5 bg-purple-100/60 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-700/50">
                  <LuSparkles className="text-purple-600 dark:text-purple-400" /> Best Work Slots: {plan.suggestedWorkingHours}
                </span>
              </div>
            </div>

            {/* Micro-Subtasks List */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <LuListOrdered className="text-indigo-500 dark:text-indigo-400" /> Step-by-Step Micro Action Plan
              </h3>
              <div className="space-y-2.5">
                {plan.subtasks?.map((st, idx) => (
                  <div key={st.id || idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                    <span className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {st.order || idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{st.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>⏱️ {st.estimatedMinutes} mins</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          st.priority === 'Critical' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-950/40'
                        }`}>
                          {st.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Energy Breaks */}
            {plan.suggestedBreaks && (
              <div className="p-4 rounded-2xl bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <LuCoffee className="text-amber-500 dark:text-amber-400" /> Recommended Energy Breaks
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {plan.suggestedBreaks.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl gradient-btn font-semibold text-sm text-white shadow-lg"
            >
              Accept AI Plan & Add to Schedule
            </button>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-8">Failed to load AI breakdown. Please try again.</p>
        )}
      </motion.div>
    </div>
  );
};
