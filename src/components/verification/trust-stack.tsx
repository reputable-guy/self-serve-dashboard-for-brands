"use client";

import { useState } from "react";
import { Check, X, Shield, ChevronUp, ChevronDown } from "lucide-react";
import type { MockTestimonial } from "@/lib/types";

/**
 * Trust Stack Pillar - individual pillar in the trust stack
 */
export function TrustStackPillar({
  icon,
  title,
  description,
  variant = "default",
}: {
  icon: string;
  title: string;
  description: string;
  variant?: "default" | "muted";
}) {
  const bgClass = variant === "muted"
    ? "bg-gray-50 border-gray-200"
    : "bg-green-50 border-green-200";
  const titleClass = variant === "muted"
    ? "text-gray-700"
    : "text-green-900";
  const textClass = variant === "muted"
    ? "text-gray-600"
    : "text-green-800";

  return (
    <div className={`p-4 rounded-lg border ${bgClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className={`font-medium ${titleClass}`}>{title}</span>
      </div>
      <p className={`text-sm ${textClass}`}>{description}</p>
    </div>
  );
}

/**
 * Comparison Table showing how Reputable differs from other review sources
 */
export function ComparisonTable() {
  const comparisons = [
    { feature: "Real person verified", amazon: false, brand: false, reputable: true },
    { feature: "Real participation tracked", amazon: false, brand: false, reputable: true },
    { feature: "No incentive to lie", amazon: false, brand: false, reputable: true },
    { feature: "Independent collection", amazon: false, brand: false, reputable: true },
    { feature: "Brand cannot edit results", amazon: false, brand: false, reputable: true },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-muted-foreground">Amazon Reviews</div>
            </th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-muted-foreground">Brand Testimonials</div>
            </th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-[#00D1C1]">Reputable</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((row) => (
            <tr key={row.feature} className="border-b last:border-0">
              <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
              <td className="py-3 px-4 text-center">
                {row.amazon ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.brand ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.reputable ? (
                  <Check className="h-4 w-4 text-[#00D1C1] mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * How We Verify Section - detailed expandable content for skeptics
 */
export function HowWeVerifySection({
  testimonial,
  formattedDataPoints,
  studyDuration,
  hasWearable = true,
}: {
  testimonial: MockTestimonial;
  formattedDataPoints: string;
  studyDuration: number;
  hasWearable?: boolean;
}) {
  const [showRawData, setShowRawData] = useState(false);

  // Build Trust Stack pillars based on participant type
  const trustStackPillars = hasWearable ? [
    {
      icon: "👤",
      title: "Real Person",
      description: "Identity verified via account authentication. Not a bot, paid reviewer, or brand employee.",
    },
    {
      icon: "⌚",
      title: "Real Device",
      description: `${testimonial.device} connected via API. ${formattedDataPoints} data points collected automatically.`,
    },
    {
      icon: "📅",
      title: "Real Participation",
      description: `${studyDuration} days active participation. Rebate given regardless of feedback.`,
    },
    {
      icon: "📊",
      title: "Real Results",
      description: "Device data collected automatically. Self-reports given with no incentive to exaggerate. The brand cannot edit any results.",
    },
  ] : [
    {
      icon: "👤",
      title: "Real Person",
      description: "Identity verified via account authentication. Not a bot, paid reviewer, or brand employee.",
    },
    {
      icon: "📋",
      title: "Structured Assessment",
      description: "Validated questionnaire completed at baseline and endpoint. Scientifically-backed methodology.",
    },
    {
      icon: "📅",
      title: "Real Participation",
      description: `${studyDuration} days of consistent engagement. Weekly check-ins tracked and verified.`,
    },
    {
      icon: "💰",
      title: "No Incentive to Lie",
      description: "Same rebate given regardless of results. No bonus for positive feedback. Brand cannot edit any data.",
    },
  ];

  // Methodology items for wearable
  const wearableMethodology = [
    { icon: "🔗", text: `All biometric data was collected directly from the participant's ${testimonial.device} via secure API. Results compare against a 7-day baseline period before product use.` },
    { icon: "💰", text: "Brands pay us the same whether results are positive or negative. They cannot edit any data." },
    { icon: "📉", text: "We show non-responders. If a product doesn't work, our data will show that." },
    { icon: "🔍", text: "Full study results are public. View all participants — not just top responders." },
    { icon: "✓", text: "Brands can choose which stories to feature but cannot alter the underlying data." },
  ];

  // Methodology items for non-wearable
  const nonWearableMethodology = [
    { icon: "📋", text: "Participants complete a validated assessment at baseline and endpoint. Questions are scientifically designed to measure outcomes reliably." },
    { icon: "📅", text: "Weekly check-ins track engagement and progress. We verify consistent participation before results count." },
    { icon: "💰", text: "Brands pay us the same whether results are positive or negative. Participants receive the same rebate regardless of their feedback." },
    { icon: "📉", text: "We show non-responders. If a product doesn't work, our data will show that." },
    { icon: "✓", text: "Brands can choose which stories to feature but cannot alter the assessment scores or responses." },
  ];

  const methodology = hasWearable ? wearableMethodology : nonWearableMethodology;

  return (
    <div className="space-y-6 pt-4">
      {/* Trust Stack - 4 pillars with distinct icons */}
      <div className="grid md:grid-cols-2 gap-4">
        {trustStackPillars.map((pillar) => (
          <TrustStackPillar key={pillar.title} {...pillar} />
        ))}
      </div>

      {/* Comparison table */}
      <div>
        <h4 className="font-medium mb-3">How we&apos;re different from other reviews:</h4>
        <ComparisonTable />
      </div>

      {/* About Reputable */}
      <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00D1C1]" />
          <span className="font-medium">About Reputable Health</span>
        </div>
        <p className="text-sm text-muted-foreground">
          We&apos;re a third-party verification platform. Brands pay us to collect unbiased data — but they
          cannot edit the results. If a product doesn&apos;t work, our data will show that.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">147+ studies</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">12,400+ participants</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">5 device integrations</span>
        </div>
      </div>

      {/* Methodology - scannable icon-prefixed points */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Our Methodology</h4>
        <div className="space-y-3 text-sm text-muted-foreground">
          {methodology.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Raw data toggle */}
      <div>
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center gap-2 text-sm font-medium text-[#00D1C1] hover:underline"
        >
          {showRawData ? "Hide" : "View"} verification data sample
          {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showRawData && (
          <div className="mt-3 bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-300">
{hasWearable
  ? `{
  "verification_id": "${testimonial.verificationId}",
  "participant_id": "anon_${testimonial.id}",
  "device": "${testimonial.device}",
  "data_points": ${formattedDataPoints.replace(/,/g, "")},
  "verified_at": "2024-12-05T18:32:00Z",
  "verification_hash": "sha256:7f83b1657..."
}`
  : `{
  "verification_id": "${testimonial.verificationId}",
  "participant_id": "anon_${testimonial.id}",
  "assessment_type": "validated_questionnaire",
  "check_ins_completed": ${studyDuration / 7},
  "engagement_verified": true,
  "verified_at": "2024-12-05T18:32:00Z",
  "verification_hash": "sha256:7f83b1657..."
}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
