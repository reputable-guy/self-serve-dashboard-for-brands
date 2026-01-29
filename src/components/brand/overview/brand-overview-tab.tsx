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
  FlaskConical,
  ArrowRight,
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

  // Get the primary improvement metric for a story.
  // Priority: bestMetric (computed from wearable data) → assessment → HRV fallback
  const getImprovementPercent = useCallback((s: ParticipantStory): number | null => {
    // Wearable best metric (the individual metric that improved most)
    if (s.wearableMetrics?.bestMetric?.changePercent !== undefined) {
      const m = s.wearableMetrics.bestMetric;
      // For "lower is better" metrics, changePercent is negative but improvement is positive
      return m.lowerIsBetter ? Math.abs(m.changePercent) : m.changePercent;
    }
    // For real data: prefer wearable HRV
    if (isRealData && s.wearableMetrics?.hrvChange?.changePercent !== undefined) {
      return s.wearableMetrics.hrvChange.changePercent;
    }
    // Assessment fallback
    const assess = s.assessmentResults?.[0] || s.assessmentResult;
    if (assess?.change?.compositePercent !== undefined) {
      return assess.change.compositePercent;
    }
    // HRV fallback
    if (s.wearableMetrics?.hrvChange?.changePercent !== undefined) {
      return s.wearableMetrics.hrvChange.changePercent;
    }
    return null;
  }, [isRealData]);

  // Pick the best story: highest POSITIVE improvement + good rating
  const bestStory = useMemo(() => {
    if (completedStories.length === 0) return null;
    const withScores = completedStories
      .map((s) => ({
        story: s,
        change: getImprovementPercent(s) ?? 0,
        rating: s.finalTestimonial?.overallRating || s.overallRating || 0,
      }))
      // Sort by: positive change first, then by rating as tiebreaker
      .sort((a, b) => {
        if (b.change !== a.change) return b.change - a.change;
        return b.rating - a.rating;
      });
    // Only feature someone with a positive result
    const best = withScores.find(s => s.change > 0) || withScores[0];
    return best?.story || completedStories[0];
  }, [completedStories, getImprovementPercent]);

  // Avg improvement: use study's pre-computed ground truth for real data.
  // For simulated data, compute from stories.
  const avgImprovement = useMemo(() => {
    if (completedStories.length === 0) return null;
    // Real data: use verified ground truth from study config
    if (isRealData && study.avgImprovement !== undefined && study.avgImprovement !== null) {
      return Math.round(
        typeof study.avgImprovement === "number"
          ? study.avgImprovement
          : parseFloat(String(study.avgImprovement)) || 0
      );
    }
    // Simulated: compute from completed stories
    const improvements = completedStories
      .map((s) => getImprovementPercent(s))
      .filter((v): v is number => v !== undefined && v !== null);
    if (improvements.length === 0) return null;
    return Math.round(
      improvements.reduce((a, b) => a + b, 0) / improvements.length
    );
  }, [completedStories, isRealData, study.avgImprovement, getImprovementPercent]);

  // Determine the best metric label for the cohort (what does "avg improvement" refer to?)
  const bestMetricInfo = useMemo(() => {
    if (isRealData && completedStories[0]?.wearableMetrics?.hrvChange) {
      return { label: "HRV", lowerIsBetter: false };
    }
    // For simulated data, find the most common bestMetric label across participants
    const labels: Record<string, { count: number; lowerIsBetter: boolean }> = {};
    for (const s of completedStories) {
      const best = s.wearableMetrics?.bestMetric;
      if (best?.label) {
        if (!labels[best.label]) labels[best.label] = { count: 0, lowerIsBetter: !!best.lowerIsBetter };
        labels[best.label].count++;
      }
    }
    const sorted = Object.entries(labels).sort((a, b) => b[1].count - a[1].count);
    if (sorted[0]) return { label: sorted[0][0], lowerIsBetter: sorted[0][1].lowerIsBetter };
    return { label: (study.categoryLabel || "Wellness") + " Score", lowerIsBetter: false };
  }, [isRealData, completedStories, study.categoryLabel]);

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
              ? `${bestMetricInfo.lowerIsBetter ? '↓' : '+'}${avgImprovement}%`
              : totalEnrolled > 0
                ? `Day ${currentDay}`
                : "—"
          }
          label={avgImprovement !== null ? "Avg Improvement" : "Study Day"}
          subtitle={
            avgImprovement !== null
              ? bestMetricInfo.label
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

      {/* Path to Research — the "layaway plan on research" */}
      <PathToResearchCard
        participantCount={totalCompleted}
        hasCompletions={hasCompletions}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED RESULT CARD — The transformation story
// ─────────────────────────────────────────────────────────────────────────────

/** Format minutes into human-readable duration */
function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function FeaturedResultCard({
  story,
}: {
  story: ParticipantStory;
  category: string;
}) {
  const testimonial = story.finalTestimonial;
  const lastQuote = story.journey?.keyQuotes?.slice(-1)[0];
  const displayQuote = testimonial?.quote || lastQuote?.quote;
  const rating = testimonial?.overallRating || story.overallRating || 4;
  const wearable = story.wearableMetrics;
  const best = wearable?.bestMetric;

  // For real data without bestMetric, fall back to HRV or assessment
  const assessment = story.assessmentResults?.[0] || story.assessmentResult;

  // Collect all individual wearable metrics for secondary display
  type MetricChange = { before: number; after: number; unit: string; changePercent: number; label?: string; lowerIsBetter?: boolean };
  const secondaryMetrics: MetricChange[] = useMemo(() => {
    if (!wearable) return [];
    // Build candidates with explicit labels for each metric type
    const candidates: (MetricChange | undefined)[] = [
      wearable.deepSleepChange && { ...wearable.deepSleepChange, label: wearable.deepSleepChange.label || 'Deep Sleep' },
      wearable.remSleepChange && { ...wearable.remSleepChange, label: wearable.remSleepChange.label || 'REM Sleep' },
      wearable.sleepEfficiencyChange && { ...wearable.sleepEfficiencyChange, label: wearable.sleepEfficiencyChange.label || 'Sleep Efficiency' },
      wearable.sleepLatencyChange && { ...wearable.sleepLatencyChange, label: wearable.sleepLatencyChange.label || 'Sleep Latency', lowerIsBetter: true },
      wearable.hrvChange && { ...wearable.hrvChange, label: wearable.hrvChange.label || 'HRV' },
      wearable.sleepChange && { ...wearable.sleepChange, label: wearable.sleepChange.label || 'Total Sleep' },
      wearable.restingHrChange && { ...wearable.restingHrChange, label: wearable.restingHrChange.label || 'Resting HR', lowerIsBetter: true },
    ];
    return candidates
      .filter((m): m is MetricChange => !!m && typeof m === 'object' && 'changePercent' in m)
      .filter(m => m !== best)
      .slice(0, 3);
  }, [wearable, best]);

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
              {wearable?.device && (
                <p className="text-xs text-muted-foreground mt-1">
                  📱 {wearable.device}
                </p>
              )}
            </div>
          </div>

          {/* Wearable Metrics — Hero + Secondary */}
          <div className="flex-1">
            {/* Hero Metric: the single best wearable metric */}
            {best ? (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-muted-foreground mb-1">
                    Before (Baseline)
                  </p>
                  <p className="text-2xl font-bold text-gray-400">
                    {best.unit === 'min' ? formatMinutes(best.before) : best.before}
                    {best.unit !== 'min' && (
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {best.unit}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {best.label || 'Wearable metric'}
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1 font-medium">
                    After (Day 28)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {best.unit === 'min' ? formatMinutes(best.after) : best.after}
                    {best.unit !== 'min' && (
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {best.unit}
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                    {best.lowerIsBetter
                      ? `${Math.abs(best.changePercent)}% reduction`
                      : `+${Math.round(best.changePercent)}% improvement`
                    }
                  </p>
                </div>
              </div>
            ) : wearable?.hrvChange ? (
              /* Fallback for real data without bestMetric */
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-muted-foreground mb-1">Before (Baseline)</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {wearable.hrvChange.before}
                    <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">HRV</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1 font-medium">After (Day 28)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {wearable.hrvChange.after}
                    <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
                  </p>
                  {wearable.hrvChange.changePercent > 0 && (
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                      +{Math.round(wearable.hrvChange.changePercent)}% improvement
                    </p>
                  )}
                </div>
              </div>
            ) : assessment?.baseline?.compositeScore !== undefined ? (
              /* Assessment fallback for non-wearable categories */
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/80 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-muted-foreground mb-1">Before (Day 1)</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {Math.round(assessment.baseline.compositeScore)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/100</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{assessment.categoryLabel} Score</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1 font-medium">After (Day 28)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(assessment.endpoint.compositeScore)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/100</span>
                  </p>
                  {assessment.change?.compositePercent !== undefined && (
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                      +{Math.round(assessment.change.compositePercent)}% improvement
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Secondary Wearable Metrics — compact row */}
            {secondaryMetrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {secondaryMetrics.map((m, i) => {
                  const label = ('label' in m ? m.label : '') || 'Metric';
                  const isLower = 'lowerIsBetter' in m && m.lowerIsBetter;
                  const pct = Math.abs(m.changePercent);
                  const improved = isLower ? m.changePercent < 0 : m.changePercent > 0;
                  return (
                    <div key={i} className="bg-gray-50/80 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground truncate">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {m.unit === 'min' ? formatMinutes(m.before) : `${m.before}${m.unit}`}
                        {' → '}
                        {m.unit === 'min' ? formatMinutes(m.after) : `${m.after}${m.unit}`}
                      </p>
                      <p className={`text-xs font-medium mt-0.5 ${improved ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {improved ? (isLower ? `↓${pct}%` : `+${pct}%`) : `${m.changePercent > 0 ? '+' : ''}${m.changePercent}%`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
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

// ─────────────────────────────────────────────────────────────────────────────
// PATH TO RESEARCH — The "layaway plan on research"
// ─────────────────────────────────────────────────────────────────────────────

function PathToResearchCard({
  participantCount,
  hasCompletions,
}: {
  participantCount: number;
  hasCompletions: boolean;
}) {
  // Milestones toward research-grade evidence
  const milestones = [
    { count: 10, label: "Early Signal", desc: "Initial evidence of product efficacy" },
    { count: 30, label: "Strong Evidence", desc: "Statistically meaningful patterns" },
    { count: 100, label: "Research Ready", desc: "Eligible for retrospective IRB study" },
  ];

  const currentMilestone = milestones.findIndex((m) => participantCount < m.count);
  const nextMilestone = milestones[currentMilestone === -1 ? milestones.length - 1 : currentMilestone];
  const progressToNext = nextMilestone
    ? Math.min(100, Math.round((participantCount / nextMilestone.count) * 100))
    : 100;

  return (
    <Card className="border-purple-100 bg-gradient-to-r from-purple-50/50 to-transparent">
      <CardContent className="pt-6 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-900">
            Path to Research
          </span>
          <Badge variant="outline" className="text-purple-600 border-purple-200 text-xs ml-auto">
            {participantCount} / {nextMilestone?.count || 100} participants
          </Badge>
        </div>

        {/* Milestone Progress */}
        <div className="flex items-center gap-2 mb-4">
          {milestones.map((milestone, i) => {
            const reached = participantCount >= milestone.count;
            const isCurrent = i === currentMilestone;
            return (
              <div key={milestone.count} className="flex items-center flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        reached
                          ? "bg-purple-600 text-white"
                          : isCurrent
                          ? "bg-purple-100 text-purple-600 ring-2 ring-purple-300"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {reached ? "✓" : milestone.count}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        reached ? "text-purple-600" : isCurrent ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {milestone.label}
                    </span>
                  </div>
                </div>
                {i < milestones.length - 1 && (
                  <ArrowRight className={`h-3 w-3 mx-1 flex-shrink-0 ${reached ? "text-purple-400" : "text-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {hasCompletions && (
          <div className="mb-3">
            <div className="w-full bg-purple-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-purple-500 transition-all duration-1000"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {/* Explanation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {participantCount >= 100 ? (
            <>Your evidence base is research-ready. You can file a <strong>retrospective IRB</strong> to publish these results as a formal study — no upfront hypothesis needed.</>
          ) : participantCount >= 30 ? (
            <>Strong evidence accumulating. At 100 participants, you can convert this into a <strong>published research study</strong> — a retrospective IRB lets you study data you&apos;ve already collected.</>
          ) : participantCount >= 10 ? (
            <>Early signal detected. Keep growing — at 30+ participants, patterns become statistically meaningful. At 100, you&apos;re eligible for a retrospective study publication.</>
          ) : hasCompletions ? (
            <>Every completed participant builds toward publishable research. Think of it as a <strong>layaway plan on research</strong> — accumulate evidence, then study it when you&apos;re ready.</>
          ) : (
            <>As participants complete their journey, evidence accumulates toward publishable research. No upfront hypothesis needed — discover your signal first, then publish.</>
          )}
        </p>
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
