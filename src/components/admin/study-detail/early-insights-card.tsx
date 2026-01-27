"use client";

/**
 * Early Insights Card v2
 *
 * Progressive disclosure of customer insights starting from the very first participant.
 * Shows individual stories first, patterns emerge on top, aggregates layer in.
 *
 * Thresholds:
 * - n=0: Waiting state with anticipation
 * - n=1-2: Individual participant story cards
 * - n=3-9: Add emerging patterns + live timeline
 * - n=10+: Add aggregate charts + demographics
 */

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  Users,
  Target,
  Clock,
  Quote,
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  useEarlyInsightsStore,
  SHOW_AGGREGATES_FROM,
  SHOW_QUOTES_FROM,
} from "@/lib/early-insights-store";
import { ParticipantStoryCard } from "./participant-story-card";
import { InsightsTimeline } from "./insights-timeline";
import { EmergingPatternsCard } from "./emerging-patterns-card";
import { HorizontalBarChart, QuoteCarousel } from "./shared";
import type { EarlyInsightsData } from "@/lib/types";

interface EarlyInsightsCardProps {
  studyId: string;
  studyCategory?: string;
  enrollmentSlug?: string;
  isDemo?: boolean;
}

export function EarlyInsightsCard({
  studyId,
  studyCategory,
  isDemo = true,
}: EarlyInsightsCardProps) {
  const {
    computeInsights,
    getBaselineCount,
    hasAnyParticipants,
    hasEnoughForPatterns,
    hasEnoughForAggregates,
  } = useEarlyInsightsStore();

  const [insights, setInsights] = useState<EarlyInsightsData | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const baselineCount = getBaselineCount(studyId);
  const hasParticipants = hasAnyParticipants(studyId);
  const hasPatterns = hasEnoughForPatterns(studyId);
  const hasAggregates = hasEnoughForAggregates(studyId);

  // Compute insights whenever we have participants
  useEffect(() => {
    if (baselineCount > 0) {
      const computed = computeInsights(studyId, studyCategory);
      setInsights(computed);
    }
  }, [studyId, studyCategory, baselineCount, computeInsights]);

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE: No participants yet (n=0)
  // ─────────────────────────────────────────────────────────────────────────────
  if (!hasParticipants) {
    return (
      <Card className="border-dashed border-slate-200 bg-gradient-to-br from-slate-50/50 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-100">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </div>
            <CardTitle className="text-sm font-medium">Customer Insights</CardTitle>
            <Badge variant="outline" className="text-xs bg-slate-50">Waiting</Badge>
          </div>
          <CardDescription className="mt-2">
            The first participant story will appear here the moment someone enrolls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-100/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">What you&apos;ll see</span>
              </div>
              <ul className="text-sm text-amber-600 space-y-1.5 ml-6">
                <li>• Real customer pain stories and quotes</li>
                <li>• What they&apos;ve tried before (and why it failed)</li>
                <li>• Their desperation and commitment levels</li>
                <li>• Patterns emerging across participants</li>
              </ul>
            </div>

            {isDemo && (
              <p className="text-xs text-slate-500">
                <span className="font-medium">Demo tip:</span> Use the &quot;Add Participant&quot; buttons in the Enrollment tab to simulate enrollments.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No insights computed yet (shouldn't happen but handle gracefully)
  if (!insights) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER: Progressive disclosure based on participant count
  // ─────────────────────────────────────────────────────────────────────────────
  const participantCards = insights.participantCards || [];
  const timeline = insights.timeline || [];
  const patterns = insights.emergingPatterns;
  const showQuotes = baselineCount >= SHOW_QUOTES_FROM;

  // Show up to 5 participant cards in horizontal carousel
  // Users can scroll through them; full list is in Participants tab
  const visibleCards = participantCards.slice(0, 5);
  const hasMoreCards = participantCards.length > 5;

  // Get motivation and duration data for aggregates
  const motivationQ = insights.baselineQuestions.find(q => q.questionId === 'motivation');
  const durationQ = insights.baselineQuestions.find(q => q.questionId === 'villain-duration');

  return (
    <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 to-white overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-sm font-medium">Customer Insights</CardTitle>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
              {baselineCount} participant{baselineCount !== 1 ? 's' : ''}
            </Badge>
            {baselineCount > 0 && timeline.length > 0 && timeline[0].timeAgo === "just now" && (
              <Badge
                variant="secondary"
                className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 animate-pulse"
              >
                Live
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          {!hasPatterns && (
            <>Individual stories from your first participants</>
          )}
          {hasPatterns && !hasAggregates && (
            <>Stories + emerging patterns ({SHOW_AGGREGATES_FROM - baselineCount} more for full analytics)</>
          )}
          {hasAggregates && (
            <>Complete customer insights with patterns and demographics</>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 1: Individual Participant Stories (n >= 1) - Horizontal Carousel
        ───────────────────────────────────────────────────────────────────── */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Customer Stories
            <span className="text-slate-400 font-normal">({participantCards.length})</span>
          </h4>

          {/* Horizontal scrolling carousel */}
          <div className="overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {visibleCards.map((card) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-[340px] snap-start"
                >
                  <ParticipantStoryCard
                    card={card}
                    studyCategory={studyCategory}
                    isExpanded={expandedCardId === card.id}
                    onToggleExpand={() => setExpandedCardId(
                      expandedCardId === card.id ? null : card.id
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {hasMoreCards && (
            <p className="text-xs text-slate-500 text-center mt-3 pt-2 border-t border-dashed border-slate-200">
              +{participantCards.length - 2} more customers • Scroll to see all or view in <span className="font-medium text-slate-600">Participants tab</span>
            </p>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 2: Live Timeline (n >= 1)
        ───────────────────────────────────────────────────────────────────── */}
        {timeline.length > 0 && (
          <InsightsTimeline
            events={timeline}
            maxVisible={4}
            compact
          />
        )}

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 3: Emerging Patterns (n >= 3)
        ───────────────────────────────────────────────────────────────────── */}
        {hasPatterns && patterns && (
          <EmergingPatternsCard
            patterns={patterns}
            participantCount={baselineCount}
          />
        )}

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 4: Notable Quotes Carousel (n >= 15)
        ───────────────────────────────────────────────────────────────────── */}
        {showQuotes && insights.notableQuotes && insights.notableQuotes.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5" />
              In Their Own Words
            </h4>
            <QuoteCarousel quotes={insights.notableQuotes} />
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 5: Aggregate Charts (n >= 10)
        ───────────────────────────────────────────────────────────────────── */}
        {hasAggregates && (
          <>
            {/* Top Motivations */}
            {motivationQ && motivationQ.responses.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Top Motivations
                </h4>
                <HorizontalBarChart
                  data={motivationQ.responses.slice(0, 4).map(r => ({
                    label: r.value,
                    value: r.count,
                    percentage: r.percentage,
                  }))}
                  colorClass="bg-purple-500"
                />
              </div>
            )}

            {/* Customer Journey */}
            {durationQ && durationQ.responses.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  How Long They&apos;ve Been Struggling
                </h4>
                <HorizontalBarChart
                  data={durationQ.responses.map(r => ({
                    label: r.value,
                    value: r.count,
                    percentage: r.percentage,
                  }))}
                  colorClass="bg-amber-500"
                />
              </div>
            )}

            {/* Demographics Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Age Distribution */}
              {insights.demographics.ageRanges.length > 0 && (
                <div className="p-4 rounded-lg bg-white/60 border border-slate-100">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Age Distribution
                  </h4>
                  <div className="space-y-2">
                    {insights.demographics.ageRanges.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.range}</span>
                        <span className="font-medium text-slate-700 tabular-nums">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Life Stage */}
              {insights.demographics.lifeStages.length > 0 && (
                <div className="p-4 rounded-lg bg-white/60 border border-slate-100">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Life Stage
                  </h4>
                  <div className="space-y-2">
                    {insights.demographics.lifeStages.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600 truncate max-w-[60%]" title={item.stage}>
                          {item.stage}
                        </span>
                        <span className="font-medium text-slate-700 tabular-nums">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Baseline Score Summary */}
            {insights.baselineScores && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-100">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Baseline Assessment Scores
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-indigo-600">
                    {insights.baselineScores.averageScore}
                  </span>
                  <span className="text-sm text-slate-500">/ 100 average</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Starting point before intervention begins
                </p>
              </div>
            )}
          </>
        )}

        {/* Progress indicator for pre-aggregate state */}
        {!hasAggregates && (
          <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Progress to full analytics</span>
              <span className="font-medium text-slate-600">
                {baselineCount} / {SHOW_AGGREGATES_FROM}
              </span>
            </div>
            <Progress
              value={(baselineCount / SHOW_AGGREGATES_FROM) * 100}
              className="h-1.5"
            />
            <p className="text-xs text-slate-400 mt-2">
              {SHOW_AGGREGATES_FROM - baselineCount} more participant{SHOW_AGGREGATES_FROM - baselineCount !== 1 ? 's' : ''} needed for aggregate demographics and charts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
