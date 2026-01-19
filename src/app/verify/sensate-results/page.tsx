"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  Minus,
  TrendingDown,
  Star,
  ExternalLink,
  CheckCircle2,
  Users
} from "lucide-react";
import Link from "next/link";
import {
  getSortedSensateStories,
  getSensateStudyStats,
  categorizeParticipant
} from "@/lib/sensate-real-data";

// Get the sorted stories and categorize them
const allStories = getSortedSensateStories();
const stats = getSensateStudyStats();

// Group participants by category
const improved = allStories.filter(s => categorizeParticipant(s) === "positive");
const neutral = allStories.filter(s => categorizeParticipant(s) === "neutral");
const didntImprove = allStories.filter(s => categorizeParticipant(s) === "negative");

function ParticipantCard({ story, category }: { story: typeof allStories[0], category: "positive" | "neutral" | "negative" }) {
  const hrvChange = story.wearableMetrics?.hrvChange?.changePercent || 0;
  const deepSleepChange = story.wearableMetrics?.deepSleepChange?.changePercent || 0;
  const nps = story.finalTestimonial?.npsScore || 0;
  const stars = story.finalTestimonial?.overallRating || 0;

  const categoryColors = {
    positive: "border-green-200 bg-green-50/50",
    neutral: "border-yellow-200 bg-yellow-50/50",
    negative: "border-red-200 bg-red-50/50"
  };

  return (
    <Link href={`/verify/${story.verificationId}`} className="block">
      <Card className={`hover:shadow-md transition-shadow cursor-pointer ${categoryColors[category]}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-semibold">
                {story.initials}
              </div>
              <div>
                <p className="font-medium">{story.name}</p>
                <p className="text-xs text-muted-foreground">{story.profile.ageRange} • {story.profile.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white/80 rounded">
              <p className={`text-sm font-semibold ${hrvChange > 0 ? "text-green-600" : hrvChange < 0 ? "text-red-500" : "text-gray-600"}`}>
                {hrvChange > 0 ? "+" : ""}{hrvChange}%
              </p>
              <p className="text-xs text-muted-foreground">HRV</p>
            </div>
            <div className="p-2 bg-white/80 rounded">
              <p className={`text-sm font-semibold ${deepSleepChange > 0 ? "text-green-600" : deepSleepChange < 0 ? "text-red-500" : "text-gray-600"}`}>
                {deepSleepChange > 0 ? "+" : ""}{deepSleepChange}%
              </p>
              <p className="text-xs text-muted-foreground">Deep Sleep</p>
            </div>
            <div className="p-2 bg-white/80 rounded">
              <p className="text-sm font-semibold text-[#00D1C1]">{nps}/10</p>
              <p className="text-xs text-muted-foreground">NPS</p>
            </div>
          </div>

          {story.finalTestimonial?.quote && (
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic">
              &quot;{story.finalTestimonial.quote}&quot;
            </p>
          )}

          <div className="flex items-center justify-end mt-2 text-xs text-[#00D1C1]">
            View full results <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function SensateResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <img
              src="/logos/reputable-logo.png"
              alt="Reputable"
              className="h-6 w-auto"
            />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Study Results
              </p>
              <h1 className="text-xl font-bold text-gray-900">Sensate Vagus Nerve Device</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#00D1C1]" />
              All {stats.totalParticipants} Verified Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These are real results from {stats.totalParticipants} verified participants in an independent 28-day study.
              We show everyone&apos;s results — not just success stories.
            </p>

            <div className="mb-4">
              <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.round((stats.improved / stats.totalParticipants) * 100)}%` }}
                />
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${Math.round((stats.neutral / stats.totalParticipants) * 100)}%` }}
                />
                <div
                  className="h-full bg-gray-300"
                  style={{ width: `${Math.round((stats.noImprovement / stats.totalParticipants) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  {stats.improved} improved ({Math.round((stats.improved / stats.totalParticipants) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-400" />
                  {stats.neutral} neutral ({Math.round((stats.neutral / stats.totalParticipants) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-300" />
                  {stats.noImprovement} didn&apos;t ({Math.round((stats.noImprovement / stats.totalParticipants) * 100)}%)
                </span>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-sm">
              <p className="font-medium mb-2">How we categorize results:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-green-600 font-medium">Improved:</span> At least one metric (HRV or Deep Sleep) improved by ≥5% AND NPS ≥ 7</li>
                <li><span className="text-yellow-600 font-medium">Neutral:</span> Mixed results — objective improvement but low satisfaction, or vice versa</li>
                <li><span className="text-red-500 font-medium">Didn&apos;t improve:</span> Low satisfaction (NPS ≤ 4) AND no objective improvement</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Improved Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Improved ({improved.length})</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {Math.round((improved.length / stats.totalParticipants) * 100)}%
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {improved.map((story) => (
              <ParticipantCard key={story.id} story={story} category="positive" />
            ))}
          </div>
        </div>

        {/* Neutral Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Minus className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold">Neutral ({neutral.length})</h2>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {Math.round((neutral.length / stats.totalParticipants) * 100)}%
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neutral.map((story) => (
              <ParticipantCard key={story.id} story={story} category="neutral" />
            ))}
          </div>
        </div>

        {/* Didn't Improve Section */}
        {didntImprove.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Didn&apos;t Improve ({didntImprove.length})</h2>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {Math.round((didntImprove.length / stats.totalParticipants) * 100)}%
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {didntImprove.map((story) => (
                <ParticipantCard key={story.id} story={story} category="negative" />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-[#00D1C1] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">About This Verification</h3>
                <p className="text-sm text-muted-foreground">
                  This study was conducted independently by Reputable Health. Participants used the Sensate device
                  for 10 minutes daily over 28 days, with wearable data (Oura Ring) collected throughout a 30-day baseline
                  and 28-day intervention period. All participants received the same compensation regardless of their
                  feedback or results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
