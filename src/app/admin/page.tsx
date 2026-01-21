"use client";

import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Users,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBrands } from "@/lib/roles";
import { AttentionAlerts } from "@/components/admin/attention-alerts";
import { PlatformHealth } from "@/components/admin/platform-health";
import { useActiveAlerts, usePlatformHealth } from "@/lib/alerts-store";

// Mock study data for the dashboard
const recentActivity = [
  {
    id: "1",
    type: "study_created",
    brandName: "Acme Supplements",
    studyName: "SleepWell Premium",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    type: "milestone",
    brandName: "ZenWell",
    studyName: "Calm Drops",
    detail: "50% enrollment reached",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    type: "study_completed",
    brandName: "Vitality Labs",
    studyName: "Energy Boost",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "4",
    type: "brand_added",
    brandName: "NaturaSleep",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "study_created":
      return <FlaskConical className="h-4 w-4 text-blue-500" />;
    case "milestone":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "study_completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "brand_added":
      return <Building2 className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getActivityMessage(activity: (typeof recentActivity)[0]): string {
  switch (activity.type) {
    case "study_created":
      return `Created "${activity.studyName}" for ${activity.brandName}`;
    case "milestone":
      return `${activity.brandName}: ${activity.detail}`;
    case "study_completed":
      return `Study completed: ${activity.studyName}`;
    case "brand_added":
      return `New brand: ${activity.brandName}`;
    default:
      return "Activity";
  }
}

export default function AdminDashboard() {
  const brands = getAllBrands();
  const totalStudies = brands.reduce((sum, b) => sum + b.studyCount, 0);
  const activeStudies = brands.reduce((sum, b) => sum + b.activeStudyCount, 0);

  // Get alerts and health from store
  const activeAlerts = useActiveAlerts();
  const platformHealth = usePlatformHealth();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage brands and studies across the Reputable platform
          </p>
        </div>
        <Link href="/admin/studies/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Study
          </Button>
        </Link>
      </div>

      {/* Attention Alerts (only shown if there are alerts) */}
      {activeAlerts.length > 0 && (
        <AttentionAlerts alerts={activeAlerts} />
      )}

      {/* Platform Health */}
      <PlatformHealth health={platformHealth} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Brands
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-xs text-muted-foreground">
              Active customer accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Studies
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudies}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Studies
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudies}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              Across all studies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Link
                href="/admin/studies"
                className="text-sm font-normal text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getActivityMessage(activity)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/studies/new"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FlaskConical className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Create New Study</p>
                  <p className="text-sm text-muted-foreground">
                    Set up a study for a brand
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            <Link
              href="/admin/brands"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Manage Brands</p>
                  <p className="text-sm text-muted-foreground">
                    View and edit brand accounts
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">Platform Settings</p>
                  <p className="text-sm text-muted-foreground">
                    Configure assessments and defaults
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Brands Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Brands Overview
            <Link
              href="/admin/brands"
              className="text-sm font-normal text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium text-center">Studies</th>
                  <th className="pb-3 font-medium text-center">Active</th>
                  <th className="pb-3 font-medium">Added</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {brand.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium">{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {brand.contactName}
                    </td>
                    <td className="py-3 text-center text-sm">
                      {brand.studyCount}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        brand.activeStudyCount > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {brand.activeStudyCount}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {brand.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/admin/brands/${brand.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
