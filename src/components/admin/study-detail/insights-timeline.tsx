"use client";

/**
 * Insights Timeline
 *
 * Real-time activity feed showing NEW CUSTOMER enrollments and emerging patterns.
 * Creates an addictive "what's happening now" feel for brand customers.
 *
 * IMPORTANT: This shows new customers JOINING, not feedback after using product.
 * All data here is baseline/pre-product context.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  UserPlus,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Quote,
} from "lucide-react";
import type { InsightTimelineEvent } from "@/lib/types";

interface InsightsTimelineProps {
  events: InsightTimelineEvent[];
  maxVisible?: number;
  showHeader?: boolean;
  compact?: boolean;
}

// Event type styling
const EVENT_STYLES: Record<InsightTimelineEvent['type'], {
  icon: typeof UserPlus;
  iconBg: string;
  iconColor: string;
  dotColor: string;
}> = {
  new_participant: {
    icon: UserPlus,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  quote_captured: {
    icon: Sparkles,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    dotColor: "bg-purple-500",
  },
  milestone: {
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  pattern_emerging: {
    icon: Lightbulb,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    dotColor: "bg-amber-500",
  },
};

function TimelineEvent({
  event,
  isLast,
  compact,
}: {
  event: InsightTimelineEvent;
  isLast: boolean;
  compact?: boolean;
}) {
  const style = EVENT_STYLES[event.type];
  const Icon = style.icon;

  return (
    <div className="relative flex gap-3">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-slate-200 to-transparent" />
      )}

      {/* Icon */}
      <div className={`relative flex-shrink-0 w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center ring-4 ring-white`}>
        <Icon className={`w-4 h-4 ${style.iconColor}`} />
        {/* Pulse dot for recent events */}
        {event.timeAgo === "just now" && (
          <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${style.dotColor} rounded-full animate-ping`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${compact ? 'pb-3' : 'pb-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Main content */}
            <p className={`text-slate-700 ${compact ? 'text-xs' : 'text-sm'}`}>
              {event.participantInitials ? (
                <>
                  <span className="font-medium text-slate-900">
                    {event.participantInitials}{" "}
                  </span>
                  {event.content}
                </>
              ) : (
                <>
                  {event.content}
                  {/* Pattern quote - actual phrase from customer responses */}
                  {event.type === 'pattern_emerging' && event.metadata?.patternQuote && (
                    <span className="font-semibold text-amber-600">
                      {" "}&ldquo;{String(event.metadata.patternQuote)}&rdquo;
                    </span>
                  )}
                </>
              )}
            </p>

            {/* Pattern highlight box with percentage */}
            {event.type === 'pattern_emerging' && event.metadata?.patternQuote ? (
              <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2">
                  <Quote className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    {typeof event.metadata.pattern === 'string' && event.metadata.pattern
                      ? event.metadata.pattern
                      : `${Math.round(((event.metadata.patternCount as number) / (event.metadata.patternTotal as number)) * 100)}% share this experience`}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Time */}
          <span className={`flex-shrink-0 text-slate-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {event.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}

export function InsightsTimeline({
  events,
  maxVisible = 5,
  showHeader = true,
  compact = false,
}: InsightsTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (events.length === 0) {
    return null;
  }

  const visibleEvents = isExpanded ? events : events.slice(0, maxVisible);
  const hasMore = events.length > maxVisible;

  const content = (
    <div className={compact ? 'space-y-0' : 'space-y-1'}>
      {visibleEvents.map((event, index) => (
        <TimelineEvent
          key={event.id}
          event={event}
          isLast={index === visibleEvents.length - 1}
          compact={compact}
        />
      ))}

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs text-slate-500 hover:text-slate-700 -mt-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Show {events.length - maxVisible} more
            </>
          )}
        </Button>
      )}
    </div>
  );

  if (!showHeader) {
    return content;
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">New Customer Activity</CardTitle>
            {events.length > 0 && events[0].timeAgo === "just now" && (
              <Badge
                className="bg-blue-600 text-white text-[10px] px-1.5 py-0 animate-pulse"
              >
                Live
              </Badge>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Real-time feed of customers signing up and sharing their stories
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {content}
      </CardContent>
    </Card>
  );
}

export default InsightsTimeline;
