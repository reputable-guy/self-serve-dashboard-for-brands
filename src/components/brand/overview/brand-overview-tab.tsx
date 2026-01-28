"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Quote,
  Activity,
} from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { useEarlyInsightsStore } from "@/lib/early-insights-store";
import type { EarlyInsightsData } from "@/lib/types";
import type { StudyData } from "@/components/admin/study-detail/types";

interface BrandOverviewTabProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
}

export function BrandOverviewTab({ study, brand }: BrandOverviewTabProps) {
  const { getEnrollmentStats, getEnrollmentsByStudy } = useEnrollmentStore();
  const { computeInsights, getBaselineCount } = useEarlyInsightsStore();
  const [insights, setInsights] = useState<EarlyInsightsData | null>(null);
  
  const stats = getEnrollmentStats(study.id);
  const enrollments = getEnrollmentsByStudy(study.id);
  const baselineCount = getBaselineCount(study.id);
  const category = study.category || study.categoryKey;

  useEffect(() => {
    if (baselineCount > 0) {
      const computed = computeInsights(study.id, category);
      setInsights(computed);
    }
  }, [study.id, category, baselineCount, computeInsights]);
  
  const totalEnrolled = stats.signedUp + stats.waiting + stats.active + stats.completed;
  const totalActive = stats.active;
  const totalCompleted = stats.completed;

  // Find most recent enrollment for "latest activity"
  const signedUpEnrollments = enrollments
    .filter((e) => e.stage !== "clicked" && e.signedUpAt)
    .sort((a, b) => new Date(b.signedUpAt!).getTime() - new Date(a.signedUpAt!).getTime());
  const latestEnrollment = signedUpEnrollments[0];

  // Get a notable quote if available
  const notableQuote = insights?.notableQuotes?.[0];

  // Calculate study progress
  const studyDays = 28;
  const currentDay = study.status === "completed" ? studyDays : Math.min(
    Math.floor(
      (Date.now() - (study.startDate ? new Date(study.startDate).getTime() : Date.now())) /
        (1000 * 60 * 60 * 24)
    ),
    studyDays
  );
  const progressPercent = Math.max(0, Math.min(100, (currentDay / studyDays) * 100));

  // Determine hero numbers based on study phase
  const isPreLaunch = totalEnrolled === 0;
  const isCompleted = study.status === "completed";

  return (
    <div className="space-y-6">
      {/* Hero Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HeroCard
          icon={<Users className="h-5 w-5 text-[#00D1C1]" />}
          value={isPreLaunch ? "—" : totalEnrolled.toString()}
          label="Enrolled"
          subtitle={
            isPreLaunch
              ? "Waiting for first signup"
              : `of ${study.targetParticipants} target`
          }
        />
        <HeroCard
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          value={isPreLaunch ? "—" : totalActive.toString()}
          label="Active"
          subtitle={isPreLaunch ? "Study not started" : "Currently in study"}
        />
        <HeroCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          value={isPreLaunch ? "—" : totalCompleted.toString()}
          label="Completed"
          subtitle={
            isCompleted
              ? `${Math.round((totalCompleted / Math.max(totalEnrolled, 1)) * 100)}% completion rate`
              : "Finished 28 days"
          }
        />
        <HeroCard
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          value={
            isCompleted && totalCompleted > 0
              ? "+23%"
              : totalEnrolled > 0
              ? `Day ${currentDay}`
              : "—"
          }
          label={isCompleted && totalCompleted > 0 ? "Avg Improvement" : "Study Day"}
          subtitle={
            isCompleted && totalCompleted > 0
              ? `${study.categoryLabel || "Wellness"} Score`
              : isPreLaunch
              ? "Not yet started"
              : `of ${studyDays} days`
          }
        />
      </div>

      {/* Study Timeline */}
      {!isPreLaunch && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Study Timeline
              </div>
              <span className="text-sm text-muted-foreground">
                {isCompleted ? "Study complete" : `Day ${currentDay} of ${studyDays}`}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-1000 ${
                  isCompleted ? "bg-emerald-500" : "bg-[#00D1C1]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day 14</span>
              <span>Day 28</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Row: Latest Activity + Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest Activity */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-4 w-4 text-[#00D1C1]" />
              <span className="text-sm font-medium text-gray-700">Latest Activity</span>
            </div>
            {latestEnrollment ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {latestEnrollment.name || "New participant"} enrolled
                </p>
                <p className="text-xs text-muted-foreground">
                  {getRelativeTime(latestEnrollment.signedUpAt!)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No enrollments yet — share your enrollment link to get started
              </p>
            )}
          </CardContent>
        </Card>

        {/* Featured Quote */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Customer Voice</span>
            </div>
            {notableQuote ? (
              <div className="space-y-2">
                <blockquote className="text-sm text-gray-700 italic leading-relaxed">
                  &ldquo;{notableQuote.quote}&rdquo;
                </blockquote>
                <p className="text-xs text-muted-foreground">
                  — {notableQuote.initials}, {notableQuote.context}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Customer quotes will appear here as participants share their stories
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** Individual hero number card */
function HeroCard({
  icon,
  value,
  label,
  subtitle,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

/** Helper to get relative time string */
function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
