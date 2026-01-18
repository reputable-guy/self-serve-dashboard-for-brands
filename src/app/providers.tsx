"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  // Zustand stores don't require providers - they work globally
  // This component is kept for future providers like auth, theme, etc.
  return <>{children}</>;
}
