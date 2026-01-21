"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Watch,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Circle,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Quote,
} from "lucide-react";
import type {
  ParticipantInterimData,
  ParticipantStatus,
  WearableMetricData,
  VillainRating,
  CheckInQuote,
} from "@/lib/types/interim-insights";

interface ParticipantInterimCardProps {
  participant: ParticipantInterimData;
}

/**
 * Status indicator emoji based on participant status.
 */
function StatusIndicator({ status }: { status: ParticipantStatus }) {
  const config = {
    improving: "🟢",
    stable: "🟡",
    declining: "🔴",
  };
  return <span className="text-lg">{config[status]}</span>;
}

/**
 * Trend icon for wearable metrics.
 */
function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  }
  return <Minus className="h-3.5 w-3.5 text-yellow-600" />;
}

/**
 * Format change percent with sign and color.
 */
function ChangePercent({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const sign = isPositive ? "+" : "";

  const sizeClass = size === "lg" ? "text-lg font-bold" : "text-sm font-medium";

  return (
    <span
      className={`${sizeClass} ${
        isPositive
          ? "text-emerald-600"
          : isNegative
          ? "text-red-500"
          : "text-muted-foreground"
      }`}
    >
      {sign}{value}%
    </span>
  );
}

/**
 * Single wearable metric display.
 */
function WearableMetricRow({ metric }: { metric: WearableMetricData }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{metric.label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {metric.baseline} → {metric.current} {metric.unit}
        </span>
        <div className="flex items-center gap-1">
          <TrendIcon trend={metric.trend} />
          <ChangePercent value={metric.changePercent} />
        </div>
      </div>
    </div>
  );
}

/**
 * Wearable metrics section with device badge.
 */
function WearableMetricsSection({
  wearableMetrics,
}: {
  wearableMetrics: ParticipantInterimData["wearableMetrics"];
}) {
  if (!wearableMetrics) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <Watch className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Wearable Metrics
        </span>
        <Badge variant="outline" className="text-xs h-5 px-1.5">
          {wearableMetrics.device}
        </Badge>
      </div>
      <div className="rounded-lg bg-muted/40 p-2.5">
        <WearableMetricRow metric={wearableMetrics.primary} />
        {wearableMetrics.secondary && (
          <WearableMetricRow metric={wearableMetrics.secondary} />
        )}
      </div>
    </div>
  );
}

/**
 * Get score interpretation label (Poor, Fair, Good, Excellent)
 */
function getScoreLabel(score: number): string {
  if (score < 25) return "Poor";
  if (score < 50) return "Fair";
  if (score < 75) return "Good";
  return "Excellent";
}

/**
 * Assessment progress section - styled like AssessmentResultCard.
 * Shows clear headline explaining what the % improvement means.
 */
function AssessmentProgressSection({
  assessment,
  villainVariable,
}: {
  assessment: ParticipantInterimData["assessmentProgress"];
  villainVariable: string;
}) {
  const improved = assessment.currentScore > assessment.baselineScore;
  const hasInterimData = assessment.completedDays.length > 1;

  // Generate headline explaining the improvement
  const baselineLabel = getScoreLabel(assessment.baselineScore);
  const currentLabel = getScoreLabel(assessment.currentScore);
  const sameRange = baselineLabel === currentLabel;

  let headline: string;
  if (improved) {
    headline = sameRange
      ? `Self-reported ${villainVariable} improved (${currentLabel})`
      : `Self-reported ${villainVariable} improved from ${baselineLabel} to ${currentLabel}`;
  } else if (assessment.currentScore < assessment.baselineScore) {
    headline = sameRange
      ? `Self-reported ${villainVariable} declined (${currentLabel})`
      : `Self-reported ${villainVariable} declined from ${baselineLabel} to ${currentLabel}`;
  } else {
    headline = `Self-reported ${villainVariable} stable at ${currentLabel}`;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {assessment.assessmentName}
          </span>
        </div>
        {assessment.isPrimary && (
          <Badge className="text-[10px] h-4 px-1 bg-purple-100 text-purple-700 hover:bg-purple-100">
            PRIMARY
          </Badge>
        )}
      </div>

      {hasInterimData ? (
        // Show score comparison for Tier 2-4 with interim assessments
        <div className="rounded-lg bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-muted-foreground">
                {assessment.baselineScore}
              </div>
              <div className="text-[10px] text-muted-foreground">Baseline</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                  improved ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {improved ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <ChangePercent value={assessment.changePercent} size="lg" />
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-xl font-bold ${
                  improved ? "text-green-600" : "text-red-500"
                }`}
              >
                {assessment.currentScore}
              </div>
              <div className="text-[10px] text-muted-foreground">Current</div>
            </div>
          </div>

          {/* Progress bar visualization */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full flex">
              <div
                className="h-full bg-gray-300 transition-all"
                style={{ width: `${assessment.baselineScore}%` }}
              />
              <div
                className={`h-full ${improved ? "bg-green-500" : "bg-red-400"} transition-all`}
                style={{ width: `${Math.abs(assessment.currentScore - assessment.baselineScore)}%` }}
              />
            </div>
          </div>

          {/* Headline explaining the improvement */}
          <p className="text-[11px] text-center text-muted-foreground">
            {headline}
          </p>

          {/* Check-in progress dots */}
          <div className="pt-2 border-t border-muted">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Check-ins:</span>
              <div className="flex items-center gap-1">
                {assessment.checkInDays.map((day) => {
                  const isCompleted = assessment.completedDays.includes(day);
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-0.5"
                      title={`Day ${day}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground/40" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Tier 1 - only baseline and endpoint assessments
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Baseline completed</span>
            <span className="text-muted-foreground/60">•</span>
            <span>Final on Day 28</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions for villain ratings
function getRatingLabel(rating: number): string {
  if (rating >= 4) return "Much Better";
  if (rating === 3) return "Somewhat Better";
  if (rating === 2) return "About the Same";
  return "Worse";
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return "bg-green-500";
  if (rating === 3) return "bg-yellow-400";
  if (rating === 2) return "bg-orange-400";
  return "bg-red-500";
}

/**
 * Compact villain journey progress for interim cards.
 */
function VillainProgressSection({
  ratings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  villainVariable,
}: {
  ratings: VillainRating[];
  villainVariable: string;
}) {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-[#00D1C1]" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Weekly Progress
        </span>
      </div>
      <div className="rounded-lg bg-muted/40 p-2.5 space-y-2">
        {ratings.map((r) => (
          <div key={r.day} className="flex items-center gap-3">
            <div className="w-12 text-xs text-muted-foreground">Day {r.day}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRatingColor(r.rating)} transition-all`}
                    style={{ width: `${(r.rating / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium w-24 ${
                    r.rating >= 4
                      ? "text-green-600"
                      : r.rating >= 3
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {getRatingLabel(r.rating)}
                </span>
              </div>
              {r.note && (
                <p className="text-[10px] text-muted-foreground mt-0.5 italic line-clamp-1">
                  &ldquo;{r.note}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Check-in quotes section for expanded view.
 */
function CheckInQuotesSection({ quotes }: { quotes: CheckInQuote[] }) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Quote className="h-3.5 w-3.5 text-purple-500" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Check-in Responses
        </span>
      </div>
      <div className="space-y-2">
        {quotes.map((q, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-purple-50/50 border border-purple-100 p-2"
          >
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-purple-400 font-medium">
                Day {q.day}
              </span>
              <p className="text-xs text-purple-900 italic flex-1">
                &ldquo;{q.quote}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual participant interim card with expandable details.
 *
 * Shows tier-aware layout:
 * - Tier 1: Wearables first, then assessment
 * - Tier 2-4: Assessment first, then wearables (if available)
 *
 * Expandable to show:
 * - Weekly villain progress
 * - Check-in quotes
 */
export function ParticipantInterimCard({
  participant,
}: ParticipantInterimCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if there's data to show in expanded view
  const hasExpandedData =
    (participant.villainRatings && participant.villainRatings.length > 0) ||
    (participant.checkInQuotes && participant.checkInQuotes.length > 0);
  // Card border color based on status
  const borderColors = {
    improving: "border-emerald-200 hover:border-emerald-300",
    stable: "border-yellow-200 hover:border-yellow-300",
    declining: "border-red-200 hover:border-red-300",
  };

  // Avatar background based on status
  const avatarColors = {
    improving: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    stable: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    declining: "bg-gradient-to-br from-red-400 to-red-500",
  };

  // Determine section order based on tier
  // Tier 1: Wearables PRIMARY → Assessment secondary
  // Tier 2-4: Assessment PRIMARY → Wearables secondary
  const showWearablesFirst = participant.tier === 1;

  return (
    <Card
      className={`overflow-hidden transition-all ${borderColors[participant.status]}`}
    >
      <CardContent className="p-4">
        {/* Header with status, avatar, name, demographics, cohort, and completion date */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <StatusIndicator status={participant.status} />
            <div
              className={`h-10 w-10 rounded-full ${avatarColors[participant.status]} flex items-center justify-center text-sm font-semibold text-white`}
            >
              {participant.initials}
            </div>
            <div>
              <p className="font-medium text-sm">{participant.displayName}</p>
              <p className="text-xs text-muted-foreground">
                {participant.demographics.ageRange} • {participant.demographics.gender}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              {participant.cohortNumber && (
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                  <Users className="h-2.5 w-2.5 mr-0.5" />
                  Cohort {participant.cohortNumber}
                </Badge>
              )}
              {participant.expectedCompletionDate && (
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                  <Calendar className="h-2.5 w-2.5 mr-0.5" />
                  Ends {participant.expectedCompletionDate}
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Day {participant.currentDay}
            </p>
          </div>
        </div>

        {/* Villain variable - what they're tracking */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <Target className="h-3.5 w-3.5 text-[#00D1C1]" />
          <span className="text-muted-foreground">
            Tracking: <span className="font-medium text-foreground capitalize">{participant.villainVariable}</span>
          </span>
        </div>

        {/* Metrics sections - ordered by tier */}
        <div className="space-y-3">
          {showWearablesFirst ? (
            // Tier 1: Wearables first
            <>
              {participant.wearableMetrics && (
                <WearableMetricsSection wearableMetrics={participant.wearableMetrics} />
              )}
              <AssessmentProgressSection assessment={participant.assessmentProgress} villainVariable={participant.villainVariable} />
            </>
          ) : (
            // Tier 2-4: Assessment first
            <>
              <AssessmentProgressSection assessment={participant.assessmentProgress} villainVariable={participant.villainVariable} />
              {participant.wearableMetrics && (
                <WearableMetricsSection wearableMetrics={participant.wearableMetrics} />
              )}
            </>
          )}
        </div>

        {/* Expanded View - villain progress and check-in quotes */}
        {isExpanded && hasExpandedData && (
          <div className="mt-4 pt-4 border-t border-dashed space-y-4">
            {/* Villain Progress */}
            {participant.villainRatings && participant.villainRatings.length > 0 && (
              <VillainProgressSection
                ratings={participant.villainRatings}
                villainVariable={participant.villainVariable}
              />
            )}

            {/* Check-in Quotes */}
            {participant.checkInQuotes && participant.checkInQuotes.length > 0 && (
              <CheckInQuotesSection quotes={participant.checkInQuotes} />
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        {hasExpandedData && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Show Full Progress
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
