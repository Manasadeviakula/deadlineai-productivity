import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuCheck, 
  LuCalendarDays, 
  LuBot, 
  LuCalendar, 
  LuTrendingUp, 
  LuTimer, 
  LuUser, 
  LuMoon, 
  LuSun, 
  LuLogOut, 
  LuMenu, 
  LuX, 
  LuFlame, 
  LuSparkles,
  LuBell
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LuLayoutDashboard },
    { name: 'Task Manager', path: '/tasks', icon: LuCheck },
    { name: 'Daily Planner', path: '/planner', icon: LuCalendarDays },
    { name: 'AI Coach', path: '/coach', icon: LuBot },
    { name: 'Calendar', path: '/calendar', icon: LuCalendar },
    { name: 'Analytics', path: '/analytics', icon: LuTrendingUp },
    { name: 'Focus Mode', path: '/focus', icon: LuTimer },
    { name: 'Profile & Settings', path: '/profile', icon: LuUser },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-200 dark:border-slate-800/60 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-btn flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            <LuSparkles />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none gradient-text">DeadlineAI</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Productivity Companion</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="text-lg" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 mb-3">
            <div className="flex items-center gap-2">
              <LuFlame className="text-orange-500 text-xl animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">5-Day Streak</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400">On Fire! Keep going</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LuLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl gradient-btn flex items-center justify-center text-white">
                  <LuSparkles />
                </div>
                <h1 className="font-bold text-lg gradient-text">DeadlineAI</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 text-2xl">
                <LuX />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="text-lg" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/40"
            >
              <LuLogOut /> Logout
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 glass-panel border-b border-slate-200 dark:border-slate-800/60 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-2xl text-slate-600 dark:text-slate-300"
            >
              <LuMenu />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                AI Powered Hackathon Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <LuSun className="text-amber-400" /> : <LuMoon className="text-indigo-600" />}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                alt="Avatar"
                className="h-9 w-9 rounded-full ring-2 ring-indigo-500/50 bg-slate-700"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-none text-slate-800 dark:text-slate-100">{user?.name || 'Alex Vance'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{user?.email || 'alex@deadline.ai'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Proactive AI Smart Notification Banner */}
        {showNotification && (
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-6 py-2.5 text-xs sm:text-sm flex items-center justify-between shrink-0 border-b border-indigo-500/30">
            <div className="flex items-center gap-3">
              <span className="p-1 rounded-md bg-indigo-500/30 text-indigo-300 animate-pulse">
                <LuBell />
              </span>
              <span>
                <strong className="font-semibold text-indigo-300">Smart AI Alert:</strong> You need around 90 minutes to complete "OS Assignment 3". Start before 5 PM to meet deadline comfortably!
              </span>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-indigo-300 hover:text-white pl-4">
              <LuX />
            </button>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
