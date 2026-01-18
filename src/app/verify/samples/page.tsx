"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  Moon,
  Activity,
  Zap,
  Brain,
  Heart,
  Smile,
  Shield,
  Leaf,
  Sparkles,
  Scale,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  SAMPLE_STORIES_BY_CATEGORY,
  CategorySampleStory,
} from "@/lib/sample-stories";
import { SENSATE_REAL_STORIES } from "@/lib/sensate-real-data";
import { getTierDisplayInfo, TierLevel } from "@/lib/assessments";
import type { ParticipantStory } from "@/lib/types";

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  sleep: Moon,
  recovery: Activity,
  fitness: Zap,
  stress: Shield,
  energy: Zap,
  focus: Brain,
  mood: Smile,
  anxiety: Heart,
  gut: Leaf,
  skin: Sparkles,
  weight: Scale,
};

// Tier colors
const TIER_COLORS: Record<TierLevel, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200",
  2: "bg-purple-100 text-purple-700 border-purple-200",
  3: "bg-green-100 text-green-700 border-green-200",
  4: "bg-orange-100 text-orange-700 border-orange-200",
};

// Group stories by tier
function groupStoriesByTier(stories: CategorySampleStory[]): Record<TierLevel, CategorySampleStory[]> {
  return {
    1: stories.filter(s => s.tier === 1),
    2: stories.filter(s => s.tier === 2),
    3: stories.filter(s => s.tier === 3),
    4: stories.filter(s => s.tier === 4),
  };
}

function RealStoryCard({ story }: { story: ParticipantStory }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-bold flex-shrink-0">
            {story.initials}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">{story.name}</h3>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Real Data
              </Badge>
              {story.dataSource === "real" && (
                <Badge variant="outline" className="bg-white">
                  Verified Participant
                </Badge>
              )}
            </div>

            {/* Demographics */}
            {story.profile && (
              <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-muted-foreground">
                <span>{story.profile.ageRange}</span>
                {story.profile.gender && <span>• {story.profile.gender}</span>}
                {story.profile.educationLevel && <span>• {story.profile.educationLevel}</span>}
              </div>
            )}

            {/* Wearable Metrics Preview */}
            {story.wearableMetrics && (
              <div className="flex flex-wrap gap-2 mb-3">
                {story.wearableMetrics.hrvChange && (
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    story.wearableMetrics.hrvChange.changePercent > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    HRV: {story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}
                    {story.wearableMetrics.hrvChange.changePercent}%
                  </span>
                )}
                {story.wearableMetrics.deepSleepChange && (
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    story.wearableMetrics.deepSleepChange.changePercent > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    Deep Sleep: {story.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}
                    {story.wearableMetrics.deepSleepChange.changePercent}%
                  </span>
                )}
              </div>
            )}

            {/* NPS Score */}
            {story.finalTestimonial?.overallRating && (
              <div className="text-sm text-muted-foreground mb-3">
                NPS: <span className="font-semibold">{story.finalTestimonial.overallRating}/10</span>
              </div>
            )}

            {/* CTA */}
            <Link href={`/verify/${story.verificationId}`}>
              <Button variant="outline" size="sm" className="w-full border-emerald-200 hover:bg-emerald-50">
                View Full Verification Story
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SampleStoryCard({ sample }: { sample: CategorySampleStory }) {
  const Icon = CATEGORY_ICONS[sample.category] || Target;
  const tierInfo = getTierDisplayInfo(sample.tier);
  const story = sample.story;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className="h-12 w-12 rounded-xl bg-[#00D1C1]/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-[#00D1C1]" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">{sample.categoryLabel}</h3>
              <Badge variant="outline" className={TIER_COLORS[sample.tier]}>
                Tier {sample.tier}: {tierInfo.label}
              </Badge>
            </div>

            {/* Villain Variable - THE KEY INSIGHT */}
            <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800">
                <Target className="h-4 w-4" />
                <span className="font-medium">Problem Being Solved:</span>
              </div>
              <p className="text-amber-900 font-semibold mt-1 capitalize">
                {sample.villainVariable}
              </p>
            </div>

            {/* Participant Preview */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-[#00D1C1] font-semibold">
                {story.initials}
              </div>
              <div>
                <p className="font-medium">{story.name}</p>
                <p className="text-sm text-muted-foreground">
                  {story.profile.ageRange} • {story.profile.lifeStage}
                </p>
              </div>
            </div>

            {/* Progress Preview */}
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Progress over {story.journey.durationDays} days:</span>
              </div>
              <div className="flex gap-1">
                {story.journey.villainRatings.map((rating, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      rating.rating >= 4 ? "bg-green-500" :
                      rating.rating === 3 ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}
                    title={`Day ${rating.day}: ${rating.note}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Day 1</span>
                <span>Day {story.journey.durationDays}</span>
              </div>
            </div>

            {/* Results Preview */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sample.tier === 1 && story.wearableMetrics?.deepSleepChange && (
                <span className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Deep Sleep: +{story.wearableMetrics.deepSleepChange.changePercent}%
                </span>
              )}
              {sample.tier === 1 && story.wearableMetrics?.hrvChange && (
                <span className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  HRV: +{story.wearableMetrics.hrvChange.changePercent}%
                </span>
              )}
              {sample.tier >= 2 && story.assessmentResult && (
                <span className="text-sm px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                  {story.assessmentResult.categoryLabel}: +{story.assessmentResult.change.compositePercent}%
                </span>
              )}
            </div>

            {/* CTA */}
            <Link href={`/verify/sample-${sample.category}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Full Verification Story
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SampleStoriesPage() {
  const allStories = Object.values(SAMPLE_STORIES_BY_CATEGORY);
  const storiesByTier = groupStoriesByTier(allStories);

  const tierDescriptions: Record<TierLevel, string> = {
    1: "Wearable data is the primary measurement. The device tells the story.",
    2: "Both wearable data AND assessment measure the outcome together.",
    3: "Assessment is primary, wearables validate engagement.",
    4: "Assessment measures the outcome, wearables prove participation.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse real participant stories and sample stories to see what the end-to-end
            verification experience looks like. Each story shows the{" "}
            <span className="font-semibold text-amber-600">problem being solved</span>{" "}
            and how progress is tracked.
          </p>
        </div>

        {/* REAL DATA SECTION */}
        <Card className="mb-8 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-emerald-900">Real Data Stories</CardTitle>
                <p className="text-sm text-emerald-700 mt-1">
                  Sensate Sleep & Stress Study • 25 participants • 58-day protocol
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-white rounded-lg border border-emerald-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Baseline</p>
                  <p className="font-semibold text-emerald-800">30 days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Intervention</p>
                  <p className="font-semibold text-emerald-800">28 days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wearable</p>
                  <p className="font-semibold text-emerald-800">Oura Ring</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="font-semibold text-emerald-800">Sensate Device</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These are <strong>real participant stories</strong> from the Sensate vagus nerve device study.
              Includes 5 participants with positive results and 2 with negative/no improvement for credibility.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SENSATE_REAL_STORIES.map((story) => (
                <RealStoryCard key={story.id} story={story} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="border-t pt-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-2">Sample Stories by Category</h2>
          <p className="text-center text-muted-foreground mb-8">
            Explore demo stories across all wellness categories and tiers
          </p>
        </div>

        {/* Tier Legend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Understanding Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {([1, 2, 3, 4] as TierLevel[]).map((tier) => (
                <div key={tier} className={`p-3 rounded-lg border ${TIER_COLORS[tier]}`}>
                  <p className="font-semibold">Tier {tier}</p>
                  <p className="text-sm mt-1">{tierDescriptions[tier]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stories by Tier */}
        {([1, 2, 3, 4] as TierLevel[]).map((tier) => {
          const tierStories = storiesByTier[tier];
          if (tierStories.length === 0) return null;

          const tierInfo = getTierDisplayInfo(tier);

          return (
            <div key={tier} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">Tier {tier}: {tierInfo.label}</h2>
                <span className="text-sm text-muted-foreground">
                  ({tierStories.length} {tierStories.length === 1 ? "category" : "categories"})
                </span>
              </div>
              <p className="text-muted-foreground mb-4">{tierDescriptions[tier]}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {tierStories.map((sample) => (
                  <SampleStoryCard key={sample.category} sample={sample} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick Links */}
        <Card className="mt-8 bg-[#00D1C1]/5 border-[#00D1C1]/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Access to Sample Stories</h3>
            <div className="flex flex-wrap gap-2">
              {allStories.map((sample) => (
                <Link key={sample.category} href={`/verify/sample-${sample.category}`}>
                  <Button variant="outline" size="sm">
                    {sample.categoryLabel}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
