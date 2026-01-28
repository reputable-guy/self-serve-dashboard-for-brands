"use client";

/**
 * Brand Insights Tab — "Meet your customers"
 * 
 * Progressive disclosure:
 * - n=0: Waiting state with anticipation
 * - n=1-2: Individual participant story cards
 * - n=3-9: Story cards + emerging patterns + timeline
 * - n=10+: All of above + aggregate charts
 */

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Users,
  Clock,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { useEarlyInsightsStore, SHOW_AGGREGATES_FROM } from "@/lib/early-insights-store";
import { ParticipantStoryCard } from "@/components/admin/study-detail/participant-story-card";
import { InsightsTimeline } from "@/components/admin/study-detail/insights-timeline";
import { EmergingPatternsCard } from "@/components/admin/study-detail/emerging-patterns-card";
import { HorizontalBarChart } from "@/components/admin/study-detail/shared";
import type { StudyData } from "@/components/admin/study-detail/types";
import type { ParticipantInsightCard, EarlyInsightsData } from "@/lib/types";

interface BrandInsightsTabProps {
  study: StudyData;
}

const PATTERNS_THRESHOLD = 3;
const AGGREGATES_THRESHOLD = SHOW_AGGREGATES_FROM; // 10

export function BrandInsightsTab({ study }: BrandInsightsTabProps) {
  const { getEnrollmentsByStudy } = useEnrollmentStore();
  const { computeInsights, getBaselineCount } = useEarlyInsightsStore();
  const [insights, setInsights] = useState<EarlyInsightsData | null>(null);
  
  const enrollments = getEnrollmentsByStudy(study.id);
  const category = study.category || study.categoryKey;
  const baselineCount = getBaselineCount(study.id);

  useEffect(() => {
    if (baselineCount > 0) {
      const computed = computeInsights(study.id, category);
      setInsights(computed);
    }
  }, [study.id, category, baselineCount, computeInsights]);
  
  const participantCards = insights?.participantCards || [];
  const timeline = insights?.timeline || [];
  const emergingPatterns = insights?.emergingPatterns;
  const notableQuotes = insights?.notableQuotes || [];
  const demographics = insights?.demographics;
  const n = participantCards.length;

  // Carousel state for story cards
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleCards = 3;
  const maxIndex = Math.max(0, participantCards.length - visibleCards);

  // n=0: Waiting State
  if (n === 0) {
    return <WaitingState studyCategory={study.categoryLabel || "Wellness"} />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#00D1C1]" />
            Customer Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {n === 1
              ? "Your first participant — here's their story"
              : n < PATTERNS_THRESHOLD
              ? `${n} participants enrolled — stories building`
              : n < AGGREGATES_THRESHOLD
              ? `${n} participants — patterns emerging`
              : `${n} participants — full analytics available`}
          </p>
        </div>
        <Badge variant="outline" className="text-[#00D1C1]">
          <Users className="h-3 w-3 mr-1" />
          {n} enrolled
        </Badge>
      </div>

      {/* Story Cards Carousel */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Participant Stories</h3>
          {participantCards.length > visibleCards && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                disabled={carouselIndex === 0}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {carouselIndex + 1}–{Math.min(carouselIndex + visibleCards, participantCards.length)} of {participantCards.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCarouselIndex(Math.min(maxIndex, carouselIndex + 1))}
                disabled={carouselIndex >= maxIndex}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participantCards
            .slice(carouselIndex, carouselIndex + visibleCards)
            .map((card) => (
              <ParticipantStoryCard
                key={card.id}
                card={card}
                studyCategory={category}
              />
            ))}
        </div>
      </div>

      {/* Live Timeline */}
      {timeline.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InsightsTimeline events={timeline.slice(0, 5)} />
          </CardContent>
        </Card>
      )}

      {/* Emerging Patterns (n >= 3) */}
      {n >= PATTERNS_THRESHOLD && emergingPatterns && (
        <EmergingPatternsCard
          patterns={emergingPatterns}
          participantCount={n}
          studyCategory={category}
        />
      )}

      {/* Aggregate Charts (n >= 10) */}
      {n >= AGGREGATES_THRESHOLD && demographics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Motivations */}
          {insights?.baselineQuestions?.find(q => q.questionId === "motivation") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Top Motivations</CardTitle>
              </CardHeader>
              <CardContent>
                <HorizontalBarChart
                  data={
                    insights.baselineQuestions
                      .find(q => q.questionId === "motivation")!
                      .responses.slice(0, 5)
                      .map(r => ({ label: r.value, value: r.percentage }))
                  }
                />
              </CardContent>
            </Card>
          )}

          {/* Age Distribution */}
          {demographics.ageRanges.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <HorizontalBarChart
                  data={demographics.ageRanges.map(r => ({
                    label: r.range,
                    value: r.percentage,
                  }))}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Progress toward full analytics */}
      {n < AGGREGATES_THRESHOLD && (
        <Card className="border-dashed border-[#00D1C1]/30 bg-[#00D1C1]/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-[#00D1C1]" />
                <span>
                  {n < PATTERNS_THRESHOLD
                    ? `${PATTERNS_THRESHOLD - n} more to unlock patterns`
                    : `${AGGREGATES_THRESHOLD - n} more for full analytics`}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {n}/{AGGREGATES_THRESHOLD}
              </span>
            </div>
            <Progress
              value={(n / AGGREGATES_THRESHOLD) * 100}
              className="h-1.5"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Waiting state when n=0 */
function WaitingState({ studyCategory }: { studyCategory: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full border-dashed">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="h-14 w-14 rounded-full bg-[#00D1C1]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-7 w-7 text-[#00D1C1]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Customer Insights</h3>
          <p className="text-muted-foreground text-sm mb-6">
            The first participant story will appear here the moment someone enrolls
            in your {studyCategory.toLowerCase()} study.
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-gray-700 mb-2">What you&apos;ll see:</p>
            <div className="text-xs text-muted-foreground space-y-1.5">
              <p>✦ Real customer pain stories and quotes</p>
              <p>✦ What they&apos;ve tried before your product</p>
              <p>✦ Their commitment and urgency levels</p>
              <p>✦ Patterns emerging across participants</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
