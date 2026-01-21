"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from "lucide-react";
import type { StudyComplianceStats } from "@/lib/types";

interface StudyProgressCardProps {
  stats: StudyComplianceStats;
}

/**
 * Displays study progress with cohort-based breakdown.
 * Shows progress for each cohort since participants start at different times.
 */
export function StudyProgressCard({ stats }: StudyProgressCardProps) {
  // Format dates for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // If cohort data is available, show cohort-based progress
  if (stats.cohortProgress && stats.cohortProgress.length > 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Study Progress by Cohort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.cohortProgress.map((cohort) => (
              <div key={cohort.cohortId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Cohort {cohort.cohortNumber}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {cohort.participantCount} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Ends {cohort.expectedCompletionDate}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Progress value={cohort.progressPercent} className="h-2 flex-1" />
                  <span className="text-sm font-medium w-24 text-right">
                    Day {cohort.dayRangeStart === cohort.dayRangeEnd
                      ? cohort.dayRangeEnd
                      : `${cohort.dayRangeStart}-${cohort.dayRangeEnd}`}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Total: <span className="font-medium text-foreground">{stats.totalActive}</span> active participants
                </span>
                <span className="text-muted-foreground">
                  {formatDate(stats.startDate)} - {formatDate(stats.endDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback to simple summary if no cohort data available
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Study Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              28-Day Study
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Started: {formatDate(stats.startDate)}
            </span>
          </div>

          <div className="pt-2 border-t">
            <span className="text-sm">
              <span className="font-medium">{stats.totalActive}</span>{" "}
              <span className="text-muted-foreground">participants active</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
