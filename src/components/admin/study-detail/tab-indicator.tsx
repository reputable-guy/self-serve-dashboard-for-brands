"use client";

import { Badge } from "@/components/ui/badge";
import { useComplianceStore } from "@/lib/compliance-store";
import { useCohortStore } from "@/lib/cohort-store";
import type { TabId } from "./types";

interface TabIndicatorProps {
  tab: TabId;
  studyId: string;
  studyStatus?: string;
  currentDay?: number;
}

/**
 * Visual indicators for tabs showing action required or attention needed.
 *
 * Indicator rules:
 * - Fulfillment: amber dot = tracking codes needed, green dot = ready to open window
 * - Compliance: red badge = number of at-risk + critical participants
 * - Results: blue dot = interim insights available (Day 7+), celebration = study complete
 */
export function TabIndicator({
  tab,
  studyId,
  studyStatus,
  currentDay,
}: TabIndicatorProps) {
  // Get store methods (not using selectors to avoid re-render loops)
  const { getRecruitmentState } = useCohortStore();
  const { getStudyStats } = useComplianceStore();

  // Get current state values
  const fulfillmentState = getRecruitmentState(studyId);
  const complianceStats = getStudyStats(studyId);

  switch (tab) {
    case "fulfillment": {
      // Amber dot: Window closed, tracking codes incomplete
      if (
        fulfillmentState?.status === "window_closed" &&
        fulfillmentState.currentCohort &&
        !fulfillmentState.currentCohort.allTrackingEntered
      ) {
        return (
          <span
            className="ml-1.5 w-2 h-2 bg-amber-500 rounded-full inline-block"
            title="Tracking codes needed"
          />
        );
      }
      // Green dot: All tracking done, ready to open next window
      if (fulfillmentState?.status === "ready_to_open") {
        return (
          <span
            className="ml-1.5 w-2 h-2 bg-green-500 rounded-full inline-block"
            title="Ready to open next window"
          />
        );
      }
      return null;
    }

    case "compliance": {
      // Red badge: Number of participants needing attention
      if (complianceStats) {
        const needsAttentionCount =
          (complianceStats.atRiskCount || 0) + (complianceStats.criticalCount || 0);
        if (needsAttentionCount > 0) {
          return (
            <Badge
              variant="destructive"
              className="ml-1.5 h-5 min-w-[20px] px-1.5 text-xs"
            >
              {needsAttentionCount}
            </Badge>
          );
        }
      }
      return null;
    }

    case "results": {
      // Celebration: Study complete
      if (studyStatus === "completed") {
        return <span className="ml-1.5" title="Results ready">🎉</span>;
      }
      // Blue dot: Interim insights available (Day 7+ for active studies)
      // Only for studies in active status, not real data studies
      if (
        studyStatus === "active" &&
        currentDay !== undefined &&
        currentDay >= 7 &&
        currentDay < 28 &&
        // Don't show for real data studies (verified participant data)
        studyId !== "study-sensate-real" &&
        studyId !== "study-lyfefuel-real"
      ) {
        return (
          <span
            className="ml-1.5 w-2 h-2 bg-blue-500 rounded-full inline-block"
            title="Interim insights available"
          />
        );
      }
      return null;
    }

    default:
      return null;
  }
}
