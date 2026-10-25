import React from 'react';
import { LetterLoader } from './LetterLoader';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LottieLoaderProps {
  /** Kept for call-site compatibility. */
  size?: number;
  /** Optional accessible status label. */
  label?: string;
  /** Extra CSS classes on the wrapper div. */
  className?: string;
}

// ── Base atom ─────────────────────────────────────────────────────────────────
/**
 * LottieLoader — page loading indicator (staggered Loading.. animation).
 * Use the higher-level exports (DashboardLoader / FullScreenLoader) instead.
 */
export const LottieLoader: React.FC<LottieLoaderProps> = ({
  label,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center ${className}`}
    role="status"
    aria-label={label ?? 'Loading…'}
  >
    <LetterLoader />
  </div>
);

// ── Dashboard-aware loader ────────────────────────────────────────────────────
/**
 * DashboardLoader — perfectly centred inside the main content area of the
 * dashboard layout (accounts for the SideNav width on md+ screens and
 * the TopAppBar height).
 *
 * Use this inside every page that lives within the dashboard (DashboardLayout).
 */
export const DashboardLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div
    className="
      fixed inset-0
      flex items-center justify-center
      bg-surface
      md:pl-[288px]
      pt-[64px]
      z-10
    "
  >
    <div className="flex items-center justify-center w-full h-full px-4">
      <LottieLoader label={label} />
    </div>
  </div>
);

// ── Full-screen loader (auth / onboarding routes) ─────────────────────────────
/**
 * FullScreenLoader — covers the entire viewport.
 * Use ONLY on routes that have no SideNav or TopAppBar (e.g., ProtectedRoute
 * auth guard while resolving the session).
 */
export const FullScreenLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-surface z-50">
    <LottieLoader label={label} />
  </div>
);
