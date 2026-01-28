"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  CheckCircle2,
  Clock,
  Activity,
  Send,
  MailOpen,
  Download,
  Search,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  FlaskConical,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import type { Enrollment, HealthStatus, NurtureType } from "@/lib/enrollment-store";
import { enrollmentToCard } from "@/lib/insights/card-transformer";
import { ParticipantStoryCard } from "./participant-story-card";

interface ParticipantsTabProps {
  studyId: string;
  studyName: string;
  enrollmentSlug: string;
  studyCategory?: string;
  isDemo?: boolean;
}

// Health status badge
function getHealthBadge(status: HealthStatus) {
  switch (status) {
    case "on_track":
      return <Badge className="bg-green-100 text-green-700">On Track</Badge>;
    case "needs_attention":
      return <Badge className="bg-amber-100 text-amber-700">Needs Attention</Badge>;
    case "at_risk":
      return <Badge className="bg-red-100 text-red-700">At Risk</Badge>;
  }
}

// Stage badge styling
function getStageBadge(stage: Enrollment["stage"]) {
  switch (stage) {
    case "clicked":
      return <Badge variant="outline" className="text-gray-600">Clicked</Badge>;
    case "signed_up":
      return <Badge className="bg-blue-100 text-blue-700">Signed Up</Badge>;
    case "waiting":
      return <Badge className="bg-amber-100 text-amber-700">Waiting</Badge>;
    case "started":
    case "active":
      return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    case "completed":
      return <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>;
    case "dropped":
      return <Badge className="bg-red-100 text-red-700">Dropped</Badge>;
    default:
      return <Badge variant="outline">{stage}</Badge>;
  }
}

// Calculate health status from enrollment data
function getHealthStatus(enrollment: Enrollment): HealthStatus {
  if (enrollment.stage === "completed") return "on_track";
  if (enrollment.stage === "dropped") return "at_risk";
  if (enrollment.stage === "clicked" || enrollment.stage === "signed_up" || enrollment.stage === "waiting") return "on_track";

  const complianceScore = enrollment.complianceScore ?? 0;
  const lastCheckIn = enrollment.lastCheckInAt ? new Date(enrollment.lastCheckInAt) : null;
  const now = new Date();
  const daysSinceLastCheckIn = lastCheckIn
    ? Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (complianceScore >= 70 && daysSinceLastCheckIn <= 2) return "on_track";
  if (complianceScore >= 50 || daysSinceLastCheckIn <= 4) return "needs_attention";
  return "at_risk";
}

// Nurture type labels
function getNurtureLabel(type: NurtureType): string {
  switch (type) {
    case "welcome": return "Welcome Email";
    case "day3_reminder": return "Day 3 Reminder";
    case "day7_checkin": return "Week 1 Check-in";
    case "day14_milestone": return "Halfway Milestone";
    case "day21_final_push": return "Final Week Push";
    case "at_risk_outreach": return "At-Risk Outreach";
    default: return type;
  }
}

type FilterStatus = "all" | "on_track" | "needs_attention" | "at_risk";

export function ParticipantsTab({
  studyId,
  studyName,
  enrollmentSlug,
  studyCategory,
}: ParticipantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedParticipant, setSelectedParticipant] = useState<Enrollment | null>(null);

  // Get enrollments from store
  const { getEnrollmentsByStudy, getEnrollmentStats, simulateBatch, resetEnrollments, addSimulatedEnrollment, simulateBaselineBatch, addSimulatedEnrollmentWithArchetype } = useEnrollmentStore();

  const enrollments = getEnrollmentsByStudy(studyId);
  const stats = getEnrollmentStats(studyId);

  // Get all participants (excluding just clicked)
  const allParticipants = enrollments.filter(e => e.stage !== "clicked");

  // Active participants for compliance tracking
  const activeParticipants = allParticipants.filter(e =>
    e.stage === "active" || e.stage === "started"
  );

  // Calculate health stats for active participants
  const now = new Date();
  const healthStats = activeParticipants.reduce((acc, e) => {
    const status = getHealthStatus(e);
    acc[status]++;
    return acc;
  }, { on_track: 0, needs_attention: 0, at_risk: 0 } as Record<HealthStatus, number>);

  // Filter and search participants
  const filteredParticipants = activeParticipants.filter(enrollment => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        enrollment.name?.toLowerCase().includes(query) ||
        enrollment.email?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filterStatus !== "all") {
      const healthStatus = getHealthStatus(enrollment);
      if (healthStatus !== filterStatus) return false;
    }

    return true;
  });

  // Export participants data
  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Stage", "Day", "Compliance %", "Last Check-in", "Status", "Nurtures Sent"].join(","),
      ...allParticipants.map(e => {
        const startedDate = e.studyStartedAt ? new Date(e.studyStartedAt) : null;
        const daysInStudy = startedDate
          ? Math.floor((now.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        const lastCheckIn = e.lastCheckInAt ? new Date(e.lastCheckInAt) : null;
        const daysSinceCheckIn = lastCheckIn
          ? Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        return [
          e.name || "Unknown",
          e.email || "",
          e.stage,
          daysInStudy,
          e.complianceScore ?? 0,
          daysSinceCheckIn !== null ? `${daysSinceCheckIn} days ago` : "Never",
          getHealthStatus(e),
          e.nurtures?.length ?? 0
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studyName.replace(/\s+/g, "-").toLowerCase()}-participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate completion projection
  const projectedCompletions = Math.round(stats.active * (healthStats.on_track / (activeParticipants.length || 1)));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allParticipants.length}</p>
            <p className="text-sm text-muted-foreground">Enrolled in study</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Currently in study</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{healthStats.on_track}</p>
            <p className="text-sm text-muted-foreground">Healthy compliance</p>
          </CardContent>
        </Card>

        <Card className={healthStats.at_risk > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${healthStats.at_risk > 0 ? "text-red-600" : ""}`}>
              {healthStats.at_risk}
            </p>
            <p className="text-sm text-muted-foreground">Need intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Projection */}
      {activeParticipants.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-transparent border-emerald-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">Completion Projection</p>
                  <p className="text-sm text-muted-foreground">
                    Based on current compliance rates
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">
                  ~{projectedCompletions + stats.completed} of {allParticipants.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  projected to complete ({Math.round((projectedCompletions + stats.completed) / allParticipants.length * 100)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Compliance Dashboard
              </CardTitle>
              <CardDescription className="mt-1">
                Track compliance and automated nurture status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeParticipants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No active participants yet</p>
              <p className="text-sm mt-1">
                Compliance tracking will appear once participants start the study
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "on_track" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("on_track")}
                    className={filterStatus === "on_track" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    On Track ({healthStats.on_track})
                  </Button>
                  <Button
                    variant={filterStatus === "needs_attention" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("needs_attention")}
                    className={filterStatus === "needs_attention" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Needs Attention ({healthStats.needs_attention})
                  </Button>
                  <Button
                    variant={filterStatus === "at_risk" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("at_risk")}
                    className={filterStatus === "at_risk" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    At Risk ({healthStats.at_risk})
                  </Button>
                </div>
              </div>

              {/* Compliance Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Participant</th>
                      <th className="text-center p-3 font-medium">Day</th>
                      <th className="text-center p-3 font-medium">Compliance</th>
                      <th className="text-center p-3 font-medium">Last Check-in</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Nurtures Sent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No participants match your filters
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((enrollment) => {
                        const healthStatus = getHealthStatus(enrollment);
                        const startedDate = enrollment.studyStartedAt ? new Date(enrollment.studyStartedAt) : null;
                        const daysInStudy = startedDate
                          ? Math.floor((now.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
                          : 0;
                        const lastCheckIn = enrollment.lastCheckInAt ? new Date(enrollment.lastCheckInAt) : null;
                        const daysSinceCheckIn = lastCheckIn
                          ? Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
                          : null;
                        const complianceScore = enrollment.complianceScore ?? 0;
                        const nurturesSent = enrollment.nurtures?.length ?? 0;
                        const lastNurture = enrollment.nurtures?.[enrollment.nurtures.length - 1];

                        return (
                          <tr key={enrollment.id} className="hover:bg-muted/30">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                  healthStatus === "on_track" ? "bg-green-100 text-green-700" :
                                  healthStatus === "needs_attention" ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {enrollment.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                                </div>
                                <div>
                                  <p className="font-medium">{enrollment.name || "Unknown"}</p>
                                  <p className="text-xs text-muted-foreground">{enrollment.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-medium">{daysInStudy}</span>
                              <span className="text-muted-foreground">/28</span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      complianceScore >= 70 ? "bg-green-500" :
                                      complianceScore >= 50 ? "bg-amber-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${complianceScore}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium">{complianceScore}%</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              {daysSinceCheckIn !== null ? (
                                <span className={`text-xs ${
                                  daysSinceCheckIn === 0 ? "text-green-600" :
                                  daysSinceCheckIn <= 2 ? "text-muted-foreground" :
                                  daysSinceCheckIn <= 4 ? "text-amber-600" : "text-red-600"
                                }`}>
                                  {daysSinceCheckIn === 0 ? "Today" :
                                   daysSinceCheckIn === 1 ? "Yesterday" :
                                   `${daysSinceCheckIn} days ago`}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Never</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {getHealthBadge(healthStatus)}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {enrollment.nurtures && enrollment.nurtures.length > 0 ? (
                                  <>
                                    <div className="flex -space-x-1">
                                      {enrollment.nurtures.slice(-3).map((nurture, idx) => (
                                        <div
                                          key={idx}
                                          className={`h-5 w-5 rounded-full border-2 border-white flex items-center justify-center ${
                                            nurture.opened ? "bg-green-100" : "bg-gray-100"
                                          }`}
                                          title={`${getNurtureLabel(nurture.type)}${nurture.opened ? " (opened)" : ""}`}
                                        >
                                          {nurture.opened ? (
                                            <MailOpen className="h-2.5 w-2.5 text-green-600" />
                                          ) : (
                                            <Send className="h-2.5 w-2.5 text-gray-400" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-1">
                                      {nurturesSent} sent
                                    </span>
                                    {lastNurture && (
                                      <span className="text-xs text-muted-foreground">
                                        · {getNurtureLabel(lastNurture.type)}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-xs text-muted-foreground">None yet</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Auto-nurture status info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                <Send className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Automated Nurtures Active</p>
                  <p className="text-blue-700 text-xs mt-0.5">
                    The system automatically sends reminder emails at key milestones (Day 3, 7, 14, 21) and
                    reaches out to at-risk participants. Open rates are tracked to measure engagement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Participants List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Participants
          </CardTitle>
          <CardDescription>
            Complete list of {allParticipants.length} enrolled participant{allParticipants.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allParticipants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No participants yet</p>
              <p className="text-sm mt-1">
                Share your enrollment link to get started
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {allParticipants.map((enrollment) => {
                const healthStatus = getHealthStatus(enrollment);
                const startedDate = enrollment.studyStartedAt ? new Date(enrollment.studyStartedAt) : null;
                const daysInStudy = startedDate
                  ? Math.floor((now.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <div
                    key={enrollment.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 -mx-4 px-4 cursor-pointer transition-colors rounded-lg group"
                    onClick={() => setSelectedParticipant(enrollment)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedParticipant(enrollment)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                        healthStatus === "on_track" ? "bg-green-100 text-green-700" :
                        healthStatus === "needs_attention" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {enrollment.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                      </div>
                      <div>
                        <p className="font-medium">{enrollment.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      {enrollment.stage === 'completed' ? (
                        <span className="text-xs text-muted-foreground">
                          Day 28/28
                        </span>
                      ) : daysInStudy !== null && (
                        <span className="text-xs text-muted-foreground">
                          Day {daysInStudy}/28
                        </span>
                      )}
                      {enrollment.complianceScore !== undefined && (
                        <span className={`text-xs font-medium ${
                          enrollment.complianceScore >= 70 ? "text-green-600" :
                          enrollment.complianceScore >= 50 ? "text-amber-600" : "text-red-600"
                        }`}>
                          {enrollment.complianceScore}%
                        </span>
                      )}
                      {getStageBadge(enrollment.stage)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulation Controls (Dev/Demo) */}
      <Card className="border-dashed border-amber-300 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-700">
            <FlaskConical className="h-4 w-4" />
            Participant Simulation
          </CardTitle>
          <CardDescription>
            Add simulated participants to test features and demo the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Simulation */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Quick Add
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollment(studyId, enrollmentSlug, 'active')}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                +1 Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollment(studyId, enrollmentSlug, 'completed')}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                +1 Completed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateBatch(studyId, enrollmentSlug, 5)}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                +5 Mixed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateBatch(studyId, enrollmentSlug, 10)}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                +10 Mixed
              </Button>
            </div>
          </div>

          {/* Archetype-Based Simulation for Early Insights */}
          <div className="pt-3 border-t border-amber-200">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
              Add Participant by Archetype (with Baseline Data for Customer Insights)
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollmentWithArchetype(studyId, enrollmentSlug, 'skeptic', studyCategory)}
                className="border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Skeptic
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollmentWithArchetype(studyId, enrollmentSlug, 'desperate', studyCategory)}
                className="border-rose-300 text-rose-600 hover:bg-rose-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Desperate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollmentWithArchetype(studyId, enrollmentSlug, 'power_user', studyCategory)}
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Power User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollmentWithArchetype(studyId, enrollmentSlug, 'struggler', studyCategory)}
                className="border-amber-300 text-amber-600 hover:bg-amber-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Struggler
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSimulatedEnrollmentWithArchetype(studyId, enrollmentSlug, 'optimist', studyCategory)}
                className="border-emerald-300 text-emerald-600 hover:bg-emerald-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Optimist
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Each archetype has unique characteristics: pain duration, failed alternatives, desperation level, and verbatim quotes.
            </p>
          </div>

          {/* Batch with Baseline */}
          <div className="pt-3 border-t border-amber-200">
            <p className="text-xs font-medium text-[#00D1C1] uppercase tracking-wide mb-2">
              Batch Add with Baseline Data
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateBaselineBatch(studyId, enrollmentSlug, 3)}
                className="border-[#00D1C1] text-[#00D1C1] hover:bg-[#00D1C1]/10"
              >
                <Plus className="h-3 w-3 mr-1" />
                +3 (Show Patterns)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateBaselineBatch(studyId, enrollmentSlug, 10)}
                className="border-[#00D1C1] text-[#00D1C1] hover:bg-[#00D1C1]/10"
              >
                <Plus className="h-3 w-3 mr-1" />
                +10 (Full Analytics)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateBaselineBatch(studyId, enrollmentSlug, 25)}
                className="border-[#00D1C1] text-[#00D1C1] hover:bg-[#00D1C1]/10"
              >
                <Plus className="h-3 w-3 mr-1" />
                +25 (Rich Data)
              </Button>
            </div>
          </div>

          {/* Clear */}
          <div className="pt-3 border-t border-amber-200">
            <Button
              variant="outline"
              size="sm"
              onClick={resetEnrollments}
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All Participants
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participant Profile Modal */}
      <Dialog open={!!selectedParticipant} onOpenChange={(open) => !open && setSelectedParticipant(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-lg font-semibold">Participant Profile</DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            {selectedParticipant && enrollmentToCard(selectedParticipant) ? (
              <ParticipantStoryCard
                card={enrollmentToCard(selectedParticipant)!}
                studyCategory={studyCategory}
                isExpanded={true}
              />
            ) : selectedParticipant && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                {selectedParticipant.stage === 'signed_up' || selectedParticipant.stage === 'waiting' ? (
                  <>
                    <p className="font-medium">Baseline collection in progress</p>
                    <p className="text-sm mt-1">
                      {selectedParticipant.name || 'This participant'} is completing their baseline questionnaire.
                      Insights will appear once they start the study.
                    </p>
                  </>
                ) : selectedParticipant.stage === 'clicked' ? (
                  <>
                    <p className="font-medium">Awaiting sign-up</p>
                    <p className="text-sm mt-1">
                      This visitor clicked the enrollment link but hasn&apos;t signed up yet.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">No baseline data available</p>
                    <p className="text-sm mt-1">
                      This participant hasn&apos;t completed their onboarding questionnaire yet.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
