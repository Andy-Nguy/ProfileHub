import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOTTIE_SRC =
  'https://lottie.host/84b9d5b2-f1e7-4f4a-85af-ad3a1018556b/dRL26Vos0e.lottie';

// ── Design tokens ─────────────────────────────────────────────────────────────
// These must stay in sync with the layout constants in TopAppBar and SideNav.
// TopAppBar height = 64px → min-h-[calc(100vh-64px)]
// SideNav width   = 288px (md:ml-72 = 18rem = 288px)
const TOPBAR_H = 64;
const SIDENAV_W = 288;

// One consistent animation size used across all pages inside the dashboard.
const LOADER_SIZE = 160;

// ── Types ─────────────────────────────────────────────────────────────────────
interface LottieLoaderProps {
  /** Size of the animation in pixels. Defaults to LOADER_SIZE (160). */
  size?: number;
  /** Optional label rendered beneath the animation. */
  label?: string;
  /** Extra CSS classes on the wrapper div. */
  className?: string;
}

// ── Base atom ─────────────────────────────────────────────────────────────────
/**
 * LottieLoader — raw animated indicator.
 * Use the higher-level exports (DashboardLoader / FullScreenLoader) instead.
 */
export const LottieLoader: React.FC<LottieLoaderProps> = ({
  size = LOADER_SIZE,
  label,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
    role="status"
    aria-label={label ?? 'Loading…'}
  >
    <DotLottieReact
      src={LOTTIE_SRC}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
    {label && (
      <p className="text-on-surface-variant text-sm font-medium tracking-wide animate-pulse">
        {label}
      </p>
    )}
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
    style={{
      // Fallback inline styles so the values stay in sync with the tokens above
      paddingLeft: undefined,
      paddingTop: undefined,
    }}
  >
    {/* Re-center after accounting for sidebar + topbar offsets */}
    <div
      className="flex items-center justify-center"
      style={{
        width: `calc(100vw - ${SIDENAV_W}px)`,
        height: `calc(100vh - ${TOPBAR_H}px)`,
      }}
    >
      <LottieLoader size={LOADER_SIZE} label={label} />
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
    <LottieLoader size={LOADER_SIZE} label={label} />
  </div>
);
