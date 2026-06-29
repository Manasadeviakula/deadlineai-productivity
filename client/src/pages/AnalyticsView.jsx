import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  LuAward, 
  LuFlame, 
  LuCheck, 
  LuTrendingUp, 
  LuDownload 
} from 'react-icons/lu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AnalyticsView = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (e) {
        console.warn("Analytics fetch error:", e);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  const categoryPieData = data?.categoryDistribution
    ? Object.keys(data.categoryDistribution).map(cat => ({ name: cat, value: data.categoryDistribution[cat] }))
    : [
        { name: 'College', value: 4 },
        { name: 'Projects', value: 3 },
        { name: 'Health', value: 2 },
        { name: 'Work', value: 5 }
      ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Category,Tasks Completed,Productivity Score\nCollege,14,88\nProjects,8,92\nWork,10,85";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "deadline_ai_analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white gradient-text flex items-center gap-2">
            <LuTrendingUp /> Analytics & Achievements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Deep operational insights, weekly streaks, and unlockable badges</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
        >
          <LuDownload /> Export CSV Report
        </button>
      </div>

      {/* Streaks & Badges Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-orange-500/20 text-orange-500 text-3xl animate-pulse">
            <LuFlame />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Daily Streak</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">5 Active Days</h3>
            <p className="text-[11px] text-slate-500">Longest: 14 days</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 text-3xl">
            <LuCheck />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Tasks Solved</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14 Completed</h3>
            <p className="text-[11px] text-slate-500">88% efficiency rate</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-400 text-3xl">
            <LuAward />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Badges Unlocked</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4 / 5 Badges</h3>
            <p className="text-[11px] text-slate-500">Master Level</p>
          </div>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Productivity Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Weekly Productivity Output</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyProductivity || [
                { day: 'Mon', completed: 4 }, { day: 'Tue', completed: 6 }, { day: 'Wed', completed: 3 },
                { day: 'Thu', completed: 5 }, { day: 'Fri', completed: 7 }, { day: 'Sat', completed: 2 }, { day: 'Sun', completed: 4 }
              ]}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Category Task Allocation</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Productivity Badges Showcase */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <LuAward className="text-amber-400" /> Unlockable Productivity Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data?.badges?.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-transform hover:scale-105 ${
                b.unlocked 
                  ? 'bg-slate-800/80 border-indigo-500/40 text-slate-100' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 grayscale opacity-60'
              }`}
            >
              <span className="text-4xl mb-2">{b.icon}</span>
              <h4 className="font-bold text-xs">{b.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
