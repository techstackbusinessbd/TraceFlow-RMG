import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PlatformOverviewPage } from './pages/admin/PlatformOverviewPage';
import { UserListPage } from './pages/admin/users/UserListPage';
import { UserCreatePage } from './pages/admin/users/UserCreatePage';
import { UserEditPage } from './pages/admin/users/UserEditPage';
import { UserResetPasswordPage } from './pages/admin/users/UserResetPasswordPage';
import { UserDeletePage } from './pages/admin/users/UserDeletePage';
import { UserArchivedPage } from './pages/admin/users/UserArchivedPage';
import { UserPermanentDeletePage } from './pages/admin/users/UserPermanentDeletePage';
import { UserPermissionsPage } from './pages/admin/users/UserPermissionsPage';
import { UserPrivilegesOverviewPage } from './pages/admin/users/UserPrivilegesOverviewPage';
import { RoleListPage } from './pages/admin/roles/RoleListPage';
import { RolePermissionsPage } from './pages/admin/roles/RolePermissionsPage';
import { AuditVaultPage } from './pages/admin/security/AuditVaultPage';
import { DeviceListPage } from './pages/admin/devices/DeviceListPage';
import { OrganizationOverviewPage } from './pages/master/organization/OrganizationOverviewPage';
import { CompanyListPage } from './pages/master/organization/CompanyListPage';
import { CompanyCreatePage } from './pages/master/organization/CompanyCreatePage';
import { CompanyEditPage } from './pages/master/organization/CompanyEditPage';
import { FactoryUnitListPage } from './pages/master/organization/FactoryUnitListPage';
import { FactoryUnitCreatePage } from './pages/master/organization/FactoryUnitCreatePage';
import { FactoryUnitEditPage } from './pages/master/organization/FactoryUnitEditPage';
import { ProductionLineListPage } from './pages/master/organization/ProductionLineListPage';
import { ProductionLineCreatePage } from './pages/master/organization/ProductionLineCreatePage';
import { ProductionLineEditPage } from './pages/master/organization/ProductionLineEditPage';
import { BuildingListPage } from './pages/master/organization/BuildingListPage';
import { BuildingCreatePage } from './pages/master/organization/BuildingCreatePage';
import { BuildingEditPage } from './pages/master/organization/BuildingEditPage';
import { FloorListPage } from './pages/master/organization/FloorListPage';
import { FloorCreatePage } from './pages/master/organization/FloorCreatePage';
import { FloorEditPage } from './pages/master/organization/FloorEditPage';
import { ModulePlaceholderPage } from './pages/common/ModulePlaceholderPage';
import { ALL_SYSTEM_MODULES } from './config/navigationData';
import { UnauthorizedPage } from './pages/common/UnauthorizedPage';
import { NotFoundPage } from './pages/common/NotFoundPage';
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
          <Route path="/admin/users/:id/reset-password" element={<UserResetPasswordPage />} />
          <Route path="/admin/users/:id/permissions" element={<UserPermissionsPage />} />
          <Route path="/admin/users/:id/delete" element={<UserDeletePage />} />
          <Route path="/admin/users/:id/permanent-delete" element={<UserPermanentDeletePage />} />
          <Route path="/admin/roles" element={<RoleListPage />} />
          <Route path="/admin/roles/:id/permissions" element={<RolePermissionsPage />} />
          <Route path="/admin/privileges" element={<UserPrivilegesOverviewPage />} />
          <Route path="/admin/privileges/:id" element={<UserPermissionsPage />} />
          <Route path="/admin/audit-vault" element={<AuditVaultPage />} />
          <Route path="/admin/purge-console" element={<Navigate to="/admin/users/archived" replace />} />
          <Route path="/admin/devices" element={<DeviceListPage />} />

          {/* Module 02: Master Library - Organization Setup */}
          <Route path="/master-data/organization" element={<OrganizationOverviewPage />} />
          <Route path="/master-data/companies" element={<CompanyListPage />} />
          <Route path="/master-data/companies/create" element={<CompanyCreatePage />} />
          <Route path="/master-data/companies/:id/edit" element={<CompanyEditPage />} />
          <Route path="/master-data/units" element={<FactoryUnitListPage />} />
          <Route path="/master-data/units/create" element={<FactoryUnitCreatePage />} />
          <Route path="/master-data/units/:id/edit" element={<FactoryUnitEditPage />} />
          <Route path="/master-data/buildings" element={<BuildingListPage />} />
          <Route path="/master-data/buildings/create" element={<BuildingCreatePage />} />
          <Route path="/master-data/buildings/:id/edit" element={<BuildingEditPage />} />
          <Route path="/master-data/floors" element={<FloorListPage />} />
          <Route path="/master-data/floors/create" element={<FloorCreatePage />} />
          <Route path="/master-data/floors/:id/edit" element={<FloorEditPage />} />
          <Route path="/master-data/lines" element={<ProductionLineListPage />} />
          <Route path="/master-data/lines/create" element={<ProductionLineCreatePage />} />
          <Route path="/master-data/lines/:id/edit" element={<ProductionLineEditPage />} />

          {/* Security & System Error Pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/403" element={<Navigate to="/unauthorized" replace />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* Dynamic Module Routes from Master Configuration */}
          {ALL_SYSTEM_MODULES.map((mod) =>
            mod.submodules.map((group) =>
              group.children.map((item) => {
                const explicitPaths = [
                  '/admin/platform-overview',
                  '/admin/users',
                  '/admin/roles',
                  '/admin/privileges',
                  '/admin/audit-vault',
                  '/admin/purge-console',
                  '/admin/devices',
                  '/master-data/organization',
                  '/master-data/companies',
                  '/master-data/units',
                  '/master-data/buildings',
                  '/master-data/floors',
                  '/master-data/lines',
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

          {/* Dedicated 404 Catch-All inside Shell */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
