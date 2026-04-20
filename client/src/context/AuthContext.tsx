'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { API_BASE } from '@/config/api';

interface User {
  userId: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<string | undefined>;
  logout: () => void;
  continueAsGuest: () => void;
  getAuthHeader: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('prof_token');
    const storedUser = localStorage.getItem('prof_user');
    const guestUser = sessionStorage.getItem('prof_guest_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('prof_token');
        localStorage.removeItem('prof_user');
      }
    } else if (guestUser) {
      try {
        setUser(JSON.parse(guestUser));
        setToken(null);
      } catch {
        sessionStorage.removeItem('prof_guest_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token: newToken, user: newUser } = res.data;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('prof_token', newToken);
    localStorage.setItem('prof_user', JSON.stringify(newUser));
    sessionStorage.removeItem('prof_guest_user');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    const { token: newToken, user: newUser, message } = res.data;

    if (newToken) {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('prof_token', newToken);
      localStorage.setItem('prof_user', JSON.stringify(newUser));
      sessionStorage.removeItem('prof_guest_user');
    }

    return message;
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser = {
      userId: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@example.com',
      name: 'Guest User'
    };
    setUser(guestUser);
    setToken(null);
    // Persist guest session in sessionStorage to survive reloads within the same tab
    sessionStorage.setItem('prof_guest_user', JSON.stringify(guestUser));
    localStorage.removeItem('prof_token');
    localStorage.removeItem('prof_user');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('prof_token');
    localStorage.removeItem('prof_user');
    sessionStorage.removeItem('prof_guest_user');
  }, []);

  const getAuthHeader = useCallback((): Record<string, string> => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        continueAsGuest,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
