"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Users,
  Calendar,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle2,
  Pencil,
  Eye,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { StudyData } from "./types";
import {
  generateMockParticipants,
  SENSATE_METRICS,
  LYFEFUEL_METRICS,
  SENSATE_STATS,
  LYFEFUEL_STATS,
  SORTED_SENSATE_STORIES,
  SORTED_LYFEFUEL_STORIES,
} from "./mock-data";

interface OverviewTabProps {
  study: StudyData;
  brand: { id: string; name: string } | undefined;
  onOpenPreview: () => void;
}

export function OverviewTab({ study, brand, onOpenPreview }: OverviewTabProps) {
  // Check if this is a real data study
  const isSensateRealStudy = study.id === "study-sensate-real";
  const isLyfefuelRealStudy = study.id === "study-lyfefuel-real";
  const isRealDataStudy = isSensateRealStudy || isLyfefuelRealStudy;

  // Use real data for Sensate/LYFEfuel study, mock data for others
  const studyParticipants = isSensateRealStudy
    ? SENSATE_METRICS.completed
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.completed
    : study.participants;
  const studyTargetParticipants = isSensateRealStudy
    ? SENSATE_METRICS.enrolled
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.enrolled
    : study.targetParticipants;
  const studyCompletionRate = isSensateRealStudy
    ? SENSATE_METRICS.completionRate
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.completionRate
    : study.completionRate;
  const studyAvgImprovement = isSensateRealStudy
    ? SENSATE_METRICS.avgHrvChange
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.avgActivityChange
    : study.avgImprovement;
  const studyMetricName = isSensateRealStudy
    ? "HRV"
    : isLyfefuelRealStudy
    ? "Activity Minutes"
    : "primary metric";

  const participants = generateMockParticipants(study.category);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/admin/studies/${study.id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Study
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={onOpenPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview in App
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {studyTargetParticipants}
            </p>
            <p className="text-sm text-muted-foreground">participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studyParticipants}/{studyTargetParticipants}</p>
            <p className="text-sm text-muted-foreground">{studyCompletionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              +{studyAvgImprovement}%
            </p>
            <p className="text-sm text-muted-foreground">{studyMetricName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLyfefuelRealStudy ? "24" : "28"} days</p>
            {isRealDataStudy ? (
              <p className="text-sm text-muted-foreground">Rolling enrollment</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {new Date(study.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(study.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Brand + Timeline Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand Info */}
        {brand && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Brand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isSensateRealStudy ? (
                    <img
                      src="/logos/sensate-logo.png"
                      alt="Sensate"
                      className="h-10 w-auto object-contain"
                    />
                  ) : isLyfefuelRealStudy ? (
                    <img
                      src="/logos/lyfefuel-logo.png"
                      alt="LYFEfuel"
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold">
                        {brand.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <p className="font-medium">{brand.name}</p>
                    </>
                  )}
                </div>
                <Link href={`/admin/brands/${brand.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">
                  Started{" "}
                  {new Date(study.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    study.status === "completed"
                      ? "bg-blue-500"
                      : "bg-muted-foreground"
                  }`}
                />
                <span className="text-sm">
                  {study.status === "completed" ? "Completed" : "Ends"}{" "}
                  {new Date(study.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Results Preview - Clickable */}
      <Card className={isRealDataStudy ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${isRealDataStudy ? "text-emerald-500" : "text-purple-500"}`} />
                {isRealDataStudy ? "Real Participant Stories" : "Sample Results Preview"}
              </CardTitle>
              <Badge variant="outline" className={`text-xs ${isRealDataStudy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}>
                {isRealDataStudy ? "Real Data" : "Demo Data"}
              </Badge>
            </div>
          </div>
          <CardDescription>
            {isSensateRealStudy
              ? `Verified participant stories from the Sensate study (${SENSATE_STATS.positive} positive, ${SENSATE_STATS.neutral} neutral, ${SENSATE_STATS.negative} negative)`
              : isLyfefuelRealStudy
              ? `Verified participant stories from the LYFEfuel study (${LYFEFUEL_STATS.positive} positive, ${LYFEFUEL_STATS.neutral} neutral, ${LYFEFUEL_STATS.negative} negative)`
              : "Click to see how verified participant stories will appear"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSensateRealStudy ? (
            // Real Sensate participants - sorted by improvement score
            <div className="grid gap-3 sm:grid-cols-2">
              {SORTED_SENSATE_STORIES.slice(0, 4).map((story) => (
                <Link key={story.id} href={`/verify/${story.verificationId}`}>
                  <div className="p-3 rounded-lg border border-emerald-200 bg-white flex items-center gap-3 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-sm font-semibold text-white">
                      {story.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-[#00D1C1] transition-colors">
                        {story.name}
                      </p>
                      {story.wearableMetrics?.hrvChange && (
                        <Badge className={`text-xs ${
                          story.wearableMetrics.hrvChange.changePercent > 0
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}>
                          {story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}
                          {story.wearableMetrics.hrvChange.changePercent}% HRV
                        </Badge>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#00D1C1] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : isLyfefuelRealStudy ? (
            // Real LYFEfuel participants - sorted by improvement score
            <div className="grid gap-3 sm:grid-cols-2">
              {SORTED_LYFEFUEL_STORIES.slice(0, 4).map((story) => (
                <Link key={story.id} href={`/verify/${story.verificationId}`}>
                  <div className="p-3 rounded-lg border border-emerald-200 bg-white flex items-center gap-3 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-sm font-semibold text-white">
                      {story.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-[#00D1C1] transition-colors">
                        {story.name}
                      </p>
                      {story.wearableMetrics?.activeMinutesChange && (
                        <Badge className={`text-xs ${
                          story.wearableMetrics.activeMinutesChange.changePercent > 0
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}>
                          {story.wearableMetrics.activeMinutesChange.changePercent > 0 ? "+" : ""}
                          {story.wearableMetrics.activeMinutesChange.changePercent}% Activity
                        </Badge>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#00D1C1] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Demo participants (default)
            <div className="grid gap-3 sm:grid-cols-2">
              {participants.slice(0, 2).map((p) => (
                <Link key={p.id} href={p.verifyUrl}>
                  <div className="p-3 rounded-lg border bg-muted/30 flex items-center gap-3 hover:bg-muted/50 hover:border-[#00D1C1]/50 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-[#00D1C1] transition-colors">
                        {p.name}
                      </p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        {p.primaryMetric.value}
                      </Badge>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#00D1C1] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {isSensateRealStudy ? (
            <Link href="/verify/sensate-results" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View all {SORTED_SENSATE_STORIES.length} verified results
              </Button>
            </Link>
          ) : isLyfefuelRealStudy ? (
            <Link href="/verify/lyfefuel-results" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View all {SORTED_LYFEFUEL_STORIES.length} verified results
              </Button>
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground mt-3">
              View the Results tab for all sample stories and participant insights
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
