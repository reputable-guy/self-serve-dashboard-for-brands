"use client";

/**
 * Widget Placements Demo Page
 * 
 * Shows the brand's widget in multiple real-world page placement contexts:
 * - Product Detail Page (PDP)
 * - Homepage Hero
 * - Landing Page
 * - Blog Post
 * - Email Signature
 * 
 * Addresses the #1 objection: "I don't want to mess with my checkout page"
 */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  ExternalLink,
  ShoppingBag,
  Home,
  FileText,
  BookOpen,
  Mail,
  Lightbulb,
  Shield,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrustStripWidget,
  TrustCardWidget,
  TrustSectionWidget,
  type WidgetStyle,
} from "@/components/widgets/trust-widgets";
import { VerificationModal } from "@/components/widgets/verification-modal";
import {
  hasWidgetData,
  getWidgetDataForStudy,
  getBestWidgetMode,
  type WidgetDisplayMode,
} from "@/lib/widget-data";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { getCompletedStoriesFromEnrollments } from "@/lib/simulation/completed-story-generator";

// ============================================
// TYPES
// ============================================

type PlacementType = "pdp" | "homepage" | "landing" | "blog" | "email";
type DeviceType = "desktop" | "tablet" | "mobile";

interface WidgetConfig {
  brandColor: string;
  position: "bottom-left" | "bottom-right";
  mode: WidgetDisplayMode | null;
  featuredParticipantIds: string[];
  widgetStyle: WidgetStyle;
}

interface PlacementConfig {
  id: PlacementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  tip: string;
  recommendedStyle: WidgetStyle;
  embedNote: string;
}

// ============================================
// CONSTANTS
// ============================================

const WIDGET_CONFIG_VERSION = "v2";
const getConfigKey = (studyId: string) => `reputable-widget-config-${WIDGET_CONFIG_VERSION}-${studyId}`;

const PLACEMENTS: PlacementConfig[] = [
  {
    id: "pdp",
    label: "Product Page",
    icon: <ShoppingBag className="h-4 w-4" />,
    description: "Below product description, above reviews",
    tip: "Product pages see 12% higher add-to-cart with verified efficacy data. Start here before testing checkout.",
    recommendedStyle: "card",
    embedNote: "Place below the product description for maximum impact.",
  },
  {
    id: "homepage",
    label: "Homepage Hero",
    icon: <Home className="h-4 w-4" />,
    description: "Below hero text, above the fold",
    tip: "Immediate credibility signal: \"We have the data to back our claims.\" Great for brand trust.",
    recommendedStyle: "strip",
    embedNote: "Best placed below your main headline or value proposition.",
  },
  {
    id: "landing",
    label: "Landing Page",
    icon: <FileText className="h-4 w-4" />,
    description: "Featured in \"The Science\" or \"Real Results\" section",
    tip: "Deep-dive content for high-intent visitors. Also provides SEO value for product efficacy queries.",
    recommendedStyle: "section",
    embedNote: "Create a dedicated \"Real Results\" or \"The Science\" section.",
  },
  {
    id: "blog",
    label: "Blog Post",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Inline within content, between paragraphs",
    tip: "Content marketing support — backs up efficacy claims in articles about your product category.",
    recommendedStyle: "card",
    embedNote: "Embed inline after discussing product benefits or claims.",
  },
  {
    id: "email",
    label: "Email Signature",
    icon: <Mail className="h-4 w-4" />,
    description: "In email signature or newsletter section",
    tip: "Passive credibility in every customer touchpoint. Great for post-purchase and newsletter comms.",
    recommendedStyle: "strip",
    embedNote: "Use the compact strip style for email compatibility.",
  },
];

// ============================================
// COMPONENT
// ============================================

export default function WidgetPlacementsDemo() {
  const params = useParams();
  const studyId = params.studyId as string;

  // State
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementType>("pdp");
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Widget config from localStorage (synced with brand-widget-tab.tsx)
  const [brandColor, setBrandColor] = useState("#00D1C1");
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>("card");
  const [selectedMode, setSelectedMode] = useState<WidgetDisplayMode | null>(null);

  // Data sources
  const useWidgetDataTs = hasWidgetData(studyId);
  const widgetData = getWidgetDataForStudy(studyId);
  const bestMode = getBestWidgetMode(studyId);

  // Enrollment store for demo studies
  const allEnrollments = useEnrollmentStore((s) => s.enrollments);
  const studyEnrollments = useMemo(
    () => allEnrollments.filter((e) => e.studyId === studyId && e.stage !== "clicked"),
    [allEnrollments, studyId]
  );
  const completedEnrollments = useMemo(
    () => studyEnrollments.filter((e) => e.stage === "completed"),
    [studyEnrollments]
  );

  // Participant data
  const participantCount = useWidgetDataTs
    ? (widgetData?.participantCount ?? 0)
    : studyEnrollments.length;

  const completedCount = useWidgetDataTs
    ? (widgetData?.participantCount ?? 0)
    : completedEnrollments.length;

  // Build participant previews for demo studies
  const participantPreviews = useMemo(() => {
    if (useWidgetDataTs && widgetData) {
      return widgetData.participants;
    }
    if (completedEnrollments.length > 0) {
      const stories = getCompletedStoriesFromEnrollments(completedEnrollments, "sleep");
      return stories.slice(0, 4).map((s) => ({
        id: s.id,
        name: s.name || "Participant",
        initials: s.initials || s.name?.[0] || "?",
        rating: s.overallRating || 4,
        primaryMetric: { label: "Improved", value: "+15%" },
        quote: "Great results!",
        device: "Oura Ring",
        verificationId: s.verificationId || s.id,
      }));
    }
    return [];
  }, [useWidgetDataTs, widgetData, completedEnrollments]);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(getConfigKey(studyId));
    if (saved) {
      try {
        const config: WidgetConfig = JSON.parse(saved);
        if (config.brandColor) setBrandColor(config.brandColor);
        if (config.widgetStyle) setWidgetStyle(config.widgetStyle);
        if (config.mode) setSelectedMode(config.mode);
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [studyId]);

  // Current placement config
  const currentPlacement = PLACEMENTS.find((p) => p.id === selectedPlacement) || PLACEMENTS[0];

  // Badge headline
  const badgeHeadline = bestMode?.badgeHeadline ||
    (completedCount > 0
      ? `${completedCount} people verified this product`
      : `${participantCount} people are testing this product`);

  // Generate embed code for current placement
  const generateEmbedCode = (placement: PlacementType) => {
    const placementStyle = PLACEMENTS.find((p) => p.id === placement)?.recommendedStyle || widgetStyle;
    return `<!-- Reputable Verification Widget - ${placement.toUpperCase()} -->
<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="${placementStyle}"
  data-study-id="${studyId}"
  data-mode="${selectedMode || bestMode?.mode || "individual"}"
  data-color="${brandColor}"
  data-placement="${placement}"
  data-theme="light"
></div>`;
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generateEmbedCode(selectedPlacement));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Device preview width
  const getDeviceWidth = () => {
    switch (deviceType) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      default: return "max-w-full";
    }
  };

  // Widget component based on style
  const renderWidget = (style: WidgetStyle = widgetStyle) => {
    const participants = participantPreviews.length > 0
      ? participantPreviews.slice(0, 3).map(p => ({ id: p.id, initials: p.initials, name: p.name }))
      : [
          { id: "1", initials: "JR", name: "James R." },
          { id: "2", initials: "SM", name: "Sarah M." },
          { id: "3", initials: "AL", name: "Alex L." },
        ];

    const props = {
      participantCount: participantCount || 30,
      headline: badgeHeadline,
      subheadline: "28-day study · Oura Ring tracked",
      participants,
      brandColor,
      onOpenModal: () => setShowModal(true),
    };

    switch (style) {
      case "strip":
        return <TrustStripWidget {...props} />;
      case "section":
        return (
          <TrustSectionWidget
            {...props}
            participants={participantPreviews.length > 0
              ? participantPreviews.slice(0, 3).map(p => ({
                  id: p.id,
                  initials: p.initials,
                  name: p.name,
                  metric: `${p.primaryMetric.value} ${p.primaryMetric.label}`,
                }))
              : [
                  { id: "1", initials: "JR", name: "James R.", metric: "+18% HRV" },
                  { id: "2", initials: "SM", name: "Sarah M.", metric: "+24% Deep Sleep" },
                  { id: "3", initials: "AL", name: "Alex L.", metric: "+12% Recovery" },
                ]
            }
          />
        );
      case "card":
      default:
        return <TrustCardWidget {...props} />;
    }
  };

  // ============================================
  // PLACEMENT MOCKUPS
  // ============================================

  const renderPlacementMockup = () => {
    const style = currentPlacement.recommendedStyle;

    switch (selectedPlacement) {
      case "pdp":
        return <PDPMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
      case "homepage":
        return <HomepageMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
      case "landing":
        return <LandingPageMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
      case "blog":
        return <BlogPostMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
      case "email":
        return <EmailMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
      default:
        return <PDPMockup brandColor={brandColor} widget={renderWidget(style)} deviceType={deviceType} />;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/admin/studies/${studyId}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Study
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold">Widget Placements Demo</h1>
                <p className="text-xs text-muted-foreground">
                  Preview your widget in different page contexts
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Not checkout — start here!
            </Badge>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-24">
              {/* Placement Tabs */}
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Page Placement
                </p>
                <div className="space-y-1">
                  {PLACEMENTS.map((placement) => (
                    <button
                      key={placement.id}
                      onClick={() => setSelectedPlacement(placement.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        selectedPlacement === placement.id
                          ? "bg-[#00D1C1]/10 text-[#00D1C1] border border-[#00D1C1]/30"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`${selectedPlacement === placement.id ? "text-[#00D1C1]" : "text-gray-400"}`}>
                        {placement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{placement.label}</p>
                      </div>
                      {placement.id === "pdp" && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-green-50 text-green-700 border-green-200">
                          Best
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Toggle */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Device Preview
                </p>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setDeviceType("desktop")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      deviceType === "desktop"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Desktop
                  </button>
                  <button
                    onClick={() => setDeviceType("tablet")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      deviceType === "tablet"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    Tablet
                  </button>
                  <button
                    onClick={() => setDeviceType("mobile")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      deviceType === "mobile"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Mobile
                  </button>
                </div>
              </div>

              {/* View Full Demo Link */}
              <div className="mt-6 pt-6 border-t">
                <Link href={`/demo/product-page/${studyId}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Full Demo Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 min-w-0">
            {/* Preview Container */}
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 border max-w-md truncate">
                    {selectedPlacement === "pdp" && "yourstore.com/products/your-product"}
                    {selectedPlacement === "homepage" && "yourstore.com"}
                    {selectedPlacement === "landing" && "yourstore.com/the-science"}
                    {selectedPlacement === "blog" && "yourstore.com/blog/how-it-works"}
                    {selectedPlacement === "email" && "email preview"}
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 bg-gray-50 flex justify-center min-h-[500px]">
                <div className={`w-full ${getDeviceWidth()} transition-all duration-300`}>
                  {renderPlacementMockup()}
                </div>
              </div>
            </div>

            {/* Embed Code Section */}
            <div className="mt-4 bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Embed Code for {currentPlacement.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {currentPlacement.embedNote}
                  </p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant={copiedCode ? "default" : "outline"}
                  size="sm"
                  className={copiedCode ? "bg-emerald-600 hover:bg-emerald-600" : ""}
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto">
                <pre>{generateEmbedCode(selectedPlacement)}</pre>
              </div>
            </div>

            {/* Tip Callout */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Why {currentPlacement.label}?
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {currentPlacement.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        study={{
          title: widgetData?.studyTitle || "Product Study",
          participantCount: participantCount || 30,
          durationDays: widgetData?.durationDays || 28,
          wearableType: widgetData?.wearableType || "Oura Ring",
          compensationNote: widgetData?.compensationNote || "Participants received compensation for completing the study.",
        }}
        participants={participantPreviews.length > 0 ? participantPreviews : [
          { id: "1", name: "James R.", initials: "JR", rating: 5, primaryMetric: { label: "HRV", value: "+18%" }, quote: "Great results!", device: "Oura Ring", verificationId: "1" },
          { id: "2", name: "Sarah M.", initials: "SM", rating: 5, primaryMetric: { label: "Deep Sleep", value: "+24%" }, quote: "Noticed a real difference.", device: "Oura Ring", verificationId: "2" },
          { id: "3", name: "Alex L.", initials: "AL", rating: 4, primaryMetric: { label: "Recovery", value: "+12%" }, quote: "Would recommend.", device: "Oura Ring", verificationId: "3" },
        ]}
        verifyPageUrl={widgetData?.verifyPageUrl || `/verify/${studyId}/results`}
      />
    </div>
  );
}

// ============================================
// PLACEMENT MOCKUPS
// ============================================

interface MockupProps {
  brandColor: string;
  widget: React.ReactNode;
  deviceType: DeviceType;
}

// Product Detail Page Mockup
function PDPMockup({ brandColor, widget, deviceType }: MockupProps) {
  const isMobile = deviceType === "mobile";

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Product Section */}
      <div className={`p-6 ${isMobile ? "" : "grid grid-cols-2 gap-8"}`}>
        {/* Product Image */}
        <div className={`aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4 ${isMobile ? "" : "mb-0"}`}>
          <div className="text-center p-4">
            <div 
              className="h-16 w-16 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              <Shield className="h-8 w-8" style={{ color: brandColor }} />
            </div>
            <p className="text-xs text-gray-400">Product Image</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase">Your Brand</p>
          <h1 className={`font-bold text-gray-900 ${isMobile ? "text-lg" : "text-xl"}`}>
            Premium Product Name
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-gray-500">4.8 (142 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">$49.99</span>
            <span className="text-sm text-gray-400 line-through">$59.99</span>
          </div>

          {/* Add to Cart */}
          <button 
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: brandColor }}
          >
            Add to Cart
          </button>

          {/* Widget */}
          <div className="pt-2">
            {widget}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed">
            Backed by real customer data. Results verified through wearable health tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

// Homepage Hero Mockup
function HomepageMockup({ brandColor, widget, deviceType }: MockupProps) {
  const isMobile = deviceType === "mobile";

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded" style={{ backgroundColor: brandColor }} />
          <span className="text-sm font-semibold">YourBrand</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Shop</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div 
        className="p-8 text-center"
        style={{ backgroundColor: `${brandColor}08` }}
      >
        <h1 className={`font-bold text-gray-900 mb-3 ${isMobile ? "text-xl" : "text-3xl"}`}>
          Transform Your Wellness
        </h1>
        <p className={`text-gray-600 mb-6 ${isMobile ? "text-sm" : "text-base"}`}>
          Science-backed products for your health journey
        </p>
        
        <button 
          className="px-6 py-2.5 rounded-lg text-white text-sm font-medium mb-6"
          style={{ backgroundColor: brandColor }}
        >
          Shop Now
        </button>

        {/* Widget */}
        <div className="max-w-md mx-auto">
          {widget}
        </div>
      </div>

      {/* Features placeholder */}
      <div className={`p-6 grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded mx-auto mb-1" />
            <div className="h-2 w-16 bg-gray-100 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Landing Page Mockup
function LandingPageMockup({ brandColor, widget, deviceType }: MockupProps) {
  const isMobile = deviceType === "mobile";

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded" style={{ backgroundColor: brandColor }} />
          <span className="text-sm font-semibold">YourBrand</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-6 border-b" style={{ backgroundColor: `${brandColor}05` }}>
        <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? "text-lg" : "text-2xl"}`}>
          The Science Behind Our Product
        </h1>
        <p className="text-sm text-gray-600">
          Real data from real customers, verified by independent tracking
        </p>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-6">
        {/* Intro text */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
          <div className="h-3 w-4/6 bg-gray-100 rounded" />
        </div>

        {/* Widget - Featured Section */}
        <div className="py-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: brandColor }} />
            Real Results
          </h2>
          {widget}
        </div>

        {/* More content */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <button 
            className="px-6 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: brandColor }}
          >
            Try It Risk-Free
          </button>
        </div>
      </div>
    </div>
  );
}

// Blog Post Mockup
function BlogPostMockup({ brandColor, widget, deviceType }: MockupProps) {
  const isMobile = deviceType === "mobile";

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded" style={{ backgroundColor: brandColor }} />
          <span className="text-sm font-semibold">YourBrand Blog</span>
        </div>
      </div>

      {/* Article */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase mb-2">Wellness • 5 min read</p>
          <h1 className={`font-bold text-gray-900 mb-3 ${isMobile ? "text-lg" : "text-xl"}`}>
            How Our Product Actually Works
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div>
              <p className="text-sm font-medium">Dr. Jane Smith</p>
              <p className="text-xs text-gray-400">January 15, 2025</p>
            </div>
          </div>
        </div>

        {/* Featured image placeholder */}
        <div className="aspect-video bg-gray-100 rounded-lg mb-6" />

        {/* Content */}
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            Understanding how wellness products work is crucial for making informed decisions
            about your health journey. In this article, we'll explore the science behind
            our approach and share real data from our customer studies.
          </p>

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
          </div>

          {/* Widget inline */}
          <div className="py-4">
            {widget}
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-4/5 bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Email Mockup
function EmailMockup({ brandColor, widget, deviceType }: MockupProps) {
  const isMobile = deviceType === "mobile";

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Email header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: brandColor }} />
          <div>
            <p className="text-sm font-medium">YourBrand Support</p>
            <p className="text-xs text-gray-400">support@yourbrand.com</p>
          </div>
        </div>
        <p className="text-sm font-semibold">Thank you for your order!</p>
      </div>

      {/* Email body */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">Hi there,</p>
        
        <p className="text-sm text-gray-600">
          Thank you for your recent purchase! We're excited for you to start your
          wellness journey with us.
        </p>

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>

        <p className="text-sm text-gray-600">
          Best regards,<br />
          The YourBrand Team
        </p>

        {/* Signature with widget */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full" style={{ backgroundColor: brandColor }} />
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-gray-400">Customer Success Manager</p>
            </div>
          </div>
          
          {/* Widget as signature element */}
          <div className={isMobile ? "" : "max-w-sm"}>
            {widget}
          </div>
        </div>
      </div>
    </div>
  );
}
