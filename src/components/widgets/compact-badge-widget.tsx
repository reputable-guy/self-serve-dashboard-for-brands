"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronRight } from "lucide-react";

interface CompactBadgeWidgetProps {
  participantCount: number;
  studyTitle: string;
  onOpenModal: () => void;
  /** Optional headline to display (varies by mode) */
  badgeHeadline?: string;
}

/**
 * FrontRowMD-inspired minimal badge widget
 * Shows participant count + "Learn More" - minimal footprint on product page
 */
export function CompactBadgeWidget({
  participantCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studyTitle,
  onOpenModal,
}: CompactBadgeWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onOpenModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group flex items-center gap-3 px-4 py-3
        bg-white border border-gray-200 rounded-lg
        shadow-sm hover:shadow-md hover:border-[#00D1C1]/30
        transition-all duration-200 cursor-pointer
        ${isHovered ? "scale-[1.02]" : "scale-100"}
      `}
    >
      {/* Verified badge icon */}
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#00D1C1]/10">
        <BadgeCheck className="h-5 w-5 text-[#00D1C1]" />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900">
            {participantCount} verified participants
          </span>
        </div>
        <p className="text-xs text-gray-500">
          completed a study on this product
        </p>
      </div>

      {/* Learn More CTA */}
      <div className="flex items-center gap-1 text-xs font-medium text-[#00D1C1] group-hover:text-[#00A89D]">
        <span>{isHovered ? "View Results" : "Learn More"}</span>
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

/**
 * Floating badge variant - for bottom corner placement like FrontRowMD
 *
 * Design: Headline varies by mode, "Verified by Reputable" stays constant
 * - Aggregate mode: "23% more daily activity"
 * - NPS mode: "83% would recommend"
 * - Simple mode: "18 participants verified"
 */
export function FloatingBadgeWidget({
  participantCount,
  onOpenModal,
  badgeHeadline,
}: CompactBadgeWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Default headline if not provided
  const headline = badgeHeadline || `${participantCount} participants verified`;

  return (
    <button
      onClick={onOpenModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex items-center gap-3 px-4 py-3
        bg-white border border-gray-200 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-200 cursor-pointer
        ${isHovered ? "scale-[1.02]" : "scale-100"}
      `}
    >
      {/* Reputable logo */}
      <Image
        src="/logos/reputable-icon-dark.png"
        alt="Reputable"
        width={24}
        height={24}
        className="h-6 w-6"
        unoptimized
      />

      {/* Content - Headline varies, subtitle stays constant */}
      <div className="text-left">
        <span className="text-sm font-medium text-gray-900">
          {headline}
        </span>
        <p className="text-[10px] text-gray-400">
          Verified by Reputable
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00D1C1]" />
    </button>
  );
}
