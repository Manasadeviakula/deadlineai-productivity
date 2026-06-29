import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LuUser, LuMail, LuAward, LuShield, LuBell, LuSparkles } from 'react-icons/lu';

export const ProfileSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white gradient-text">User Profile & Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage account parameters and AI model preferences</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl flex items-center gap-6">
        <img
          src={user?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
          alt="Avatar"
          className="h-20 w-20 rounded-2xl ring-4 ring-indigo-500/40 bg-slate-800"
        />
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Vance'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'alex@deadline.ai'}</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <LuSparkles /> AI Master Tier Member
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">System Preferences</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40">
            <div>
              <p className="text-xs font-semibold text-slate-200">Gemini Proactive Notifications</p>
              <p className="text-[11px] text-slate-400">Receive smart pre-deadline recommendations</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-indigo-600 rounded" />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40">
            <div>
              <p className="text-xs font-semibold text-slate-200">Google Calendar Auto-Sync</p>
              <p className="text-[11px] text-slate-400">Automatically push created tasks to calendar</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-indigo-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
