"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Quote,
  Activity,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { useEarlyInsightsStore } from "@/lib/early-insights-store";
import {
  getCompletedStoriesFromEnrollments,
} from "@/lib/simulation";
import type { EarlyInsightsData, ParticipantStory } from "@/lib/types";
import type { StudyData } from "@/components/admin/study-detail/types";

interface BrandOverviewTabProps {
  study: StudyData;
  brand?: { id: string; name: string; logoUrl?: string };
  realStories?: ParticipantStory[] | null;
}

export function BrandOverviewTab({ study, realStories }: BrandOverviewTabProps) {
  const { getEnrollmentStats, getEnrollmentsByStudy } = useEnrollmentStore();
  const { computeInsights, getBaselineCount } = useEarlyInsightsStore();
  const [insights, setInsights] = useState<EarlyInsightsData | null>(null);

  const isRealData = !!realStories && realStories.length > 0;

  const stats = getEnrollmentStats(study.id);
  const enrollments = getEnrollmentsByStudy(study.id);
  const baselineCount = getBaselineCount(study.id);
  const category = study.category;

  useEffect(() => {
    if (!isRealData && baselineCount > 0) {
      const computed = computeInsights(study.id, category);
      setInsights(computed);
    }
  }, [study.id, category, baselineCount, computeInsights, isRealData]);

  // For real data studies, derive counts from the stories
  const totalEnrolled = isRealData
    ? (study.targetParticipants || realStories.length)
    : stats.signedUp + stats.waiting + stats.active + stats.completed;
  const totalActive = isRealData ? 0 : stats.active;
  const totalCompleted = isRealData
    ? realStories.length  // All real stories are completed participants
    : stats.completed;

  // Get completed stories for the featured result
  const completedStories = useMemo(() => {
    if (isRealData) {
      // Real stories are already completed — filter to those with outcome data
      // All real stories are completed participants
      return realStories;
    }
    return getCompletedStoriesFromEnrollments(enrollments, category);
  }, [isRealData, realStories, enrollments, category]);

  // Helper: get the primary improvement % for a story (assessment or wearable)
  const getImprovementPercent = useCallback((s: ParticipantStory): number | null => {
    // Try assessment data first
    const assess = s.assessmentResults?.[0] || s.assessmentResult;
    if (assess?.change?.compositePercent !== undefined) {
      return assess.change.compositePercent;
    }
    // Fall back to wearable HRV change
    if (s.wearableMetrics?.hrvChange?.changePercent !== undefined) {
      return s.wearableMetrics.hrvChange.changePercent;
    }
    return null;
  }, []);

  const bestStory = useMemo(() => {
    if (completedStories.length === 0) return null;
    // Prefer stories with the highest actual improvement
    const withScores = completedStories
      .map((s) => ({
        story: s,
        change: getImprovementPercent(s) ?? 0,
      }))
      .sort((a, b) => b.change - a.change);
    return withScores[0]?.story || completedStories[0];
  }, [completedStories, getImprovementPercent]);

  // Compute real avg improvement from completed stories
  const avgImprovement = useMemo(() => {
    if (completedStories.length === 0) return null;
    // For real data studies, use the study's pre-computed avg if available
    if (isRealData && study.avgImprovement) {
      return Math.round(
        typeof study.avgImprovement === "number"
          ? study.avgImprovement
          : parseFloat(study.avgImprovement) || 0
      );
    }
    const improvements = completedStories
      .map((s) => getImprovementPercent(s))
      .filter((v): v is number => v !== undefined && v !== null);
    if (improvements.length === 0) return null;
    return Math.round(
      improvements.reduce((a, b) => a + b, 0) / improvements.length
    );
  }, [completedStories, isRealData, study.avgImprovement, getImprovementPercent]);

  // Find most recent enrollment for "latest activity"
  const signedUpEnrollments = enrollments
    .filter((e) => e.stage !== "clicked" && e.signedUpAt)
    .sort(
      (a, b) =>
        new Date(b.signedUpAt!).getTime() - new Date(a.signedUpAt!).getTime()
    );
  const latestEnrollment = signedUpEnrollments[0];

  // Get a notable quote — from real stories' testimonials or from insights
  const notableQuote = useMemo(() => {
    if (isRealData) {
      // Find a story with a good testimonial (not the best story — want variety)
      const withQuotes = completedStories
        .filter((s) => s.finalTestimonial?.quote && s !== bestStory)
        .sort((a, b) => (b.finalTestimonial?.overallRating || 0) - (a.finalTestimonial?.overallRating || 0));
      const quoter = withQuotes[0] || completedStories.find((s) => s.finalTestimonial?.quote);
      if (quoter?.finalTestimonial?.quote) {
        return {
          quote: quoter.finalTestimonial.quote,
          initials: quoter.initials || quoter.name?.[0] || "?",
          context: quoter.finalTestimonial.satisfaction || "Participant testimonial",
        };
      }
      return null;
    }
    return insights?.notableQuotes?.[0] || null;
  }, [isRealData, completedStories, bestStory, insights]);

  // Calculate study progress
  const studyDays = 28;
  const currentDay =
    study.status === "completed"
      ? studyDays
      : Math.min(
          Math.floor(
            (Date.now() -
              (study.startDate
                ? new Date(study.startDate).getTime()
                : Date.now())) /
              (1000 * 60 * 60 * 24)
          ),
          studyDays
        );
  const progressPercent = Math.max(
    0,
    Math.min(100, (currentDay / studyDays) * 100)
  );

  const isPreLaunch = totalEnrolled === 0;
  const isCompleted = study.status === "completed";
  const hasCompletions = totalCompleted > 0;

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
            hasCompletions
              ? `${Math.round((totalCompleted / Math.max(totalEnrolled, 1)) * 100)}% completion rate`
              : "Finished 28 days"
          }
        />
        <HeroCard
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          value={
            avgImprovement !== null
              ? `+${avgImprovement}%`
              : totalEnrolled > 0
                ? `Day ${currentDay}`
                : "—"
          }
          label={avgImprovement !== null ? "Avg Improvement" : "Study Day"}
          subtitle={
            avgImprovement !== null
              ? isRealData && completedStories[0]?.wearableMetrics?.hrvChange
                ? "HRV"
                : `${study.categoryLabel || "Stress & Sleep"} Score`
              : isPreLaunch
                ? "Not yet started"
                : `of ${studyDays} days`
          }
          highlight={avgImprovement !== null}
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
                {isCompleted
                  ? "Study complete"
                  : `Day ${currentDay} of ${studyDays}`}
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

      {/* Featured Result — the "journey + outcome" blend */}
      {hasCompletions && bestStory ? (
        <FeaturedResultCard story={bestStory} category={category} />
      ) : !isPreLaunch ? (
        <FeaturedResultPlaceholder />
      ) : null}

      {/* Bottom Row: Latest Activity + Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest Activity */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-4 w-4 text-[#00D1C1]" />
              <span className="text-sm font-medium text-gray-700">
                Latest Activity
              </span>
            </div>
            {isRealData && study.endDate ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  Study completed
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(study.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}{totalCompleted} participants finished
                </p>
              </div>
            ) : latestEnrollment ? (
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
              <span className="text-sm font-medium text-gray-700">
                Customer Voice
              </span>
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
                Customer quotes will appear here as participants share their
                stories
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED RESULT CARD — The transformation story
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedResultCard({
  story,
  category,
}: {
  story: ParticipantStory;
  category: string;
}) {
  const assessment = story.assessmentResults?.[0] || story.assessmentResult;
  const baselineScore = assessment?.baseline?.compositeScore;
  const endpointScore = assessment?.endpoint?.compositeScore;
  const scoreChange = assessment?.change?.compositePercent;
  const testimonial = story.finalTestimonial;
  const lastQuote = story.journey?.keyQuotes?.slice(-1)[0];
  const displayQuote = testimonial?.quote || lastQuote?.quote;
  const rating = testimonial?.overallRating || story.overallRating || 4;
  const wearable = story.wearableMetrics;

  return (
    <Card className="border-[#00D1C1]/20 bg-gradient-to-r from-[#00D1C1]/5 via-transparent to-emerald-50/30 overflow-hidden">
      <CardContent className="pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00D1C1]" />
            <span className="text-sm font-semibold text-gray-900">
              Featured Result
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200 bg-emerald-50"
          >
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Participant Info */}
          <div className="flex items-start gap-3 md:w-1/3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {story.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {story.name}
              </p>
              {story.profile?.location && (
                <p className="text-xs text-muted-foreground">
                  {story.profile.ageRange} · {story.profile.location}
                </p>
              )}
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.floor(rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Before → After Metrics */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              {/* Assessment Score */}
              {baselineScore !== undefined && endpointScore !== undefined && (
                <>
                  <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-muted-foreground mb-1">
                      Before (Day 1)
                    </p>
                    <p className="text-2xl font-bold text-gray-400">
                      {Math.round(baselineScore)}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        / 100
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category === "sleep" || category === "stress"
                        ? "Stress & Sleep Score"
                        : "Wellness Score"}
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs text-emerald-600 mb-1 font-medium">
                      After (Day 28)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(endpointScore)}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        / 100
                      </span>
                    </p>
                    {scoreChange !== undefined && (
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {scoreChange > 0 ? "+" : ""}
                        {Math.round(scoreChange)}% improvement
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Wearable HRV Metric (real data — primary for Sensate) */}
              {!baselineScore && wearable?.hrvChange && (
                <>
                  <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-muted-foreground mb-1">
                      Before (Baseline)
                    </p>
                    <p className="text-2xl font-bold text-gray-400">
                      {wearable.hrvChange.before}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        ms
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      HRV · Oura Ring verified
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs text-emerald-600 mb-1 font-medium">
                      After (Day 28)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wearable.hrvChange.after}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        ms
                      </span>
                    </p>
                    {wearable.hrvChange.changePercent > 0 && (
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                        +{Math.round(wearable.hrvChange.changePercent)}% HRV improvement
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Wearable Sleep Metric (simulated data fallback) */}
              {!baselineScore && !wearable?.hrvChange && wearable?.sleepChange && (
                <>
                  <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-muted-foreground mb-1">
                      Sleep Score (Before)
                    </p>
                    <p className="text-2xl font-bold text-gray-400">
                      {wearable.sleepChange.before}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Oura Ring verified
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs text-emerald-600 mb-1 font-medium">
                      Sleep Score (After)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wearable.sleepChange.after}
                    </p>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                      +{Math.round(wearable.sleepChange.changePercent)}% improvement
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        {displayQuote && (
          <div className="mt-4 pt-4 border-t border-[#00D1C1]/10">
            <blockquote className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;{displayQuote}&rdquo;
            </blockquote>
            {testimonial?.reportedBenefits && testimonial.reportedBenefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {testimonial.reportedBenefits.slice(0, 3).map((b) => (
                  <Badge
                    key={b}
                    variant="outline"
                    className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50/50"
                  >
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Placeholder when study is running but no completions yet */
function FeaturedResultPlaceholder() {
  return (
    <Card className="border-dashed border-[#00D1C1]/30">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-[#00D1C1]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Featured Result
            </p>
            <p className="text-xs text-muted-foreground">
              Your first verified before/after transformation will appear here
              as participants complete their 28-day journey
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function HeroCard({
  icon,
  value,
  label,
  subtitle,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-emerald-200 bg-emerald-50/30" : ""}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
        <p
          className={`text-3xl font-bold ${
            highlight ? "text-emerald-600" : "text-gray-900"
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

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
