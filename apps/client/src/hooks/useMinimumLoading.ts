import { useState, useEffect, useRef } from 'react';

// Get default loading debounce time from environment variable or fallback to 800ms
const DEFAULT_MIN_TIME = 800;
const envMinTime = import.meta.env.VITE_LOADING_DEBOUNCE_MS
  ? parseInt(import.meta.env.VITE_LOADING_DEBOUNCE_MS, 10)
  : NaN;

export const LOADING_DEBOUNCE_MS = !isNaN(envMinTime) ? envMinTime : DEFAULT_MIN_TIME;

/**
 * useMinimumLoading
 * Ensures loading state stays true for at least `minTime` ms
 * so that loaders/animations don't flicker too quickly.
 *
 * @param isLoading The actual loading state from API/Context
 * @param minTime Minimum time in milliseconds to keep loading state active (default loaded from ENV or fallback to 800ms)
 */
export function useMinimumLoading(isLoading: boolean, minTime = LOADING_DEBOUNCE_MS): boolean {
  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
      setDelayedLoading(true);
    } else {
      if (startTimeRef.current !== null) {
        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minTime - elapsedTime);

        const timer = setTimeout(() => {
          setDelayedLoading(false);
          startTimeRef.current = null;
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        setDelayedLoading(false);
      }
    }
  }, [isLoading, minTime]);

  return delayedLoading;
}
