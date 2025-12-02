"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Check,
  Star,
  BadgeCheck,
  Clock,
  Watch,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Share2,
  Smartphone,
  Activity,
  Heart,
  Moon,
  Zap,
} from "lucide-react";
import { MockTestimonial } from "@/lib/mock-data";

// Reputable Health Seal Component
function ReputableSeal({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { outer: "h-16 w-16", shield: "h-8 w-8", check: "h-4 w-4" },
    md: { outer: "h-24 w-24", shield: "h-12 w-12", check: "h-6 w-6" },
    lg: { outer: "h-32 w-32", shield: "h-16 w-16", check: "h-8 w-8" },
  };

  return (
    <div className={`${sizes[size].outer} relative`}>
      {/* Outer ring animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00D1C1] to-[#00A89D] animate-pulse opacity-20" />
      {/* Main circle */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center shadow-lg">
        <div className="relative">
          <Shield className={`${sizes[size].shield} text-white`} />
          <Check className={`${sizes[size].check} text-white absolute inset-0 m-auto`} />
        </div>
      </div>
      {/* Verified badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 shadow-md border border-[#00D1C1]/20">
        <span className="text-[10px] font-bold text-[#00D1C1] uppercase tracking-wide">Verified</span>
      </div>
    </div>
  );
}

// Timeline event component
function TimelineEvent({
  date,
  title,
  description,
  icon: Icon,
  isLast = false,
}: {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#00D1C1]" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#00D1C1]/20 my-2" />}
      </div>
      <div className="flex-1 pb-6">
        <p className="text-xs text-muted-foreground">{date}</p>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Metric card with before/after
function MetricCard({
  label,
  before,
  after,
  change,
  icon: Icon,
}: {
  label: string;
  before: string;
  after: string;
  change: string;
  icon: React.ElementType;
}) {
  const isPositive = change.startsWith("+") || change.startsWith("-");

  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#00D1C1]" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Before</p>
          <p className="text-lg font-semibold text-muted-foreground">{before}</p>
        </div>
        <div className="text-center px-4">
          <TrendingUp className="h-5 w-5 text-[#00D1C1] mx-auto" />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">After</p>
          <p className="text-lg font-semibold">{after}</p>
        </div>
      </div>
      <div className="text-center">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
          isPositive ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}

interface VerificationPageProps {
  testimonial: MockTestimonial;
  studyTitle: string;
  productName: string;
  studyDuration: number;
  studyId: string;
}

export function VerificationPage({
  testimonial,
  studyTitle,
  productName,
  studyDuration,
  studyId,
}: VerificationPageProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // Mock timeline data
  const timeline = [
    {
      date: "Nov 1, 2024",
      title: "Study Enrollment",
      description: "Participant enrolled and connected wearable device",
      icon: Smartphone,
    },
    {
      date: "Nov 1-7, 2024",
      title: "Baseline Period",
      description: "7 days of baseline data collected before product use",
      icon: Activity,
    },
    {
      date: "Nov 8, 2024",
      title: "Product Started",
      description: `Began using ${productName}`,
      icon: Zap,
    },
    {
      date: "Nov 8 - Dec 5, 2024",
      title: "Study Period",
      description: `${studyDuration} days of tracked product usage`,
      icon: Calendar,
    },
    {
      date: "Dec 5, 2024",
      title: "Study Completed",
      description: "Final data collected and verified",
      icon: BadgeCheck,
    },
  ];

  // Mock detailed metrics with before/after
  const detailedMetrics = [
    { label: "Deep Sleep", before: "1h 12m", after: "1h 29m", change: "+23%", icon: Moon },
    { label: "Sleep Score", before: "72", after: "83", change: "+15%", icon: Star },
    { label: "HRV", before: "42ms", after: "51ms", change: "+21%", icon: Heart },
    { label: "Resting HR", before: "68 bpm", after: "62 bpm", change: "-9%", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#00D1C1]">Reputable Health</p>
                <p className="text-xs text-muted-foreground">Third-Party Verification</p>
              </div>
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

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Verification Hero */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <ReputableSeal size="lg" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Verified Study Result</h1>
            <p className="text-muted-foreground">
              This result has been independently verified by Reputable Health
            </p>
          </div>

          {/* Verification ID */}
          <div className="inline-flex items-center gap-2 bg-[#00D1C1]/10 rounded-full px-4 py-2">
            <BadgeCheck className="h-4 w-4 text-[#00D1C1]" />
            <span className="text-sm font-medium">Verification ID: #{testimonial.verificationId}</span>
          </div>
        </div>

        {/* Study Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xl font-bold">
                {testimonial.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{testimonial.participant}</h2>
                  <BadgeCheck className="h-5 w-5 text-[#00D1C1]" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {testimonial.age} years old
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {testimonial.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Watch className="h-4 w-4" />
                    {testimonial.device}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(testimonial.overallRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{testimonial.overallRating}</span>
                </div>
                <p className="text-sm bg-muted/50 p-4 rounded-lg italic">
                  &ldquo;{testimonial.story}&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">{studyDuration}</p>
                <p className="text-sm text-muted-foreground">Days in Study</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">100%</p>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">{studyDuration * 24}</p>
                <p className="text-sm text-muted-foreground">Hours of Data</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-[#00D1C1]/5 rounded-lg border border-[#00D1C1]/20">
              <p className="text-sm">
                <strong>Study:</strong> {studyTitle}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Product:</strong> {productName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verified Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00D1C1]" />
              Verified Results
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

        {/* Reported Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reported Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {testimonial.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  {benefit}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Participant Journey Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#00D1C1]" />
              Participant Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {timeline.map((event, index) => (
                <TimelineEvent
                  key={event.title}
                  {...event}
                  isLast={index === timeline.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Methodology (Collapsible) */}
        <Card>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00D1C1]" />
              <span className="font-semibold">Verification Methodology</span>
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
                  <h4 className="font-medium text-foreground mb-1">Data Collection</h4>
                  <p>
                    All biometric data was collected directly from the participant&apos;s {testimonial.device} via
                    secure API integration. Data was synced automatically every 24 hours throughout the study period.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Baseline Comparison</h4>
                  <p>
                    Results are compared against a 7-day baseline period collected before product use began.
                    This ensures accurate before/after comparison.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Verification Process</h4>
                  <p>
                    Reputable Health independently verified the authenticity of all data points.
                    No data was provided or modified by the product manufacturer.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Privacy</h4>
                  <p>
                    Participant identity is protected. Only anonymized health metrics are displayed.
                    Full data access requires participant consent.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Raw Data Preview (Collapsible) */}
        <Card>
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#00D1C1]" />
              <span className="font-semibold">Raw Data Sample</span>
            </div>
            {showRawData ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          {showRawData && (
            <CardContent className="pt-0 border-t">
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-300">
{`{
  "verification_id": "${testimonial.verificationId}",
  "study_id": "${studyId}",
  "participant_id": "anon_${testimonial.id}",
  "device": "${testimonial.device}",
  "data_points": 672,
  "baseline_period": {
    "start": "2024-11-01",
    "end": "2024-11-07",
    "avg_deep_sleep_min": 72,
    "avg_sleep_score": 72
  },
  "study_period": {
    "start": "2024-11-08",
    "end": "2024-12-05",
    "avg_deep_sleep_min": 89,
    "avg_sleep_score": 83
  },
  "verified_at": "2024-12-05T18:32:00Z",
  "verification_hash": "sha256:7f83b1657..."
}`}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is a sample of the verification data. Full data export available upon request.
              </p>
            </CardContent>
          )}
        </Card>

        {/* QR Code for Mobile */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white rounded-lg border p-2 flex items-center justify-center">
                <QRCodeSVG
                  value={`https://reputable.health/verify/${testimonial.verificationId}`}
                  size={80}
                  level="M"
                  fgColor="#00D1C1"
                  bgColor="#ffffff"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Scan to Verify</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Scan this QR code with your phone to verify this result on reputable.health
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  reputable.health/verify/{testimonial.verificationId}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#00D1C1]" />
            <span className="font-semibold text-[#00D1C1]">Reputable Health</span>
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

// Compact verification badge for embedding in story cards
export function VerificationBadge({
  verificationId,
  onClick,
}: {
  verificationId: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D1C1]/10 hover:bg-[#00D1C1]/20 border border-[#00D1C1]/20 transition-colors group"
    >
      <div className="relative">
        <Shield className="h-3.5 w-3.5 text-[#00D1C1]" />
        <Check className="absolute inset-0 m-auto h-1.5 w-1.5 text-[#00D1C1]" />
      </div>
      <span className="text-xs font-medium text-[#00D1C1]">
        Verified #{verificationId}
      </span>
      <ExternalLink className="h-3 w-3 text-[#00D1C1] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
