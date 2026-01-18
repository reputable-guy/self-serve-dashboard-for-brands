"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  BarChart3,
  Calendar,
  Smartphone,
  Zap,
  Clock,
  Info,
  Users,
} from "lucide-react";
import type { MockTestimonial, ParticipantStory, StudyProtocol } from "@/lib/types";

// Import sub-components from the verification module
import { InlineVerifiedBadge } from "./badges";
import { MetricCard } from "./metrics";
import { TimelineEvent } from "./journey";
import { HowWeVerifySection } from "./trust-stack";

// Collapsible section component for progressive disclosure
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-dashed">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t pt-4">{children}</div>}
    </Card>
  );
}

interface VerificationPageProps {
  testimonial: MockTestimonial;
  studyTitle: string;
  productName: string;
  studyDuration: number;
  studyId: string;
  story?: ParticipantStory;
  hasWearable?: boolean;
  /** Product description for standalone pages */
  productDescription?: string;
  /** Product image URL for standalone pages */
  productImage?: string;
  /** Study protocol details for transparency */
  protocol?: StudyProtocol;
}

export function VerificationPage({
  testimonial,
  studyTitle,
  productName,
  studyDuration,
  studyId,
  story,
  hasWearable: hasWearableProp,
  productDescription,
  productImage,
  protocol,
}: VerificationPageProps) {
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
  void productDescription;
  void productImage;

  // Get the primary metric for hero display
  const primaryMetrics: { label: string; change: string; before: string; after: string; icon: React.ElementType }[] = [];

  if (hasActualWearableMetrics && story?.wearableMetrics) {
    if (story.wearableMetrics.hrvChange) {
      primaryMetrics.push({
        label: "HRV",
        change: `${story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}${story.wearableMetrics.hrvChange.changePercent}%`,
        before: `${story.wearableMetrics.hrvChange.before}ms`,
        after: `${story.wearableMetrics.hrvChange.after}ms`,
        icon: Heart,
      });
    }
    if (story.wearableMetrics.deepSleepChange) {
      primaryMetrics.push({
        label: "Deep Sleep",
        change: `${story.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}${story.wearableMetrics.deepSleepChange.changePercent}%`,
        before: `${story.wearableMetrics.deepSleepChange.before}min`,
        after: `${story.wearableMetrics.deepSleepChange.after}min`,
        icon: Moon,
      });
    }
  }

  // NPS score if available
  const npsScore = story?.finalTestimonial?.overallRating || testimonial.overallRating;

  // Check if this is a "no improvement" participant
  const showedImprovement = primaryMetrics.length > 0 && primaryMetrics.some(m => m.change.startsWith("+"));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Slim */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-[#00D1C1] text-sm">Reputable</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* SECTION 1: RESULT-FIRST HERO */}
        <Card className={`border-2 ${showedImprovement ? "border-green-200 bg-gradient-to-br from-green-50 to-white" : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"}`}>
          <CardContent className="p-6">
            {/* Metrics Grid - THE MAIN ATTRACTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {primaryMetrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="text-center p-4 bg-white rounded-xl border shadow-sm">
                  <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.change.startsWith("+") ? "text-green-600" : metric.change.startsWith("-") ? "text-red-500" : "text-muted-foreground"}`} />
                  <p className={`text-3xl md:text-4xl font-bold ${metric.change.startsWith("+") ? "text-green-600" : metric.change.startsWith("-") ? "text-red-500" : "text-muted-foreground"}`}>
                    {metric.change}
                  </p>
                  <p className="text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.before} → {metric.after}
                  </p>
                </div>
              ))}
              {npsScore && (
                <div className="text-center p-4 bg-white rounded-xl border shadow-sm">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {npsScore}/10
                  </p>
                  <p className="text-sm font-medium text-foreground">Would Recommend</p>
                  <p className="text-xs text-muted-foreground mt-1">NPS Score</p>
                </div>
              )}
            </div>

            {/* Verification Badge Line */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-4 w-4 text-[#00D1C1]" />
                <span>Reputable verified</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>{studyDuration}-day study</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Watch className="h-3 w-3" />
                {testimonial.device || "Oura Ring"} data
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: CONDENSED PARTICIPANT + QUOTE */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {testimonial.initials}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + Verified Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{testimonial.participant}</h2>
                  <InlineVerifiedBadge />
                </div>

                {/* Demographics - Compact */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{story?.profile?.ageRange || `${testimonial.age} years old`}</span>
                  {story?.profile?.gender && (
                    <>
                      <span>•</span>
                      <span>{story.profile.gender}</span>
                    </>
                  )}
                  {story?.profile?.educationLevel && (
                    <>
                      <span>•</span>
                      <span>{story.profile.educationLevel}</span>
                    </>
                  )}
                </div>

                {/* Quote - The Key Insight */}
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-[#00D1C1]">
                  <p className="text-sm italic">
                    &ldquo;{story?.finalTestimonial?.quote || testimonial.story}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: STUDY CONTEXT - Honesty Emphasis */}
        <div className="p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              <span className="text-sm">
                <span className="font-medium">One of 7 real participants</span>
                <span className="text-muted-foreground"> • </span>
                <span className="text-green-600 font-medium">5 improved</span>
                <span className="text-muted-foreground">, </span>
                <span className="text-slate-500">2 didn&apos;t</span>
              </span>
            </div>
            <a
              href={`/verify/${testimonial.verificationId}/results`}
              className="text-sm text-[#00D1C1] hover:underline font-medium flex items-center gap-1"
            >
              View all results
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            We show everyone, not just success stories. Same rebate given regardless of results.
          </p>
        </div>

        {/* SECTION 4: CONDENSED JOURNEY */}
        {story && story.journey.villainRatings.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#00D1C1]" />
                <span className="font-medium">Progress Over {story.journey.durationDays} Days</span>
              </div>

              {/* Compact Progress Bar */}
              <div className="mb-4">
                <div className="flex gap-1">
                  {story.journey.villainRatings.map((rating, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full ${
                        rating.rating >= 4 ? "bg-green-500" :
                        rating.rating === 3 ? "bg-yellow-400" :
                        "bg-red-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Day 1</span>
                  <span>Day {story.journey.durationDays}</span>
                </div>
              </div>

              {/* 3-Point Journey Summary */}
              {story.journey.villainRatings.length >= 2 && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 font-medium">Start</p>
                    <p className="text-xs text-red-800 line-clamp-2 mt-1">
                      {story.journey.villainRatings[0].note || "Baseline"}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Mid-point</p>
                    <p className="text-xs text-yellow-800 line-clamp-2 mt-1">
                      {story.journey.villainRatings[Math.floor(story.journey.villainRatings.length / 2)]?.note || "In progress"}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">End</p>
                    <p className="text-xs text-green-800 line-clamp-2 mt-1">
                      {story.journey.villainRatings[story.journey.villainRatings.length - 1]?.note || "Complete"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* SECTION 5: COLLAPSIBLE - How We Verify */}
        <CollapsibleSection title="How We Verify" icon={Info} defaultOpen={false}>
          <HowWeVerifySection
            testimonial={testimonial}
            formattedDataPoints={formattedDataPoints}
            studyDuration={studyDuration}
            hasWearable={hasWearable}
          />
        </CollapsibleSection>

        {/* SECTION 6: COLLAPSIBLE - Study Protocol */}
        {protocol && (
          <CollapsibleSection title="Study Protocol" icon={Shield} defaultOpen={false}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-muted-foreground">Baseline</p>
                <p className="font-semibold text-emerald-800">{protocol.baselineDays} days</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-muted-foreground">Intervention</p>
                <p className="font-semibold text-emerald-800">{protocol.interventionDays} days</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-emerald-800">{protocol.baselineDays + protocol.interventionDays} days</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-muted-foreground">Wearable</p>
                <p className="font-semibold text-emerald-800">{protocol.wearableTypes.join(", ")}</p>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg mb-3">
              <p className="text-xs text-muted-foreground mb-1">Daily Instructions</p>
              <p className="text-sm">{protocol.dailyInstructions}</p>
            </div>
            {protocol.compensationNote && (
              <p className="text-xs text-emerald-700 flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" />
                {protocol.compensationNote}
              </p>
            )}
          </CollapsibleSection>
        )}

        {/* SECTION 7: COLLAPSIBLE - Full Timeline */}
        <CollapsibleSection title="Full Timeline" icon={Clock} defaultOpen={false}>
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

        {/* SECTION 8: COLLAPSIBLE - Detailed Wearable Data (if tier-relevant) */}
        {hasActualWearableMetrics && detailedMetrics.length > 0 && (
          <CollapsibleSection title="Detailed Wearable Data" icon={BarChart3} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-4">
              {detailedMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* SIMPLIFIED FOOTER with small QR */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white rounded-lg border p-1 flex items-center justify-center flex-shrink-0">
                <QRCodeSVG
                  value={`https://reputable.health/verify/${testimonial.verificationId}`}
                  size={40}
                  level="M"
                  fgColor="#00D1C1"
                  bgColor="#ffffff"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-[#00D1C1]" />
                  <span className="font-semibold text-sm text-[#00D1C1]">Reputable</span>
                </div>
                <code className="text-xs text-muted-foreground">
                  #{testimonial.verificationId}
                </code>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-right max-w-[200px]">
              Independent verification for wellness products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
