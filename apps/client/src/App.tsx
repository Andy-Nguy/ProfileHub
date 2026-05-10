import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TopAppBar } from './components/layout/TopAppBar';

/**
 * App root — global TopAppBar is rendered on every page except auth pages.
 *
 * Routes:
 *   /              → LandingPage  (public)
 *   /login         → LoginPage
 *   /register      → RegisterPage
 *   /discovery     → DiscoveryPage
 *   /profile       → ProfilePage  (own profile — current user)
 *   /u/:username   → ProfilePage  (any user's public portfolio)
 *   /messages      → ComingSoonPage
 *   /analytics     → ComingSoonPage
 *   /settings      → ComingSoonPage
 */
const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <TopAppBar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />

          {/* Own profile shortcut (no username → defaults to current user) */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Any user's public portfolio */}
          <Route path="/u/:username" element={<ProfilePage />} />

          {/* ── Coming Soon ─────────────────────────────────── */}
          <Route path="/messages"  element={<ComingSoonPage title="Messages"           icon="mail"        description="Your professional messaging hub is being built. Soon you'll be able to connect directly with experts." />} />
          <Route path="/network"   element={<ComingSoonPage title="Professional Network" icon="group"     description="Expand your reach. We are designing a powerful way for you to discover and connect with peers." />} />
          <Route path="/resources" element={<ComingSoonPage title="Resources"           icon="folder_open" description="A curated library of professional resources is coming your way. Expand your knowledge base." />} />
          <Route path="/analytics" element={<ComingSoonPage title="Analytics"           icon="insights"    description="Gain deep insights into your profile reach and professional impact. Detailed metrics coming soon." />} />
          <Route path="/settings"  element={<ComingSoonPage title="Settings"            icon="settings"    description="Personalize your ProHub experience. Advanced account and privacy controls are being finalized." />} />

          <Route path="*" element={
            <ComingSoonPage
              title="Page Not Found"
              icon="search_off"
              description="The page you are looking for doesn't exist or has been moved."
            />
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;
