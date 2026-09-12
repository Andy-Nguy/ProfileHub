import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FullScreenLoader } from './LottieLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute - handles authentication and onboarding redirection.
 *
 * If a cached session already exists, the page renders immediately so F5
 * does not flash a full-screen loader and then a second in-layout loader.
 * FullScreenLoader is only used when we have no user yet (cold bootstrap).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const location = useLocation();

  if (isLoading && !isAuthenticated) {
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
