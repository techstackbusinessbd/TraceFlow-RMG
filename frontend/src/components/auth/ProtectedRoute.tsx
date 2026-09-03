import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated()) {
    const redirectParam = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect_to=${redirectParam}`} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ attemptedPath: location.pathname, requiredRole }}
        replace
      />
    );
  }

  return children;
};
