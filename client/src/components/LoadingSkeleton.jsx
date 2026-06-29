import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel p-5 rounded-2xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between">
          <div className="space-y-2 flex-1 pr-4">
            <div className="h-4 bg-slate-700/60 rounded-md w-1/3"></div>
            <div className="h-3 bg-slate-800/60 rounded-md w-2/3"></div>
          </div>
          <div className="h-8 w-24 bg-indigo-900/40 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};
