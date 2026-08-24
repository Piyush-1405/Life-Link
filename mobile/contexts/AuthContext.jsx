import React, { createContext, useState, useEffect } from 'react';
import { getToken, getUser, clearAll } from '../utils/storage';
import * as authService from '../services/auth.service';
import { router } from 'expo-router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await getToken();
        const storedUser = await getUser();
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      }
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
