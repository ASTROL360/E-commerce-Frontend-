import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      const profile = res.data?.data || res.data;
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch {
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const data = res.data?.data || res.data;
      const authToken = data.token;
      const userData = data;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      try {
        const profileRes = await authService.getProfile();
        const profile = profileRes.data?.data || profileRes.data;
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch {
        // Keep login data
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authService.register(name, email, password);
      const data = res.data?.data || res.data;
      const authToken = data.token;
      setToken(authToken);
      setUser(data);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
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
