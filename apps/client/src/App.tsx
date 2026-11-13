import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TopAppBar } from './components/layout/TopAppBar';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { DashboardLoader } from './components/shared/LottieLoader';

const LandingPage = React.lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const DiscoveryPage = React.lazy(() =>
  import('./pages/DiscoveryPage').then((m) => ({ default: m.DiscoveryPage })),
);
const ProfilePage = React.lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const ComingSoonPage = React.lazy(() =>
  import('./pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })),
);
const LoginPage = React.lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = React.lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const OnboardingPage = React.lazy(() =>
  import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
);

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
        <Suspense fallback={<DashboardLoader />}>
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
              <Route path="/resources" element={<ComingSoonPage title="Resources" icon="folder" />} />
              <Route path="/analytics" element={<ProtectedRoute><ComingSoonPage title="Analytics" icon="insights" /></ProtectedRoute>} />
              <Route path="/settings"  element={<ProtectedRoute><ComingSoonPage title="Settings" icon="settings" /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<ComingSoonPage title="Page Not Found" icon="search_off" hasSideNav={false} />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
