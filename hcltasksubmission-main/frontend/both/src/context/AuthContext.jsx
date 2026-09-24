import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('livepoll_token');
      const savedUser = localStorage.getItem('livepoll_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to parse cached auth state:', e);
      localStorage.removeItem('livepoll_token');
      localStorage.removeItem('livepoll_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('livepoll_token', data.token);
    localStorage.setItem('livepoll_user', JSON.stringify(data.user));
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.signup({ name, email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('livepoll_token', data.token);
    localStorage.setItem('livepoll_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('livepoll_token');
    localStorage.removeItem('livepoll_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
