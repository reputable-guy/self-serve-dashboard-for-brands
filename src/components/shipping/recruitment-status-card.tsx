"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, CircleDot } from "lucide-react";
import type { StudyRecruitmentState } from "@/lib/types";

interface RecruitmentStatusCardProps {
  recruitmentState: StudyRecruitmentState;
}

/**
 * Displays recruitment progress and current window status.
 * Shows overall progress (enrolled/target) and window countdown.
 */
export function RecruitmentStatusCard({
  recruitmentState,
}: RecruitmentStatusCardProps) {
  const {
    totalEnrolled,
    targetParticipants,
    waitlistCount,
    status,
    currentWindowEndsAt,
    currentWindowEnrolled,
  } = recruitmentState;

  const isWindowOpen = status === "window_open";

  // Include current window enrollments in the total display
  // (they get added to totalEnrolled when window closes)
  const displayEnrolled = totalEnrolled + (isWindowOpen ? currentWindowEnrolled : 0);
  const progressPercent = Math.round(
    (displayEnrolled / targetParticipants) * 100
  );

  // Calculate time remaining if window is open
  const timeRemaining = currentWindowEndsAt
    ? getTimeRemaining(new Date(currentWindowEndsAt))
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recruitment Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Progress value={progressPercent} className="flex-1" />
            <span className="text-sm font-medium w-12 text-right">
              {progressPercent}%
            </span>
          </div>
          <p className="text-2xl font-bold">
            {displayEnrolled}{" "}
            <span className="text-base font-normal text-muted-foreground">
              / {targetParticipants} participants
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{waitlistCount} on waitlist</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <CircleDot
              className={`h-5 w-5 ${
                isWindowOpen ? "text-green-500" : "text-amber-500"
              }`}
            />
            <span className="font-semibold">
              Recruitment Window {isWindowOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>

          {isWindowOpen && timeRemaining && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Closes in: {timeRemaining.hours}h {timeRemaining.minutes}m
              </span>
            </div>
          )}

          {status === "window_closed" && (
            <p className="text-sm text-muted-foreground">
              Enter all tracking codes to open next window
            </p>
          )}

          {isWindowOpen && (
            <p className="text-sm">
              <span className="font-semibold">{currentWindowEnrolled}</span>{" "}
              <span className="text-muted-foreground">
                enrolled so far this window
              </span>
            </p>
          )}

          {status === "waitlist_only" && (
            <p className="text-sm text-muted-foreground">
              Click &quot;Go Live&quot; to open first recruitment window
            </p>
          )}

          {status === "complete" && (
            <p className="text-sm text-green-600 font-medium">
              Recruitment complete - study is full
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getTimeRemaining(endTime: Date): { hours: number; minutes: number } {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}
