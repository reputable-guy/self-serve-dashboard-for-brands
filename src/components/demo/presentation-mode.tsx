"use client";

/**
 * Presentation Mode Component
 * 
 * Full-screen, clean demo experience for sales calls.
 * - No sidebar, no config UI
 * - Arrow keys navigate between placements
 * - Escape exits
 * - Shareable via URL
 */

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Share2,
  Check,
  ShoppingBag,
  Home,
  FileText,
  BookOpen,
  Mail,
  Shield,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrustStripWidget,
  TrustCardWidget,
  TrustSectionWidget,
  type WidgetStyle,
} from "@/components/widgets/trust-widgets";
import { FloatingBadgeWidget } from "@/components/widgets/compact-badge-widget";

// ============================================
// TYPES
// ============================================

type PlacementType = "pdp" | "homepage" | "landing" | "blog" | "email";
type DeviceType = "desktop" | "mobile";

interface Participant {
  id: string;
  initials: string;
  name: string;
}

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  studyId: string;
  brandColor: string;
  participantCount: number;
  badgeHeadline: string;
  participants: Participant[];
  initialPlacement?: PlacementType;
  onOpenVerification?: () => void;
  /** Optional widget style override - if provided, uses this instead of placement's recommended style */
  widgetStyle?: WidgetStyle;
}

interface PlacementConfig {
  id: PlacementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  recommendedStyle: WidgetStyle;
  urlPath: string;
}

// ============================================
// CONSTANTS
// ============================================

const PLACEMENTS: PlacementConfig[] = [
  {
    id: "pdp",
    label: "Product Page",
    icon: <ShoppingBag className="h-4 w-4" />,
    description: "Social proof at the point of consideration",
    recommendedStyle: "card",
    urlPath: "yourstore.com/products/product-name",
  },
  {
    id: "homepage",
    label: "Homepage",
    icon: <Home className="h-4 w-4" />,
    description: "Immediate credibility above the fold",
    recommendedStyle: "strip",
    urlPath: "yourstore.com",
  },
  {
    id: "landing",
    label: "Landing Page",
    icon: <FileText className="h-4 w-4" />,
    description: "Deep-dive for high-intent visitors",
    recommendedStyle: "section",
    urlPath: "yourstore.com/the-science",
  },
  {
    id: "blog",
    label: "Blog Post",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Content marketing support",
    recommendedStyle: "card",
    urlPath: "yourstore.com/blog/how-it-works",
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    description: "Passive credibility in every touchpoint",
    recommendedStyle: "strip",
    urlPath: "email signature",
  },
];

// ============================================
// COMPONENT
// ============================================

export function PresentationMode({
  isOpen,
  onClose,
  studyId,
  brandColor,
  participantCount,
  badgeHeadline,
  participants,
  initialPlacement = "pdp",
  onOpenVerification,
  widgetStyle: configuredWidgetStyle,
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(
    PLACEMENTS.findIndex((p) => p.id === initialPlacement) || 0
  );
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to initial placement when opening
  useEffect(() => {
    if (isOpen) {
      const idx = PLACEMENTS.findIndex((p) => p.id === initialPlacement);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, initialPlacement]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : PLACEMENTS.length - 1));
          break;
        case "ArrowRight":
          setCurrentIndex((prev) => (prev < PLACEMENTS.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
        case "ArrowDown":
          // Toggle device type
          setDeviceType((prev) => (prev === "desktop" ? "mobile" : "desktop"));
          break;
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll and hide underlying content when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Hide all other body children except our portal
      const children = document.body.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (!child.hasAttribute('data-presentation-mode')) {
          child.dataset.wasVisible = child.style.visibility || '';
          child.style.visibility = 'hidden';
        }
      }
    } else {
      document.body.style.overflow = "";
      // Restore visibility
      const children = document.body.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.dataset.wasVisible !== undefined) {
          child.style.visibility = child.dataset.wasVisible;
          delete child.dataset.wasVisible;
        }
      }
    }
    return () => {
      document.body.style.overflow = "";
      // Cleanup: restore visibility
      const children = document.body.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.dataset.wasVisible !== undefined) {
          child.style.visibility = child.dataset.wasVisible;
          delete child.dataset.wasVisible;
        }
      }
    };
  }, [isOpen]);

  // Generate share link
  const generateShareLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const placement = PLACEMENTS[currentIndex].id;
    return `${baseUrl}/demo/widget-placements/${studyId}?present=true&placement=${placement}`;
  };

  const handleCopyShareLink = async () => {
    const link = generateShareLink();
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPlacement = PLACEMENTS[currentIndex];

  // Render widget based on style
  // Use configured style if provided, otherwise fall back to placement's recommended style
  const renderWidget = (placementStyle: WidgetStyle) => {
    const style = configuredWidgetStyle || placementStyle;
    const participantData = participants.length > 0
      ? participants.slice(0, 3)
      : [
          { id: "1", initials: "JR", name: "James R." },
          { id: "2", initials: "SM", name: "Sarah M." },
          { id: "3", initials: "AL", name: "Alex L." },
        ];

    const props = {
      participantCount: participantCount || 30,
      headline: badgeHeadline,
      subheadline: "28-day study · Wearable verified",
      participants: participantData,
      brandColor,
      onOpenModal: onOpenVerification || (() => {}),
    };

    switch (style) {
      case "strip":
        return <TrustStripWidget {...props} />;
      case "section":
        return (
          <TrustSectionWidget
            {...props}
            participants={participantData.map((p) => ({
              ...p,
              metric: "+15% improvement",
            }))}
          />
        );
      case "floating-badge":
        return (
          <FloatingBadgeWidget
            participantCount={props.participantCount}
            studyTitle="Product Study"
            badgeHeadline={badgeHeadline}
            participants={participantData.map((p) => ({
              id: p.id,
              initials: p.initials,
            }))}
            brandColor={brandColor}
            onOpenModal={onOpenVerification || (() => {})}
          />
        );
      case "card":
      default:
        return <TrustCardWidget {...props} />;
    }
  };

  if (!mounted || !isOpen) return null;

  const content = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[100] bg-gray-900 flex flex-col overflow-hidden"
      data-presentation-mode="true"
    >
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-950/50 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* Placement Tabs */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            {PLACEMENTS.map((placement, index) => (
              <button
                key={placement.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  index === currentIndex
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {placement.icon}
                <span className="hidden sm:inline">{placement.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Device Toggle */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setDeviceType("desktop")}
              className={`p-2 rounded-md transition-all ${
                deviceType === "desktop"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceType("mobile")}
              className={`p-2 rounded-md transition-all ${
                deviceType === "mobile"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyShareLink}
            className={`gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 ${
              copiedLink ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-600" : ""
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share
              </>
            )}
          </Button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Exit presentation (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className={`transition-all duration-300 ${
            deviceType === "mobile" ? "max-w-[375px]" : "max-w-4xl"
          } w-full`}
        >
          {/* Browser Chrome */}
          <div className="bg-gray-100 rounded-t-xl border border-gray-200 border-b-0">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-md px-4 py-1 text-sm text-gray-500 border max-w-md truncate">
                  {currentPlacement.urlPath}
                </div>
              </div>
            </div>
          </div>

          {/* Page Mockup */}
          <div className="bg-white rounded-b-xl border border-gray-200 overflow-hidden shadow-2xl">
            {renderPlacementMockup(currentPlacement.id, brandColor, renderWidget(currentPlacement.recommendedStyle), deviceType)}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : PLACEMENTS.length - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors"
        title="Previous placement (←)"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev < PLACEMENTS.length - 1 ? prev + 1 : 0))}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors"
        title="Next placement (→)"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Footer with Keyboard Hints */}
      <div className="flex items-center justify-center gap-6 py-3 bg-gray-950/50 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">←</kbd>
          <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">→</kbd>
          <span>Navigate placements</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">↑</kbd>
          <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">↓</kbd>
          <span>Toggle device</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <kbd className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">Esc</kbd>
          <span>Exit</span>
        </div>
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs"
        >
          {currentPlacement.id === "pdp" && "★ Recommended starting placement"}
          {currentPlacement.id !== "pdp" && currentPlacement.description}
        </Badge>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

// ============================================
// PLACEMENT MOCKUPS (Simplified for Presentation)
// ============================================

function renderPlacementMockup(
  placement: PlacementType,
  brandColor: string,
  widget: React.ReactNode,
  deviceType: DeviceType
) {
  const isMobile = deviceType === "mobile";

  switch (placement) {
    case "pdp":
      return <PDPMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
    case "homepage":
      return <HomepageMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
    case "landing":
      return <LandingPageMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
    case "blog":
      return <BlogPostMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
    case "email":
      return <EmailMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
    default:
      return <PDPMockup brandColor={brandColor} widget={widget} isMobile={isMobile} />;
  }
}

interface MockupProps {
  brandColor: string;
  widget: React.ReactNode;
  isMobile: boolean;
}

function PDPMockup({ brandColor, widget, isMobile }: MockupProps) {
  return (
    <div className="p-6">
      {/* Nav */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandColor }} />
          <span className="font-semibold">YourBrand</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Shop</span>
          <span>About</span>
          <span>Cart (0)</span>
        </div>
      </div>

      <div className={isMobile ? "space-y-6" : "grid grid-cols-2 gap-8"}>
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center p-4">
            <div
              className="h-20 w-20 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${brandColor}20` }}
            >
              <Shield className="h-10 w-10" style={{ color: brandColor }} />
            </div>
            <p className="text-xs text-gray-400">Product Image</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase mb-1">Your Brand</p>
            <h1 className="text-2xl font-bold text-gray-900">Premium Product Name</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm text-gray-500">4.8 (142 reviews)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">$49.99</span>
            <span className="text-lg text-gray-400 line-through">$59.99</span>
          </div>

          <button
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: brandColor }}
          >
            Add to Cart
          </button>

          {/* Widget */}
          <div className="pt-2">{widget}</div>

          <p className="text-sm text-gray-500">
            Backed by real customer data. Results verified through wearable health tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

function HomepageMockup({ brandColor, widget, isMobile }: MockupProps) {
  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandColor }} />
          <span className="font-semibold">YourBrand</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Shop</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div className="p-8 text-center" style={{ backgroundColor: `${brandColor}08` }}>
        <h1 className={`font-bold text-gray-900 mb-3 ${isMobile ? "text-2xl" : "text-4xl"}`}>
          Transform Your Wellness
        </h1>
        <p className={`text-gray-600 mb-6 max-w-md mx-auto ${isMobile ? "text-sm" : "text-lg"}`}>
          Science-backed products for your health journey, verified by real customer data
        </p>

        <button
          className="px-8 py-3 rounded-lg text-white font-medium mb-8"
          style={{ backgroundColor: brandColor }}
        >
          Shop Now
        </button>

        {/* Widget */}
        <div className="max-w-lg mx-auto">{widget}</div>
      </div>

      {/* Features */}
      <div className={`p-6 grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {["Free Shipping", "30-Day Returns", "2 Year Warranty"].map((feature) => (
          <div key={feature} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto mb-2" />
            <p className="text-sm font-medium">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingPageMockup({ brandColor, widget, isMobile }: MockupProps) {
  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandColor }} />
          <span className="font-semibold">YourBrand</span>
        </div>
      </div>

      {/* Hero */}
      <div className="p-6 border-b" style={{ backgroundColor: `${brandColor}05` }}>
        <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? "text-xl" : "text-2xl"}`}>
          The Science Behind Our Product
        </h1>
        <p className="text-gray-600">Real data from real customers, verified by independent tracking</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
          <div className="h-3 w-4/6 bg-gray-100 rounded" />
        </div>

        {/* Widget Section */}
        <div className="py-4 px-4 bg-gray-50 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: brandColor }} />
            Real Results
          </h2>
          {widget}
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>

        <div className="text-center py-4">
          <button
            className="px-8 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: brandColor }}
          >
            Try It Risk-Free
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogPostMockup({ brandColor, widget, isMobile }: MockupProps) {
  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandColor }} />
          <span className="font-semibold">YourBrand Blog</span>
        </div>
      </div>

      {/* Article */}
      <div className="p-6">
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase mb-2">Wellness • 5 min read</p>
          <h1 className={`font-bold text-gray-900 mb-4 ${isMobile ? "text-xl" : "text-2xl"}`}>
            How Our Product Actually Works
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div>
              <p className="font-medium">Dr. Jane Smith</p>
              <p className="text-sm text-gray-400">January 15, 2025</p>
            </div>
          </div>
        </div>

        <div className="aspect-video bg-gray-100 rounded-lg mb-6" />

        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Understanding how wellness products work is crucial for making informed decisions
            about your health journey. In this article, we&apos;ll explore the science behind
            our approach.
          </p>

          <div className="py-4">{widget}</div>

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

function EmailMockup({ brandColor, widget, isMobile }: MockupProps) {
  return (
    <div>
      {/* Email Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full" style={{ backgroundColor: brandColor }} />
          <div>
            <p className="font-medium">YourBrand Support</p>
            <p className="text-sm text-gray-400">support@yourbrand.com</p>
          </div>
        </div>
        <p className="font-semibold">Thank you for your order!</p>
      </div>

      {/* Email Body */}
      <div className="p-6 space-y-4">
        <p>Hi there,</p>
        <p className="text-gray-600">
          Thank you for your recent purchase! We&apos;re excited for you to start your
          wellness journey with us.
        </p>

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>

        <p>
          Best regards,
          <br />
          The YourBrand Team
        </p>

        {/* Signature */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full" style={{ backgroundColor: brandColor }} />
            <div>
              <p className="font-medium">Jane Doe</p>
              <p className="text-sm text-gray-400">Customer Success Manager</p>
            </div>
          </div>

          <div className={isMobile ? "" : "max-w-sm"}>{widget}</div>
        </div>
      </div>
    </div>
  );
}

export default PresentationMode;
