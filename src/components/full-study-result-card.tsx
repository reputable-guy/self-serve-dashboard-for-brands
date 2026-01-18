"use client";

import { useState } from "react";
import Link from "next/link";
import { ParticipantStory } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Watch,
  Quote,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  MessageSquare,
  Activity,
  Zap,
} from "lucide-react";

interface FullStudyResultCardProps {
  story: ParticipantStory;
  studyId?: string;
  productName?: string;
}

// Progress bar component
function ProgressBar({ before, after, label, unit, isNegativeBetter = false }: {
  before: number;
  after: number;
  label: string;
  unit: string;
  isNegativeBetter?: boolean;
}) {
  const change = after - before;
  const changePercent = Math.round((change / before) * 100);
  const maxVal = Math.max(before, after);
  const beforeWidth = (before / maxVal) * 100;
  const afterWidth = (after / maxVal) * 100;
  const isPositive = isNegativeBetter ? change < 0 : change > 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`text-sm font-bold ${isPositive ? "text-[#00D1C1]" : "text-red-500"}`}>
          {changePercent > 0 ? "+" : ""}{changePercent}%
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-12">Before</span>
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-full"
              style={{ width: `${beforeWidth}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-16 text-right">{before} {unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-12">After</span>
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isPositive ? "bg-[#00D1C1]" : "bg-red-400"}`}
              style={{ width: `${afterWidth}%` }}
            />
          </div>
          <span className="text-xs font-medium w-16 text-right">{after} {unit}</span>
        </div>
      </div>
    </div>
  );
}

// Villain rating trajectory visualization
function VillainTrajectory({ ratings, villainVariable }: {
  ratings: { day: number; rating: number; note?: string }[];
  villainVariable: string;
}) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {villainVariable} Rating Over Time
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNotes(!showNotes)}
          className="text-xs h-6 px-2"
        >
          {showNotes ? "Hide notes" : "Show notes"}
          {showNotes ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </Button>
      </div>

      <div className="space-y-2">
        {ratings.map((r) => (
          <div key={r.day} className="flex items-start gap-3">
            <div className="w-12 text-xs text-gray-400">Day {r.day}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-3 rounded-sm ${
                      i < r.rating
                        ? r.rating >= 4
                          ? "bg-[#00D1C1]"
                          : r.rating >= 3
                          ? "bg-yellow-400"
                          : "bg-red-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {r.rating === 1 ? "Much worse" : r.rating === 2 ? "Worse" : r.rating === 3 ? "Same" : r.rating === 4 ? "Better" : "Much better"}
                </span>
              </div>
              {showNotes && r.note && (
                <p className="text-xs text-gray-500 mt-1 italic">&quot;{r.note}&quot;</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FullStudyResultCard({ story }: FullStudyResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Header Section */}
      <CardHeader className="bg-gradient-to-r from-[#00D1C1]/5 to-blue-500/5 border-b pb-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {story.avatarUrl ? (
            <img
              src={story.avatarUrl}
              alt={story.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#00D1C1]/10 flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-xl font-bold text-[#00D1C1]">{story.initials}</span>
            </div>
          )}

          {/* Identity & Context */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{story.name}</h3>
              <span className="text-sm text-gray-500">{story.profile.ageRange}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{story.profile.lifeStage}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Dealing with {story.journey.villainVariable} for {story.baseline.villainDuration.toLowerCase()}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {story.baseline.triedOther}
              </span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
            {story.wearableMetrics && story.tier !== 4 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Watch className="w-3 h-3" />
                <span>{story.wearableMetrics?.device}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Why They Joined Section */}
        <div className="p-6 border-b bg-white dark:bg-gray-900">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Why They Joined</h4>
              <blockquote className="text-sm text-gray-600 dark:text-gray-400 italic border-l-2 border-blue-500 pl-3">
                &quot;{story.baseline.motivation}&quot;
              </blockquote>
              <p className="text-xs text-gray-400 mt-2">— Enrollment audio response</p>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="p-6 border-b bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00D1C1]" />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Their Journey</h4>
            <span className="text-xs text-gray-400 ml-auto">
              {story.journey.durationDays} days · {story.journey.startDate} to {story.journey.endDate}
            </span>
          </div>

          <VillainTrajectory
            ratings={story.journey.villainRatings}
            villainVariable={story.journey.villainVariable}
          />
        </div>

        {/* Wearable Insights Section - Only show for tiers 1-3 with wearable data */}
        {story.wearableMetrics && story.tier !== 4 && (
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Watch className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Wearable Insights</h4>
              <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                <span>Data from</span>
                <span className="font-medium">{story.wearableMetrics?.device}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Activity metrics (energy studies) */}
              {story.wearableMetrics?.stepsChange && (
                <ProgressBar
                  before={story.wearableMetrics.stepsChange.before}
                  after={story.wearableMetrics.stepsChange.after}
                  label="Daily Steps"
                  unit=""
                />
              )}
              {story.wearableMetrics?.activeMinutesChange && (
                <ProgressBar
                  before={story.wearableMetrics.activeMinutesChange.before}
                  after={story.wearableMetrics.activeMinutesChange.after}
                  label="Active Minutes"
                  unit={story.wearableMetrics.activeMinutesChange.unit}
                />
              )}
              {/* Sleep metrics (sleep/recovery/stress studies) - only show if has actual sleep data */}
              {story.wearableMetrics?.sleepChange && story.wearableMetrics.sleepChange.changePercent > 0 && (
                <ProgressBar
                  before={story.wearableMetrics.sleepChange.before}
                  after={story.wearableMetrics.sleepChange.after}
                  label="Total Sleep"
                  unit={story.wearableMetrics.sleepChange.unit}
                />
              )}
              {story.wearableMetrics?.deepSleepChange && !story.wearableMetrics?.stepsChange && (
                <ProgressBar
                  before={story.wearableMetrics.deepSleepChange.before}
                  after={story.wearableMetrics.deepSleepChange.after}
                  label="Deep Sleep"
                  unit={story.wearableMetrics.deepSleepChange.unit}
                />
              )}
              {story.wearableMetrics?.hrvChange && (
                <ProgressBar
                  before={story.wearableMetrics.hrvChange.before}
                  after={story.wearableMetrics.hrvChange.after}
                  label="HRV"
                  unit="ms"
                />
              )}
              {story.wearableMetrics?.restingHrChange && (
                <ProgressBar
                  before={story.wearableMetrics.restingHrChange.before}
                  after={story.wearableMetrics.restingHrChange.after}
                  label="Resting HR"
                  unit="bpm"
                  isNegativeBetter
                />
              )}
            </div>
          </div>
        )}

        {/* Key Quotes Section */}
        {story.journey.keyQuotes.length > 0 && (
          <div className="p-6 border-b bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">In Their Words</h4>
            </div>

            <div className="space-y-4">
              {story.journey.keyQuotes.map((q, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Quote className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      &quot;{q.quote}&quot;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      — Day {q.day} {q.context}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Narrative (expandable) */}
        {story.generatedNarrative && (
          <div className="p-6 bg-gradient-to-b from-[#00D1C1]/5 to-transparent">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00D1C1]" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Story</h4>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {story.generatedNarrative}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Completed {story.completedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{story.journey.durationDays} days</span>
            </div>
          </div>
          <Link href={`/verify/${story.verificationId}`}>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <BadgeCheck className="w-3 h-3 mr-1" />
              View Verification #{story.verificationId}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for grid displays
export function CompactFullCard({ story }: { story: ParticipantStory }) {
  const lastRating = story.journey.villainRatings[story.journey.villainRatings.length - 1];
  const primaryMetric = story.wearableMetrics?.deepSleepChange || story.wearableMetrics?.sleepChange;
  const bestQuote = story.journey.keyQuotes[story.journey.keyQuotes.length - 1]?.quote || story.baseline.motivation;
  const truncatedQuote = bestQuote.length > 100 ? bestQuote.slice(0, 97) + "..." : bestQuote;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {story.avatarUrl ? (
            <img src={story.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-bold text-[#00D1C1]">
              {story.initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{story.name}</span>
              <span className="text-xs text-gray-500">{story.profile.ageRange}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{story.profile.lifeStage}</p>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <BadgeCheck className="w-3.5 h-3.5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Quick Stats */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-lg font-bold text-[#00D1C1]">
              +{primaryMetric?.changePercent || 0}%
            </div>
            <div className="text-xs text-gray-500">
              {primaryMetric === story.wearableMetrics?.deepSleepChange ? "Deep Sleep" : "Sleep"}
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="flex items-center gap-0.5 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < (lastRating?.rating || 0) ? "bg-[#00D1C1]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1 capitalize">{story.journey.villainVariable}</div>
          </div>
        </div>

        {/* Quote */}
        <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">
          &quot;{truncatedQuote}&quot;
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Watch className="w-3 h-3" />
            <span>{story.wearableMetrics?.device}</span>
          </div>
          <span>{story.journey.durationDays} days</span>
        </div>
      </CardContent>
    </Card>
  );
}
