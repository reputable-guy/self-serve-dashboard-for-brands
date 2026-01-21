"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Package, CheckCircle2, Edit2 } from "lucide-react";
import type { StudyRecruitmentState } from "@/lib/types";
import Link from "next/link";

interface StudyStatusBannerProps {
  studyId: string;
  recruitmentState: StudyRecruitmentState;
}

/**
 * Status banner shown after study goes live.
 * Displays contextual information based on study state:
 * - Recruiting: Window countdown + enrolled count
 * - Shipping: Tracking codes progress
 * - Active: Day progress + compliance rate
 * - Complete: Final results summary
 */
export function StudyStatusBanner({
  studyId,
  recruitmentState,
}: StudyStatusBannerProps) {
  const { status, waitlistCount, currentWindowEndsAt, currentWindowEnrolled, totalEnrolled, targetParticipants, currentCohort } = recruitmentState;

  // Calculate time remaining for window
  const getTimeRemaining = () => {
    if (!currentWindowEndsAt) return null;
    const endTime = new Date(currentWindowEndsAt).getTime();
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return "Closing...";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Status-specific rendering
  const renderContent = () => {
    switch (status) {
      case "waitlist_only":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Building Waitlist
              </Badge>
              <span className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                {waitlistCount} on waitlist
              </span>
            </div>
            <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
              <Button size="sm" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                Go Live
              </Button>
            </Link>
          </div>
        );

      case "window_open":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Recruiting
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Closes in: <span className="font-medium">{getTimeRemaining()}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{currentWindowEnrolled} enrolled this window</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {waitlistCount} on waitlist
            </span>
          </div>
        );

      case "window_closed":
        const trackingEntered = currentCohort?.trackingCodesEntered || 0;
        const totalParticipants = currentCohort?.participantIds.length || 0;

        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <Package className="h-3 w-3 mr-1" />
                Shipping
              </Badge>
              <span className="text-sm">
                Cohort {currentCohort?.cohortNumber}: {trackingEntered}/{totalParticipants} tracking codes entered
              </span>
            </div>
            <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-1" />
                Enter Tracking
              </Button>
            </Link>
          </div>
        );

      case "ready_to_open":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Ready
              </Badge>
              <span className="text-sm text-muted-foreground">
                All tracking codes entered. Open next recruitment window when ready.
              </span>
            </div>
            <Link href={`/admin/studies/${studyId}?tab=fulfillment`}>
              <Button size="sm" className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                Open Window
              </Button>
            </Link>
          </div>
        );

      case "complete":
        return (
          <div className="flex items-center gap-4 w-full">
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Complete
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalEnrolled}/{targetParticipants} participants enrolled
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render for draft status
  if (status === "draft") {
    return null;
  }

  // Get background color based on status
  const bgColor = {
    waitlist_only: "bg-amber-50 border-amber-200",
    window_open: "bg-green-50 border-green-200",
    window_closed: "bg-orange-50 border-orange-200",
    ready_to_open: "bg-blue-50 border-blue-200",
    complete: "bg-gray-50 border-gray-200",
    draft: "",
  }[status];

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      {renderContent()}
    </div>
  );
}
