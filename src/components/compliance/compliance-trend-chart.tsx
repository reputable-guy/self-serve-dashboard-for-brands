"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyComplianceStats } from "@/lib/types";

interface ComplianceTrendChartProps {
  stats: StudyComplianceStats;
}

/**
 * Simple bar chart showing daily compliance percentage over time.
 * Uses pure CSS/divs for visualization (no chart library).
 * Shows target line at 85%.
 */
export function ComplianceTrendChart({ stats }: ComplianceTrendChartProps) {
  const { dailyCompliance, compliancePercent, targetCompliancePercent } = stats;

  // Get max value for scaling (min 100 for full height)
  const maxPercent = 100;

  // Calculate bar width based on number of days
  const barCount = dailyCompliance.length;

  // Determine color based on current compliance vs target
  const isAboveTarget = compliancePercent >= targetCompliancePercent;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Compliance Trend</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current:</span>
            <span className={`text-lg font-bold ${isAboveTarget ? "text-green-600" : "text-amber-600"}`}>
              {compliancePercent}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart area */}
        <div className="relative h-40 mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-muted-foreground">
            <span>100%</span>
            <span>90%</span>
            <span>80%</span>
            <span>70%</span>
          </div>

          {/* Chart container */}
          <div className="ml-12 h-full relative">
            {/* Target line at 85% */}
            <div
              className="absolute w-full border-t-2 border-dashed border-gray-300 z-10"
              style={{ bottom: `calc(${(targetCompliancePercent / maxPercent) * 100}% + 24px)` }}
            >
              <span className="absolute right-0 -top-4 text-xs text-gray-400">
                Target ({targetCompliancePercent}%)
              </span>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 bottom-6 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-gray-100" />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 bottom-6 flex items-end gap-px">
              {dailyCompliance.map((point, index) => {
                const height = (point.percent / maxPercent) * 100;
                const isWeekend = new Date(point.date).getDay() === 0 || new Date(point.date).getDay() === 6;
                const barColor = point.percent >= targetCompliancePercent
                  ? "bg-green-500"
                  : point.percent >= 80
                    ? "bg-amber-500"
                    : "bg-red-500";

                return (
                  <div
                    key={point.day}
                    className={`flex-1 ${barColor} ${isWeekend ? "opacity-70" : ""} rounded-t-sm transition-all hover:opacity-80`}
                    style={{ height: `${height}%`, minWidth: "4px" }}
                    title={`Day ${point.day}: ${point.percent}%`}
                  />
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between text-xs text-muted-foreground pt-1">
              <span>D1</span>
              {barCount >= 7 && <span>D7</span>}
              {barCount >= 14 && <span>D14</span>}
              {barCount >= 21 && <span>D21</span>}
              {barCount >= 28 && <span>D28</span>}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <span>&ge; {targetCompliancePercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-sm" />
            <span>80-{targetCompliancePercent - 1}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span>&lt; 80%</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-6 border-t-2 border-dashed border-gray-300" />
            <span>Target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
