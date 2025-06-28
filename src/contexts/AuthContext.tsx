'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { AuthService } from '@/services/authService';
import { setAuthTokens, getAuthToken, getRefreshToken } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        // Mock user data from stored info or API call
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };

    initAuth();

    // Set up token refresh interval (check every 30 seconds)
    const tokenRefreshInterval = setInterval(async () => {
      const token = getAuthToken();
      const refreshToken = getRefreshToken();

      if (token && refreshToken && user) {
        try {
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            setAuthTokens(newToken, refreshToken);
          } else {
            // Refresh failed, logout user
            logout();
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const login = async (username: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await AuthService.login(username);
      if (response) {
        setAuthTokens(response.token, response.refreshToken);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
