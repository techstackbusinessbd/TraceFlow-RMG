import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PlatformOverviewPage } from './pages/admin/PlatformOverviewPage';
import { ModulePlaceholderPage } from './pages/common/ModulePlaceholderPage';
import { ENTERPRISE_NAV_SECTIONS } from './config/navigationData';
import { useAuthStore } from './store/authStore';
import { resolveLandingPath } from './routes/RoleLandingEngine';

export const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const defaultLanding = user ? resolveLandingPath(user.roles || [], user.default_dashboard_path) : '/login';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Universal Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Root Redirect */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to={defaultLanding} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected App Shell Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* Specific Dedicated Pages */}
          <Route path="/admin/platform-overview" element={<PlatformOverviewPage />} />

          {/* Dynamic Module Routes from Master Configuration */}
          {ENTERPRISE_NAV_SECTIONS.map((section) =>
            section.modules.map((mod) =>
              mod.submodules.map((group) =>
                group.children.map((item) => {
                  if (item.path === '/admin/platform-overview') return null;
                  return (
                    <Route
                      key={item.id}
                      path={item.path}
                      element={
                        <ModulePlaceholderPage
                          title={item.title}
                          moduleCode={mod.code}
                          description={`${group.title} workspace for ${mod.title}`}
                        />
                      }
                    />
                  );
                })
              )
            )
          )}

          {/* Fallback Catch-All inside Shell */}
          <Route path="*" element={<ModulePlaceholderPage title="Dedicated Workspace" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
