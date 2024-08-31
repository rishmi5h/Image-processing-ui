import { useState } from 'react';

export const useLocalStorage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [refreshExpiresAt, setRefreshExpiresAt] = useState(null);
};
