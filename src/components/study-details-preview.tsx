import { PhoneMockup } from "./phone-mockup";
import { Watch, Clock, Check } from "lucide-react";
import { DiscoverItem, RoutineStep, ValueItem } from "@/lib/study-context";

interface StudyDetailsPreviewProps {
  productName: string;
  productImage: string;
  studyTitle: string;
  hookQuestion: string;
  rebateAmount: string;
  durationDays: string;
  totalSpots: string;
  requiredDevice: string;
  discoverItems: DiscoverItem[];
  dailyRoutine: RoutineStep[];
  whatYouGet: ValueItem[];
}

const deviceLabels: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

export function StudyDetailsPreview({
  productImage,
  studyTitle,
  hookQuestion,
  rebateAmount,
  durationDays,
  totalSpots,
  requiredDevice,
  discoverItems,
  dailyRoutine,
  whatYouGet,
}: StudyDetailsPreviewProps) {
  const rebateNum = parseFloat(rebateAmount || "0");
  const heartbeats = rebateNum > 0 ? Math.round(rebateNum * 100) : 0;
  const heartbeatsFormatted = heartbeats > 0 ? heartbeats.toLocaleString() : "--";
  const rebateFormatted = rebateNum > 0 ? rebateNum.toFixed(0) : "--";
  const duration = durationDays || "30";
  const spots = totalSpots || "--";
  const device = requiredDevice ? deviceLabels[requiredDevice] || "Any Device" : "Any Device";

  // Calculate total value
  const totalValue = whatYouGet.reduce((sum, item) => {
    const match = item.value.match(/\$(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <PhoneMockup>
      <div className="h-[520px] overflow-y-auto scrollbar-thin">
        {/* Header */}
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
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-600 text-sm">Product image</div>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
          </div>

          {/* Status badges */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-700 text-gray-300">
              Draft
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white">
              {spots} spots
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 -mt-8 relative z-10">
          {/* Title Section */}
          <h1 className="text-xl font-bold text-white mb-1">{studyTitle || "Your Study Title"}</h1>
          <p className="text-sm text-gray-400 mb-3">{hookQuestion || "Your hook question..."}</p>

          {/* Heartbeats */}
          <p className="text-xs text-gray-400 mb-4">
            Earn up to:{" "}
            <span className="text-white">
              💗 +{heartbeatsFormatted} (≈ ${rebateFormatted} in rewards)
            </span>
          </p>

          {/* What You'll Discover */}
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
              <span>✨</span> What You&apos;ll Discover About You
            </h2>
            <div className="space-y-2">
              {discoverItems.slice(0, 3).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white font-medium">{item.question}</p>
                    <p className="text-[10px] text-gray-500">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
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
              <span>{duration} Days</span>
            </div>
          </div>

          {/* What You'll Do */}
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white mb-2">📋 What You&apos;ll Do</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Your Daily Routine</p>
            <div className="space-y-2">
              {dailyRoutine.map((step, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="w-4 h-4 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] text-[#00D1C1] font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">{step.action}</p>
                    <p className="text-[10px] text-gray-500">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Get */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white mb-2">🎁 What You&apos;ll Get</h2>
            <div className="space-y-2">
              {whatYouGet.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white">{item.item}</p>
                    <p className="text-[10px] text-gray-500">{item.note}</p>
                  </div>
                  <span className="text-xs text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-800">
              <span className="text-xs text-white font-semibold">Total Value</span>
              <span className="text-sm text-[#00D1C1] font-bold">${totalValue}+</span>
            </div>
          </div>

          {/* CTA Button - scrolls with content */}
          <div className="bg-[#00D1C1] text-center py-2.5 rounded-lg mb-4">
            <p className="text-xs font-semibold text-white">Join Study</p>
            <p className="text-[10px] text-white/80">{spots} spots left</p>
          </div>
        </div>
      </div>
    </PhoneMockup>
  );
}
