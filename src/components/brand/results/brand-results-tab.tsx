"use client";

/**
 * Brand Results Tab — "Here's the proof"
 * 
 * Shows before/after stories with objective data + testimonials.
 * Progressive: no completions → first results → full study results.
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Star,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { getCompletedStoriesFromEnrollments, categorizeStory } from "@/lib/simulation";
import type { StudyData } from "@/components/admin/study-detail/types";
import type { ParticipantStory } from "@/lib/types";
import Link from "next/link";

interface BrandResultsTabProps {
  study: StudyData;
}

export function BrandResultsTab({ study }: BrandResultsTabProps) {
  const { getEnrollmentsByStudy } = useEnrollmentStore();
  const enrollments = getEnrollmentsByStudy(study.id);
  const category = study.category || study.categoryKey;

  // Get completed stories from enrollments
  const completedStories = useMemo(() => {
    const stories = getCompletedStoriesFromEnrollments(enrollments, category);
    return stories || [];
  }, [enrollments, category]);

  // Categorize stories
  const categorized = useMemo(() => {
    const positive = completedStories.filter((s) => categorizeStory(s) === "positive");
    const neutral = completedStories.filter((s) => categorizeStory(s) === "neutral");
    const negative = completedStories.filter((s) => categorizeStory(s) === "negative");
    return { positive, neutral, negative };
  }, [completedStories]);

  const totalCompleted = completedStories.length;

  // No results yet
  if (totalCompleted === 0) {
    return <ResultsWaiting study={study} />;
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

      {/* Featured Before/After Story (first positive story) */}
      {categorized.positive[0] && (
        <BeforeAfterCard
          story={categorized.positive[0]}
          category={category}
          variant="featured"
        />
      )}

      {/* More Stories Grid */}
      {completedStories.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            More Participant Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedStories.slice(1, 5).map((story) => (
              <BeforeAfterCard
                key={story.id}
                story={story}
                category={category}
                variant="compact"
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

/** Before/After Story Card */
function BeforeAfterCard({
  story,
  category,
  variant,
}: {
  story: ParticipantStory;
  category: string;
  variant: "featured" | "compact";
}) {
  const storyCategory = categorizeStory(story);
  const isFeatured = variant === "featured";
  
  // Get assessment results if available (singular or plural field)
  const assessment = story.assessmentResults?.[0] || story.assessmentResult;
  const baselineScore = assessment?.baseline?.compositeScore;
  const endpointScore = assessment?.endpoint?.compositeScore;
  const scoreChange = assessment?.change?.compositePercent;

  // Get wearable metrics if available
  const wearable = story.wearableMetrics;

  // Get testimonial
  const testimonial = story.finalTestimonial;
  const rating = testimonial?.overallRating || story.overallRating || 4;

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
                  {story.profile.location}
                </span>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              storyCategory === "positive"
                ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                : storyCategory === "neutral"
                ? "text-gray-600 border-gray-200"
                : "text-amber-600 border-amber-200 bg-amber-50"
            }
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        </div>

        {/* Before/After Metrics */}
        {(baselineScore !== undefined || wearable) && (
          <div className={`${isFeatured ? "grid grid-cols-2 gap-4 mb-4" : "flex gap-4 mb-3"}`}>
            {/* Assessment Score */}
            {baselineScore !== undefined && endpointScore !== undefined && (
              <div className={`bg-gray-50 rounded-lg p-3 ${isFeatured ? "" : "flex-1"}`}>
                <div className="text-xs text-muted-foreground mb-1">
                  {assessment?.categoryLabel || category} Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">{Math.round(baselineScore)}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-bold text-gray-900">{Math.round(endpointScore)}</span>
                  {scoreChange !== undefined && (
                    <span className={`text-sm font-semibold ${scoreChange > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                      {scoreChange > 0 ? "+" : ""}{Math.round(scoreChange)}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Wearable Metric (if Tier 1-2) */}
            {wearable?.sleepChange && (
              <div className={`bg-gray-50 rounded-lg p-3 ${isFeatured ? "" : "flex-1"}`}>
                <div className="text-xs text-muted-foreground mb-1">Sleep Score</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">{wearable.sleepChange.before}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-bold text-gray-900">{wearable.sleepChange.after}</span>
                  <span className={`text-sm font-semibold ${wearable.sleepChange.changePercent > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                    {wearable.sleepChange.changePercent > 0 ? "+" : ""}{Math.round(wearable.sleepChange.changePercent)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testimonial Quote */}
        {testimonial?.quote && (
          <blockquote className={`text-gray-700 italic leading-relaxed mb-3 ${isFeatured ? "text-sm" : "text-xs"}`}>
            &ldquo;{isFeatured ? testimonial.quote : testimonial.quote.slice(0, 120) + (testimonial.quote.length > 120 ? "..." : "")}&rdquo;
          </blockquote>
        )}

        {/* Footer: Rating + Verify */}
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
          {story.verificationId && (
            <Link
              href={`/verify/${story.verificationId}/results`}
              className="text-xs text-[#00D1C1] hover:underline flex items-center gap-1"
            >
              Verified Results <ExternalLink className="h-3 w-3" />
            </Link>
          )}
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
function ResultsWaiting({ study }: { study: StudyData }) {
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
