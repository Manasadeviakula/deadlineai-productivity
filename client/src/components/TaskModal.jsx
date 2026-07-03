import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuX, LuPlus, LuSave, LuClock, LuCalendar, LuTag, LuFlag } from 'react-icons/lu';
import { useTasks } from '../context/TaskContext';

export const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
    estimatedHours: 1,
    category: 'Work'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setIsSubmitting(false);
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        deadline: taskToEdit.deadline ? taskToEdit.deadline.slice(0, 16) : '',
        priority: taskToEdit.priority || 'Medium',
        estimatedHours: taskToEdit.estimatedHours || 1,
        category: taskToEdit.category || 'Work'
      });
    } else {
      const defaultDeadline = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16);
      setFormData({
        title: '',
        description: '',
        deadline: defaultDeadline,
        priority: 'Medium',
        estimatedHours: 2,
        category: 'College'
      });
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsSubmitting(true);
    setError('');

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, formData);
      } else {
        await addTask(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Personal', 'College', 'Work', 'Health', 'Finance', 'Projects'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl relative border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold gradient-text">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
            <LuX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Task Title *</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Complete Machine Learning Assignment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              disabled={isSubmitting}
              placeholder="Add details, instructions or resource links..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                <LuCalendar className="text-indigo-500 dark:text-indigo-400" /> Deadline Date & Time
              </label>
              <input
                type="datetime-local"
                required
                disabled={isSubmitting}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                <LuClock className="text-indigo-500 dark:text-indigo-400" /> Est. Time (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="40"
                disabled={isSubmitting}
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                <LuTag className="text-indigo-500 dark:text-indigo-400" /> Category
              </label>
              <select
                value={formData.category}
                disabled={isSubmitting}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                <LuFlag className="text-indigo-500 dark:text-indigo-400" /> Priority Level
              </label>
              <select
                value={formData.priority}
                disabled={isSubmitting}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs border border-rose-500/20 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="px-6 py-2.5 rounded-xl gradient-btn font-semibold text-xs text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : taskToEdit ? (
                <LuSave />
              ) : (
                <LuPlus />
              )}
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
