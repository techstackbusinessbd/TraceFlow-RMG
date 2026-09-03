import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PlatformOverviewPage } from './pages/admin/PlatformOverviewPage';
import { UserListPage } from './pages/admin/users/UserListPage';
import { UserCreatePage } from './pages/admin/users/UserCreatePage';
import { UserEditPage } from './pages/admin/users/UserEditPage';
import { UserDeletePage } from './pages/admin/users/UserDeletePage';
import { UserArchivedPage } from './pages/admin/users/UserArchivedPage';
import { UserPermanentDeletePage } from './pages/admin/users/UserPermanentDeletePage';
import { UserPermissionsPage } from './pages/admin/users/UserPermissionsPage';
import { RoleListPage } from './pages/admin/roles/RoleListPage';
import { RolePermissionsPage } from './pages/admin/roles/RolePermissionsPage';
import { ModulePlaceholderPage } from './pages/common/ModulePlaceholderPage';
import { ALL_SYSTEM_MODULES } from './config/navigationData';
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
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/create" element={<UserCreatePage />} />
          <Route path="/admin/users/archived" element={<UserArchivedPage />} />
          <Route path="/admin/users/:id/edit" element={<UserEditPage />} />
          <Route path="/admin/users/:id/permissions" element={<UserPermissionsPage />} />
          <Route path="/admin/users/:id/delete" element={<UserDeletePage />} />
          <Route path="/admin/users/:id/permanent-delete" element={<UserPermanentDeletePage />} />
          <Route path="/admin/roles" element={<RoleListPage />} />
          <Route path="/admin/roles/:id/permissions" element={<RolePermissionsPage />} />

          {/* Dynamic Module Routes from Master Configuration */}
          {ALL_SYSTEM_MODULES.map((mod) =>
            mod.submodules.map((group) =>
              group.children.map((item) => {
                const explicitPaths = [
                  '/admin/platform-overview',
                  '/admin/users',
                  '/admin/roles',
                ];
                if (explicitPaths.includes(item.path)) return null;
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
          )}

          {/* Fallback Catch-All inside Shell */}
          <Route path="*" element={<ModulePlaceholderPage title="Dedicated Workspace" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
