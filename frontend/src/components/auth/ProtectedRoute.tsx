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
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="text-xl font-bold text-rose-500 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-400">
          You do not have the required enterprise role ({requiredRole}) to access this page.
        </p>
      </div>
    );
  }

  return children;
};
