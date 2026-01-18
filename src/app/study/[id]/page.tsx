/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Check,
  Star,
  BadgeCheck,
  Users,
  Clock,
  Watch,
  TrendingUp,
  ExternalLink,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  Heart,
  Moon,
  Zap,
} from "lucide-react";
import { useStudies, Study } from "@/lib/studies-store";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { DEVICE_LABELS } from "@/lib/constants";
import { generateStudyPDF } from "@/components/pdf-report-generator";
import { SAMPLE_STORIES_BY_CATEGORY } from "@/lib/sample-stories";

// Mock study data for fixed study IDs (matches admin pages)
const MOCK_STUDIES: Record<string, Partial<Study> & { category: string }> = {
  "study-1": {
    id: "study-1",
    studyTitle: "Better Sleep Study",
    productName: "SleepWell Premium",
    productDescription: "Natural sleep supplement formulated to improve sleep quality and duration",
    hookQuestion: "How effective is SleepWell Premium for improving sleep quality?",
    durationDays: "28",
    requiredDevice: "any",
    category: "sleep",
  },
  "study-2": {
    id: "study-2",
    studyTitle: "Recovery Enhancement Study",
    productName: "Recovery Plus",
    productDescription: "Advanced recovery formula for post-workout muscle recovery",
    hookQuestion: "Does Recovery Plus actually speed up recovery?",
    durationDays: "28",
    requiredDevice: "any",
    category: "recovery",
  },
  "study-3": {
    id: "study-3",
    studyTitle: "Stress Management Study",
    productName: "Calm Focus Formula",
    productDescription: "Natural stress relief supplement for better focus and calm",
    hookQuestion: "Can Calm Focus Formula reduce daily stress levels?",
    durationDays: "28",
    requiredDevice: "any",
    category: "stress",
  },
  "study-4": {
    id: "study-4",
    studyTitle: "Energy & Vitality Study",
    productName: "Energy Boost Complex",
    productDescription: "All-day energy supplement without jitters or crashes",
    hookQuestion: "Does Energy Boost Complex provide sustained energy?",
    durationDays: "28",
    requiredDevice: "none",
    category: "energy",
  },
  "study-5": {
    id: "study-5",
    studyTitle: "Gut Health Study",
    productName: "Gut Health Pro",
    productDescription: "Probiotic blend for digestive wellness and gut balance",
    hookQuestion: "How effective is Gut Health Pro for digestive comfort?",
    durationDays: "28",
    requiredDevice: "none",
    category: "gut",
  },
  "study-6": {
    id: "study-6",
    studyTitle: "Focus & Concentration Study",
    productName: "Focus Flow",
    productDescription: "Nootropic formula for enhanced mental clarity and focus",
    hookQuestion: "Can Focus Flow improve concentration and mental performance?",
    durationDays: "28",
    requiredDevice: "none",
    category: "focus",
  },
};

// Reputable Health Seal Component
function ReputableSeal() {
  return (
    <div className="h-28 w-28 relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00D1C1] to-[#00A89D] animate-pulse opacity-20" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center shadow-lg">
        <div className="relative">
          <Shield className="h-14 w-14 text-white" />
          <Check className="h-7 w-7 text-white absolute inset-0 m-auto" />
        </div>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md border border-[#00D1C1]/20">
        <span className="text-xs font-bold text-[#00D1C1] uppercase tracking-wide">Verified</span>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border p-4 text-center">
      <div className="h-10 w-10 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center mx-auto mb-2">
        <Icon className="h-5 w-5 text-[#00D1C1]" />
      </div>
      <p className="text-2xl font-bold text-[#00D1C1]">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof MOCK_TESTIMONIALS)[0];
}) {
  return (
    <Link
      href={`/verify/${testimonial.verificationId}`}
      className="bg-white rounded-xl border p-4 hover:border-[#00D1C1]/50 transition-colors block"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {testimonial.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{testimonial.participant}</span>
            <BadgeCheck className="h-4 w-4 text-[#00D1C1] flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.floor(testimonial.overallRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{testimonial.overallRating}</span>
          </div>
        </div>
      </div>

      {/* Key Metric */}
      <div className="bg-[#00D1C1]/10 rounded-lg p-2 text-center mb-3">
        <p className="text-xl font-bold text-[#00D1C1]">{testimonial.metrics[0].value}</p>
        <p className="text-xs text-muted-foreground">{testimonial.metrics[0].label}</p>
      </div>

      {/* Quote snippet */}
      <p className="text-sm text-muted-foreground italic line-clamp-2">
        &ldquo;{testimonial.story.slice(0, 80)}...&rdquo;
      </p>

      {/* Verification link */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="flex items-center gap-1 text-xs text-[#00D1C1]">
          <Shield className="h-3 w-3" />
          <span>#{testimonial.verificationId}</span>
        </div>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
    </Link>
  );
}

export default function PublicStudyPage() {
  const params = useParams();
  const { getStudy } = useStudies();
  const [showMethodology, setShowMethodology] = useState(false);

  const studyId = params.id as string;

  // Try to get study from store first, then fall back to mock data
  const storeStudy = getStudy(studyId);
  const mockStudy = MOCK_STUDIES[studyId];
  const study = storeStudy || (mockStudy ? {
    ...mockStudy,
    productImage: "",
    productUrl: "",
    featuredTestimonialIds: [],
  } as Study : undefined);

  // Get category for the study (for sample stories)
  const category = mockStudy?.category || "sleep";
  const sampleStory = SAMPLE_STORIES_BY_CATEGORY[category];

  // Create testimonials from sample story data if available
  const categoryTestimonials = sampleStory ? [{
    id: 1,
    participant: sampleStory.story.name,
    initials: sampleStory.story.initials,
    age: parseInt(sampleStory.story.profile.ageRange.split("-")[0]) + 2,
    location: "Sample City, ST",
    completedDay: sampleStory.story.journey.durationDays,
    overallRating: sampleStory.story.overallRating,
    story: sampleStory.story.testimonialResponses?.[1]?.response ||
           `This product made a real difference for my ${sampleStory.villainVariable}.`,
    metrics: sampleStory.story.tier === 1
      ? [
          { label: "Deep Sleep", value: `+${sampleStory.story.wearableMetrics?.deepSleepChange?.changePercent || 20}%`, positive: true },
          { label: "HRV", value: `+${sampleStory.story.wearableMetrics?.hrvChange?.changePercent || 15}%`, positive: true },
        ]
      : [
          { label: sampleStory.categoryLabel, value: `+${sampleStory.story.assessmentResult?.change.compositePercent || 50}%`, positive: true },
        ],
    benefits: ["Improved " + sampleStory.villainVariable, "Better overall wellbeing"],
    verified: true,
    verificationId: sampleStory.story.verificationId,
    device: sampleStory.story.wearableMetrics?.device,
  }] : MOCK_TESTIMONIALS;

  // Use category testimonials for mock studies, otherwise use stored study testimonials
  const displayTestimonials = mockStudy ? categoryTestimonials : MOCK_TESTIMONIALS;

  // Calculate aggregate stats from testimonials
  const avgRating =
    displayTestimonials.reduce((sum, t) => sum + t.overallRating, 0) / displayTestimonials.length;
  const avgImprovement = sampleStory?.story.tier === 1
    ? `+${sampleStory.story.wearableMetrics?.deepSleepChange?.changePercent || 18}%`
    : `+${sampleStory?.story.assessmentResult?.change.compositePercent || 18}%`;
  const completionRate = "87%";

  const studyUrl = typeof window !== "undefined" ? `${window.location.origin}/study/${studyId}` : "";

  if (!study) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">Study Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find this study. It may have been removed or the link may be incorrect.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const device = DEVICE_LABELS[study.requiredDevice] || "Any Device";

  const handleDownloadPDF = async () => {
    // Use featured testimonials if set, otherwise all
    const featuredIds = study.featuredTestimonialIds || [];
    const featured = featuredIds.length > 0
      ? displayTestimonials.filter((t) => featuredIds.includes(String(t.id)))
      : displayTestimonials;

    await generateStudyPDF({
      study,
      featuredTestimonials: featured,
      allTestimonials: displayTestimonials,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logos/reputable-logo-dark.png"
                alt="Reputable Health"
                width={320}
                height={80}
                className="h-10 w-auto"
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <ReputableSeal />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{study.studyTitle}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {study.hookQuestion}
            </p>
          </div>

          {/* Study Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#00D1C1]" />
              <span><strong>{displayTestimonials.length}</strong> verified participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#00D1C1]" />
              <span><strong>{study.durationDays}</strong> day study</span>
            </div>
            <div className="flex items-center gap-2">
              <Watch className="h-4 w-4 text-[#00D1C1]" />
              <span>{device}</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {study.productImage ? (
                <img
                  src={study.productImage}
                  alt={study.productName}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{study.productName}</h2>
                <p className="text-muted-foreground mt-1">{study.productDescription}</p>
                {study.productUrl && (
                  <a
                    href={study.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#00D1C1] hover:underline flex items-center gap-1 mt-2"
                  >
                    View Product <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aggregate Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00D1C1]" />
              Aggregate Study Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <MetricCard
                icon={Star}
                label="Avg. Rating"
                value={avgRating.toFixed(1)}
                description="out of 5 stars"
              />
              <MetricCard
                icon={TrendingUp}
                label="Avg. Improvement"
                value={avgImprovement}
                description="in tracked metrics"
              />
              <MetricCard
                icon={BadgeCheck}
                label="Completion Rate"
                value={completionRate}
                description="finished full study"
              />
              <MetricCard
                icon={Users}
                label="Verified Results"
                value={String(displayTestimonials.length)}
                description="participants"
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Improvements */}
        <Card>
          <CardHeader>
            <CardTitle>Key Improvements Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#00D1C1]/5 rounded-lg border border-[#00D1C1]/20">
                <Moon className="h-6 w-6 text-[#00D1C1] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#00D1C1]">+22%</p>
                <p className="text-sm text-muted-foreground">Deep Sleep</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Heart className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">+17%</p>
                <p className="text-sm text-muted-foreground">HRV</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-500">+14%</p>
                <p className="text-sm text-muted-foreground">Sleep Score</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Zap className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-500">+12%</p>
                <p className="text-sm text-muted-foreground">Energy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Reported Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Most Reported Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { benefit: "Wake up feeling refreshed", percent: 78 },
                { benefit: "Fall asleep faster", percent: 65 },
                { benefit: "Better recovery", percent: 52 },
                { benefit: "More energy throughout the day", percent: 48 },
                { benefit: "Reduced stress", percent: 41 },
              ].map((item) => (
                <div key={item.benefit} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{item.benefit}</span>
                      <span className="text-sm font-medium">{item.percent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D1C1] rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verified Participants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Verified Participant Results</h2>
            <p className="text-sm text-muted-foreground">
              Click any card to view full verification details
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Methodology (Collapsible) */}
        <Card>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00D1C1]" />
              <span className="font-semibold">Study Methodology & Verification</span>
            </div>
            {showMethodology ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          {showMethodology && (
            <CardContent className="pt-0 border-t">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Study Design</h4>
                  <p>
                    This {study.durationDays}-day observational study tracked participants using their personal
                    wearable devices. All participants were existing customers who purchased the product independently.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Data Collection</h4>
                  <p>
                    Biometric data was collected directly from participants&apos; {device} devices via secure API
                    integration. A 7-day baseline period was recorded before product use began.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Verification Process</h4>
                  <p>
                    Reputable Health independently verified all data points. Each participant&apos;s results link
                    to a dedicated verification page with detailed metrics and data provenance.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Limitations</h4>
                  <p>
                    This is an observational study without a control group. Results may be influenced by participant
                    expectations and lifestyle factors. Individual results may vary.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* QR Code & Share */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-28 w-28 bg-white rounded-lg border p-2 flex items-center justify-center flex-shrink-0">
                <QRCodeSVG
                  value={studyUrl}
                  size={96}
                  level="M"
                  fgColor="#00D1C1"
                  bgColor="#ffffff"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Share This Study</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Scan the QR code or share the link to let others explore these verified results.
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block mb-2 break-all">
                  {studyUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(studyUrl)}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/logos/reputable-logo-dark-compact.png"
              alt="Reputable Health"
              width={240}
              height={58}
              className="h-8 w-auto"
              unoptimized
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Independent verification for wellness products
          </p>
          <a href="#" className="text-sm text-[#00D1C1] hover:underline flex items-center justify-center gap-1 mt-2">
            Learn more about our verification process
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
