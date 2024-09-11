import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../api/getUrl.tsx';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } else {
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
    // Set up periodic token validation
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        baseUrl + '/login',
        { password, username },
        { headers: { Authorization: '' } },
      );
      const token = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch {
      throw new Error('Login failed');
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        baseUrl + '/register',
        { password, username },
        { headers: { Authorization: '' } },
      );
      const token = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/login');
      } else {
        throw new Error('No token received');
      }
    } catch {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, register, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
