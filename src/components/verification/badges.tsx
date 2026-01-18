"use client";

import { Check, ExternalLink, Shield } from "lucide-react";
import type { TierLevel } from "@/lib/types";

/**
 * Reputable Seal - main verification badge
 */
export function ReputableSeal({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { container: "h-16 w-16", shield: "h-6 w-6", check: "h-3 w-3", text: "text-xs" },
    md: { container: "h-24 w-24", shield: "h-8 w-8", check: "h-4 w-4", text: "text-sm" },
    lg: { container: "h-32 w-32", shield: "h-10 w-10", check: "h-5 w-5", text: "text-base" },
  };
  const s = sizes[size];

  return (
    <div className={`${s.container} rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] p-1 shadow-lg`}>
      <div className="h-full w-full rounded-full bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <Shield className={`${s.shield} text-[#00D1C1]`} />
          <Check className={`absolute inset-0 m-auto ${s.check} text-[#00D1C1]`} />
        </div>
        <span className={`${s.text} font-semibold text-[#00D1C1] mt-1`}>VERIFIED</span>
      </div>
    </div>
  );
}

/**
 * Inline verified badge for use within text or next to items
 */
export function InlineVerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00D1C1] bg-[#00D1C1]/10 px-2 py-0.5 rounded-full">
      <Check className="h-3 w-3" />
      {label}
    </span>
  );
}

/**
 * Tier badge showing the measurement tier (1-4)
 */
export function TierBadge({ tier }: { tier: TierLevel }) {
  const tierNames: Record<TierLevel, string> = {
    1: "Wearable Primary",
    2: "Co-Primary",
    3: "Assessment Primary",
    4: "Assessment Only",
  };

  const tierColors: Record<TierLevel, string> = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-purple-100 text-purple-700",
    3: "bg-amber-100 text-amber-700",
    4: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tierColors[tier]}`}>
      Tier {tier}: {tierNames[tier]}
    </span>
  );
}

/**
 * Compact verification badge for embedding in story cards
 */
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
      <span className="text-xs text-[#00D1C1]/70 hidden group-hover:inline">• Click to see proof</span>
      <ExternalLink className="h-3 w-3 text-[#00D1C1] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
