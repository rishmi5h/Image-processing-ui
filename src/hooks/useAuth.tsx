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
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  user: { username: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUser({ username: storedUsername });
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
        localStorage.setItem('username', username);
        setToken(token);
        setUser({ username });
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
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
        // Don't set token or authenticate here
        // Delay navigation to show the success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error('No token received');
      }
    } catch {
      throw new Error('Registration failed');
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const response = await axios.put(
        baseUrl + '/update-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        // Password updated successfully
        return;
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        token,
        updatePassword,
        user,
      }}
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
