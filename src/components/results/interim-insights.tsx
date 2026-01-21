"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  AlertTriangle,
  Search,
  ChevronDown,
  Lock,
} from "lucide-react";
import { useInterimInsightsStore } from "@/lib/interim-insights-store";
import { shouldShowInterimInsights } from "@/lib/types/interim-insights";
import type { ParticipantStatus } from "@/lib/types/interim-insights";
import { ParticipantInterimCard } from "./participant-interim-card";

interface InterimInsightsProps {
  studyId: string;
  studyStatus: string;
  category: string;
  currentDay: number;
  totalParticipants: number;
}

/**
 * Interim Insights Section
 *
 * Shows individual participant journeys (N of 1 trials) during active studies.
 * CRITICAL: Never renders for real studies (Sensate, LYFEfuel).
 */
export function InterimInsights({
  studyId,
  studyStatus,
  category,
  currentDay,
  totalParticipants,
}: InterimInsightsProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | ParticipantStatus
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Check if we should show interim insights
  const shouldShow = shouldShowInterimInsights({
    id: studyId,
    status: studyStatus,
    currentDay,
  });

  // Get insights from store
  const { getInsights } = useInterimInsightsStore();
  const insights = shouldShow
    ? getInsights(studyId, category, currentDay, totalParticipants)
    : null;

  // Filter participants
  const filteredParticipants = useMemo(() => {
    if (!insights) return [];

    let participants = insights.participants;

    // Filter by status
    if (activeFilter !== "all") {
      participants = participants.filter((p) => p.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      participants = participants.filter((p) =>
        p.displayName.toLowerCase().includes(query)
      );
    }

    return participants;
  }, [insights, activeFilter, searchQuery]);

  // Don't render if we shouldn't show
  if (!shouldShow || !insights) {
    return null;
  }

  // Participants to display (default 5, show all if expanded)
  const displayedParticipants = showAll
    ? filteredParticipants
    : filteredParticipants.slice(0, 5);
  const hasMore = filteredParticipants.length > 5;

  // Filter button styles
  const getFilterButtonClass = (filter: "all" | ParticipantStatus) => {
    const isActive = activeFilter === filter;
    const baseClass =
      "px-3 py-1.5 text-sm rounded-lg transition-colors font-medium";

    if (isActive) {
      if (filter === "all") return `${baseClass} bg-[#00D1C1] text-white`;
      if (filter === "improving")
        return `${baseClass} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      if (filter === "stable")
        return `${baseClass} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      if (filter === "declining")
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`;
    }

    return `${baseClass} bg-muted/50 text-muted-foreground hover:bg-muted`;
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50/30 to-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">
              Early Participant Insights
            </CardTitle>
            <Badge
              variant="outline"
              className="ml-2 bg-blue-100 text-blue-700 border-blue-200"
            >
              {insights.participantsWithData} Active
            </Badge>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Interim data from {insights.participantsWithData} participants.</strong>{" "}
            Study in progress across multiple cohorts. Final verified results available as each cohort completes.
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              className={getFilterButtonClass("all")}
              onClick={() => setActiveFilter("all")}
            >
              All {insights.participantsWithData}
            </button>
            <button
              className={getFilterButtonClass("improving")}
              onClick={() => setActiveFilter("improving")}
            >
              🟢 Improving {insights.statusCounts.improving}
            </button>
            <button
              className={getFilterButtonClass("stable")}
              onClick={() => setActiveFilter("stable")}
            >
              🟡 Stable {insights.statusCounts.stable}
            </button>
            <button
              className={getFilterButtonClass("declining")}
              onClick={() => setActiveFilter("declining")}
            >
              🔴 Declining {insights.statusCounts.declining}
            </button>
          </div>

          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* Participant Cards Grid */}
        {filteredParticipants.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {displayedParticipants.map((participant) => (
                <ParticipantInterimCard
                  key={participant.participantId}
                  participant={participant}
                />
              ))}
            </div>

            {/* Show More Button */}
            {hasMore && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  "Show Less"
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show {filteredParticipants.length - 5} more participants
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No participants match your search.</p>
          </div>
        )}

        {/* Final Results Teaser */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-dashed">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Final Verified Results</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Includes: Full participant stories, categorized outcomes, and
                verified metrics. Available progressively as each cohort completes their 28-day journey.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
