import React, { useState, useEffect } from 'react';
import { LuTimer, LuPlay, LuPause, LuRotateCcw, LuVolume2, LuVolumeX, LuFlame } from 'react-icons/lu';
import confetti from 'canvas-confetti';

export const PomodoroFocus = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      confetti({ particleCount: 60, spread: 70 });
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    else if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    else if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto py-8 text-center space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold gradient-text flex items-center justify-center gap-2">
          <LuTimer /> Pomodoro Focus Mode
        </h1>
        <p className="text-xs text-slate-400 mt-1">Distraction-free environment engineered for peak cognitive performance</p>
      </div>

      {/* Mode Selectors */}
      <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 gap-2">
        <button
          onClick={() => resetTimer('focus')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'focus' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎯 Deep Work (25m)
        </button>
        <button
          onClick={() => resetTimer('shortBreak')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'shortBreak' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          ☕ Short Break (5m)
        </button>
        <button
          onClick={() => resetTimer('longBreak')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'longBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🌴 Long Rest (15m)
        </button>
      </div>

      {/* Main Clock Card */}
      <div className="glass-panel-glow p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="text-7xl sm:text-8xl font-extrabold font-mono tracking-tighter text-white">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="h-16 w-16 rounded-2xl gradient-btn flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform"
          >
            {isRunning ? <LuPause /> : <LuPlay className="ml-1" />}
          </button>
          <button
            onClick={() => resetTimer()}
            className="h-12 w-12 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center text-xl transition-colors"
            title="Reset Timer"
          >
            <LuRotateCcw />
          </button>
        </div>
      </div>

    </div>
  );
};
