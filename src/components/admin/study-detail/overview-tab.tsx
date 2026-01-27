"use client";

import React, { useEffect, useState } from "react";
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
  Package,
  Rocket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowRight,
  Info,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AlertTriangle,
  EyeOff,
  UserPlus,
  UserCheck,
  Link as LinkIcon,
  Copy,
  Check,
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
import { LaunchChecklist } from "./launch-checklist";
import { EarlyInsightsCard } from "./early-insights-card";
import { useStudiesStore } from "@/lib/studies-store";
import { useCohortStore, getWaitlistStats } from "@/lib/cohort-store";
import { useEnrollmentStore } from "@/lib/enrollment-store";

interface OverviewTabProps {
  study: StudyData;
  brand: { id: string; name: string } | undefined;
  onOpenPreview: () => void;
  onNavigateToTab?: (tab: "overview" | "enrollment" | "fulfillment" | "compliance" | "results" | "config") => void;
}

export function OverviewTab({ study, brand, onOpenPreview, onNavigateToTab }: OverviewTabProps) {
  // Check study data type
  const isSensateRealStudy = study.id === "study-sensate-real";
  const isLyfefuelRealStudy = study.id === "study-lyfefuel-real";
  const isRealDataStudy = isSensateRealStudy || isLyfefuelRealStudy;

  // Check if this is a new user-created study with no participants
  // isDemo: true = demo/sample study, show mock data
  // isDemo: false = real study, show real data (or empty state if no participants)
  const isNewUserStudy = study.isDemo === false && study.participants === 0 && !isRealDataStudy;

  // Check if study is in pre-launch phase (draft or coming_soon)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPreLaunchStudy = study.status === "draft" || study.status === "coming_soon";

  // Get store actions for launch checklist
  const { updateLaunchChecklist, publishToCatalogue, unpublishFromCatalogue, startRecruiting } = useStudiesStore();

  // Get cohort data for waitlist count
  const { getRecruitmentState, initializeStudy, goLive } = useCohortStore();
  const recruitmentState = getRecruitmentState(study.id);

  // Auto-initialize recruitment state for coming_soon studies
  // Starts at 0 - waitlist grows as participants join
  useEffect(() => {
    if (study.status === "coming_soon" && !getRecruitmentState(study.id)) {
      // Initialize with 0 waitlist - will grow as participants join
      initializeStudy(study.id, study.targetParticipants, 0, 0);
    }
  }, [study.id, study.status, study.targetParticipants, getRecruitmentState, initializeStudy]);

  // Get or initialize launch checklist
  const checklist = study.launchChecklist ?? {
    settingsComplete: true, // Always true after creation
    previewReviewed: false,
    inventoryConfirmed: false,
  };

  // Handlers for launch checklist
  const handlePreviewReview = () => {
    onOpenPreview();
    // Mark as reviewed when they click
    updateLaunchChecklist(study.id, { previewReviewed: true });
  };

  const handleInventoryConfirm = () => {
    updateLaunchChecklist(study.id, { inventoryConfirmed: true });
  };

  const handleGoLive = () => {
    // This publishes to catalogue as coming_soon
    publishToCatalogue(study.id);
    // Mark the publish step as complete in the checklist
    updateLaunchChecklist(study.id, { goLiveAt: new Date().toISOString() });
  };

  // Use real data for Sensate/LYFEfuel study, mock data for demos, zeros for new user studies
  const studyParticipants = isSensateRealStudy
    ? SENSATE_METRICS.completed
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.completed
    : isNewUserStudy
    ? 0
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
    : isNewUserStudy
    ? 0
    : study.completionRate;
  const studyAvgImprovement = isSensateRealStudy
    ? SENSATE_METRICS.avgHrvChange
    : isLyfefuelRealStudy
    ? LYFEFUEL_METRICS.avgActivityChange
    : isNewUserStudy
    ? 0
    : study.avgImprovement;
  const studyMetricName = isSensateRealStudy
    ? "HRV"
    : isLyfefuelRealStudy
    ? "Activity Minutes"
    : "primary metric";

  // Only generate mock participants for demo studies
  const participants = study.isDemo !== false ? generateMockParticipants(study.category) : [];

  // Handler for starting recruitment
  const handleStartRecruiting = () => {
    // Initialize recruitment state if not exists
    if (!recruitmentState) {
      initializeStudy(study.id, study.targetParticipants, 0, 0);
    }
    // Update study status AND open the recruitment window in cohort store
    startRecruiting(study.id);
    goLive(study.id);
    // Navigate to fulfillment tab to manage the recruitment window
    onNavigateToTab?.("fulfillment");
  };

  // Handler for unpublishing
  const handleUnpublish = () => {
    unpublishFromCatalogue(study.id);
  };

  // Get waitlist stats for display
  const waitlistStats = getWaitlistStats(recruitmentState);

  // Check if this is a brand-recruited study
  const isBrandRecruits = study.fulfillmentModel === "rebate" && study.enrollmentConfig;

  // Get enrollment stats for brand-recruited studies
  const { getEnrollmentStats } = useEnrollmentStore();
  const enrollmentStats = isBrandRecruits ? getEnrollmentStats(study.id) : null;

  // State for copy link functionality
  const [copied, setCopied] = useState(false);

  // Build enrollment URL for brand-recruited studies
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const enrollmentUrl = isBrandRecruits ? `${baseUrl}/join/${study.enrollmentConfig?.enrollmentSlug}` : "";

  // Copy link handler
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(enrollmentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ================================================
  // BRAND-RECRUITED ACTIVE STUDIES - Enrollment-focused dashboard
  // ================================================
  if (isBrandRecruits && (study.status === "active" || study.status === "recruiting")) {
    const enrollmentConfig = study.enrollmentConfig!;
    return (
      <div className="space-y-6">
        {/* Enrollment Status Banner */}
        <Card className="border-[#00D1C1]/30 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-[#00D1C1]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Enrollment is open</p>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share your enrollment link with customers who purchased your product
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Early Insights - Week 1 baseline data */}
        <EarlyInsightsCard
          studyId={study.id}
          studyCategory={study.category}
          enrollmentSlug={enrollmentConfig.enrollmentSlug}
          isDemo={study.isDemo !== false}
        />

        {/* Enrollment Link Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-[#00D1C1]" />
              Your Enrollment Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm truncate">
                {enrollmentUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                className={copied ? "bg-green-600 hover:bg-green-600" : ""}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Add this link to your post-purchase email or order confirmation page
            </p>
          </CardContent>
        </Card>

        {/* Enrollment Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Enrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{enrollmentConfig.enrolledCount || 0}</p>
              <p className="text-sm text-muted-foreground">of {enrollmentConfig.enrollmentCap} cap</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Signed Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {enrollmentStats ? (enrollmentStats.signedUp + enrollmentStats.waiting + enrollmentStats.active + enrollmentStats.completed) : 0}
              </p>
              <p className="text-sm text-muted-foreground">completed signup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{enrollmentStats?.active || 0}</p>
              <p className="text-sm text-muted-foreground">in study</p>
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
              <p className="text-2xl font-bold text-emerald-600">{enrollmentStats?.completed || 0}</p>
              <p className="text-sm text-muted-foreground">finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => onNavigateToTab?.("enrollment")}>
            <Users className="h-4 w-4 mr-2" />
            View All Enrollments
          </Button>
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

        {/* Study Configuration Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Study Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{study.categoryLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier</p>
                <p className="font-medium">Tier {study.tier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-medium">{study.targetParticipants} participants</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Testing Reward</p>
                <p className="font-medium">${study.rebateAmount}</p>
              </div>
            </div>
            {brand && (
              <div className="mt-4 pt-4 border-t flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Brand:</span>
                <span className="font-medium">{brand.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ================================================
  // COMING SOON STUDIES - Waitlist-focused dashboard
  // ================================================
  if (study.status === "coming_soon") {
    return (
      <div className="space-y-6">
        {/* Live Status Banner */}
        <Card className="border-[#00D1C1]/30 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-[#00D1C1]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Your study is live in the catalogue</p>
                  <Badge className="bg-[#00D1C1]/20 text-[#00D1C1] hover:bg-[#00D1C1]/20">Coming Soon</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Participants can join your waitlist. Start recruiting when you&apos;re ready to ship.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist Insights Card */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-[#00D1C1]" />
              Waitlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main count + trend */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-5xl font-bold text-[#00D1C1]">{waitlistStats.count}</p>
                <p className="text-sm text-muted-foreground">people on waitlist</p>
              </div>
              {waitlistStats.weeklyChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                  waitlistStats.weeklyChange > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  <TrendingUp className={`h-3.5 w-3.5 ${waitlistStats.weeklyChange < 0 ? "rotate-180" : ""}`} />
                  {waitlistStats.weeklyChange > 0 ? "+" : ""}{waitlistStats.weeklyChange} this week
                </div>
              )}
            </div>

            {/* Projection */}
            <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">~{waitlistStats.projectedEnrollments}</span> expected enrollments per window
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {Math.round(waitlistStats.conversionRate * 100)}% conversion rate
              </p>
            </div>

            {/* Returning vs New users */}
            {(waitlistStats.returningUsers > 0 || waitlistStats.newUsers > 0) && (
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{waitlistStats.returningUsers}</span>
                  <span className="text-muted-foreground">returning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{waitlistStats.newUsers}</span>
                  <span className="text-muted-foreground">new</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Primary CTA: Start Recruiting */}
        <Card className="bg-gradient-to-r from-purple-50 to-white border-purple-200">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Ready to start?</p>
                <p className="text-sm text-muted-foreground">
                  Open a 24-hour recruitment window. Waitlist members will be notified.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleStartRecruiting}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Start Recruiting
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Study Configuration Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Study Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{study.categoryLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier</p>
                <p className="font-medium">Tier {study.tier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-medium">{study.targetParticipants} participants</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rebate</p>
                <p className="font-medium">${study.rebateAmount}</p>
              </div>
            </div>
            {brand && (
              <div className="mt-4 pt-4 border-t flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Brand:</span>
                <span className="font-medium">{brand.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unpublish Option */}
        <Card className="border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Changed your mind?</p>
                  <p className="text-xs text-muted-foreground">Remove from catalogue and return to draft</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleUnpublish}>
                Unpublish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ================================================
  // DRAFT STUDIES - Launch preparation dashboard
  // ================================================
  if (study.status === "draft") {
    return (
      <div className="space-y-6">
        {/* Launch Checklist - Prominent at top */}
        <LaunchChecklist
          checklist={checklist}
          targetParticipants={study.targetParticipants}
          onPreviewReview={handlePreviewReview}
          onInventoryConfirm={handleInventoryConfirm}
          onGoLive={handleGoLive}
        />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/admin/studies/${study.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Study
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handlePreviewReview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview in App
          </Button>
          <Link href={`/admin/studies/${study.id}?tab=fulfillment`}>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Configure Fulfillment
            </Button>
          </Link>
        </div>

        {/* Study Configuration Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Study Configuration</CardTitle>
            <CardDescription>Your study settings at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{study.categoryLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier</p>
                <p className="font-medium">Tier {study.tier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Participants</p>
                <p className="font-medium">{study.targetParticipants}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rebate Amount</p>
                <p className="font-medium">${study.rebateAmount}</p>
              </div>
            </div>
            {brand && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Brand:</span>
                  <span className="font-medium">{brand.name}</span>
                </div>
                <Link href={`/admin/brands/${brand.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What Happens Next - Educational section */}
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#00D1C1]">1</span>
                </div>
                <div>
                  <p className="font-medium">Complete the publish checklist above</p>
                  <p className="text-sm text-muted-foreground">
                    Review your preview and confirm your inventory is ready to ship.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#00D1C1]">2</span>
                </div>
                <div>
                  <p className="font-medium">Publish as &quot;Coming Soon&quot;</p>
                  <p className="text-sm text-muted-foreground">
                    Your study appears in the mobile app catalogue. Participants can join your waitlist.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#00D1C1]">3</span>
                </div>
                <div>
                  <p className="font-medium">Start recruiting when ready</p>
                  <p className="text-sm text-muted-foreground">
                    Open 24-hour recruitment windows to enroll participants from your waitlist.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#00D1C1]">4</span>
                </div>
                <div>
                  <p className="font-medium">Ship products and track results</p>
                  <p className="text-sm text-muted-foreground">
                    Fulfill orders for each cohort and watch verified results come in.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Regular overview for active/completed studies
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
              {study.status === "completed" ? studyParticipants : (recruitmentState?.totalEnrolled ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              of {studyTargetParticipants} target
            </p>
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
            {/* Show selection method for Tier 1 studies */}
            {study.tier === 1 && !isRealDataStudy && (
              <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
                {(study as StudyData & { primaryMetricConfig?: { mode: "auto" | "manual" } }).primaryMetricConfig?.mode === "manual"
                  ? "(selected)"
                  : "(auto)"}
              </p>
            )}
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
            ) : study.startDate && study.endDate && !isNaN(new Date(study.startDate).getTime()) ? (
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
            ) : (
              <p className="text-sm text-muted-foreground">Not scheduled yet</p>
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
            {study.startDate && study.endDate && !isNaN(new Date(study.startDate).getTime()) ? (
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
            ) : (
              <div className="text-center py-2 text-muted-foreground">
                <p className="text-sm">Study dates not scheduled yet</p>
                <p className="text-xs mt-1">Timeline will appear once the study goes live</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample Results Preview - Clickable */}
      <Card className={isRealDataStudy ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white" : isNewUserStudy ? "border-dashed" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${isRealDataStudy ? "text-emerald-500" : isNewUserStudy ? "text-muted-foreground" : "text-purple-500"}`} />
                {isRealDataStudy ? "Real Participant Stories" : isNewUserStudy ? "Participant Results" : "Sample Results Preview"}
              </CardTitle>
              {!isNewUserStudy && (
                <Badge variant="outline" className={`text-xs ${isRealDataStudy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}>
                  {isRealDataStudy ? "Real Data" : "Demo Data"}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {isSensateRealStudy
              ? `Verified participant stories from the Sensate study (${SENSATE_STATS.positive} positive, ${SENSATE_STATS.neutral} neutral, ${SENSATE_STATS.negative} negative)`
              : isLyfefuelRealStudy
              ? `Verified participant stories from the LYFEfuel study (${LYFEFUEL_STATS.positive} positive, ${LYFEFUEL_STATS.neutral} neutral, ${LYFEFUEL_STATS.negative} negative)`
              : isNewUserStudy
              ? "Participant results will appear here once your study goes live and participants complete their journey"
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
          ) : isNewUserStudy ? (
            // Empty state for new user-created studies
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No participants yet</p>
              <p className="text-sm mt-1">
                Once your study goes live and participants complete their journey,<br />
                their verified results will appear here.
              </p>
            </div>
          ) : (
            // Demo participants (for sample studies)
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
          ) : isNewUserStudy ? (
            null // No footer needed for empty state
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
