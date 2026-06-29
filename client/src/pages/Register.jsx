import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuSparkles, LuUser, LuMail, LuLock, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name || 'Hackathon Creator', email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] text-white relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-glow w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-btn flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <LuSparkles />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Start beating deadlines with Gemini AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
            <div className="relative">
              <LuUser className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="text"
                required
                placeholder="Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="email"
                required
                placeholder="alex@deadline.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Password</label>
            <div className="relative">
              <LuLock className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
              <input
                type="password"
                required
                placeholder="••••••••"
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
            {loading ? 'Creating Account...' : <>Get Started <LuArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
