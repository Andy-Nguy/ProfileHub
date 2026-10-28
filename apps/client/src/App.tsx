import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TopAppBar } from './components/layout/TopAppBar';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { OnboardingPage } from './pages/OnboardingPage';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

/**
 * App root — global TopAppBar is rendered on every page except auth and onboarding pages.
 */
const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isOnboardingPage = location.pathname === '/onboarding';

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" richColors />
      {!isAuthPage && !isOnboardingPage && <TopAppBar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* ── Dashboard Layout Routes ───────────────────────────── */}
          <Route element={<DashboardLayout />}>
            <Route path="/discovery" element={<DiscoveryPage />} />
            
            {/* Own profile shortcut */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Any user's public portfolio */}
            <Route path="/u/:username" element={<ProfilePage />} />

            {/* Coming Soon Pages */}
            <Route path="/messages"  element={<ProtectedRoute><ComingSoonPage title="Messages" icon="mail" /></ProtectedRoute>} />
            <Route path="/network"   element={<ProtectedRoute><ComingSoonPage title="Network" icon="group" /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><ComingSoonPage title="Analytics" icon="insights" /></ProtectedRoute>} />
            <Route path="/settings"  element={<ProtectedRoute><ComingSoonPage title="Settings" icon="settings" /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<ComingSoonPage title="Page Not Found" icon="search_off" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
