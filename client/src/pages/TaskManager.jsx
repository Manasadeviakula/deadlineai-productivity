import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  LuPlus, 
  LuSearch, 
  LuFilter, 
  LuSparkles, 
  LuCheck, 
  LuClock, 
  LuTrash2, 
  LuCalendar,
  LuTag,
  LuPenLine
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskModal } from '../components/TaskModal';
import { AIBreakdownModal } from '../components/AIBreakdownModal';

export const TaskManager = () => {
  const { tasks, toggleComplete, deleteTask, activePlanModalTask, setActivePlanModalTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Personal', 'College', 'Work', 'Health', 'Finance', 'Projects'];

  const filteredTasks = tasks.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white gradient-text">Task Management Board</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize, track, and generate AI plans for your commitments</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-2xl gradient-btn font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg"
        >
          <LuPlus className="text-base" /> Add New Task
        </button>
      </div>

      {/* Filters and Search toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <LuSearch className="absolute left-3.5 top-3 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredTasks.map(t => {
            const isCompleted = t.status === 'completed';
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted ? 'opacity-60 bg-slate-200/30 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800' : 'border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                      t.category === 'College' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      t.category === 'Projects' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {t.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800" title="Edit Task">
                        <LuPenLine />
                      </button>
                      <button onClick={() => deleteTask(t.id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800" title="Delete Task">
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-2">
                    <button
                      onClick={() => toggleComplete(t.id)}
                      className={`h-5 w-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted && <LuCheck className="text-xs" />}
                    </button>
                    <h3 className={`font-bold text-base text-slate-900 dark:text-white leading-tight ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                      {t.title}
                    </h3>
                  </div>

                  {t.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pl-8 mb-4">
                      {t.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><LuClock className="text-indigo-400" /> {t.estimatedHours}h</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                      t.priority === 'High' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                      t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <button
                    onClick={() => setActivePlanModalTask(t)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1 border border-purple-500/20"
                  >
                    <LuSparkles /> AI Plan
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} taskToEdit={taskToEdit} />
      <AIBreakdownModal task={activePlanModalTask} onClose={() => setActivePlanModalTask(null)} />
    </div>
  );
};
