"use client";

import { ParticipantStory } from "@/lib/mock-data";
import { BadgeCheck, Watch, TrendingUp, TrendingDown } from "lucide-react";

interface CompactTestimonialCardProps {
  story: ParticipantStory;
  studyId?: string;
  className?: string;
}

// Render filled/empty dots for rating visualization (1-5 scale)
function RatingDots({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < rating ? "bg-[#00D1C1]" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// Format metric change with appropriate sign and color
function MetricChange({ value, label, unit }: { value: number; label: string; unit?: string }) {
  const isPositive = label.toLowerCase().includes("hr") ? value < 0 : value > 0;
  const displayValue = value > 0 ? `+${value}%` : `${value}%`;

  return (
    <div className="flex items-center gap-1">
      <span className={`text-sm font-bold ${isPositive ? "text-[#00D1C1]" : "text-red-500"}`}>
        {displayValue}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export function CompactTestimonialCard({ story, studyId, className = "" }: CompactTestimonialCardProps) {
  // Get the primary metric to highlight (deep sleep is usually most impactful)
  const primaryMetric = story.wearableMetrics.deepSleepChange || story.wearableMetrics.sleepChange;

  // Get first and last villain ratings for trajectory
  const firstRating = story.journey.villainRatings[0];
  const lastRating = story.journey.villainRatings[story.journey.villainRatings.length - 1];

  // Get the best quote (prefer final reflection)
  const bestQuote = story.journey.keyQuotes[story.journey.keyQuotes.length - 1]?.quote
    || story.baseline.motivation;

  // Truncate quote if too long
  const truncatedQuote = bestQuote.length > 120 ? bestQuote.slice(0, 117) + "..." : bestQuote;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header: Identity + Life Stage */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {story.avatarUrl ? (
            <img
              src={story.avatarUrl}
              alt={story.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
              <span className="text-[#00D1C1] font-semibold">{story.initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">{story.name}</span>
              <span className="text-xs text-gray-500">{story.profile.ageRange}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{story.profile.lifeStage}</p>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
          &quot;{truncatedQuote}&quot;
        </p>
      </div>

      {/* Villain Trajectory */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 capitalize">{story.journey.villainVariable}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <RatingDots rating={firstRating?.rating || 2} />
              <span className="text-gray-400 mx-1">→</span>
              <RatingDots rating={lastRating?.rating || 5} />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
        {story.wearableMetrics.deepSleepChange && (
          <MetricChange
            value={story.wearableMetrics.deepSleepChange.changePercent}
            label="Deep Sleep"
          />
        )}
        {story.wearableMetrics.hrvChange && (
          <MetricChange
            value={story.wearableMetrics.hrvChange.changePercent}
            label="HRV"
          />
        )}
        {story.wearableMetrics.sleepChange && !story.wearableMetrics.deepSleepChange && (
          <MetricChange
            value={story.wearableMetrics.sleepChange.changePercent}
            label="Sleep"
          />
        )}
      </div>

      {/* Footer: Verification */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Watch className="w-3 h-3" />
          <span>{story.wearableMetrics.device}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>{story.journey.durationDays}-day verified</span>
        </div>
      </div>
    </div>
  );
}

// Minimal version for social embeds
export function MinimalTestimonialCard({ story }: { story: ParticipantStory }) {
  const primaryMetric = story.wearableMetrics.deepSleepChange || story.wearableMetrics.sleepChange;
  const lastRating = story.journey.villainRatings[story.journey.villainRatings.length - 1];

  return (
    <div className="bg-white rounded-lg border p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        {story.avatarUrl ? (
          <img src={story.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-xs font-semibold text-[#00D1C1]">
            {story.initials}
          </div>
        )}
        <div>
          <div className="text-sm font-medium">{story.name}</div>
          <div className="text-xs text-gray-500">{story.profile.lifeStage}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <RatingDots rating={2} maxRating={5} />
          <span className="text-gray-400 mx-0.5">→</span>
          <RatingDots rating={lastRating?.rating || 5} maxRating={5} />
        </div>
        {primaryMetric && (
          <span className="font-bold text-[#00D1C1]">
            +{primaryMetric.changePercent}% {primaryMetric === story.wearableMetrics.deepSleepChange ? "deep sleep" : "sleep"}
          </span>
        )}
      </div>

      <div className="flex items-center justify-end mt-2 pt-2 border-t">
        <div className="flex items-center gap-1 text-xs text-green-600">
          <BadgeCheck className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}
