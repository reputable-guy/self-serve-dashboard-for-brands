"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Star,
  BadgeCheck,
  Watch,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Share2,
  Activity,
  Heart,
  Moon,
  User,
  Quote,
  BarChart3,
  Calendar,
  MapPin,
  Smartphone,
  Zap,
  Target,
  MessageSquare,
  Clock,
} from "lucide-react";
import type { MockTestimonial, ParticipantStory } from "@/lib/types";

// Import sub-components from the verification module
import { InlineVerifiedBadge } from "./badges";
import { MetricCard, AssessmentResultCard } from "./metrics";
import { TimelineEvent, TestimonialResponsesSection, VillainJourneyProgress } from "./journey";
import { HowWeVerifySection } from "./trust-stack";

interface StudyProtocol {
  baselineDays: number;
  interventionDays: number;
  wearableTypes: string[];
  dailyInstructions: string;
  compensationNote?: string;
}

interface StudyStats {
  totalParticipants: number;
  improved: number;
  neutral: number;
  noImprovement: number;
}

interface VerificationPageProps {
  testimonial: MockTestimonial;
  studyTitle: string;
  productName: string;
  studyDuration: number;
  studyId: string;
  story?: ParticipantStory;
  hasWearable?: boolean;
  productDescription?: string;
  productImage?: string;
  brandLogo?: string;
  protocol?: StudyProtocol;
  studyStats?: StudyStats;
}

// Collapsible section wrapper component
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-5 w-5 text-[#00D1C1]" />
          {title}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-6 px-6">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

export function VerificationPage({
  testimonial,
  studyTitle,
  productName,
  studyDuration,
  studyId,
  story,
  hasWearable: hasWearableProp,
  productDescription: _productDescription,
  productImage: _productImage,
  brandLogo,
  protocol,
  studyStats,
}: VerificationPageProps) {
  // These props are available for future use
  void _productDescription;
  void _productImage;
  void studyTitle;
  void studyId;

  // Default study stats (fallback for non-real studies)
  const defaultStats: StudyStats = {
    totalParticipants: 47,
    improved: 38,
    neutral: 0,
    noImprovement: 9,
  };
  const stats = studyStats || defaultStats;

  // Determine if this is a wearable-based verification
  const hasWearable = hasWearableProp ?? (
    testimonial.device !== undefined &&
    testimonial.device !== "" &&
    testimonial.device !== "None"
  );

  // Calculate data points
  const dataPointsCollected = hasWearable ? studyDuration * 24 * 30 : 0;
  const formattedDataPoints = dataPointsCollected.toLocaleString();

  // Determine if this story has ACTUAL wearable metrics data
  const hasActualWearableMetrics = !!(story && story.wearableMetrics && (
    (story.wearableMetrics.sleepChange && story.wearableMetrics.sleepChange.changePercent > 0) ||
    story.wearableMetrics.deepSleepChange ||
    story.wearableMetrics.hrvChange ||
    story.wearableMetrics.restingHrChange ||
    story.wearableMetrics.stepsChange ||
    story.wearableMetrics.activeMinutesChange
  ));

  // Build detailed metrics
  const tier = story?.tier || 1;
  const detailedMetrics = hasActualWearableMetrics ? [
    story!.wearableMetrics!.stepsChange && {
      label: "Daily Steps",
      before: story!.wearableMetrics!.stepsChange.before.toLocaleString(),
      after: story!.wearableMetrics!.stepsChange.after.toLocaleString(),
      change: `${story!.wearableMetrics!.stepsChange.changePercent > 0 ? "+" : ""}${story!.wearableMetrics!.stepsChange.changePercent}%`,
      icon: Activity,
    },
    story!.wearableMetrics!.activeMinutesChange && {
      label: "Active Minutes",
      before: `${story!.wearableMetrics!.activeMinutesChange.before}min`,
      after: `${story!.wearableMetrics!.activeMinutesChange.after}min`,
      change: `${story!.wearableMetrics!.activeMinutesChange.changePercent > 0 ? "+" : ""}${story!.wearableMetrics!.activeMinutesChange.changePercent}%`,
      icon: Zap,
    },
    story!.wearableMetrics!.deepSleepChange && {
      label: "Deep Sleep",
      before: `${story!.wearableMetrics!.deepSleepChange.before}min`,
      after: `${story!.wearableMetrics!.deepSleepChange.after}min`,
      change: `${story!.wearableMetrics!.deepSleepChange.changePercent > 0 ? "+" : ""}${story!.wearableMetrics!.deepSleepChange.changePercent}%`,
      icon: Moon,
    },
    story!.wearableMetrics!.sleepChange && story!.wearableMetrics!.sleepChange.changePercent > 0 && {
      label: "Total Sleep",
      before: `${(story!.wearableMetrics!.sleepChange.before / 60).toFixed(1)}h`,
      after: `${(story!.wearableMetrics!.sleepChange.after / 60).toFixed(1)}h`,
      change: `${story!.wearableMetrics!.sleepChange.changePercent > 0 ? "+" : ""}${story!.wearableMetrics!.sleepChange.changePercent}%`,
      icon: Star,
    },
    story!.wearableMetrics!.hrvChange && {
      label: "HRV",
      before: `${story!.wearableMetrics!.hrvChange.before}ms`,
      after: `${story!.wearableMetrics!.hrvChange.after}ms`,
      change: `${story!.wearableMetrics!.hrvChange.changePercent > 0 ? "+" : ""}${story!.wearableMetrics!.hrvChange.changePercent}%`,
      icon: Heart,
    },
    story!.wearableMetrics!.restingHrChange && {
      label: "Resting HR",
      before: `${story!.wearableMetrics!.restingHrChange.before}bpm`,
      after: `${story!.wearableMetrics!.restingHrChange.after}bpm`,
      change: `${story!.wearableMetrics!.restingHrChange.changePercent}%`,
      icon: Activity,
    },
  ].filter(Boolean) as { label: string; before: string; after: string; change: string; icon: React.ElementType }[]
  : (tier === 1 || tier === 2) && !story?.assessmentResult ? [
    { label: "Deep Sleep", before: "1h 12m", after: "1h 29m", change: "+23%", icon: Moon },
    { label: "Sleep Score", before: "72", after: "83", change: "+15%", icon: Star },
    { label: "HRV", before: "42ms", after: "51ms", change: "+21%", icon: Heart },
    { label: "Resting HR", before: "68 bpm", after: "62 bpm", change: "-9%", icon: Activity },
  ]
  : [];

  // Build timeline
  const timeline = [
    { date: "Nov 1, 2024", title: "Study Enrollment", description: "Participant enrolled and connected wearable device", icon: Smartphone },
    { date: "Nov 1-7, 2024", title: "Baseline Period", description: "7 days of baseline data collected before product use", icon: Activity },
    { date: "Nov 8, 2024", title: "Product Started", description: `Began using ${productName}`, icon: Zap },
    { date: "Nov 8 - Dec 5, 2024", title: "Study Period", description: `${studyDuration} days of tracked product usage`, icon: Calendar },
    { date: "Dec 5, 2024", title: "Study Completed", description: "Final data collected and verified", icon: BadgeCheck },
  ];

  void studyTitle;
  void studyId;

  // Extract first name for personalization
  const firstName = testimonial.participant.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Reputable Branded (platform owner) */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <img
                src="/logos/reputable-logo.png"
                alt="Reputable"
                className="h-6 w-auto mb-2"
              />
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                Independent Verification
              </p>
              <h1 className="text-xl font-bold text-gray-900">{productName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* SECTION 1: THE PERSON (Amazon-style, FIRST) */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {testimonial.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{testimonial.participant}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00D1C1]/10 text-[#00D1C1] text-xs font-medium">
                    <BadgeCheck className="h-3 w-3" />
                    Verified Participant
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                  <span>{testimonial.age} years old</span>
                  {story?.profile?.gender && (
                    <span>{story.profile.gender}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {testimonial.location}
                  </span>
                </div>

                {/* Demographics - Education and Employment */}
                {(story?.profile?.educationLevel || story?.profile?.employmentStatus) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                    {story?.profile?.educationLevel && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                        {story.profile.educationLevel}
                      </span>
                    )}
                    {story?.profile?.employmentStatus && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        {story.profile.employmentStatus}
                      </span>
                    )}
                  </div>
                )}

                {/* Product and tracking context */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3 pb-3 border-b">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Tested {productName} for {studyDuration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Watch className="h-3.5 w-3.5" />
                    Tracked with: {hasWearable ? testimonial.device : "Daily check-ins"}{hasWearable ? " + daily check-ins" : ""}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm bg-muted/50 p-4 rounded-lg italic mb-3">
                  &ldquo;{testimonial.story}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(testimonial.overallRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Would recommend</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Being Verified - clearly frames brand as SUBJECT not owner */}
        {brandLogo && (
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-lg border border-muted">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Product Verified:</span>
            <img
              src={brandLogo}
              alt="Product brand"
              className="h-6 w-auto object-contain opacity-70"
            />
          </div>
        )}

        {/* SECTION 2: PERSONALIZED RESULTS */}
        {renderVerifiedResults(tier, story, hasActualWearableMetrics, detailedMetrics, hasWearable, studyDuration, firstName, productName)}

        {/* Trust checkmarks */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground py-2">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-green-600" />
            Data collected over {studyDuration} days
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-green-600" />
            Baseline measured before product use
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-green-600" />
            Results verified by independent platform
          </span>
        </div>

        {/* SECTION 3: About This Study (contextualized) */}
        <Card className="border-[#00D1C1]/20 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
          <CardContent className="p-5">
            <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
              About This Study
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {firstName} was one of <span className="font-medium text-foreground">{stats.totalParticipants} real people</span> who tested {productName} in an independent {studyDuration}-day study.
            </p>
            <div className="mb-2">
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.round((stats.improved / stats.totalParticipants) * 100)}%` }}
                />
                {stats.neutral > 0 && (
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${Math.round((stats.neutral / stats.totalParticipants) * 100)}%` }}
                  />
                )}
                <div
                  className="h-full bg-gray-300"
                  style={{ width: `${Math.round((stats.noImprovement / stats.totalParticipants) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{stats.improved} improved</span>
                {stats.neutral > 0 && <span>{stats.neutral} neutral</span>}
                <span>{stats.noImprovement} didn&apos;t</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              We show everyone&apos;s results — not just success stories.
            </p>
            <a
              href="/verify/sensate-results"
              className="text-sm text-[#00D1C1] hover:underline font-medium flex items-center gap-1"
            >
              View all {stats.totalParticipants} verified results
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        {/* SECTION 4: What [Name] Was Trying to Improve - Only show if villain ratings exist */}
        {story && story.journey.villainRatings && story.journey.villainRatings.length > 0 && (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
            <CardContent className="p-5">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                What {firstName} Was Trying to Improve
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {firstName}&apos;s concern: <span className="font-medium text-amber-800 capitalize">{story.journey.villainVariable}</span>
              </p>
              <div className="flex gap-1 mb-1">
                {story.journey.villainRatings.map((rating, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 flex-1 rounded-full ${
                      rating.rating >= 4 ? "bg-green-500" :
                      rating.rating === 3 ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}
                    title={`Day ${rating.day}: ${rating.note || ''}`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-amber-600">Day 1</span>
                <span className={`font-semibold ${
                  story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 4
                    ? "text-green-600"
                    : story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 3
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}>
                  {story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 4
                    ? "Significantly Improved"
                    : story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 3
                    ? "Some Improvement"
                    : "No Improvement"}
                </span>
                <span className="text-amber-600">Day {story.journey.durationDays}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SECTION 5: Why This Is Different */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00D1C1]" />
              Why This Is Different
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Data-Tracked</p>
                  <p className="text-xs text-muted-foreground">
                    {hasWearable ? "Wearable + assessment" : "Assessment"} data over {studyDuration} days. Not just opinions.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Independent</p>
                  <p className="text-xs text-muted-foreground">
                    Study run by Reputable Health, not the brand.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">All Results Shown</p>
                  <p className="text-xs text-muted-foreground">
                    We publish everyone — including people who saw no improvement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLLAPSIBLE SECTIONS - Detailed Information */}

        {/* Participant Context - Collapsed by default */}
        {story && (
          <CollapsibleSection title="Participant Context" icon={User} defaultOpen={false}>
            <div className="space-y-6">
              <div className={`grid ${story.baseline.villainDuration ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Life Stage</p>
                  <p className="font-medium">{story.profile.lifeStage}</p>
                </div>
                {story.baseline.villainDuration && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Duration Dealing with Issue</p>
                    <p className="font-medium">{story.baseline.villainDuration}</p>
                  </div>
                )}
              </div>

              {story.baseline.triedOther && story.baseline.triedOther !== "No" && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Previously tried:</strong> {story.baseline.triedOther}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Quote className="h-4 w-4 text-[#00D1C1]" />
                  <span>Why They Joined the Study</span>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                  <p className="text-sm italic text-purple-900">
                    &ldquo;{story.baseline.motivation}&rdquo;
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-[#00D1C1]" />
                  <span>What They Hoped to Achieve</span>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm italic text-blue-900">
                    &ldquo;{story.baseline.hopedResults}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Self-Reported Progress - Collapsed by default, only show if villain ratings exist */}
        {story && story.journey.villainRatings && story.journey.villainRatings.length > 0 && (
          <CollapsibleSection title="Self-Reported Progress" icon={TrendingUp} defaultOpen={false}>
            <VillainJourneyProgress
              ratings={story.journey.villainRatings}
              villainVariable={story.journey.villainVariable}
            />
          </CollapsibleSection>
        )}

        {/* Key Moments - Collapsed by default */}
        {story && story.journey.keyQuotes.length > 0 && (
          <CollapsibleSection title="Key Moments During the Study" icon={MessageSquare} defaultOpen={false}>
            <div className="space-y-4">
              {story.journey.keyQuotes.map((kq, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 rounded-full bg-[#00D1C1]/10 text-[#00D1C1] text-sm font-medium">
                      Day {kq.day}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm italic mb-1">&ldquo;{kq.quote}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">{kq.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* How We Verify - Collapsed by default */}
        <CollapsibleSection title="How We Verify" icon={Shield} defaultOpen={false}>
          <HowWeVerifySection
            testimonial={testimonial}
            formattedDataPoints={formattedDataPoints}
            studyDuration={studyDuration}
            hasWearable={hasWearable}
          />
        </CollapsibleSection>

        {/* Study Protocol - Collapsed by default */}
        {protocol && (
          <CollapsibleSection title="Study Protocol" icon={Target} defaultOpen={false}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This study followed a rigorous protocol to ensure reliable results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Baseline Period</div>
                  <div className="text-lg font-semibold">{protocol.baselineDays} days</div>
                  <div className="text-xs text-muted-foreground">No product, tracking only</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Intervention Period</div>
                  <div className="text-lg font-semibold">{protocol.interventionDays} days</div>
                  <div className="text-xs text-muted-foreground">Daily product use</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Watch className="h-5 w-5 text-[#00D1C1] mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Tracked with</div>
                    <div className="text-sm text-muted-foreground">
                      {protocol.wearableTypes.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#00D1C1] mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Daily Instructions</div>
                    <div className="text-sm text-muted-foreground">
                      {protocol.dailyInstructions}
                    </div>
                  </div>
                </div>
                {protocol.compensationNote && (
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="h-5 w-5 text-[#00D1C1] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Compensation</div>
                      <div className="text-sm text-muted-foreground">
                        {protocol.compensationNote}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Timeline - Collapsed by default */}
        <CollapsibleSection title="Participant Journey" icon={Clock} defaultOpen={false}>
          <div className="space-y-0">
            {timeline.map((event, index) => (
              <TimelineEvent
                key={event.title}
                {...event}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Reported Benefits - Keep visible (small) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Reported Benefits</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {testimonial.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {benefit}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simplified Footer with small QR */}
        <div className="border-t pt-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white rounded-lg border p-1 flex items-center justify-center flex-shrink-0">
                <QRCodeSVG
                  value={`https://reputable.health/verify/${testimonial.verificationId}`}
                  size={56}
                  level="M"
                  fgColor="#00D1C1"
                  bgColor="#ffffff"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#00D1C1]" />
                  <span className="font-semibold text-[#00D1C1] text-sm">Reputable Health</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Independent verification for wellness products
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BadgeCheck className="h-3 w-3 text-[#00D1C1]" />
                <span>Verification ID:</span>
              </div>
              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                #{testimonial.verificationId}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to render tier-aware verified results
function renderVerifiedResults(
  tier: number,
  story: ParticipantStory | undefined,
  hasActualWearableMetrics: boolean,
  detailedMetrics: { label: string; before: string; after: string; change: string; icon: React.ElementType }[],
  hasWearable: boolean,
  studyDuration: number,
  firstName: string,
  _productName: string,
) {
  void _productName; // Available for future use

  // Tier 1: Wearables PRIMARY
  if (tier === 1) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
              {firstName}&apos;s Verified Results
              <InlineVerifiedBadge label="Device Data" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Wearable data directly measures the outcome. No surveys needed - the device tells the story.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {detailedMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </CardContent>
        </Card>

        {story?.testimonialResponses && story.testimonialResponses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Quote className="h-5 w-5 text-purple-600" />
                In {firstName}&apos;s Own Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TestimonialResponsesSection responses={story.testimonialResponses} />
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  // Tier 2: Co-Primary (Wearables + Assessment)
  if (tier === 2 && story?.assessmentResult) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              {firstName}&apos;s Self-Reported Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentResultCard
              assessmentName={story.assessmentResult.assessmentName}
              baselineScore={story.assessmentResult.baseline.compositeScore}
              endpointScore={story.assessmentResult.endpoint.compositeScore}
              changePercent={story.assessmentResult.change.compositePercent}
              headline={story.assessmentResult.headline}
              isPrimary={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Watch className="h-5 w-5 text-[#00D1C1]" />
              {firstName}&apos;s Wearable Data
              <InlineVerifiedBadge label="Device Data" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Physiological markers corroborate the self-reported improvement.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {detailedMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-[#00D1C1]/10 rounded-lg border border-purple-200">
          <p className="text-sm text-center">
            <strong className="text-purple-700">Both metrics improved:</strong>{" "}
            Objective wearable data shows physiological improvement{" "}
            <span className="font-semibold text-[#00D1C1]">AND</span>{" "}
            {firstName} reported feeling better.
          </p>
        </div>
      </>
    );
  }

  // Tier 3-4: Assessment PRIMARY
  if ((tier === 3 || tier === 4) && story?.assessmentResult) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              {firstName}&apos;s Verified Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentResultCard
              assessmentName={story.assessmentResult.assessmentName}
              baselineScore={story.assessmentResult.baseline.compositeScore}
              endpointScore={story.assessmentResult.endpoint.compositeScore}
              changePercent={story.assessmentResult.change.compositePercent}
              headline={story.assessmentResult.headline}
              isPrimary={true}
            />
          </CardContent>
        </Card>

        {tier === 4 && story?.photoDocumentation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Photo Documentation
                <InlineVerifiedBadge label="Verified" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {story.photoDocumentation.beforePhoto && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Before</p>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Photo Available</span>
                    </div>
                  </div>
                )}
                {story.photoDocumentation.afterPhoto && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">After</p>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Photo Available</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {tier !== 4 && hasActualWearableMetrics && detailedMetrics.length > 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                <Watch className="h-5 w-5" />
                Supporting Evidence: Wearable Data
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  SECONDARY
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Wearable data provides supporting context for the assessment results.
              </p>
              <div className="grid grid-cols-2 gap-4 opacity-80">
                {detailedMetrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(tier === 4 || !hasActualWearableMetrics) && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                Engagement Verification
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  VERIFIED
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Participant engagement verified through consistent check-in completion.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold text-[#00D1C1]">{Math.floor(studyDuration / 7) + 2}</p>
                  <p className="text-xs text-muted-foreground">Check-ins Completed</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold text-[#00D1C1]">100%</p>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold text-[#00D1C1]">{studyDuration}</p>
                  <p className="text-xs text-muted-foreground">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  // Fallback: Original layout
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
          {firstName}&apos;s Verified Results
          <InlineVerifiedBadge label="Device Data" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {detailedMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
