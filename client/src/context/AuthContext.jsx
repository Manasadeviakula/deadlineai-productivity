import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('deadline_ai_user');
    return saved ? JSON.parse(saved) : {
      uid: 'demo_user_123',
      name: 'Alex Vance',
      email: 'alex@deadline.ai',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('deadline_ai_user', JSON.stringify(res.data.user));
        localStorage.setItem('deadline_ai_token', res.data.token);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      // Demo fallback login
      const demoUser = { uid: 'demo_user_123', name: email.split('@')[0] || 'Alex Vance', email, photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` };
      setUser(demoUser);
      localStorage.setItem('deadline_ai_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('deadline_ai_user', JSON.stringify(res.data.user));
        localStorage.setItem('deadline_ai_token', res.data.token);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const newUser = { uid: `user_${Date.now()}`, name, email, photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` };
      setUser(newUser);
      localStorage.setItem('deadline_ai_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('deadline_ai_user');
    localStorage.removeItem('deadline_ai_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
