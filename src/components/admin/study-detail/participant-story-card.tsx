"use client";

/**
 * Participant Story Card
 *
 * Displays individual participant insights in a compelling format.
 * Shows their challenge, what they've tried, and their baseline data.
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  TrendingDown,
  Sparkles,
  X,
} from "lucide-react";
import type { ParticipantInsightCard, ParticipantArchetype } from "@/lib/types";
import { DesperationGauge, WearableMetricCard } from "./shared";

// Category label mapping for display
const CATEGORY_LABELS: Record<string, string> = {
  sleep: 'Sleep',
  stress: 'Stress',
  energy: 'Energy',
  focus: 'Focus',
  recovery: 'Recovery',
  mood: 'Mood',
  anxiety: 'Anxiety',
  default: 'Wellness',
};

interface ParticipantStoryCardProps {
  card: ParticipantInsightCard;
  studyCategory?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Archetype styling
const ARCHETYPE_STYLES: Record<ParticipantArchetype, {
  border: string;
  bg: string;
  text: string;
  label: string;
}> = {
  skeptic: { border: "border-slate-400", bg: "bg-slate-50", text: "text-slate-600", label: "Cautious" },
  desperate: { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-700", label: "Urgent" },
  power_user: { border: "border-blue-400", bg: "bg-blue-50", text: "text-blue-700", label: "Optimizer" },
  struggler: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700", label: "Seeking Help" },
  optimist: { border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", label: "Hopeful" },
};

// Avatar gradient from name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

export function ParticipantStoryCard({
  card,
  studyCategory,
  isExpanded: controlledExpanded,
  onToggleExpand,
}: ParticipantStoryCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;

  // Get category label for contextual display
  const categoryLabel = CATEGORY_LABELS[studyCategory || 'default'] || 'Wellness';

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const archetypeStyle = card.archetype
    ? ARCHETYPE_STYLES[card.archetype]
    : ARCHETYPE_STYLES.struggler;

  const isNew = card.enrolledAgo === "just now" ||
                card.enrolledAgo.includes("min") ||
                card.enrolledAgo === "1 hour ago";

  return (
    <Card className="group relative overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-md">
      {/* Accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getAvatarGradient(card.displayName)}`} />

      <CardContent className="p-4 pt-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`relative flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(card.displayName)} flex items-center justify-center ring-2 ring-offset-2 ${archetypeStyle.border}`}>
              <span className="text-sm font-semibold text-white">{card.initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-slate-900">{card.displayName}</h4>
                {isNew && (
                  <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 font-semibold shadow-sm">
                    NEW CUSTOMER
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {card.ageRange} {card.location && `• ${card.location}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{card.enrolledAgo}</span>
          </div>
        </div>

        {/* Why They're Trying Your Product */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 font-medium mb-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            Why they&apos;re trying your product
          </div>
          <div className="relative pl-4 border-l-2 border-amber-200 bg-amber-50/30 rounded-r-lg py-2 pr-3">
            <div className="absolute -left-1 top-1 text-amber-300 text-2xl font-serif leading-none">&ldquo;</div>
            <blockquote className="text-slate-700 text-sm leading-relaxed italic">
              {card.heroSymptom}
            </blockquote>
            {card.heroSymptomSeverity != null && (
              <div className="mt-1 text-xs text-slate-400">
                Severity: {card.heroSymptomSeverity}/10
              </div>
            )}
          </div>
        </div>

        {/* Duration & Failed Alternatives - Side by Side (only show when data exists) */}
        {(card.painDuration || card.failedAlternatives.length > 0) && (
          <div className={`grid gap-3 mb-4 ${card.painDuration && card.failedAlternatives.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* How Long They've Been Struggling */}
            {card.painDuration && (
              <div className="p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Struggling for
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {card.painDuration}
                </span>
              </div>
            )}

            {/* What Didn't Work */}
            {card.failedAlternatives.length > 0 && (
              <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100/50">
                <div className="text-[10px] uppercase tracking-wide text-rose-400 font-medium mb-1.5 flex items-center gap-1">
                  <X className="w-3 h-3 text-rose-400" />
                  Already tried
                </div>
                <div className="flex flex-wrap gap-1">
                  {card.failedAlternatives.slice(0, 2).map((alt, i) => (
                    <span key={i} className="text-xs text-rose-600 font-medium">
                      {alt}{i < Math.min(1, card.failedAlternatives.length - 1) ? ',' : ''}
                    </span>
                  ))}
                  {card.failedAlternatives.length > 2 && (
                    <span className="text-xs text-rose-400">
                      +{card.failedAlternatives.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wearable Baseline Data */}
        {card.wearableBaseline && card.wearableBaseline.metrics.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-medium flex items-center gap-1">
                <span className={`w-1 h-1 rounded-full bg-gradient-to-r ${
                  card.wearableBaseline.category === 'sleep' ? 'from-indigo-500 to-purple-500' :
                  card.wearableBaseline.category === 'stress' ? 'from-rose-500 to-orange-500' :
                  card.wearableBaseline.category === 'recovery' ? 'from-emerald-500 to-teal-500' :
                  'from-blue-500 to-cyan-500'
                }`}></span>
                Baseline Wearable Data
              </div>
              <span className="text-[9px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                {card.wearableBaseline.avgPeriod}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {card.wearableBaseline.metrics.slice(0, 6).map((metric, i) => (
                <WearableMetricCard key={i} metric={metric} />
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className={`grid gap-3 p-3 rounded-lg bg-slate-50/80 border border-slate-100 ${card.desperationLevel != null ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {card.desperationLevel != null && (
            <div title={`Urgency: ${card.desperationLevel}/10 - How desperately they need a solution (1=mild curiosity, 10=tried everything, desperate for relief)`}>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                Urgency
              </div>
              <DesperationGauge level={card.desperationLevel} showLabel />
            </div>
          )}
          <div className={card.desperationLevel != null ? "border-l border-slate-200 pl-3" : ""}>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
              Hopes to achieve
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <span className="text-xs text-slate-600 line-clamp-2" title={card.primaryGoal}>
                {card.primaryGoal}
              </span>
            </div>
          </div>
          <div
            className="border-l border-slate-200 pl-3"
            title={`Baseline ${categoryLabel} Score: ${card.baselineScore ?? 'N/A'}/100 - Their ${categoryLabel.toLowerCase()} assessment score BEFORE using the product. Lower scores = more room for improvement.`}
          >
            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
              {categoryLabel} Score
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-amber-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {card.baselineScore ?? '—'}<span className="text-xs font-normal text-slate-400">/100</span>
                </span>
              </div>
              <span className="text-[9px] text-slate-400">Before product</span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {card.verbatimQuote && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-indigo-600 mb-1">In their own words</p>
                    <p className="text-sm text-slate-600 italic">&ldquo;{card.verbatimQuote}&rdquo;</p>
                  </div>
                </div>
              </div>
            )}
            {card.failedAlternatives.length > 3 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">What they&apos;ve tried before:</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.failedAlternatives.map((alt, i) => (
                    <Badge key={i} variant="outline" className="bg-white border-slate-200 text-slate-500 text-xs font-normal">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {card.archetype && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Profile type:</span>
                <Badge variant="secondary" className={`${archetypeStyle.bg} ${archetypeStyle.text} text-xs`}>
                  {archetypeStyle.label}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="w-full mt-3 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              View full profile
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ParticipantStoryCard;
