import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';
import { getGoogleProfile, googleAppPassword } from '../services/googleAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persistAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const loadProfile = async (fallback) => {
    try {
      const res = await authService.getProfile();
      return res.data?.data || res.data;
    } catch {
      return fallback;
    }
  };

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const authData = res.data?.data || res.data;
    localStorage.setItem('token', authData.token);
    setToken(authData.token);
    const profile = await loadProfile({ email: authData.email, role: authData.role });
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    const authData = res.data?.data || res.data;
    localStorage.setItem('token', authData.token);
    setToken(authData.token);
    const profile = await loadProfile({ name, email: authData.email, role: authData.role });
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const loginWithGoogle = async () => {
    const { email, name } = await getGoogleProfile();
    const password = googleAppPassword(email);

    try {
      const res = await authService.login(email, password);
      const authData = res.data?.data || res.data;
      persistAuth(authData.token, await loadProfile({ name, email, role: 'CUSTOMER' }));
      return authData;
    } catch {
      await authService.register(name || 'User', email, password);
      return login(email, password);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    login,
    register,
    loginWithGoogle,
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
