import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ProfilePage } from './pages/ProfilePage';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">hub</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ProfileHub
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/discovery"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                location.pathname === '/discovery'
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Discover
            </Link>
            <button className="ml-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-light transition-colors">
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* ── Routes ─────────────────────── */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="*" element={
            <div className="flex items-center justify-center h-96">
              <p className="text-on-surface-variant text-lg">Page not found</p>
            </div>
          } />
        </Routes>
      </main>

      {/* ── Footer ─────────────────────── */}
      <footer className="border-t border-outline-variant/30 py-6 mt-auto">
        <p className="text-center text-sm text-on-surface-variant">
          © {new Date().getFullYear()} ProfileHub
        </p>
      </footer>
    </div>
  );
};

export default App;
