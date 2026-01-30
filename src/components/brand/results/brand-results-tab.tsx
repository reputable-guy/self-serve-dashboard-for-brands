"use client";

/**
 * Brand Results Tab — "Here's the proof"
 * 
 * Shows before/after stories with objective data + testimonials.
 * Progressive: no completions → first results → full study results.
 */

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Star,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { useBrandsStore } from "@/lib/brands-store";
import { getCompletedStoriesFromEnrollments, categorizeStory } from "@/lib/simulation";
import type { StudyData } from "@/components/admin/study-detail/types";
import type { ParticipantStory } from "@/lib/types";
import Link from "next/link";
import { ContentGeneratorDrawer } from "./content-generator-drawer";

interface BrandResultsTabProps {
  study: StudyData;
  realStories?: ParticipantStory[] | null;
  brandName?: string;
  productName?: string;
}

export function BrandResultsTab({ study, realStories, brandName, productName }: BrandResultsTabProps) {
  const [selectedStory, setSelectedStory] = useState<ParticipantStory | null>(null);
  const { getEnrollmentsByStudy } = useEnrollmentStore();
  const { getBrandById } = useBrandsStore();
  const enrollments = getEnrollmentsByStudy(study.id);
  const category = study.category;
  const isRealData = !!realStories && realStories.length > 0;

  // Get brand name from store if not passed as prop
  const resolvedBrandName = brandName || getBrandById(study.brandId)?.name;

  // Get completed stories — real data or from enrollments
  const completedStories = useMemo(() => {
    if (isRealData) {
      return realStories; // All real stories are completed participants
    }
    const stories = getCompletedStoriesFromEnrollments(enrollments, category);
    return stories || [];
  }, [isRealData, realStories, enrollments, category]);

  // Categorize stories
  const categorized = useMemo(() => {
    const positive = completedStories.filter((s) => categorizeStory(s) === "positive");
    const neutral = completedStories.filter((s) => categorizeStory(s) === "neutral");
    const negative = completedStories.filter((s) => categorizeStory(s) === "negative");
    return { positive, neutral, negative };
  }, [completedStories]);

  const totalCompleted = completedStories.length;

  // Sort stories: positive first (by improvement %), then neutral, then negative
  const sortedStories = useMemo(() => {
    const getImprovement = (s: ParticipantStory): number => {
      // Best wearable metric (normalized for lower-is-better)
      const best = s.wearableMetrics?.bestMetric;
      if (best?.changePercent !== undefined) {
        return best.lowerIsBetter ? Math.abs(best.changePercent) : best.changePercent;
      }
      // HRV fallback (real data)
      if (s.wearableMetrics?.hrvChange?.changePercent !== undefined) {
        return s.wearableMetrics.hrvChange.changePercent;
      }
      // Assessment fallback
      const assess = s.assessmentResults?.[0] || s.assessmentResult;
      if (assess?.change?.compositePercent !== undefined) {
        return assess.change.compositePercent;
      }
      return 0;
    };

    return [...completedStories].sort((a, b) => {
      const catA = categorizeStory(a);
      const catB = categorizeStory(b);
      const order = { positive: 0, neutral: 1, negative: 2 };
      if (order[catA] !== order[catB]) return order[catA] - order[catB];
      // Within same category, sort by improvement descending
      return getImprovement(b) - getImprovement(a);
    });
  }, [completedStories]);

  // No results yet
  if (totalCompleted === 0) {
    return <ResultsWaiting />;
  }

  // Calculate aggregate stats
  const avgRating = completedStories.reduce(
    (sum, s) => sum + (s.overallRating || s.finalTestimonial?.overallRating || 4),
    0
  ) / totalCompleted;
  
  const improvedCount = categorized.positive.length;
  const improvedPercent = Math.round((improvedCount / totalCompleted) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HeroStatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          value={`${improvedPercent}%`}
          label="Improved"
          description="Reported positive change"
        />
        <HeroStatCard
          icon={<Star className="h-5 w-5 text-amber-500" />}
          value={avgRating.toFixed(1)}
          label="Avg Rating"
          description="Out of 5 stars"
        />
        <HeroStatCard
          icon={<ThumbsUp className="h-5 w-5 text-blue-500" />}
          value={`${totalCompleted}`}
          label="Completed"
          description="Finished 28-day study"
        />
        <HeroStatCard
          icon={<Award className="h-5 w-5 text-purple-500" />}
          value="Verified"
          label="Status"
          description="Third-party verified"
        />
      </div>

      {/* Featured Before/After Story (best positive story) */}
      {sortedStories[0] && (
        <BeforeAfterCard
          story={sortedStories[0]}
          category={category}
          variant="featured"
          onCreateContent={() => setSelectedStory(sortedStories[0])}
        />
      )}

      {/* More Stories Grid — sorted: positive first, then neutral, then negative */}
      {sortedStories.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            More Participant Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedStories.slice(1, 7).map((story) => (
              <BeforeAfterCard
                key={story.id}
                story={story}
                category={category}
                variant="compact"
                onCreateContent={() => setSelectedStory(story)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outcome Distribution */}
      {totalCompleted >= 3 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Outcome Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <OutcomeBar
                label="Positive"
                count={categorized.positive.length}
                total={totalCompleted}
                color="bg-emerald-500"
              />
              <OutcomeBar
                label="Neutral"
                count={categorized.neutral.length}
                total={totalCompleted}
                color="bg-gray-400"
              />
              <OutcomeBar
                label="Minimal Change"
                count={categorized.negative.length}
                total={totalCompleted}
                color="bg-amber-400"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Generator Drawer */}
      {selectedStory && (
        <ContentGeneratorDrawer
          isOpen={selectedStory !== null}
          onClose={() => setSelectedStory(null)}
          story={selectedStory}
          brandName={resolvedBrandName}
          productName={productName || resolvedBrandName}
          category={category}
        />
      )}
    </div>
  );
}

/** Hero stat card */
function HeroStatCard({
  icon,
  value,
  label,
  description,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
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
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

/** Format minutes into human-readable duration */
function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/** Before/After Story Card — shows individual wearable metrics, not composites */
function BeforeAfterCard({
  story,
  variant,
  onCreateContent,
}: {
  story: ParticipantStory;
  category: string;
  variant: "featured" | "compact";
  onCreateContent?: () => void;
}) {
  const isFeatured = variant === "featured";
  const wearable = story.wearableMetrics;
  const best = wearable?.bestMetric;

  // Assessment fallback for non-wearable categories
  const assessment = story.assessmentResults?.[0] || story.assessmentResult;

  // Get testimonial — try finalTestimonial first, fall back to journey keyQuotes
  const testimonial = story.finalTestimonial;
  const lastQuote = story.journey?.keyQuotes?.slice(-1)[0];
  const displayQuote = testimonial?.quote || lastQuote?.quote;
  const rating = testimonial?.overallRating || story.overallRating || 4;

  // Collect secondary metrics (up to 2 for compact, 3 for featured)
  type MetricChange = { before: number; after: number; unit: string; changePercent: number; label?: string; lowerIsBetter?: boolean };
  const secondaryMetrics: MetricChange[] = useMemo(() => {
    if (!wearable) return [];
    // Build candidates with explicit labels for each metric type
    const candidates: (MetricChange | undefined)[] = [
      wearable.deepSleepChange && { ...wearable.deepSleepChange, label: wearable.deepSleepChange.label || 'Deep Sleep' },
      wearable.sleepEfficiencyChange && { ...wearable.sleepEfficiencyChange, label: wearable.sleepEfficiencyChange.label || 'Sleep Efficiency', lowerIsBetter: false },
      wearable.hrvChange && { ...wearable.hrvChange, label: wearable.hrvChange.label || 'HRV' },
      wearable.remSleepChange && { ...wearable.remSleepChange, label: wearable.remSleepChange.label || 'REM Sleep' },
      wearable.sleepLatencyChange && { ...wearable.sleepLatencyChange, label: wearable.sleepLatencyChange.label || 'Sleep Latency', lowerIsBetter: true },
      wearable.sleepChange && { ...wearable.sleepChange, label: wearable.sleepChange.label || 'Total Sleep' },
      wearable.restingHrChange && { ...wearable.restingHrChange, label: wearable.restingHrChange.label || 'Resting HR', lowerIsBetter: true },
    ];
    return candidates
      .filter((m): m is MetricChange => !!m && typeof m === 'object' && 'changePercent' in m)
      .filter(m => m !== best)
      .slice(0, isFeatured ? 3 : 2);
  }, [wearable, best, isFeatured]);

  // Hero symptom and context for mini customer story
  // Priority: hopedResults (what they wanted to achieve) > villainVariable (category) > motivation (why they joined)
  const heroSymptom = story.baseline?.hopedResults 
    || story.journey?.villainVariable 
    || story.baseline?.motivation;
  const villainDuration = story.baseline?.villainDuration;
  const triedBefore = story.baseline?.triedOther;

  return (
    <Card className={`${isFeatured ? "border-[#00D1C1]/30 bg-gradient-to-r from-[#00D1C1]/5 to-transparent" : ""}`}>
      <CardContent className={isFeatured ? "pt-6 pb-5" : "pt-5 pb-4"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xs font-semibold">
              {story.initials}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">{story.name}</span>
              {story.profile?.location && (
                <span className="text-xs text-muted-foreground ml-2">
                  {story.profile.ageRange} · {story.profile.location}
                </span>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200 bg-emerald-50"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        </div>

        {/* Mini Customer Story Context */}
        {(heroSymptom || villainDuration || triedBefore) && (
          <div className={`bg-gray-50/70 rounded-lg p-2.5 mb-3 space-y-1 ${isFeatured ? '' : 'text-xs'}`}>
            {heroSymptom && (
              <p className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Looking for:</span> {heroSymptom.length > 80 ? heroSymptom.slice(0, 80) + '…' : heroSymptom}
              </p>
            )}
            {villainDuration && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">For:</span> {villainDuration}
              </p>
            )}
            {triedBefore && triedBefore !== 'Yes, various options' && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Previously tried:</span> {triedBefore.length > 60 ? triedBefore.slice(0, 60) + '…' : triedBefore}
              </p>
            )}
          </div>
        )}

        {/* Best Wearable Metric — hero display */}
        {best ? (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="text-xs text-muted-foreground mb-1">
              {best.label || 'Wearable Metric'} · {wearable?.device || 'Wearable verified'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">
                {best.unit === 'min' ? formatMinutes(best.before) : `${best.before}${best.unit}`}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-lg font-bold text-gray-900">
                {best.unit === 'min' ? formatMinutes(best.after) : `${best.after}${best.unit}`}
              </span>
              <span className={`text-sm font-semibold ${
                (best.lowerIsBetter ? best.changePercent < 0 : best.changePercent > 0) ? "text-emerald-600" : "text-gray-500"
              }`}>
                {best.lowerIsBetter
                  ? `↓${Math.abs(best.changePercent)}%`
                  : `+${Math.round(best.changePercent)}%`
                }
              </span>
            </div>
          </div>
        ) : wearable?.hrvChange ? (
          /* Real data HRV fallback */
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="text-xs text-muted-foreground mb-1">HRV · {wearable.device || 'Oura Ring'}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">{wearable.hrvChange.before} ms</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-lg font-bold text-gray-900">{wearable.hrvChange.after} ms</span>
              <span className={`text-sm font-semibold ${wearable.hrvChange.changePercent > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                {wearable.hrvChange.changePercent > 0 ? "+" : ""}{Math.round(wearable.hrvChange.changePercent)}%
              </span>
            </div>
          </div>
        ) : assessment?.baseline?.compositeScore !== undefined ? (
          /* Assessment fallback */
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="text-xs text-muted-foreground mb-1">{assessment.categoryLabel} Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">{Math.round(assessment.baseline.compositeScore)}/100</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-lg font-bold text-gray-900">{Math.round(assessment.endpoint.compositeScore)}/100</span>
              {assessment.change?.compositePercent !== undefined && (
                <span className={`text-sm font-semibold ${assessment.change.compositePercent > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                  +{Math.round(assessment.change.compositePercent)}%
                </span>
              )}
            </div>
          </div>
        ) : null}

        {/* Secondary Wearable Metrics — compact inline */}
        {secondaryMetrics.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {secondaryMetrics.map((m, i) => {
              const label = ('label' in m ? m.label : '') || 'Metric';
              const isLower = 'lowerIsBetter' in m && m.lowerIsBetter;
              const improved = isLower ? m.changePercent < 0 : m.changePercent > 0;
              return (
                <span key={i} className={`text-xs px-2 py-1 rounded-full ${improved ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {label}: {isLower ? `↓${Math.abs(m.changePercent)}%` : `+${Math.round(m.changePercent)}%`}
                </span>
              );
            })}
          </div>
        )}

        {/* Testimonial Quote */}
        {displayQuote && (
          <blockquote className={`text-gray-700 italic leading-relaxed mb-3 ${isFeatured ? "text-sm" : "text-xs"}`}>
            &ldquo;{isFeatured ? displayQuote : displayQuote.slice(0, 120) + (displayQuote.length > 120 ? "..." : "")}&rdquo;
          </blockquote>
        )}

        {/* Footer: Rating + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
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
          <div className="flex items-center gap-2">
            {onCreateContent && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateContent();
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Create Content
              </Button>
            )}
            {story.verificationId && (
              <Link
                href={`/verify/${story.verificationId}`}
                className="text-xs text-[#00D1C1] hover:underline flex items-center gap-1"
              >
                Verified Results <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Outcome distribution bar */
function OutcomeBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-12 text-right">
        {percentage}%
      </span>
    </div>
  );
}

/** Waiting state when no results */
function ResultsWaiting() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full border-dashed">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Results Coming Soon</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Results will appear here as participants complete their 28-day journey
            with your product.
          </p>
          <div className="text-xs text-muted-foreground bg-gray-50 rounded-lg p-3">
            What you&apos;ll see: Before/after data, verified testimonials, aggregate improvement stats
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
