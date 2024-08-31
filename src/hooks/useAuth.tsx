import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/login',
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
        'http://localhost:8080/register',
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
      value={{ isAuthenticated, login, logout, register, token }}
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
