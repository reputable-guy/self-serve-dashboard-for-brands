"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Users,
  TrendingUp,
  Star,
  Minus,
  TrendingDown,
} from "lucide-react";
import {
  getLYFEfuelStoriesForStudy,
  getLYFEfuelStudyStats,
} from "@/lib/lyfefuel-demo-stories";
import {
  getSensateDemographics,
  categorizeParticipant,
} from "@/lib/sensate-real-data";
import {
  getLyfefuelDemographics,
  categorizeLyfefuelParticipant,
} from "@/lib/lyfefuel-real-data";
import type { StudyData } from "./types";
import {
  generateMockParticipants,
  getParticipantInsights,
  MOCK_DEMOGRAPHICS,
  SENSATE_METRICS,
  LYFEFUEL_METRICS,
  SENSATE_STATS,
  LYFEFUEL_STATS,
  SORTED_SENSATE_STORIES,
  SORTED_LYFEFUEL_STORIES,
} from "./mock-data";
import { InterimInsights } from "@/components/results/interim-insights";
import { WidgetSection } from "./widget-section";

interface ResultsTabProps {
  study: StudyData;
}

export function ResultsTab({ study }: ResultsTabProps) {
  // Check if this is a real data study
  const isSensateRealStudy = study.id === "study-sensate-real";
  const isLyfefuelRealStudy = study.id === "study-lyfefuel-real";
  const isRealDataStudy = isSensateRealStudy || isLyfefuelRealStudy;

  // Check if this is a demo study (show mock data) or a real user study (hide mock data)
  const isDemo = (study as { isDemo?: boolean }).isDemo !== false;

  // Compute currentDay for interim insights
  // For active demo studies without currentDay set, default to day 14 (mid-study)
  const studyCurrentDay = (() => {
    // Use explicit currentDay if set
    const explicitDay = (study as { currentDay?: number }).currentDay;
    if (explicitDay !== undefined && explicitDay > 0) {
      return explicitDay;
    }
    // For active demo studies, default to day 14 to show interim insights
    if (study.status === "active" && !isRealDataStudy) {
      return 14;
    }
    return 0;
  })();

  // Check if this is a LYFEfuel study with specific demo stories
  const lyfefuelStats = getLYFEfuelStudyStats(study.id);
  const lyfefuelStories = getLYFEfuelStoriesForStudy(study.id);
  const isLYFEfuelDemoStudy = lyfefuelStories.length > 0;

  const participants = generateMockParticipants(study.category);
  const insights = getParticipantInsights(study.category);

  // Get real demographics for real studies
  const sensateDemographics = isSensateRealStudy ? getSensateDemographics() : null;
  const lyfefuelDemographics = isLyfefuelRealStudy ? getLyfefuelDemographics() : null;

  // Use real demographics for real studies, fallback to mock for others
  const demographics = sensateDemographics || lyfefuelDemographics || MOCK_DEMOGRAPHICS;

  return (
    <div className="space-y-6">
      {/* Interim Insights - Only shows for active demo studies, NEVER for real studies */}
      <InterimInsights
        studyId={study.id}
        studyStatus={study.status}
        category={study.category}
        currentDay={studyCurrentDay}
        totalParticipants={study.participants}
      />

      {/* Aggregate Results Summary - Context-aware based on study status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Aggregate Results
          </CardTitle>
          <CardDescription>
            {study.status === "recruiting" || study.status === "filling-fast"
              ? "Results will be available once the study is active"
              : study.status === "active" && !isRealDataStudy
              ? "Preliminary data from active study"
              : `Summary of outcomes across all ${lyfefuelStats?.participants || study.participants} participants`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Recruiting/Filling-fast: No results yet */}
          {(study.status === "recruiting" || study.status === "filling-fast") && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Results will be available once participants complete the study.
                Currently {study.participants} participants enrolled.
              </p>
            </div>
          )}

          {/* Active (demo) studies: Primary metric only with preliminary label */}
          {study.status === "active" && !isRealDataStudy && (
            <div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Primary Outcome</p>
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Preliminary
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  +{lyfefuelStats?.averageImprovement || study.avgImprovement}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  average {study.categoryLabel.toLowerCase()} improvement
                </p>
                {/* Show selection method for Tier 1 studies */}
                {study.tier === 1 && (
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">
                    {study.primaryMetricConfig?.mode === "manual"
                      ? "(selected metric)"
                      : "(auto-selected as top performer)"}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Final verified results available when study completes
              </p>
            </div>
          )}

          {/* Completed studies or real data studies: Full results */}
          {(study.status === "completed" || isRealDataStudy) && (
            <>
              {/* LYFEfuel-specific headline if available */}
              {lyfefuelStats && (
                <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-[#00D1C1]/10 to-[#00D1C1]/5 border border-[#00D1C1]/20">
                  <p className="text-sm text-muted-foreground mb-1">Key Finding</p>
                  <p className="text-lg font-semibold text-[#00D1C1]">{lyfefuelStats.topHeadline}</p>
                </div>
              )}
              {/* Real study-specific key finding */}
              {isSensateRealStudy && (
                <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Key Finding</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {SENSATE_METRICS.wouldRecommendPercent}% of participants would recommend the product (NPS ≥ 7)
                  </p>
                </div>
              )}
              {isLyfefuelRealStudy && (
                <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Key Finding</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {LYFEFUEL_METRICS.wouldRecommendPercent}% of participants would recommend the product (NPS ≥ 7)
                  </p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                  <p className="text-sm text-muted-foreground">Primary Outcome</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isSensateRealStudy ? (
                      <>{SENSATE_METRICS.avgHrvChange > 0 ? "+" : ""}{SENSATE_METRICS.avgHrvChange}%</>
                    ) : isLyfefuelRealStudy ? (
                      <>{LYFEFUEL_METRICS.avgActivityChange > 0 ? "+" : ""}{LYFEFUEL_METRICS.avgActivityChange}%</>
                    ) : (
                      <>+{lyfefuelStats?.averageImprovement || study.avgImprovement}%</>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSensateRealStudy
                      ? "average HRV improvement"
                      : isLyfefuelRealStudy
                      ? "average activity minutes change"
                      : `average ${study.categoryLabel.toLowerCase()} improvement`}
                  </p>
                  {/* Show selection method for Tier 1 studies */}
                  {study.tier === 1 && !isRealDataStudy && (
                    <p className="text-xs text-muted-foreground/70 mt-1 italic">
                      {study.primaryMetricConfig?.mode === "manual"
                        ? "(selected metric)"
                        : "(auto-selected as top performer)"}
                    </p>
                  )}
                </div>
                {/* Only show NPS for real data studies */}
                {isRealDataStudy && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm text-muted-foreground">Avg. NPS Score</p>
                    <p className="text-2xl font-bold">
                      {isSensateRealStudy
                        ? `${SENSATE_METRICS.avgNps}/10`
                        : isLyfefuelRealStudy
                        ? `${LYFEFUEL_METRICS.avgNps}/10`
                        : "8.2/10"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      likelihood to recommend
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Participant Insights Highlights - Only show for demo studies (hide for real data and user-created studies) */}
      {isDemo && !isRealDataStudy && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#00D1C1]/10 to-[#00D1C1]/5 border border-[#00D1C1]/20">
            <p className="text-xs text-muted-foreground mb-1">Top Motivation</p>
            <p className="text-lg font-semibold text-[#00D1C1]">
              {insights.topMotivation.label} ({insights.topMotivation.value}%)
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Exercise 3+ days/week</p>
            <p className="text-lg font-semibold text-green-600">
              {insights.exerciseActive}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-xs text-muted-foreground mb-1">Already takes supplements</p>
            <p className="text-lg font-semibold text-purple-600">
              {insights.takesSupplements}%
            </p>
          </div>
        </div>
      )}

      {/* Embeddable Widget Section - Only show for real data studies */}
      {isRealDataStudy && (
        <WidgetSection studyId={study.id} studyName={study.name} />
      )}

      {/* Sample Participant Stories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className={`h-5 w-5 ${isRealDataStudy ? "text-emerald-500" : "text-yellow-500"}`} />
              {isRealDataStudy ? "Real Verified Participant Stories" : isLYFEfuelDemoStudy ? "Verified Participant Stories" : "Sample Participant Stories"}
            </h3>
            <Badge variant="outline" className={`text-xs ${isRealDataStudy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}>
              {isRealDataStudy ? "Real Data" : isLYFEfuelDemoStudy ? "LYFEfuel Demo" : "Demo Data"}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isSensateRealStudy
            ? `These are REAL participant stories from the Sensate study. Includes ${SENSATE_STATS.positive} positive, ${SENSATE_STATS.neutral} neutral, and ${SENSATE_STATS.negative} negative results for credibility.`
            : isLyfefuelRealStudy
            ? `These are REAL participant stories from the LYFEfuel study. Includes ${LYFEFUEL_STATS.positive} positive, ${LYFEFUEL_STATS.neutral} neutral, and ${LYFEFUEL_STATS.negative} negative results for credibility.`
            : isLYFEfuelDemoStudy
            ? "These stories show the type of verified evidence LYFEfuel can expect from their Daily Essentials studies."
            : "Preview how verified participant stories will appear. Click any card to see the full verification page."}
        </p>

        {/* LYFEfuel Demo Stories */}
        {isLYFEfuelDemoStudy && (
          <div className="grid gap-4 sm:grid-cols-2">
            {lyfefuelStories.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden hover:shadow-md transition-shadow border-[#00D1C1]/20"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                        {story.initials}
                      </div>
                      <div>
                        <p className="font-medium">{story.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(story.overallRating ?? 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{story.journey.durationDays} days</p>
                      <p className="text-[#00D1C1]">{story.verificationId}</p>
                    </div>
                  </div>

                  {/* Villain Variable & Improvement */}
                  <div className="mb-3 space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Tracking: <span className="font-medium">{story.journey.villainVariable}</span>
                    </div>
                    {story.assessmentResult && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm px-3 py-1">
                        +{story.assessmentResult.change.compositePercent}% {story.assessmentResult.categoryLabel}
                      </Badge>
                    )}
                  </div>

                  {/* Journey Progress */}
                  <div className="mb-3 text-xs">
                    <p className="text-muted-foreground mb-1">Progress: {story.journey.villainRatings[0]?.rating}/5 → {story.journey.villainRatings[story.journey.villainRatings.length - 1]?.rating}/5</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full"
                        style={{ width: `${(story.journey.villainRatings[story.journey.villainRatings.length - 1]?.rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Quote */}
                  {story.journey.keyQuotes[story.journey.keyQuotes.length - 1] && (
                    <p className="text-sm text-muted-foreground italic mb-4">
                      &quot;{story.journey.keyQuotes[story.journey.keyQuotes.length - 1].quote}&quot;
                    </p>
                  )}

                  {/* Profile Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.ageRange}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.lifeStage}</span>
                  </div>

                  {/* View Story Button */}
                  <Link href={`/verify/${story.verificationId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Verified Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Real LYFEfuel Stories - grouped by category */}
        {isLyfefuelRealStudy && (
          <LyfefuelRealStories stories={SORTED_LYFEFUEL_STORIES} />
        )}

        {/* Real Sensate Stories - grouped by category */}
        {isSensateRealStudy && (
          <SensateRealStories stories={SORTED_SENSATE_STORIES} />
        )}

        {/* Generic Mock Participants (demo studies only, non-LYFEfuel, non-Sensate) */}
        {isDemo && !isLYFEfuelDemoStudy && !isRealDataStudy && (
          <div className="grid gap-4 sm:grid-cols-2">
            {participants.map((participant) => (
              <Card
                key={participant.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                        {participant.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < participant.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{participant.daysInStudy} days</p>
                      <p>{participant.compliance}% compliance</p>
                    </div>
                  </div>

                  {/* Primary Metric */}
                  <div className="mb-3">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm px-3 py-1">
                      {participant.primaryMetric.value}
                    </Badge>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="flex gap-4 mb-3 text-xs">
                    {participant.secondaryMetrics.map((m, i) => (
                      <div key={i}>
                        <span className="text-muted-foreground">{m.label}:</span>{" "}
                        <span className="font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <p className="text-sm text-muted-foreground italic mb-4">
                    &quot;{participant.testimonial}&quot;
                  </p>

                  {/* View Story Button */}
                  <Link href={participant.verifyUrl}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Verified Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state for non-demo studies with no data */}
        {!isDemo && !isRealDataStudy && !isLYFEfuelDemoStudy && (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Participant stories will appear here as they complete the study.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Each verified story includes biometric data, testimonials, and ratings.
            </p>
          </div>
        )}
      </div>

      {/* Comprehensive Participant Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participant Insights
          </CardTitle>
          <CardDescription>
            Demographics, motivations, and characteristics of study participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Empty state for non-demo studies with no data */}
          {!isDemo && !isRealDataStudy && (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Participant insights will appear here once participants complete onboarding.
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">What you&apos;ll see:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Purchase motivations and expectations</li>
                  <li>• Exercise and lifestyle habits</li>
                  <li>• Demographics and device preferences</li>
                </ul>
              </div>
            </div>
          )}

          {/* Show insights data for demo and real data studies */}
          {(isDemo || isRealDataStudy) && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Purchase Motivation */}
            <div>
              <h4 className="text-sm font-medium mb-4">Purchase Motivation</h4>
              <div className="space-y-3">
                {insights.purchaseMotivation.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D1C1] rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Frequency */}
            <div>
              <h4 className="text-sm font-medium mb-4">Exercise Frequency</h4>
              <div className="space-y-3">
                {insights.exerciseFrequency.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            <div>
              <h4 className="text-sm font-medium mb-4">Expected Results</h4>
              <div className="space-y-3">
                {insights.expectedResults.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <h4 className="text-sm font-medium mb-4">Stress Level</h4>
              <div className="space-y-3">
                {insights.stressLevel.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wearable Devices - Only show for non-LYFEfuel real studies */}
            {!isLyfefuelRealStudy && 'wearableDevices' in demographics && (
              <div>
                <h4 className="text-sm font-medium mb-4">Wearable Devices</h4>
                <div className="space-y-3">
                  {(demographics as typeof MOCK_DEMOGRAPHICS).wearableDevices.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demographics - Age & Gender */}
            {!isLyfefuelRealStudy && 'age' in demographics && 'gender' in demographics && (
              <div>
                <h4 className="text-sm font-medium mb-4">Age & Gender</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {(demographics as typeof MOCK_DEMOGRAPHICS).age.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm flex-1">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {(demographics as typeof MOCK_DEMOGRAPHICS).gender.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm flex-1">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LYFEfuel Real Study Demographics */}
            {lyfefuelDemographics && (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-4">Age Distribution</h4>
                  <div className="space-y-3">
                    {lyfefuelDemographics.ageRanges.map((item) => (
                      <div key={item.range}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.range}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Gender Distribution</h4>
                  <div className="space-y-3">
                    {lyfefuelDemographics.genders.map((item) => (
                      <div key={item.gender}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.gender}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Education Level</h4>
                  <div className="space-y-3">
                    {lyfefuelDemographics.education.map((item) => (
                      <div key={item.level}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.level}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Employment Status</h4>
                  <div className="space-y-3">
                    {lyfefuelDemographics.employment.map((item) => (
                      <div key={item.status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.status}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Sensate Demographics - Education */}
            {sensateDemographics && sensateDemographics.education.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Education Level</h4>
                <div className="space-y-3">
                  {sensateDemographics.education.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Employment */}
            {sensateDemographics && sensateDemographics.employment.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Employment Status</h4>
                <div className="space-y-3">
                  {sensateDemographics.employment.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Income */}
            {sensateDemographics && sensateDemographics.income.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Household Income</h4>
                <div className="space-y-3">
                  {sensateDemographics.income.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Sensate Demographics - Satisfaction */}
            {sensateDemographics && sensateDemographics.satisfaction.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4">Overall Satisfaction</h4>
                <div className="space-y-3">
                  {sensateDemographics.satisfaction.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extracted sub-component for LYFEfuel real stories
function LyfefuelRealStories({ stories }: { stories: typeof SORTED_LYFEFUEL_STORIES }) {
  // Group stories by category
  const positiveStories = stories.filter(s => categorizeLyfefuelParticipant(s) === "positive");
  const neutralStories = stories.filter(s => categorizeLyfefuelParticipant(s) === "neutral");
  const negativeStories = stories.filter(s => categorizeLyfefuelParticipant(s) === "negative");

  return (
    <div className="space-y-8">
      {/* Improved Section */}
      {positiveStories.length > 0 && (
        <StorySection
          title="Improved"
          stories={positiveStories}
          totalCount={stories.length}
          category="positive"
          description="Participants with objective improvement (Activity Minutes 10%+ or Steps 20%+) AND high satisfaction (NPS 7+)"
          renderCard={(story) => <LyfefuelStoryCard key={story.id} story={story} category="positive" />}
        />
      )}

      {/* Neutral Section */}
      {neutralStories.length > 0 && (
        <StorySection
          title="Mixed Results"
          stories={neutralStories}
          totalCount={stories.length}
          category="neutral"
          description="Participants with either objective improvement but lower satisfaction, or high satisfaction but no measurable improvement"
          renderCard={(story) => <LyfefuelStoryCard key={story.id} story={story} category="neutral" />}
        />
      )}

      {/* No Improvement Section */}
      {negativeStories.length > 0 && (
        <StorySection
          title="No Improvement"
          stories={negativeStories}
          totalCount={stories.length}
          category="negative"
          description="Participants with low satisfaction (NPS 4 or below) AND no objective improvement in metrics"
          renderCard={(story) => <LyfefuelStoryCard key={story.id} story={story} category="negative" />}
        />
      )}
    </div>
  );
}

// Extracted sub-component for Sensate real stories
function SensateRealStories({ stories }: { stories: typeof SORTED_SENSATE_STORIES }) {
  // Group stories by category
  const positiveStories = stories.filter(s => categorizeParticipant(s) === "positive");
  const neutralStories = stories.filter(s => categorizeParticipant(s) === "neutral");
  const negativeStories = stories.filter(s => categorizeParticipant(s) === "negative");

  return (
    <div className="space-y-8">
      {/* Improved Section */}
      {positiveStories.length > 0 && (
        <StorySection
          title="Improved"
          stories={positiveStories}
          totalCount={stories.length}
          category="positive"
          description="Participants with objective improvement (HRV or Deep Sleep up 5%+) AND high satisfaction (NPS 7+)"
          renderCard={(story) => <SensateStoryCard key={story.id} story={story} category="positive" />}
        />
      )}

      {/* Neutral Section */}
      {neutralStories.length > 0 && (
        <StorySection
          title="Mixed Results"
          stories={neutralStories}
          totalCount={stories.length}
          category="neutral"
          description="Participants with either objective improvement but lower satisfaction, or high satisfaction but no measurable improvement"
          renderCard={(story) => <SensateStoryCard key={story.id} story={story} category="neutral" />}
        />
      )}

      {/* No Improvement Section */}
      {negativeStories.length > 0 && (
        <StorySection
          title="No Improvement"
          stories={negativeStories}
          totalCount={stories.length}
          category="negative"
          description="Participants with low satisfaction (NPS 4 or below) AND no objective improvement in metrics"
          renderCard={(story) => <SensateStoryCard key={story.id} story={story} category="negative" />}
        />
      )}
    </div>
  );
}

// Reusable story section component
function StorySection<T>({
  title,
  stories,
  totalCount,
  category,
  description,
  renderCard,
}: {
  title: string;
  stories: T[];
  totalCount: number;
  category: "positive" | "neutral" | "negative";
  description: string;
  renderCard: (story: T) => React.ReactNode;
}) {
  const icons = {
    positive: <TrendingUp className="h-5 w-5 text-emerald-600" />,
    neutral: <Minus className="h-5 w-5 text-yellow-600" />,
    negative: <TrendingDown className="h-5 w-5 text-red-500" />,
  };

  const titleColors = {
    positive: "text-emerald-700",
    neutral: "text-yellow-700",
    negative: "text-red-600",
  };

  const badgeStyles = {
    positive: "bg-emerald-100 text-emerald-700 border-emerald-200",
    neutral: "bg-yellow-100 text-yellow-700 border-yellow-200",
    negative: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icons[category]}
        <h4 className={`font-semibold ${titleColors[category]}`}>{title} ({stories.length})</h4>
        <Badge className={badgeStyles[category]}>
          {Math.round((stories.length / totalCount) * 100)}%
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map(renderCard)}
      </div>
    </div>
  );
}

// LYFEfuel story card component
function LyfefuelStoryCard({
  story,
  category,
}: {
  story: typeof SORTED_LYFEFUEL_STORIES[0];
  category: "positive" | "neutral" | "negative";
}) {
  const cardStyles = {
    positive: "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white",
    neutral: "border-yellow-200 bg-gradient-to-br from-yellow-50/30 to-white",
    negative: "border-red-200 bg-gradient-to-br from-red-50/30 to-white",
  };
  const avatarStyles = {
    positive: "bg-gradient-to-br from-[#00D1C1] to-[#00A89D]",
    neutral: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    negative: "bg-gradient-to-br from-red-400 to-red-500",
  };
  const buttonStyles = {
    positive: "border-emerald-200 hover:bg-emerald-50",
    neutral: "border-yellow-200 hover:bg-yellow-50",
    negative: "border-red-200 hover:bg-red-50",
  };
  const idStyles = {
    positive: "text-emerald-600",
    neutral: "text-yellow-600",
    negative: "text-red-600",
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${cardStyles[category]}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarStyles[category]}`}>
              {story.initials}
            </div>
            <div>
              <p className="font-medium">{story.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(story.finalTestimonial?.overallRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {story.finalTestimonial?.npsScore !== undefined
                    ? `${story.finalTestimonial.npsScore}/10 NPS`
                    : `${story.finalTestimonial?.overallRating}/5`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{story.journey.durationDays} days</p>
            <p className={idStyles[category]}>{story.verificationId}</p>
          </div>
        </div>

        {/* Demographics + Cohort */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {story.cohortNumber && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
              <Users className="h-2.5 w-2.5" />
              Cohort {story.cohortNumber}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.ageRange}</span>
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.gender}</span>
          {story.profile.educationLevel && (
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.educationLevel}</span>
          )}
        </div>

        {/* Wearable Metrics */}
        <div className="mb-3 space-y-2">
          {story.wearableMetrics?.activeMinutesChange && (
            <Badge className={`text-sm px-3 py-1 ${
              story.wearableMetrics.activeMinutesChange.changePercent > 0
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}>
              Activity: {story.wearableMetrics.activeMinutesChange.changePercent > 0 ? "+" : ""}
              {story.wearableMetrics.activeMinutesChange.changePercent}%
            </Badge>
          )}
          {story.wearableMetrics?.stepsChange && (
            <Badge className={`text-sm px-3 py-1 ml-1 ${
              story.wearableMetrics.stepsChange.changePercent > 0
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}>
              Steps: {story.wearableMetrics.stepsChange.changePercent > 0 ? "+" : ""}
              {story.wearableMetrics.stepsChange.changePercent}%
            </Badge>
          )}
        </div>

        {/* Key Quote */}
        {story.finalTestimonial?.quote && (
          <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">
            &quot;{story.finalTestimonial.quote}&quot;
          </p>
        )}

        {/* View Story Button */}
        <Link href={`/verify/${story.verificationId}`}>
          <Button variant="outline" size="sm" className={`w-full ${buttonStyles[category]}`}>
            <ExternalLink className="h-3 w-3 mr-1" />
            View Verified Story
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Sensate story card component
function SensateStoryCard({
  story,
  category,
}: {
  story: typeof SORTED_SENSATE_STORIES[0];
  category: "positive" | "neutral" | "negative";
}) {
  const cardStyles = {
    positive: "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white",
    neutral: "border-yellow-200 bg-gradient-to-br from-yellow-50/30 to-white",
    negative: "border-red-200 bg-gradient-to-br from-red-50/30 to-white",
  };
  const avatarStyles = {
    positive: "bg-gradient-to-br from-[#00D1C1] to-[#00A89D]",
    neutral: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    negative: "bg-gradient-to-br from-red-400 to-red-500",
  };
  const buttonStyles = {
    positive: "border-emerald-200 hover:bg-emerald-50",
    neutral: "border-yellow-200 hover:bg-yellow-50",
    negative: "border-red-200 hover:bg-red-50",
  };
  const idStyles = {
    positive: "text-emerald-600",
    neutral: "text-yellow-600",
    negative: "text-red-600",
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${cardStyles[category]}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold text-white ${avatarStyles[category]}`}>
              {story.initials}
            </div>
            <div>
              <p className="font-medium">{story.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(story.finalTestimonial?.overallRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {story.finalTestimonial?.npsScore !== undefined
                    ? `${story.finalTestimonial.npsScore}/10 NPS`
                    : `${story.finalTestimonial?.overallRating}/5`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{story.journey.durationDays} days</p>
            <p className={idStyles[category]}>{story.verificationId}</p>
          </div>
        </div>

        {/* Demographics + Cohort */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {story.cohortNumber && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
              <Users className="h-2.5 w-2.5" />
              Cohort {story.cohortNumber}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.ageRange}</span>
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.gender}</span>
          {story.profile.educationLevel && (
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{story.profile.educationLevel}</span>
          )}
        </div>

        {/* Wearable Metrics */}
        <div className="mb-3 space-y-2">
          {story.wearableMetrics?.hrvChange && (
            <Badge className={`text-sm px-3 py-1 ${
              story.wearableMetrics.hrvChange.changePercent > 0
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}>
              HRV: {story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}
              {story.wearableMetrics.hrvChange.changePercent}%
            </Badge>
          )}
          {story.wearableMetrics?.deepSleepChange && (
            <Badge className={`text-sm px-3 py-1 ml-1 ${
              story.wearableMetrics.deepSleepChange.changePercent > 0
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}>
              Deep Sleep: {story.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}
              {story.wearableMetrics.deepSleepChange.changePercent}%
            </Badge>
          )}
        </div>

        {/* Key Quote */}
        {story.finalTestimonial?.quote && (
          <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">
            &quot;{story.finalTestimonial.quote}&quot;
          </p>
        )}

        {/* View Story Button */}
        <Link href={`/verify/${story.verificationId}`}>
          <Button variant="outline" size="sm" className={`w-full ${buttonStyles[category]}`}>
            <ExternalLink className="h-3 w-3 mr-1" />
            View Verified Story
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
