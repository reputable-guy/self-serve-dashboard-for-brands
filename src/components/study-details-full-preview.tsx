import { PhoneMockup } from "./phone-mockup";
import {
  Watch,
  Clock,
  Check,
  Download,
  RefreshCw,
  MessageSquare,
  ClipboardList,
  ChevronDown,
  Gift,
  Heart,
  BarChart3,
  Package,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Icon mapping for What You'll Do items
const WHAT_YOULL_DO_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  download: { icon: Download, color: "text-[#00D1C1]" },
  watch: { icon: Watch, color: "text-gray-400" },
  gift: { icon: Gift, color: "text-amber-400" },
  message: { icon: MessageSquare, color: "text-blue-400" },
  refresh: { icon: RefreshCw, color: "text-gray-400" },
  clipboard: { icon: ClipboardList, color: "text-purple-400" },
  package: { icon: Package, color: "text-amber-400" },
  sparkles: { icon: Sparkles, color: "text-yellow-400" },
};

// Icon mapping for What You'll Get items
const WHAT_YOULL_GET_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  package: { icon: Gift, color: "text-amber-400" },
  heart: { icon: Heart, color: "text-red-400" },
  chart: { icon: BarChart3, color: "text-blue-400" },
};

export interface WhatYoullDoItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface WhatYoullDoSection {
  sectionTitle: string;
  items: WhatYoullDoItem[];
}

export interface WhatYoullGetItem {
  icon: string;
  item: string;
  note: string;
  value: string;
}

interface StudyDetailsFullPreviewProps {
  productName: string;
  productImage: string;
  productDescription: string;
  category: string;
  rebateAmount: number;
  durationDays: number;
  totalSpots: number;
  requiredDevice: "required" | "optional" | "none";
  whatYoullDiscover: string[];
  howItWorks: string;
  // New structured props
  whatYoullDoSections?: WhatYoullDoSection[];
  whatYoullGet?: WhatYoullGetItem[];
  // Legacy props (for backward compatibility)
  dailyRoutine?: string;
  tier?: number;
}

const deviceLabels: Record<string, string> = {
  required: "Wearable Required",
  optional: "Wearable Optional",
  none: "No Wearable Needed",
};

// Generate default What You'll Do sections based on tier and product
function generateDefaultWhatYoullDo(
  productName: string,
  category: string,
  durationDays: number,
  tier: number
): WhatYoullDoSection[] {
  const sections: WhatYoullDoSection[] = [
    {
      sectionTitle: "Getting Started (One-Time)",
      items: [
        {
          icon: "download",
          title: `Receive your ${productName}`,
          subtitle: "Product shipped to your door with instructions",
        },
      ],
    },
    {
      sectionTitle: "Your Daily Routine",
      items: [
        ...(tier <= 2
          ? [
              {
                icon: "watch",
                title: "Wear your device day and night",
                subtitle: `Keep charged and wear continuously to track ${category.toLowerCase()}`,
              },
            ]
          : []),
        {
          icon: "gift",
          title: `Use ${productName} as directed`,
          subtitle: "Follow the provided usage instructions",
        },
        {
          icon: "message",
          title: "Quick daily check-in",
          subtitle: "~1 minute in the Reputable app",
        },
        {
          icon: "refresh",
          title: "Repeat",
          subtitle: `Follow these steps daily for ${durationDays} days`,
        },
      ],
    },
    {
      sectionTitle: "Surveys",
      items: [
        {
          icon: "clipboard",
          title: "Complete in Reputable app",
          subtitle: "Wellness survey (Day 0) and optional Feedback survey at End-of-Study",
        },
      ],
    },
  ];
  return sections;
}

// Generate default What You'll Get items
function generateDefaultWhatYoullGet(
  productName: string,
  category: string,
  rebateAmount: number,
  durationDays: number
): WhatYoullGetItem[] {
  const heartbeats = rebateAmount * 100;
  return [
    {
      icon: "package",
      item: `${productName} Supply`,
      note: `${durationDays}-day supply shipped to your door`,
      value: `$${Math.round(rebateAmount * 2)}`,
    },
    {
      icon: "heart",
      item: `${heartbeats.toLocaleString()} Heartbeats`,
      note: "Redeemable for Amazon gift cards (requires ≥70% compliance + study completion)",
      value: `$${rebateAmount}`,
    },
    {
      icon: "chart",
      item: "Personalized Insights",
      note: `See how your ${category.toLowerCase()} changed during the study`,
      value: "Free",
    },
  ];
}

export function StudyDetailsFullPreview({
  productName,
  productImage,
  productDescription,
  category,
  rebateAmount,
  durationDays,
  totalSpots,
  requiredDevice,
  whatYoullDiscover,
  howItWorks,
  whatYoullDoSections,
  whatYoullGet,
  tier = 1,
}: StudyDetailsFullPreviewProps) {
  const heartbeats = rebateAmount * 100;
  const heartbeatsFormatted = heartbeats.toLocaleString();
  const device = deviceLabels[requiredDevice] || "Any Device";

  // Use provided sections or generate defaults
  const doSections =
    whatYoullDoSections ||
    generateDefaultWhatYoullDo(productName, category, durationDays, tier);

  // Use provided items or generate defaults
  const getItems =
    whatYoullGet ||
    generateDefaultWhatYoullGet(productName, category, rebateAmount, durationDays);

  // Calculate total value from What You'll Get items
  const totalValue = getItems.reduce((sum, item) => {
    const numValue = parseFloat(item.value.replace(/[^0-9.]/g, "")) || 0;
    return sum + numValue;
  }, 0);

  return (
    <PhoneMockup>
      <div className="h-[600px] flex flex-col bg-[#111827]">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Hero Header */}
          <div className="relative">
            {/* Hero Image */}
            <div className="aspect-[16/9] bg-gray-800">
              {productImage ? (
                <img
                  src={productImage}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <div className="text-gray-500 text-sm">{productName || "Product image"}</div>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
            </div>

            {/* Status badges */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/90 text-white">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1" />
                Recruiting
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {totalSpots} spots left
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 -mt-6 relative z-10">
            {/* Title Section */}
            <h1 className="text-lg font-bold text-white mb-1">
              {productName || "Study Title"}
            </h1>
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
              {productDescription || `Can ${productName} help improve your ${category.toLowerCase()}?`}
            </p>

            {/* Heartbeats */}
            <p className="text-xs text-gray-400 mb-4">
              Earn up to:{" "}
              <span className="text-white">
                <span className="text-red-400">❤️</span> +{heartbeatsFormatted} (≈ ${rebateAmount} in rewards)
              </span>
            </p>

            {/* ✨ What You'll Discover About You */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                <span>✨</span> What You&apos;ll Discover About You
              </h2>
              <div className="space-y-2">
                {whatYoullDiscover.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                A {durationDays}-day study exploring how {productName} impacts {category.toLowerCase()}.
              </p>
            </div>

            {/* Study Info Row */}
            <div className="flex items-center gap-3 mb-5 text-[10px] text-gray-500">
              <div className="flex items-center gap-1">
                <Watch className="w-3 h-3" />
                <span>{device}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{durationDays} Days</span>
              </div>
            </div>

            {/* 📋 What You'll Do */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-1">
                <span>📋</span> What You&apos;ll Do
              </h2>

              {doSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <p className="text-[10px] text-[#00D1C1] uppercase tracking-wide mb-2">
                    {section.sectionTitle}
                  </p>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => {
                      const iconConfig = WHAT_YOULL_DO_ICONS[item.icon] || WHAT_YOULL_DO_ICONS.gift;
                      const IconComponent = iconConfig.icon;
                      return (
                        <div key={itemIndex} className="flex gap-2 items-start">
                          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <IconComponent className={`w-3 h-3 ${iconConfig.color}`} />
                          </div>
                          <div>
                            <p className="text-xs text-white font-medium">{item.title}</p>
                            <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ How It Works */}
            {howItWorks && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                  <span>✅</span> How It Works
                </h2>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-300 font-medium mb-1">What is {productName}?</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{howItWorks}</p>
                </div>
              </div>
            )}

            {/* 🎁 What You'll Get */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-1">
                <span>🎁</span> What You&apos;ll Get
              </h2>
              <div className="space-y-3">
                {getItems.map((item, index) => {
                  const iconConfig = WHAT_YOULL_GET_ICONS[item.icon] || WHAT_YOULL_GET_ICONS.package;
                  const IconComponent = iconConfig.icon;
                  return (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <IconComponent className={`w-4 h-4 ${iconConfig.color} mt-0.5`} />
                        <div>
                          <p className="text-xs text-white font-medium">{item.item}</p>
                          <p className="text-[10px] text-gray-500">{item.note}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white font-medium">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <span className="text-sm text-white font-semibold">Total Value</span>
                </div>
                <span className="text-sm text-[#00D1C1] font-bold">${totalValue}+</span>
              </div>
            </div>

            {/* Study Details (Collapsible placeholder) */}
            <div className="mb-4">
              <button className="w-full flex items-center justify-between py-3 text-sm text-white border-t border-gray-700">
                <span>Study Details</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Resources (Collapsible placeholder) */}
            <div className="mb-4">
              <button className="w-full flex items-center justify-between py-3 text-sm text-white border-t border-gray-700">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed CTA Button - Outside scroll area */}
        <div className="flex-shrink-0 p-4 bg-[#111827] border-t border-gray-800">
          <div className="bg-[#c8f65d] text-center py-3 rounded-xl">
            <p className="text-sm font-semibold text-gray-900">Join Study</p>
            <p className="text-[10px] text-gray-700">{totalSpots} spots left • No labs required</p>
          </div>
        </div>
      </div>
    </PhoneMockup>
  );
}

// Export utility functions for generating defaults
export { generateDefaultWhatYoullDo, generateDefaultWhatYoullGet };
