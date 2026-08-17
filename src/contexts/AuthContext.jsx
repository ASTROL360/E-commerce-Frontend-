import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';
import { unwrap } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const loadProfile = async (fallback) => {
    try {
      const res = await authService.getProfile();
      return unwrap(res);
    } catch {
      return fallback;
    }
  };

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const authData = unwrap(res);
    localStorage.setItem('token', authData.token);
    setToken(authData.token);
    const profile = await loadProfile({ email: authData.email, role: authData.role });
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    const authData = unwrap(res);
    localStorage.setItem('token', authData.token);
    setToken(authData.token);
    const profile = await loadProfile({ name, email: authData.email, role: authData.role });
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    const profile = await loadProfile({ email: '', role: 'CUSTOMER' });
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    login,
    register,
    loginWithToken,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
