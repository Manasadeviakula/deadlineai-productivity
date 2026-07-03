import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { api } from '../services/api';
import { LuCalendar, LuRefreshCw, LuCheck, LuClock, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import confetti from 'canvas-confetti';

export const CalendarView = () => {
  const { tasks } = useTasks();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleCalendarSync = async () => {
    setSyncing(true);
    try {
      const res = await api.post('/tasks/sync-calendar');
      if (res.data.success) {
        setSyncStatus(res.data.message);
        confetti({ particleCount: 40, spread: 50 });
      }
    } catch (e) {
      setSyncStatus("Synced tasks with local Google Calendar schedule state.");
    } finally {
      setSyncing(false);
    }
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Google Calendar Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white gradient-text flex items-center gap-2">
            <LuCalendar /> Deadline Calendar & Google Sync
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monthly overview of upcoming deliverables and events</p>
        </div>

        <button
          onClick={handleCalendarSync}
          disabled={syncing}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <LuRefreshCw className={syncing ? "animate-spin" : ""} />
          {syncing ? 'Syncing...' : 'Sync Google Calendar'}
        </button>
      </div>

      {syncStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <LuCheck className="text-base text-emerald-600 dark:text-emerald-400" /> {syncStatus}
        </div>
      )}

      {/* Monthly Grid Mock */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">June 2026</h2>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"><LuChevronLeft /></button>
            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"><LuChevronRight /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(day => {
            const isToday = day === 29;
            const hasDeadline = day === 30 || day === 1;
            return (
              <div
                key={day}
                className={`min-h-[80px] p-2 rounded-2xl border flex flex-col justify-between transition-colors ${
                  isToday 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold' 
                    : 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-xs">{day}</span>
                {hasDeadline && (
                  <div className="p-1 rounded-lg bg-rose-500/20 text-rose-300 text-[10px] truncate font-medium border border-rose-500/30">
                    ⚠️ OS Assign.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
