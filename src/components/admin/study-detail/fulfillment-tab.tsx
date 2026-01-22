"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Clock, CheckCircle2, Info, Users, RefreshCw, Timer, AlertTriangle, TrendingUp } from "lucide-react";
import { RecruitmentStatusCard } from "@/components/shipping/recruitment-status-card";
import { CohortStatusCard } from "@/components/shipping/cohort-status-card";
import { TrackingEntryModal } from "@/components/shipping/tracking-entry-modal";
import { useCohortStore } from "@/lib/cohort-store";
import type { Cohort, ParticipantShipping, FulfillmentMetrics } from "@/lib/types";

interface FulfillmentTabProps {
  studyId: string;
  studyName: string;
  targetParticipants: number;
  isDemo?: boolean;
}

/**
 * Fulfillment tab for managing cohort-based recruitment and shipping.
 *
 * State flow:
 * - waitlist_only: Click "Go Live" to open first window
 * - window_open: 24h countdown, participants enrolling. Click "Close Window" to form cohort.
 * - window_closed: Cohort being processed. Enter all tracking codes to re-open window.
 * - complete: Study is full
 */
export function FulfillmentTab({
  studyId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studyName,
  targetParticipants,
  isDemo = true,
}: FulfillmentTabProps) {
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Get store data
  const {
    initializeStudy,
    goLive,
    openWindow,
    closeWindow,
    simulateEnrollment,
    simulateWaitlistGrowth,
    enterTrackingCode,
    getRecruitmentState,
    getCohortParticipants,
    resetStore,
  } = useCohortStore();

  // Initialize study on mount
  // For demo studies, start with 142 mock waitlist participants
  // For real studies, start with 0 (waitlist grows organically)
  useEffect(() => {
    initializeStudy(studyId, targetParticipants, isDemo ? 142 : 0);
  }, [studyId, targetParticipants, isDemo, initializeStudy]);

  const recruitmentState = getRecruitmentState(studyId);
  const currentCohort = recruitmentState?.currentCohort;
  const participants = currentCohort ? getCohortParticipants(currentCohort.id) : [];

  // Compute metrics from completed cohorts
  const completedCohorts = recruitmentState?.cohorts.filter((c) => c.status === "complete") || [];
  const metrics: FulfillmentMetrics = {
    totalShipped: completedCohorts.reduce((sum, c) => sum + c.participantIds.length, 0),
    avgShipTimeDays: completedCohorts.length > 0
      ? completedCohorts.reduce((sum, c) => sum + (c.avgShipTimeDays || 0), 0) / completedCohorts.length
      : 0,
    onTimePercent: 94, // Would be calculated from actual data
    cohortsCompleted: completedCohorts.length,
  };

  // State checks
  const isWaitlistOnly = recruitmentState?.status === "waitlist_only";
  const isWindowOpen = recruitmentState?.status === "window_open";
  const isWindowClosed = recruitmentState?.status === "window_closed";
  const isReadyToOpen = recruitmentState?.status === "ready_to_open";
  const isComplete = recruitmentState?.status === "complete";
  const hasCurrentCohort = currentCohort !== undefined;

  // Calculate expected enrollments based on conversion rate
  const conversionRate = recruitmentState?.conversionRate ?? 0.35; // Default 35%
  const expectedEnrollments = Math.round(
    (recruitmentState?.waitlistCount || 0) * conversionRate
  );
  const remainingSlots = targetParticipants - (recruitmentState?.totalEnrolled || 0);
  const minRecommendedCohort = 10; // Recommend at least 10 per cohort for efficiency

  const handleGoLive = () => {
    goLive(studyId);
  };

  const handleOpenWindow = () => {
    openWindow(studyId);
  };

  const handleCloseWindow = () => {
    closeWindow(studyId);
  };

  const handleSimulateWaitlistGrowth = () => {
    simulateWaitlistGrowth(studyId, 20);
  };

  const handleSimulateEnrollment = () => {
    simulateEnrollment(studyId, 5);
  };

  const handleDownloadCSV = () => {
    if (!currentCohort) return;
    const csvContent = generateShippingCSV(participants);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cohort-${currentCohort.cohortNumber}-shipping.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTracking = (
    updates: { participantId: string; trackingNumber: string }[]
  ) => {
    updates.forEach(({ participantId, trackingNumber }) => {
      if (trackingNumber.trim()) {
        enterTrackingCode(studyId, participantId, trackingNumber);
      }
    });
    setShowTrackingModal(false);
  };

  const handleReset = () => {
    if (confirm("Reset all cohort data for this study? This cannot be undone.")) {
      resetStore();
    }
  };

  if (!recruitmentState) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Study Complete */}
      {isComplete && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Study recruitment complete!</strong> All {recruitmentState.targetParticipants} participants have been enrolled.
          </AlertDescription>
        </Alert>
      )}

      {/* Waitlist Only State - Show Go Live Button */}
      {isWaitlistOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Launch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your study is ready to accept participants. Click &quot;Go Live&quot; to
              open the first 24-hour recruitment window. Participants on the
              waitlist will be notified via the mobile app.
            </p>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {recruitmentState.waitlistCount}
                </p>
                <p className="text-xs text-muted-foreground">On Waitlist</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{targetParticipants}</p>
                <p className="text-xs text-muted-foreground">Target</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{recruitmentState.totalEnrolled}</p>
                <p className="text-xs text-muted-foreground">Enrolled</p>
              </div>
            </div>
            <Button onClick={handleGoLive} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Go Live - Open First Recruitment Window
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Window Open State */}
      {isWindowOpen && (
        <>
          <RecruitmentStatusCard recruitmentState={recruitmentState} />

          {/* Simulation Controls - Demo Only */}
          {isDemo && (
            <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Simulation Controls (Demo Only)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-blue-600">
                  In production, participants would enroll via the mobile app during the 24h window.
                  Use these buttons to simulate the flow.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSimulateEnrollment}
                    disabled={recruitmentState.totalEnrolled + recruitmentState.currentWindowEnrolled >= recruitmentState.targetParticipants}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    +5 Enrollments
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseWindow}
                    disabled={recruitmentState.currentWindowEnrolled === 0}
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Close Window (Form Cohort)
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current window: {recruitmentState.currentWindowEnrolled} enrolled
                  {recruitmentState.currentWindowEnrolled === 0 && " (need at least 1 to form cohort)"}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Window Closed - Cohort Processing */}
      {isWindowClosed && hasCurrentCohort && currentCohort && (
        <>
          {/* Status Banner */}
          <Alert className="bg-amber-50 border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Recruitment window closed.</strong> Ship to Cohort {currentCohort.cohortNumber} and enter all tracking codes to open the next window.
            </AlertDescription>
          </Alert>

          {/* Progress Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {recruitmentState.totalEnrolled}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    / {recruitmentState.targetParticipants} participants
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((recruitmentState.totalEnrolled / recruitmentState.targetParticipants) * 100)}% of target
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Next Window Opens When
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  All <strong>{currentCohort.participantIds.length}</strong> tracking codes are entered
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {currentCohort.trackingCodesEntered}/{currentCohort.participantIds.length} entered
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Cohort Status */}
          <CohortStatusCard
            cohort={currentCohort}
            participants={participants}
            onDownloadCSV={handleDownloadCSV}
            onEnterTracking={() => setShowTrackingModal(true)}
          />
        </>
      )}

      {/* Ready to Open State - Brand decides when to open next window */}
      {isReadyToOpen && (
        <>
          {/* Success Banner */}
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>All tracking codes entered!</strong> You can open the next recruitment window when ready.
            </AlertDescription>
          </Alert>

          {/* Waitlist Status & Window Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ready to Open Next Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Waitlist Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-3xl font-bold">{recruitmentState?.waitlistCount || 0}</p>
                  <p className="text-sm text-muted-foreground">People on Waitlist</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-3xl font-bold">{expectedEnrollments}</p>
                  <p className="text-sm text-muted-foreground">Expected Enrollments</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {Math.round(conversionRate * 100)}% conversion
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-3xl font-bold">{remainingSlots}</p>
                  <p className="text-sm text-muted-foreground">Slots Remaining</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {recruitmentState?.totalEnrolled || 0} / {targetParticipants} enrolled
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              {expectedEnrollments < minRecommendedCohort && (
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Low waitlist warning:</strong> Based on your conversion rate,
                    opening now would likely result in a cohort of ~{expectedEnrollments} participants.
                    We recommend waiting for at least {Math.ceil(minRecommendedCohort / conversionRate)} on the waitlist
                    for efficient shipping batches.
                  </AlertDescription>
                </Alert>
              )}

              {expectedEnrollments >= minRecommendedCohort && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Good to go!</strong> Your waitlist has enough people
                    for an efficient cohort of ~{expectedEnrollments} participants.
                  </AlertDescription>
                </Alert>
              )}

              {/* Open Window Button */}
              <Button
                onClick={handleOpenWindow}
                className="w-full"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Open 24-Hour Recruitment Window
              </Button>

              {/* Simulation Controls - Demo Only */}
              {isDemo && (
                <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Simulation Controls (Demo Only)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-blue-600 mb-3">
                      In production, waitlist grows organically as users discover the study.
                      Use this to simulate waitlist growth.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSimulateWaitlistGrowth}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      +20 to Waitlist
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {recruitmentState?.totalEnrolled || 0}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    / {targetParticipants} participants
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(((recruitmentState?.totalEnrolled || 0) / targetParticipants) * 100)}% of target
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cohorts Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {recruitmentState?.cohorts.filter(c => c.status === "complete").length || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  All tracking codes entered
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Cohort History */}
      {recruitmentState.cohorts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cohort History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Delivered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruitmentState.cohorts.map((cohort) => (
                  <TableRow key={cohort.id}>
                    <TableCell className="font-medium">
                      Cohort {cohort.cohortNumber}
                      {cohort.id === currentCohort?.id && (
                        <Badge variant="outline" className="ml-2">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>{cohort.participantIds.length}</TableCell>
                    <TableCell>
                      <CohortStatusBadge status={cohort.status} />
                    </TableCell>
                    <TableCell>
                      {cohort.trackingCodesEntered}/{cohort.participantIds.length}
                      {cohort.allTrackingEntered && (
                        <CheckCircle2 className="h-3 w-3 text-green-500 inline ml-1" />
                      )}
                    </TableCell>
                    <TableCell>
                      {cohort.deliveredCount}/{cohort.participantIds.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Fulfillment Metrics */}
      {metrics.totalShipped > 0 && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>
              Cohorts completed:{" "}
              <strong className="text-foreground">{metrics.cohortsCompleted}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              Total shipped:{" "}
              <strong className="text-foreground">{metrics.totalShipped}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Reset Button (for demo testing only) */}
      {isDemo && (
        <div className="pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Demo Data
          </Button>
        </div>
      )}

      {/* Tracking Entry Modal */}
      {hasCurrentCohort && currentCohort && (
        <TrackingEntryModal
          open={showTrackingModal}
          onClose={() => setShowTrackingModal(false)}
          cohort={currentCohort}
          participants={participants}
          onSave={handleSaveTracking}
        />
      )}
    </div>
  );
}

function CohortStatusBadge({ status }: { status: Cohort["status"] }) {
  const config: Record<
    Cohort["status"],
    { label: string; variant: "default" | "secondary" | "outline" }
  > = {
    recruiting: { label: "Recruiting", variant: "default" },
    collecting_addresses: { label: "Collecting Addresses", variant: "secondary" },
    pending_shipment: { label: "Pending Shipment", variant: "secondary" },
    shipping: { label: "Shipping", variant: "secondary" },
    complete: { label: "Complete", variant: "outline" },
  };

  const { label, variant } = config[status];
  return (
    <Badge variant={variant} className={status === "complete" ? "bg-green-100 text-green-800" : ""}>
      {status === "complete" && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  );
}

function generateShippingCSV(participants: ParticipantShipping[]): string {
  const headers = [
    "Participant ID",
    "Name",
    "Street 1",
    "Street 2",
    "City",
    "State",
    "Zip Code",
    "Phone",
  ];
  const rows = participants
    .filter((p) => p.address)
    .map((p) => [
      p.participantId,
      p.displayName,
      p.address?.street1 || "",
      p.address?.street2 || "",
      p.address?.city || "",
      p.address?.state || "",
      p.address?.zipCode || "",
      p.address?.phone || "",
    ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
