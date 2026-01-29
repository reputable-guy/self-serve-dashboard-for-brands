"use client";

/**
 * Brand Widget Tab — Merged version
 *
 * Combines Theban's original widget configuration UI (display modes, brand color,
 * position, featured participants) with the additions from the brand view sprint
 * (marketing kit, FAQ, install steps, mock product page).
 *
 * Data sources:
 * - Real data studies (Sensate, LyfeFuel): widget-data.ts
 * - Demo/simulated studies: enrollment store + completed-story-generator
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  TrendingUp,
  Quote,
  Star,
  Palette,
  Users,
  RotateCcw,
  Sparkles,
  Settings2,
} from "lucide-react";
import { FloatingBadgeWidget } from "@/components/widgets/compact-badge-widget";
import { VerificationModal } from "@/components/widgets/verification-modal";
import {
  TrustStripWidget,
  TrustCardWidget,
  TrustSectionWidget,
  WIDGET_STYLES,
  type WidgetStyle,
  type TrustWidgetParticipant,
} from "@/components/widgets/trust-widgets";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { getCompletedStoriesFromEnrollments } from "@/lib/simulation/completed-story-generator";
import {
  hasWidgetData,
  getWidgetDataForStudy,
  getBestWidgetMode,
  getAllWidgetModes,
  getDefaultFeaturedParticipantIds,
  type WidgetDisplayMode,
  type WidgetModeConfig,
} from "@/lib/widget-data";
import type { ParticipantStory } from "@/lib/types";

// ============================================
// TYPES
// ============================================

interface BrandWidgetTabProps {
  studyId: string;
  studyName: string;
  brandName?: string;
  category?: string;
  realStories?: ParticipantStory[] | null;
}

interface WidgetConfig {
  brandColor: string;
  position: "bottom-left" | "bottom-right";
  mode: WidgetDisplayMode | null;
  featuredParticipantIds: string[];
  widgetStyle: WidgetStyle;
}

interface ParticipantPreviewItem {
  id: string;
  name: string;
  initials: string;
  rating: number;
  primaryMetric: {
    label: string;
    value: string;
  };
  quote: string;
  device: string;
  verificationId: string;
}

// ============================================
// CONSTANTS
// ============================================

const COLOR_PRESETS = [
  { name: "Reputable Teal", value: "#00D1C1" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#059669" },
  { name: "Orange", value: "#EA580C" },
  { name: "Pink", value: "#DB2777" },
];

const getConfigKey = (studyId: string) => `reputable-widget-config-${studyId}`;

// ============================================
// HELPER: Compute display modes for demo studies
// ============================================

function computeDemoDisplayModes(
  completedCount: number,
  participantCount: number,
  participants: ParticipantPreviewItem[],
): WidgetModeConfig[] {
  const modes: WidgetModeConfig[] = [];

  // Compute aggregate from participants
  const metricsWithChange = participants
    .map((p) => {
      const match = p.primaryMetric.value.match(/([+-]?\d+)/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((v): v is number => v !== null && v > 0);

  const avgChange =
    metricsWithChange.length > 0
      ? Math.round(metricsWithChange.reduce((a, b) => a + b, 0) / metricsWithChange.length)
      : 0;

  // Aggregate mode
  if (avgChange > 0) {
    modes.push({
      mode: "aggregate",
      headline: `+${avgChange}% avg improvement`,
      subheadline: `${completedCount} verified participants`,
      friendlyDescription: `Participants averaged ${avgChange}% improvement in tracked metrics`,
      badgeHeadline: `Participants averaged ${avgChange}% improvement in tracked metrics`,
      metricLabel: "Improvement",
      metricValue: `+${avgChange}%`,
    });
  }

  // NPS / satisfaction mode (estimate from ratings)
  const avgRating =
    participants.length > 0
      ? participants.reduce((a, b) => a + b.rating, 0) / participants.length
      : 0;
  const wouldRecommend = Math.round(
    (participants.filter((p) => p.rating >= 4).length / Math.max(participants.length, 1)) * 100
  );

  if (wouldRecommend > 0) {
    modes.push({
      mode: "nps",
      headline: `${wouldRecommend}% Would Recommend`,
      subheadline: `${completedCount} verified participants`,
      friendlyDescription: `${wouldRecommend}% of verified participants would recommend this product`,
      badgeHeadline: `${wouldRecommend}% of verified participants would recommend this product`,
      npsValue: Math.round(avgRating * 20 - 10), // rough estimate
      wouldRecommendPercent: wouldRecommend,
    });
  }

  // Individual / people tested mode (always available)
  modes.push({
    mode: "individual",
    headline: `${participantCount} people tested this product and tracked results with wearables`,
    subheadline: "Verified by Reputable",
    friendlyDescription: `${participantCount} people tested this product`,
    badgeHeadline: `${participantCount} people tested this product and tracked results with wearables`,
    featuredParticipant: participants[0] || undefined,
  });

  return modes;
}

function getModeLabelText(mode: WidgetDisplayMode): string {
  switch (mode) {
    case "aggregate":
      return "Outcome Highlight";
    case "nps":
      return "Satisfaction Score";
    case "individual":
      return "People Tested";
  }
}

function getModeDescriptionText(modeConfig: WidgetModeConfig): string {
  switch (modeConfig.mode) {
    case "aggregate":
      return `Shows "${modeConfig.badgeHeadline}"`;
    case "nps":
      return `Shows "${modeConfig.badgeHeadline}"`;
    case "individual":
      return `Shows "X people tested this product..."`;
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BrandWidgetTab({
  studyId,
  studyName,
  brandName,
  category,
  realStories,
}: BrandWidgetTabProps) {
  // --- State ---
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Config state (persisted to localStorage)
  const [brandColor, setBrandColor] = useState("#00D1C1");
  const [position, setPosition] = useState<"bottom-left" | "bottom-right">("bottom-left");
  const [selectedMode, setSelectedMode] = useState<WidgetDisplayMode | null>(null);
  const [featuredParticipantIds, setFeaturedParticipantIds] = useState<string[]>([]);
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>("card");

  // --- Data sources ---
  const useWidgetDataTs = hasWidgetData(studyId);
  const isRealData = !!realStories && realStories.length > 0;

  // Enrollment store (for demo studies)
  const allEnrollments = useEnrollmentStore((s) => s.enrollments);
  const studyEnrollments = useMemo(
    () => allEnrollments.filter((e) => e.studyId === studyId && e.stage !== "clicked"),
    [allEnrollments, studyId]
  );
  const completedEnrollments = useMemo(
    () => studyEnrollments.filter((e) => e.stage === "completed"),
    [studyEnrollments]
  );

  // Participant counts
  const participantCount = useWidgetDataTs
    ? (getWidgetDataForStudy(studyId)?.participantCount ?? 0)
    : isRealData
      ? realStories.length
      : studyEnrollments.length;

  const completedCount = useWidgetDataTs
    ? (getWidgetDataForStudy(studyId)?.participantCount ?? 0)
    : isRealData
      ? realStories.length
      : completedEnrollments.length;

  const hasParticipants = participantCount > 0;

  // --- Build participant previews ---
  const allParticipantPreviews: ParticipantPreviewItem[] = useMemo(() => {
    // Source 1: widget-data.ts (real studies with pre-built data)
    if (useWidgetDataTs) {
      return getWidgetDataForStudy(studyId)?.participants ?? [];
    }

    // Source 2: Real stories prop
    if (isRealData) {
      const sorted = [...realStories].sort((a, b) => {
        const aChange = a.wearableMetrics?.hrvChange?.changePercent ?? 0;
        const bChange = b.wearableMetrics?.hrvChange?.changePercent ?? 0;
        return bChange - aChange;
      });
      return sorted.slice(0, 8).map((s) => ({
        id: s.id,
        name: s.name || "Participant",
        initials: s.initials || s.name?.[0] || "?",
        rating: s.finalTestimonial?.overallRating || s.overallRating || 4,
        primaryMetric: {
          label: s.wearableMetrics?.hrvChange
            ? `HRV (${s.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}${s.wearableMetrics.hrvChange.changePercent}%)`
            : "Completed",
          value: s.wearableMetrics?.hrvChange
            ? `${s.wearableMetrics.hrvChange.after} ms`
            : "28 days",
        },
        quote: s.finalTestimonial?.quote || "Completed the full study.",
        device: s.wearableMetrics?.device || "Oura Ring",
        verificationId: s.verificationId || s.id,
      }));
    }

    // Source 3: Simulated data from enrollment store
    if (completedEnrollments.length > 0) {
      const stories = getCompletedStoriesFromEnrollments(
        completedEnrollments,
        category || "sleep"
      );
      const sorted = [...stories].sort((a, b) => {
        const getBest = (s: typeof a) => {
          const best = s.wearableMetrics?.bestMetric;
          if (best) return best.lowerIsBetter ? Math.abs(best.changePercent) : best.changePercent;
          return s.assessmentResult?.change?.compositePercent ?? 0;
        };
        return getBest(b) - getBest(a);
      });
      return sorted.slice(0, 8).map((s) => {
        const best = s.wearableMetrics?.bestMetric;
        const lastQuote = s.journey?.keyQuotes?.[s.journey.keyQuotes.length - 1];

        let metricLabel: string;
        let metricValue: string;
        if (best) {
          const pct = best.lowerIsBetter ? Math.abs(best.changePercent) : best.changePercent;
          metricLabel = `${best.label || "Improved"} ${best.lowerIsBetter ? "↓" : "+"}${pct}%`;
          metricValue =
            best.unit === "min"
              ? `${Math.floor(best.after / 60)}h ${best.after % 60}m`
              : `${best.after}${best.unit}`;
        } else {
          const pct = s.assessmentResult?.change?.compositePercent;
          metricLabel = pct !== undefined ? `${pct > 0 ? "+" : ""}${pct}%` : "Completed";
          metricValue = s.assessmentResult
            ? `${s.assessmentResult.endpoint.compositeScore}/100`
            : "28 days";
        }

        return {
          id: s.id,
          name: s.name || "Participant",
          initials: s.initials || s.name?.[0] || "?",
          rating: s.overallRating || 4,
          primaryMetric: { label: metricLabel, value: metricValue },
          quote:
            (typeof lastQuote === "string" ? lastQuote : lastQuote?.quote) ||
            "Completed the full study.",
          device: s.wearableMetrics?.device || "Oura Ring",
          verificationId: s.verificationId || s.id,
        };
      });
    }

    return [];
  }, [useWidgetDataTs, studyId, isRealData, realStories, completedEnrollments, category]);

  // --- Display modes ---
  const allModes: WidgetModeConfig[] = useMemo(() => {
    if (useWidgetDataTs) {
      return getAllWidgetModes(studyId);
    }
    return computeDemoDisplayModes(completedCount, participantCount, allParticipantPreviews);
  }, [useWidgetDataTs, studyId, completedCount, participantCount, allParticipantPreviews]);

  const bestMode: WidgetModeConfig | null = useMemo(() => {
    if (useWidgetDataTs) {
      return getBestWidgetMode(studyId);
    }
    // For demo: aggregate if strong, then nps, else individual
    const agg = allModes.find((m) => m.mode === "aggregate");
    if (agg && agg.metricValue) {
      const val = parseInt(agg.metricValue.replace(/[^0-9]/g, ""), 10);
      if (val >= 15) return agg;
    }
    const nps = allModes.find((m) => m.mode === "nps");
    if (nps && nps.wouldRecommendPercent && nps.wouldRecommendPercent >= 70) return nps;
    return allModes.find((m) => m.mode === "individual") || allModes[0] || null;
  }, [useWidgetDataTs, studyId, allModes]);

  const currentMode = useMemo(() => {
    if (selectedMode) {
      return allModes.find((m) => m.mode === selectedMode) || bestMode;
    }
    return bestMode;
  }, [selectedMode, allModes, bestMode]);

  // --- Default featured participant IDs ---
  const computeDefaultFeatured = useCallback((): string[] => {
    if (useWidgetDataTs) {
      return getDefaultFeaturedParticipantIds(studyId);
    }
    // Score by rating + positive metric change
    const scored = allParticipantPreviews.map((p) => {
      let score = p.rating * 10;
      const match = p.primaryMetric.value.match(/([+-]?\d+)/);
      if (match) {
        const change = parseInt(match[1], 10);
        if (change > 0) score += change;
      }
      return { id: p.id, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.id);
  }, [useWidgetDataTs, studyId, allParticipantPreviews]);

  // --- Load config from localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem(getConfigKey(studyId));
    if (saved) {
      try {
        const config: WidgetConfig = JSON.parse(saved);
        if (config.brandColor) setBrandColor(config.brandColor);
        if (config.position) setPosition(config.position);
        if (config.mode) setSelectedMode(config.mode);
        if (config.widgetStyle) setWidgetStyle(config.widgetStyle);
        if (config.featuredParticipantIds && config.featuredParticipantIds.length > 0) {
          setFeaturedParticipantIds(config.featuredParticipantIds);
        } else {
          setFeaturedParticipantIds(computeDefaultFeatured());
        }
      } catch {
        setFeaturedParticipantIds(computeDefaultFeatured());
      }
    } else {
      setFeaturedParticipantIds(computeDefaultFeatured());
    }
  }, [studyId, computeDefaultFeatured]);

  // --- Save config to localStorage ---
  // Skip save if featuredParticipantIds is empty (initial state before load effect runs)
  useEffect(() => {
    if (featuredParticipantIds.length === 0) {
      return;
    }
    const config: WidgetConfig = {
      brandColor,
      position,
      mode: selectedMode,
      featuredParticipantIds,
      widgetStyle,
    };
    localStorage.setItem(getConfigKey(studyId), JSON.stringify(config));
  }, [brandColor, position, selectedMode, featuredParticipantIds, widgetStyle, studyId]);

  // --- Badge data ---
  const participantAvatars = useMemo(() => {
    if (allParticipantPreviews.length > 0) {
      return allParticipantPreviews.slice(0, 4).map((p) => ({
        id: p.id,
        initials: p.initials,
      }));
    }
    return [
      { id: "demo-1", initials: "SM" },
      { id: "demo-2", initials: "JR" },
      { id: "demo-3", initials: "AL" },
      { id: "demo-4", initials: "MK" },
    ];
  }, [allParticipantPreviews]);

  const badgeHeadline = currentMode?.badgeHeadline ||
    (hasParticipants
      ? completedCount > 0
        ? `${completedCount} people verified this product`
        : `${participantCount} people are testing this product`
      : "Verified by real participants");

  // --- Modal participants (filtered by featured selection) ---
  const modalParticipants = useMemo(() => {
    if (featuredParticipantIds.length > 0) {
      const featured = allParticipantPreviews.filter((p) =>
        featuredParticipantIds.includes(p.id)
      );
      if (featured.length > 0) return featured;
    }
    return allParticipantPreviews.slice(0, 3);
  }, [featuredParticipantIds, allParticipantPreviews]);

  // --- URLs ---
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = isRealData
    ? `${baseUrl}/verify/${studyId === "study-sensate-real" ? "sensate-results" : studyId === "study-lyfefuel-real" ? "lyfefuel-results" : studyId + "/results"}`
    : `${baseUrl}/verify/${studyId}/results`;

  const embedCode = `<!-- Reputable Verification Widget -->
<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="${widgetStyle}"
  data-study-id="${studyId}"
  data-mode="${currentMode?.mode || "individual"}"
  data-color="${brandColor}"
  data-position="${position}"
  data-theme="light"
></div>`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* ===================== */}
      {/* WIDGET STYLE SELECTOR */}
      {/* ===================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00D1C1]" />
            Choose Widget Style
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Select how the verification badge appears on your product page
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WIDGET_STYLES.map((style) => (
              <button
                key={style.value}
                onClick={() => setWidgetStyle(style.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  widgetStyle === style.value
                    ? "border-[#00D1C1] bg-[#00D1C1]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      widgetStyle === style.value ? "border-[#00D1C1]" : "border-gray-300"
                    }`}
                  >
                    {widgetStyle === style.value && (
                      <div className="h-2 w-2 rounded-full bg-[#00D1C1]" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{style.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {style.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* WIDGET PREVIEW ON MOCK PRODUCT PAGE */}
      {/* ===================== */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
                Live Preview
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                See how your widget looks on a real product page
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <Check className="h-3 w-3 mr-1" />
              {WIDGET_STYLES.find(s => s.value === widgetStyle)?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Professional Mock Product Page */}
          <div className="bg-white border-t">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 border">
                  yourstore.com/products/{studyName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                </div>
              </div>
            </div>

            {/* Product page content */}
            <div className="p-6 md:p-8">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                    <div className="text-center p-8">
                      <div 
                        className="h-24 w-24 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${brandColor}15` }}
                      >
                        <Shield className="h-12 w-12" style={{ color: brandColor }} />
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {brandName || "Your Brand"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Product Image</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col">
                    <div className="mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {brandName || "Your Brand"}
                      </span>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                      {studyName
                        .replace(/\s*\(.*?\)\s*/g, "")
                        .replace(/study/gi, "")
                        .replace(/sleep\s*&?\s*stress/gi, "")
                        .trim() || "Premium Product"}
                    </h1>
                    
                    {/* Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">4.8 (142 reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">$49.99</span>
                      <span className="text-sm text-gray-500 line-through ml-2">$59.99</span>
                    </div>

                    {/* Add to Cart */}
                    <button className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors mb-4">
                      Add to Cart
                    </button>

                    {/* Trust Strip Widget (if selected) */}
                    {widgetStyle === "strip" && (
                      <div className="mb-4">
                        <TrustStripWidget
                          participantCount={hasParticipants ? participantCount : 30}
                          headline={badgeHeadline}
                          participants={
                            hasParticipants
                              ? participantAvatars.map(p => ({ ...p, name: p.initials }))
                              : [
                                  { id: "1", initials: "JR" },
                                  { id: "2", initials: "SM" },
                                  { id: "3", initials: "AL" },
                                ]
                          }
                          brandColor={brandColor}
                          onOpenModal={() => setShowWidgetModal(true)}
                        />
                      </div>
                    )}

                    {/* Trust Card Widget (if selected) */}
                    {widgetStyle === "card" && (
                      <div className="mb-4">
                        <TrustCardWidget
                          participantCount={hasParticipants ? participantCount : 30}
                          headline={hasParticipants 
                            ? `${participantCount} people verified this product with wearable data`
                            : "30 people verified this product with wearable data"
                          }
                          subheadline="28-day study · Oura Ring tracked"
                          participants={
                            hasParticipants
                              ? participantAvatars.map(p => ({ ...p, name: p.initials }))
                              : [
                                  { id: "1", initials: "JR" },
                                  { id: "2", initials: "SM" },
                                  { id: "3", initials: "AL" },
                                ]
                          }
                          brandColor={brandColor}
                          onOpenModal={() => setShowWidgetModal(true)}
                        />
                      </div>
                    )}

                    {/* Product description */}
                    <div className="text-sm text-gray-600 leading-relaxed">
                      <p>
                        Backed by real customer data. Results verified through 
                        wearable health tracking over a 28-day study period.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Section Widget (if selected) - below the fold */}
                {widgetStyle === "section" && (
                  <div className="mt-8 pt-8 border-t">
                    <TrustSectionWidget
                      participantCount={hasParticipants ? participantCount : 30}
                      headline={hasParticipants 
                        ? badgeHeadline
                        : "30 real customers tested this product for 28 days with Oura Ring health tracking"
                      }
                      participants={
                        hasParticipants
                          ? allParticipantPreviews.slice(0, 3).map(p => ({
                              id: p.id,
                              initials: p.initials,
                              name: p.name,
                              metric: p.primaryMetric.value + " " + p.primaryMetric.label,
                            }))
                          : [
                              { id: "1", initials: "JR", name: "James R.", metric: "+18% HRV" },
                              { id: "2", initials: "SM", name: "Sarah M.", metric: "+24% Deep Sleep" },
                              { id: "3", initials: "AL", name: "Alex L.", metric: "+12% Recovery" },
                            ]
                      }
                      brandColor={brandColor}
                      onOpenModal={() => setShowWidgetModal(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground py-3 text-center bg-gray-50 border-t">
            Click the widget to preview the modal that opens for customers
          </p>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* CONFIGURATION PANEL */}
      {/* ===================== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              Widget Configuration
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="text-muted-foreground"
            >
              {isConfigOpen ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isConfigOpen ? "Collapse" : "Configure"}
            </Button>
          </div>
          {!isConfigOpen && (
            <p className="text-xs text-muted-foreground">
              Mode: <span className="font-medium">{currentMode ? getModeLabelText(currentMode.mode) : "Auto"}</span>
              {" · "}Color:{" "}
              <span
                className="inline-block h-3 w-3 rounded-full align-middle border"
                style={{ backgroundColor: brandColor }}
              />
            </p>
          )}
        </CardHeader>

        {isConfigOpen && (
          <CardContent className="space-y-6 pt-0">
            {/* Display Mode Selection */}
            {allModes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Display Mode</p>
                <div className="space-y-2">
                  {allModes.map((modeConfig) => {
                    const isSelected = currentMode?.mode === modeConfig.mode;
                    const isBest = bestMode?.mode === modeConfig.mode;

                    return (
                      <button
                        key={modeConfig.mode}
                        onClick={() => setSelectedMode(modeConfig.mode)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                          isSelected
                            ? "border-[#00D1C1] bg-[#00D1C1]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-[#00D1C1]" : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-[#00D1C1]" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium flex items-center gap-2">
                              {getModeLabelText(modeConfig.mode)}
                              {isBest && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
                                >
                                  Recommended
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getModeDescriptionText(modeConfig)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brand Color */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Brand Color</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setBrandColor(preset.value)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        brandColor === preset.value
                          ? "border-gray-900 scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="customColor" className="text-xs text-muted-foreground">
                    Custom:
                  </Label>
                  <Input
                    id="customColor"
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-24 h-8 text-xs font-mono"
                    placeholder="#00D1C1"
                  />
                </div>
              </div>
            </div>

            {/* Note: Position removed - new widget styles are all inline, not floating */}

            {/* Featured Participants */}
            {allParticipantPreviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Featured Participants</p>
                    <span className="text-xs text-muted-foreground">
                      ({featuredParticipantIds.length}/3 selected)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeaturedParticipantIds(computeDefaultFeatured())}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Auto-select
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose up to 3 participants to highlight in the modal. Auto-select picks
                  the top performers.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                  {allParticipantPreviews.map((participant) => {
                    const isSelected = featuredParticipantIds.includes(participant.id);
                    const canSelect = isSelected || featuredParticipantIds.length < 3;

                    return (
                      <button
                        key={participant.id}
                        onClick={() => {
                          if (isSelected) {
                            setFeaturedParticipantIds(
                              featuredParticipantIds.filter((id) => id !== participant.id)
                            );
                          } else if (canSelect) {
                            setFeaturedParticipantIds([
                              ...featuredParticipantIds,
                              participant.id,
                            ]);
                          }
                        }}
                        disabled={!canSelect && !isSelected}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                          isSelected
                            ? "bg-[#00D1C1]/10 border border-[#00D1C1]/30"
                            : canSelect
                              ? "hover:bg-gray-50 border border-transparent"
                              : "opacity-50 cursor-not-allowed border border-transparent"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-[#00D1C1] bg-[#00D1C1]"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>

                        {/* Avatar */}
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        >
                          {participant.initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {participant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span
                              className="font-medium"
                              style={{ color: brandColor }}
                            >
                              {participant.primaryMetric.value}{" "}
                              {participant.primaryMetric.label}
                            </span>
                            <span>·</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-2.5 w-2.5 ${
                                    star <= participant.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ===================== */}
      {/* EMBED CODE & VERIFICATION LINK */}
      {/* ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Embed Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto">
              {embedCode}
            </div>
            <Button
              onClick={handleCopyCode}
              variant={copiedCode ? "default" : "outline"}
              size="sm"
              className={`mt-3 w-full ${
                copiedCode ? "bg-emerald-600 hover:bg-emerald-600" : ""
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Verification Page */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00D1C1]" />
              Verification Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Your public results page — full methodology, participant data, and
              verification details.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-600 truncate mb-3">
              {verifyUrl}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopyLink}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open Page
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===================== */}
      {/* MARKETING KIT */}
      {/* ===================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            Marketing Kit
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Ready-to-use content assets from your study data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset 1: Aggregate Stat Card */}
            <div className="border rounded-xl overflow-hidden bg-white">
              <div
                className="p-5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium opacity-90">
                    Verified by Reputable
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {completedCount > 0 ? `${completedCount}` : "—"}
                  </span>
                  <span className="text-sm opacity-80">people verified</span>
                </div>
                <p className="text-sm mt-2 opacity-90">
                  {completedCount > 0
                    ? "Real customers tested this product for 28 days with wearable tracking"
                    : "Verified participant results coming soon"}
                </p>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-gray-600">
                    {completedCount > 0 ? "Aggregate stat card" : "Preview"}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Instagram / Email
                </span>
              </div>
            </div>

            {/* Asset 2: Participant Spotlight */}
            <div className="border rounded-xl overflow-hidden bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: brandColor }}
                  >
                    {allParticipantPreviews[0]?.initials || "JR"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {allParticipantPreviews[0]?.name || "Participant Spotlight"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-3 w-3 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Quote className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-600 italic line-clamp-2">
                    {allParticipantPreviews[0]?.quote ||
                      "Very satisfied with the product experience."}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Shield className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Verified by Reputable · 28-day study
                  </span>
                </div>
              </div>
              <div className="border-t p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs text-gray-600">
                    Participant spotlight
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Social / Ads
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Export and customization coming soon — use these as templates for your
            marketing team
          </p>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* METHODOLOGY FAQ */}
      {/* ===================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            How It Works — FAQ
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            These questions appear when customers click &quot;Learn more&quot; on the
            widget
          </p>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            {
              q: "How was this study conducted?",
              a: "Participants used the product daily for 28 days while wearing an Oura Ring to track objective health metrics. They completed validated assessments at baseline and endpoint.",
            },
            {
              q: "Who are the participants?",
              a: "Real customers who volunteered for the study. They represent a diverse range of ages, backgrounds, and starting health conditions.",
            },
            {
              q: "Were participants compensated?",
              a: "Yes, participants received a rebate for completing the full 28-day study. Compensation was the same regardless of their feedback or results.",
            },
            {
              q: "How is the data verified?",
              a: "All wearable data is pulled directly from Oura Ring APIs — participants cannot modify it. Assessments use clinically validated instruments. Results are independently verified by Reputable.",
            },
            {
              q: "Who owns the data?",
              a: "Participants own their personal data. Aggregate, anonymized results are shared with the brand to display on their product page.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group border-b border-gray-100 last:border-0"
            >
              <summary className="flex items-center justify-between py-3 cursor-pointer text-sm font-medium text-gray-900 hover:text-[#00D1C1] transition-colors list-none">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground pb-3 pr-8 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* INSTALLATION STEPS */}
      {/* ===================== */}
      <Card className="bg-gradient-to-r from-[#00D1C1]/5 to-transparent border-[#00D1C1]/20">
        <CardContent className="pt-6 pb-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            3 Simple Steps to Install
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Copy the embed code",
                desc: "Click the copy button above",
              },
              {
                step: "2",
                title: "Paste into your product page",
                desc: "Add it before the closing </body> tag",
              },
              {
                step: "3",
                title: "Results auto-update",
                desc: "The widget refreshes as new results come in",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div
                  className="h-7 w-7 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: brandColor }}
                >
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* VERIFICATION MODAL */}
      {/* ===================== */}
      <VerificationModal
        isOpen={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        study={{
          title: studyName,
          participantCount: completedCount || participantCount,
          durationDays: 28,
          wearableType: "Oura Ring",
          compensationNote:
            "Participants received a rebate for completing the study.",
        }}
        participants={modalParticipants}
        verifyPageUrl={verifyUrl}
      />
    </div>
  );
}
