"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function ConditionalSidebar() {
  const pathname = usePathname();

  // Don't render the brand sidebar on:
  // - Landing page (root)
  // - Admin routes
  // - Verification pages
  // - Study public pages
  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/study/")
  ) {
    return null;
  }

  return <Sidebar />;
}
