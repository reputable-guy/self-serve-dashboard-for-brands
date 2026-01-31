"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight, Clock, Users, Package, BarChart3 } from "lucide-react";
import type { StudyRecruitmentState, StudyComplianceStats } from "@/lib/types";
import Link from "next/link";

interface LifecycleBarProps {
  studyId: string;
  status: "draft" | "recruiting" | "filling-fast" | "full" | "active" | "completed" | "archived";
  recruitmentState?: StudyRecruitmentState;
  complianceStats?: StudyComplianceStats;
  hasLaunchedChecklistComplete?: boolean;
}

type LifecycleStage = "draft" | "waitlist" | "recruiting" | "active" | "complete";

const STAGES: { id: LifecycleStage; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "waitlist", label: "Waitlist" },
  { id: "recruiting", label: "Recruiting" },
  { id: "active", label: "Active" },
  { id: "complete", label: "Complete" },
];

/**
 * Visual lifecycle progression bar showing study status.
 * Shows: Draft → Waitlist → Recruiting → Active → Complete
 *
 * Provides contextual messaging and CTAs for each stage.
 */
export function LifecycleBar({
  studyId,
  status,
  recruitmentState,
  complianceStats,
  hasLaunchedChecklistComplete,
}: LifecycleBarProps) {
  // Determine current lifecycle stage
  const getCurrentStage = (): LifecycleStage => {
    if (status === "draft") return "draft";
    if (status === "completed" || status === "archived") return "complete";
    if (status === "active") return "active";

    // Check recruitment state for finer granularity
    if (recruitmentState) {
      if (recruitmentState.status === "waitlist_only") return "waitlist";
      if (recruitmentState.status === "window_open" ||
          recruitmentState.status === "window_closed" ||
          recruitmentState.status === "ready_to_open") return "recruiting";
      if (recruitmentState.status === "complete") return "complete";
    }

    // Default based on study status
    if (status === "recruiting" || status === "filling-fast" || status === "full") return "recruiting";
    return "draft";
  };

  const currentStage = getCurrentStage();

  // Get stage index for progress calculation
  const stageIndex = STAGES.findIndex((s) => s.id === currentStage);

  // Generate contextual message and CTA
  const getContextualContent = () => {
    switch (currentStage) {
      case "draft":
        return {
          message: "Complete the launch checklist to go live",
          cta: hasLaunchedChecklistComplete ? (
            <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
              <Button size="sm" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                Go Live
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : null,
        };

      case "waitlist":
        const waitlistCount = recruitmentState?.waitlistCount || 0;
        return {
          message: `${waitlistCount} people interested`,
          icon: <Users className="h-4 w-4" />,
          cta: (
            <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
              <Button size="sm" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                Go Live
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ),
        };

      case "recruiting":
        if (recruitmentState?.status === "window_open") {
          const timeRemaining = getTimeRemaining(recruitmentState.currentWindowEndsAt);
          return {
            message: `Cohort ${(recruitmentState.currentCohort?.cohortNumber || 0) + 1} recruiting`,
            detail: `${recruitmentState.currentWindowEnrolled} enrolled, ${timeRemaining} remaining`,
            icon: <Clock className="h-4 w-4" />,
          };
        }
        if (recruitmentState?.status === "window_closed") {
          const trackingEntered = recruitmentState.currentCohort?.trackingCodesEntered || 0;
          const totalParticipants = recruitmentState.currentCohort?.participantIds.length || 0;
          return {
            message: `Ship Cohort ${recruitmentState.currentCohort?.cohortNumber}`,
            detail: `${trackingEntered}/${totalParticipants} tracking codes entered`,
            icon: <Package className="h-4 w-4" />,
            cta: (
              <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
                <Button size="sm" variant="outline">
                  Enter Tracking
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ),
          };
        }
        if (recruitmentState?.status === "ready_to_open") {
          return {
            message: "Ready to open next window",
            detail: `${recruitmentState.waitlistCount} on waitlist`,
            icon: <Users className="h-4 w-4" />,
            cta: (
              <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
                <Button size="sm" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                  Open Window
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ),
          };
        }
        return { message: "Recruiting in progress" };

      case "active":
        const day = complianceStats?.currentDay || 1;
        const totalDays = complianceStats?.totalDays || 28;
        const compliance = complianceStats?.compliancePercent || 0;
        const activeCount = complianceStats?.totalActive || 0;
        return {
          message: `Day ${day} of ${totalDays}`,
          detail: `${activeCount} participants active, ${compliance}% compliance`,
          icon: <BarChart3 className="h-4 w-4" />,
        };

      case "complete":
        const totalEnrolled = recruitmentState?.totalEnrolled || 0;
        const avgImprovement = "+23%"; // Would come from results
        return {
          message: "Study complete",
          detail: `${totalEnrolled} participants, ${avgImprovement} avg improvement`,
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          cta: (
            <Link href={`/admin/studies/${studyId}?tab=results`}>
              <Button size="sm" variant="outline">
                View Results
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ),
        };

      default:
        return { message: "" };
    }
  };

  const contextContent = getContextualContent();

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Progress stages */}
      <div className="flex items-center mb-4">
        {STAGES.map((stage, index) => {
          const isPast = index < stageIndex;
          const isCurrent = index === stageIndex;
          const isFuture = index > stageIndex;

          return (
            <div key={stage.id} className="flex items-center">
              {/* Stage circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isPast
                      ? "bg-[#00D1C1] text-white"
                      : isCurrent
                        ? "bg-[#00D1C1]/20 border-2 border-[#00D1C1] text-[#00D1C1]"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3 fill-current" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isCurrent
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div
                  className={`h-0.5 w-12 mx-2 ${
                    isPast ? "bg-[#00D1C1]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Contextual content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {contextContent.icon && (
            <span className="text-muted-foreground">{contextContent.icon}</span>
          )}
          <div>
            <span className="font-medium">{contextContent.message}</span>
            {contextContent.detail && (
              <span className="text-muted-foreground ml-2">
                {contextContent.detail}
              </span>
            )}
          </div>
        </div>
        {contextContent.cta}
      </div>
    </div>
  );
}

// Helper to calculate time remaining
function getTimeRemaining(endTimeStr?: string): string {
  if (!endTimeStr) return "";
  const endTime = new Date(endTimeStr).getTime();
  const now = Date.now();
  const diff = endTime - now;

  if (diff <= 0) return "Closing...";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
