import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuSparkles, LuMail, LuLock, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('alex@deadline.ai');
  const [password, setPassword] = useState('password123');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    await login('google.user@deadline.ai', 'googlepass');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glow w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-btn flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <LuSparkles />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">Log in to DeadlineAI Productivity Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Reset password link sent to " + email); }} className="text-[11px] text-indigo-400 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <LuLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-btn font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? 'Logging in...' : <>Sign In <LuArrowRight /></>}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Or Continue With</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-xs text-slate-200 flex items-center justify-center gap-3 transition-colors"
        >
          <FcGoogle className="text-lg" /> Google Sign-In
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register for Free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
