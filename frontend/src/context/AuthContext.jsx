import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (name, email, password, role = 'user') => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
        role
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  // Verify Email
  const verifyEmail = async (token) => {
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
      
      if (response.data.success) {
        // Refresh user data
        await checkAuth();
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email verification failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Resend Verification Email
  const resendVerification = async () => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/auth/resend-verification`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend verification email';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });

      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Reset Password
  const resetPassword = async (token, password) => {
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password
      });

      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return user?.isEmailVerified || false;
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    hasRole,
    isAuthenticated,
    isEmailVerified,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
