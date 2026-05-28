import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FullScreenLoader } from './LottieLoader';
import { useMinimumLoading } from '../../hooks/useMinimumLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute - handles authentication and onboarding redirection.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const showLoading = useMinimumLoading(isLoading);
  const location = useLocation();

  if (showLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if needed, but only if we're not already there
  if (requireOnboarding && needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If already onboarded, don't allow going back to onboarding page
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/discovery" replace />;
  }

  return <>{children}</>;
};
