"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * StoreHydrationProvider
 *
 * Waits for client-side hydration to complete before rendering children.
 * This prevents React hydration errors caused by Zustand stores that persist
 * to localStorage - the server renders with seed data while the client may
 * have different persisted data.
 *
 * By rendering a consistent placeholder on both server and initial client render,
 * we avoid the mismatch entirely.
 */
export function StoreHydrationProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This only runs on the client after hydration
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return null or a loading state - must be the same on server and client
    // Using null means the page shell (layout) renders but content waits
    return null;
  }

  return <>{children}</>;
}
