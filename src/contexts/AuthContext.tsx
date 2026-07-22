import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken, removeToken, parseJwt } from '../utils/authUtils';
import { LoginResponse } from '../services/authService';

interface UserContextData {
  nic: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserContextData | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserContextData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setUser({ nic: decoded.sub, role: decoded.role });
      } else {
        removeToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: LoginResponse) => {
    setToken(data.token);
    setIsAuthenticated(true);
    setUser({ nic: data.nic, role: data.role });
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
