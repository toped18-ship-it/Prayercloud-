/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shell from './components/layout/Shell';
import { 
  DashboardSkeleton, 
  CardsGridSkeleton, 
  DetailSkeleton, 
  ChatSkeleton, 
  TableSkeleton 
} from './components/ui/SkeletonLoader';

// Main Pages (Code-split via lazy)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CountriesPage = lazy(() => import('./pages/CountriesPage'));
const CountryDetailPage = lazy(() => import('./pages/CountryDetailPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MissionaryHub = lazy(() => import('./pages/MissionaryHub'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const GmailPage = lazy(() => import('./pages/GmailPage'));

import { AuthProvider } from './lib/AuthContext';
import { RequireAuth } from './components/auth/PermissionGate';

// Admin Layout & Pages (Code-split via lazy)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBranding = lazy(() => import('./pages/admin/Branding'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const AdminSecurity = lazy(() => import('./pages/admin/Security'));
const AdminEmail = lazy(() => import('./pages/admin/EmailSettings'));
const AdminAPIIntegrations = lazy(() => import('./pages/admin/APIIntegrations'));
const AdminHomepage = lazy(() => import('./pages/admin/Homepage'));
const AdminRoles = lazy(() => import('./pages/admin/Roles'));
const AdminCountries = lazy(() => import('./pages/admin/Countries'));
const AdminUnreached = lazy(() => import('./pages/admin/UnreachedPlaces'));
const AdminHub = lazy(() => import('./pages/admin/MissionaryHubControl'));
const AdminChat = lazy(() => import('./pages/admin/ChatModeration'));
const AdminRecordings = lazy(() => import('./pages/admin/Recordings'));
const AdminPrayer = lazy(() => import('./pages/admin/PrayerRequests'));
const AdminEvents = lazy(() => import('./pages/admin/Events'));
const AdminResources = lazy(() => import('./pages/admin/Resources'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminBackups = lazy(() => import('./pages/admin/Backups'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route path="/" element={<Shell><Suspense fallback={<DashboardSkeleton />}><LandingPage /></Suspense></Shell>} />
            
            {/* Protected Main Routes */}
            <Route path="/home" element={
              <Shell>
                <RequireAuth permission="view_dashboard" fallback={<DashboardSkeleton />}>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <Dashboard />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/countries" element={
              <Shell>
                <RequireAuth permission="view_countries" fallback={<CardsGridSkeleton count={8} />}>
                  <Suspense fallback={<CardsGridSkeleton count={8} />}>
                    <CountriesPage />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/countries/:id" element={
              <Shell>
                <RequireAuth permission="view_countries" fallback={<DetailSkeleton />}>
                  <Suspense fallback={<DetailSkeleton />}>
                    <CountryDetailPage />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/map" element={
              <Shell>
                <RequireAuth permission="view_countries" fallback={<DashboardSkeleton />}>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <MapPage />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/missionary-hub" element={
              <Shell>
                <RequireAuth permission="view_missionary_hub" fallback={<CardsGridSkeleton count={6} />}>
                  <Suspense fallback={<CardsGridSkeleton count={6} />}>
                    <MissionaryHub />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/chat" element={
              <Shell>
                <RequireAuth permission="post_prayer_requests" fallback={<ChatSkeleton />}>
                  <Suspense fallback={<ChatSkeleton />}>
                    <ChatPage />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />
            <Route path="/gmail" element={
              <Shell>
                <RequireAuth permission="view_dashboard" fallback={<TableSkeleton rows={8} title="Missionary Correspondence" />}>
                  <Suspense fallback={<TableSkeleton rows={8} title="Missionary Correspondence" />}>
                    <GmailPage />
                  </Suspense>
                </RequireAuth>
              </Shell>
            } />

            {/* Super Admin Dashboard Routes */}
            <Route path="/admin" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/branding" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminBranding />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/homepage" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminHomepage />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/users" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/audit-logs" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminAuditLogs />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/security" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminSecurity />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/email" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminEmail />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/api" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminAPIIntegrations />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/roles" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminRoles />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/countries" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminCountries />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/unreached" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminUnreached />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/hub" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminHub />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/chat" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminChat />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/recordings" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminRecordings />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/prayer" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminPrayer />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/events" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminEvents />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/resources" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminResources />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/notifications" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminNotifications />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/analytics" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />
            <Route path="/admin/backups" element={
              <RequireAuth permission="access_admin_panel" fallback={<div className="p-8"><TableSkeleton /></div>}>
                <Suspense fallback={<div className="p-8"><TableSkeleton /></div>}>
                  <AdminLayout>
                    <AdminBackups />
                  </AdminLayout>
                </Suspense>
              </RequireAuth>
            } />

            <Route path="/unauthorized" element={<Shell><Suspense fallback={<DashboardSkeleton />}><UnauthorizedPage /></Suspense></Shell>} />
            <Route path="/register" element={<Shell><Suspense fallback={<DashboardSkeleton />}><RegisterPage /></Suspense></Shell>} />
            <Route path="/login" element={<Shell><Suspense fallback={<DashboardSkeleton />}><RegisterPage /></Suspense></Shell>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
