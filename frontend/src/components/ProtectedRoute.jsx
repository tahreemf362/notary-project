import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Component
export const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route (redirects to dashboard if already logged in)
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Email Verification Required
export const RequireEmailVerification = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified()) {
    return <Navigate to="/verify-email-required" replace />;
  }

  return children;
};

// Admin Only Route
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute roles="admin">
      {children}
    </ProtectedRoute>
  );
};

// Notary Only Route
export const NotaryRoute = ({ children }) => {
  return (
    <ProtectedRoute roles={['notary', 'admin']}>
      {children}
    </ProtectedRoute>
  );
};
