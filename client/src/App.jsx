import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TaskManager } from './pages/TaskManager';
import { DailyPlanner } from './pages/DailyPlanner';
import { AICoach } from './pages/AICoach';
import { CalendarView } from './pages/CalendarView';
import { AnalyticsView } from './pages/AnalyticsView';
import { PomodoroFocus } from './pages/PomodoroFocus';
import { ProfileSettings } from './pages/ProfileSettings';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<TaskManager />} />
                  <Route path="/planner" element={<DailyPlanner />} />
                  <Route path="/coach" element={<AICoach />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/analytics" element={<AnalyticsView />} />
                  <Route path="/focus" element={<PomodoroFocus />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
