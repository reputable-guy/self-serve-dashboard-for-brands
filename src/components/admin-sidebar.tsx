"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FlaskConical,
  Settings,
  ChevronRight,
} from "lucide-react";
import { getCurrentUser, getRoleDisplayName } from "@/lib/roles";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/studies", label: "Studies", icon: FlaskConical },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo and Admin Badge */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logos/reputable-logo-dark-compact.png"
            alt="Reputable"
            width={240}
            height={58}
            className="h-8 w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* Admin Badge */}
      <div className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-xs font-medium text-orange-600">
            {getRoleDisplayName(user.role)}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {adminNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4">
        <Link
          href="/admin/studies/new"
          className="flex items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Study
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
