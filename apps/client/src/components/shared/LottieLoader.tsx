import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOTTIE_SRC =
  'https://lottie.host/84b9d5b2-f1e7-4f4a-85af-ad3a1018556b/dRL26Vos0e.lottie';

interface LottieLoaderProps {
  /** Size of the animation. Defaults to 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Optional descriptive label shown below the animation */
  label?: string;
  /** Extra Tailwind classes on the wrapper */
  className?: string;
}

const sizeMap: Record<NonNullable<LottieLoaderProps['size']>, number> = {
  sm: 80,
  md: 140,
  lg: 160,
};

/**
 * LottieLoader — base animated loading indicator.
 */
export const LottieLoader: React.FC<LottieLoaderProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const px = sizeMap[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label ?? 'Loading…'}
    >
      <DotLottieReact
        src={LOTTIE_SRC}
        loop
        autoplay
        style={{ width: px, height: px }}
      />
      {label && (
        <p className="text-on-surface-variant text-sm font-medium animate-pulse tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
};

/**
 * DashboardPageLoader — sidebar-aware page loader used inside DashboardLayout.
 *
 * Accounts for:
 * - TopAppBar height: 64px  →  min-h-[calc(100vh-64px)]
 * - SideNav width:   288px  →  md:ml-72
 * - Background matches the page bg-surface
 *
 * Use this for ALL loading states inside dashboard routes (Discovery, Profile, etc.)
 */
export const DashboardPageLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex-1 md:ml-72 min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center">
    <LottieLoader size="md" label={label} />
  </div>
);

/**
 * FullScreenLoader — used ONLY for auth-level loading (ProtectedRoute)
 * before the layout is even mounted, so there is no sidebar offset.
 */
export const FullScreenLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div className="h-screen w-screen flex items-center justify-center bg-surface">
    <LottieLoader size="md" label={label} />
  </div>
);

/**
 * @deprecated Use DashboardPageLoader instead.
 * Kept for backwards compatibility.
 */
export const PageLoader: React.FC<{ label?: string }> = ({ label }) => (
  <DashboardPageLoader label={label} />
);
