"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBadgeWidget, InlineBadgeWidget } from "@/components/widgets/compact-badge-widget";
import { VerificationModal } from "@/components/widgets/verification-modal";
import {
  getWidgetDataForStudy,
  getBestWidgetMode,
  hasWidgetData,
} from "@/lib/widget-data";

// Product info mapped by study ID with hex brand colors
const PRODUCT_INFO: Record<
  string,
  {
    name: string;
    tagline: string;
    price: string;
    originalPrice: string;
    rating: number;
    reviewCount: number;
    description: string;
    brandColorHex: string;
    brandColorClass: string;
    brandColorHover: string;
    brandColorLight: string;
    brandColorText: string;
    brandName: string;
    features: string[];
  }
> = {
  "study-sensate-real": {
    name: "Sensate 2 - Relaxation Device",
    tagline:
      "The 10-Minute Vagus Nerve Device Shown to Cut Stress by 48% and Boost Sleep",
    price: "$299.00",
    originalPrice: "$349.00",
    rating: 4.8,
    reviewCount: 2341,
    description:
      "Sensate uses gentle sound vibrations to quickly calm your nervous system. Just 10 minutes a day can help reduce stress, improve sleep quality, and increase heart rate variability. Backed by clinical research and used by over 100,000 customers worldwide.",
    brandColorHex: "#7C3AED",
    brandColorClass: "bg-purple-600",
    brandColorHover: "hover:bg-purple-700",
    brandColorLight: "bg-purple-50",
    brandColorText: "text-purple-600",
    brandName: "Sensate",
    features: [
      "Sensate 2 Device",
      "USB-C Charging Cable",
      "Carry Pouch",
      "Free App Access",
    ],
  },
  "study-lyfefuel-real": {
    name: "LYFEfuel Daily Essentials Shake",
    tagline:
      "Complete Nutrition Shake for Energy, Focus, and Overall Wellness",
    price: "$59.99",
    originalPrice: "$69.99",
    rating: 4.6,
    reviewCount: 1523,
    description:
      "LYFEfuel Daily Essentials is a plant-based nutrition shake packed with essential vitamins, minerals, and adaptogens. Designed to support energy levels, mental clarity, and overall wellness throughout your day.",
    brandColorHex: "#00A89D",
    brandColorClass: "bg-emerald-600",
    brandColorHover: "hover:bg-emerald-700",
    brandColorLight: "bg-emerald-50",
    brandColorText: "text-emerald-600",
    brandName: "LYFEfuel",
    features: [
      "30-Day Supply",
      "Plant-Based Formula",
      "No Added Sugars",
      "Free Shaker Bottle",
    ],
  },
};

// Helper to get localStorage key for widget config
const getWidgetConfigKey = (studyId: string) => `reputable-widget-config-${studyId}`;

interface WidgetConfig {
  brandColor: string;
  position: "bottom-left" | "bottom-right";
  mode: string | null;
}

export default function DynamicProductPage() {
  const params = useParams();
  const studyId = params.studyId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBadge, setShowFloatingBadge] = useState(true);
  const [showInlineBadge, setShowInlineBadge] = useState(false);

  // Custom widget config from localStorage
  const [customBrandColor, setCustomBrandColor] = useState<string | null>(null);
  const [customPosition, setCustomPosition] = useState<"bottom-left" | "bottom-right">("bottom-left");

  // Load custom config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(getWidgetConfigKey(studyId));
    if (saved) {
      try {
        const config: WidgetConfig = JSON.parse(saved);
        if (config.brandColor) setCustomBrandColor(config.brandColor);
        if (config.position) setCustomPosition(config.position);
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [studyId]);

  // Get widget data
  const widgetData = getWidgetDataForStudy(studyId);
  const bestMode = getBestWidgetMode(studyId);
  const productInfo = PRODUCT_INFO[studyId];

  // If no data available, show error
  if (!hasWidgetData(studyId) || !widgetData || !bestMode || !productInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">No Widget Data</h1>
          <p className="text-muted-foreground mb-6">
            Widget demo is not available for this study. Only completed studies
            with real participant data can show widget previews.
          </p>
          <Link href="/admin/studies">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Studies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Transform participants for avatar display
  const participantAvatars = widgetData.participants.map((p) => ({
    id: p.id,
    initials: p.initials,
    imageUrl: undefined, // Can add real images later
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#00D1C1] to-[#00A89D] text-white py-2 px-4">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
              DEMO
            </span>
            <span className="text-sm">
              This is a mock product page showing the Reputable widget for{" "}
              {productInfo.brandName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showFloatingBadge}
                onChange={(e) => setShowFloatingBadge(e.target.checked)}
                className="rounded"
              />
              Floating badge
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showInlineBadge}
                onChange={(e) => setShowInlineBadge(e.target.checked)}
                className="rounded"
              />
              Inline badge
            </label>
            <Link
              href={`/admin/studies/${studyId}`}
              className="text-sm underline hover:no-underline"
            >
              Back to Study
            </Link>
          </div>
        </div>
      </div>

      {/* Fake Store Header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 ${productInfo.brandColorClass} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white font-bold text-sm">
                  {productInfo.brandName[0]}
                </span>
              </div>
              <span className={`text-xl font-bold ${productInfo.brandColorText}`}>
                {productInfo.brandName}
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Shop
              </span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Science
              </span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                About
              </span>
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart (0)
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-gray-900 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-gray-900 cursor-pointer">Shop</span>
          <span>/</span>
          <span className="text-gray-900">{productInfo.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div
              className={`aspect-square ${productInfo.brandColorLight} rounded-2xl flex items-center justify-center`}
            >
              <div className="text-center">
                <div
                  className={`h-48 w-48 ${productInfo.brandColorClass} rounded-full mx-auto mb-4 shadow-lg`}
                />
                <p className="text-sm text-gray-400">[Product Image]</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 ring-gray-400"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productInfo.name}
              </h1>
              <p className="text-gray-600">{productInfo.tagline}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(productInfo.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {productInfo.rating} ({productInfo.reviewCount.toLocaleString()}{" "}
                reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {productInfo.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {productInfo.originalPrice}
              </span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Save $
                {(
                  parseFloat(productInfo.originalPrice.replace("$", "")) -
                  parseFloat(productInfo.price.replace("$", ""))
                ).toFixed(0)}
              </span>
            </div>

            {/* Reputable Widget - INLINE PLACEMENT (optional) */}
            {showInlineBadge && (
              <div className="py-2">
                <InlineBadgeWidget
                  participantCount={widgetData.participantCount}
                  studyTitle={widgetData.studyTitle}
                  badgeHeadline={bestMode.badgeHeadline}
                  participants={participantAvatars}
                  brandColor={customBrandColor || productInfo.brandColorHex}
                  onOpenModal={() => setIsModalOpen(true)}
                />
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                className={`w-full h-14 text-lg ${productInfo.brandColorClass} ${productInfo.brandColorHover} gap-2`}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full h-12">
                Buy with Shop Pay
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className={`h-5 w-5 ${productInfo.brandColorText}`} />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className={`h-5 w-5 ${productInfo.brandColorText}`} />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className={`h-5 w-5 ${productInfo.brandColorText}`} />
                <span>30 Day Returns</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {productInfo.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">What&apos;s Included</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {productInfo.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge (optional) */}
      {showFloatingBadge && (
        <div className={`fixed bottom-6 ${customPosition === "bottom-right" ? "right-6" : "left-6"} z-40 max-w-sm`}>
          <FloatingBadgeWidget
            participantCount={widgetData.participantCount}
            studyTitle={widgetData.studyTitle}
            badgeHeadline={bestMode.badgeHeadline}
            participants={participantAvatars}
            brandColor={customBrandColor || productInfo.brandColorHex}
            storageKey={studyId}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {/* Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        study={{
          title: widgetData.studyTitle,
          participantCount: widgetData.participantCount,
          durationDays: widgetData.durationDays,
          wearableType: widgetData.wearableType,
          compensationNote: widgetData.compensationNote,
        }}
        participants={widgetData.participants}
        verifyPageUrl={widgetData.verifyPageUrl}
      />
    </div>
  );
}
