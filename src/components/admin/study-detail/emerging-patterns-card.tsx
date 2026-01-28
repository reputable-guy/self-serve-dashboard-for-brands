"use client";

/**
 * Emerging Patterns Card
 *
 * Shows patterns that emerge as participants enroll (n >= 3).
 * Provides early signals before full statistical validity.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  AlertCircle,
  Pill,
  Clock,
  Flame,
  Info,
} from "lucide-react";
import type { EmergingPatterns } from "@/lib/types";

interface EmergingPatternsCardProps {
  patterns: EmergingPatterns;
  participantCount: number;
}

// Desperation level indicator
function DesperationIndicator({ level }: { level: number }) {
  const getColor = () => {
    if (level >= 8) return "text-rose-600 bg-rose-50";
    if (level >= 5) return "text-amber-600 bg-amber-50";
    return "text-emerald-600 bg-emerald-50";
  };

  const getLabel = () => {
    if (level >= 8) return "High urgency";
    if (level >= 5) return "Moderate urgency";
    return "Lower urgency";
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      <Flame className="w-3 h-3" />
      <span>{level.toFixed(1)}/10</span>
      <span className="text-slate-400">•</span>
      <span>{getLabel()}</span>
    </div>
  );
}

export function EmergingPatternsCard({
  patterns,
  participantCount,
}: EmergingPatternsCardProps) {
  // Calculate pattern reliability based on n
  const reliabilityPercent = Math.min(100, (participantCount / 10) * 100);
  const isReliable = participantCount >= 10;

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-orange-50/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-100">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">Emerging Patterns</CardTitle>
              <CardDescription className="text-xs">
                Based on {participantCount} participant{participantCount !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${
              isReliable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isReliable ? "Reliable" : "Early Signal"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Top Challenges (before product) */}
        {patterns.topPainPoints.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Top Challenges (before product)
            </h4>
            <div className="space-y-2.5">
              {patterns.topPainPoints.slice(0, 4).map((point, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 truncate max-w-[70%]" title={point.label}>
                      &ldquo;{point.label}&rdquo;
                    </span>
                    <span className="text-slate-500 font-medium tabular-nums">
                      {point.percentage}%
                    </span>
                  </div>
                  <Progress
                    value={point.percentage}
                    className="h-1.5 bg-slate-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What They've Already Tried (before product) */}
        {patterns.commonFailedAlternatives.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              What They&apos;ve Already Tried
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {patterns.commonFailedAlternatives.map((alt, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-white/80 border-slate-200 text-slate-600 text-xs font-normal"
                >
                  {alt.label}
                  <span className="ml-1 text-slate-400">({alt.count})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-white/60 border border-amber-100/50">
          {/* Average Desperation */}
          <div>
            <div className="text-xs text-slate-500 mb-1.5">Avg Urgency Level</div>
            <DesperationIndicator level={patterns.averageDesperationLevel} />
          </div>

          {/* Most Common Duration */}
          <div>
            <div className="text-xs text-slate-500 mb-1.5">Typical Duration</div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {patterns.mostCommonDuration}
            </div>
          </div>
        </div>

        {/* Reliability Note */}
        {!isReliable && (
          <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50/50 border border-amber-100/50">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {patterns.confidenceNote || `Patterns become more reliable at 10+ participants. Currently at ${participantCount}.`}
            </p>
          </div>
        )}

        {/* Pattern Strength Indicator */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Pattern reliability</span>
            <span className="text-slate-600 font-medium">{Math.round(reliabilityPercent)}%</span>
          </div>
          <Progress
            value={reliabilityPercent}
            className={`h-1.5 ${isReliable ? 'bg-emerald-100' : 'bg-amber-100'}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default EmergingPatternsCard;
