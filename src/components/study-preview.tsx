import { PhoneMockup } from "./phone-mockup";
import { Watch, Clock } from "lucide-react";

interface StudyPreviewProps {
  productName: string;
  productImage: string;
  category: string;
  rebateAmount?: string;
  durationDays?: string;
  totalSpots?: string;
  requiredDevice?: string;
  studyTitle?: string;
  hookQuestion?: string;
  villainVariable?: string;
}

const deviceLabels: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

export function StudyPreview({
  productName,
  productImage,
  rebateAmount,
  durationDays,
  totalSpots,
  requiredDevice,
  studyTitle: customStudyTitle,
  hookQuestion,
  villainVariable,
}: StudyPreviewProps) {
  const studyTitle = customStudyTitle || (productName ? `${productName} Study` : "Your Study Title");

  // Calculate heartbeats from rebate (rebate × 100)
  const rebateNum = parseFloat(rebateAmount || "0");
  const heartbeats = rebateNum > 0 ? Math.round(rebateNum * 100) : 0;
  const heartbeatsFormatted = heartbeats > 0 ? heartbeats.toLocaleString() : "--";
  const rebateFormatted = rebateNum > 0 ? rebateNum.toFixed(0) : "--";

  // Format duration
  const duration = durationDays || "--";

  // Format spots
  const spots = totalSpots || "--";

  // Format device
  const device = requiredDevice ? deviceLabels[requiredDevice] || "Any Device" : "Any Device";

  // What's included text
  const whatsIncluded = rebateNum > 0
    ? `$${rebateNum.toFixed(0)} rebate upon completion`
    : "Details coming in next step";

  return (
    <PhoneMockup>
      <div className="px-4 pb-8">
        {/* Study Card */}
        <div className="bg-[#1a2332] rounded-2xl overflow-hidden border border-gray-800">
          {/* Image Section */}
          <div className="relative aspect-[16/10] bg-gray-800">
            {productImage ? (
              <img
                src={productImage}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-600 text-sm">Product image</div>
              </div>
            )}

            {/* Status Badge - Top Left */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                Draft
              </span>
            </div>

            {/* Spots Indicator - Top Right */}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {spots} spots
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Heartbeats Line */}
            <div className="text-sm text-gray-400">
              Earn up to:{" "}
              <span className="text-white">
                💗 +{heartbeatsFormatted}{" "}
                <span className="text-gray-500">(≈ ${rebateFormatted} in rewards)</span>
              </span>
            </div>

            {/* Study Title */}
            <h3 className="text-lg font-semibold text-white leading-tight">
              {studyTitle}
            </h3>

            {/* Hook Question */}
            <p className="text-sm text-gray-400 italic">
              {hookQuestion || "Your hook question will appear here..."}
            </p>

            {/* What's Included Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1520] text-sm text-gray-300">
              <span>🎁</span>
              <span>{whatsIncluded}</span>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Watch className="w-3.5 h-3.5" />
                <span>{device}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{duration} Days</span>
              </div>
            </div>

            {/* Weekly Check-in Indicator */}
            {villainVariable && (
              <div className="flex items-center gap-1.5 pt-2 text-xs text-[#00D1C1]">
                <span>📋</span>
                <span>Weekly check-ins configured</span>
              </div>
            )}
          </div>
        </div>

        {/* Helper text below preview */}
        <p className="text-center text-xs text-gray-500 mt-4 px-4">
          This is how your study will appear to participants in the Reputable app
        </p>
      </div>
    </PhoneMockup>
  );
}
