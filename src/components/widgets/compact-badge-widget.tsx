"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronRight } from "lucide-react";

// Avatar colors for participants (when no image is available)
const AVATAR_COLORS = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-purple-400 to-purple-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
];

interface ParticipantAvatar {
  id: string;
  initials: string;
  imageUrl?: string;
}

interface FloatingBadgeWidgetProps {
  /** Number of participants in the study */
  participantCount: number;
  /** Study title (for aria label) */
  studyTitle: string;
  /** Callback when badge is clicked to open modal */
  onOpenModal: () => void;
  /** Main headline text - varies by display mode */
  badgeHeadline?: string;
  /** Participant avatars to display (first 3-4 shown) */
  participants?: ParticipantAvatar[];
  /** Brand color for customization (hex) - defaults to Reputable teal */
  brandColor?: string;
  /** Storage key for dismiss state */
  storageKey?: string;
  /** Callback when badge is dismissed */
  onDismiss?: () => void;
}

/**
 * Participant Avatar Stack - shows overlapping avatars like FrontRowMD
 */
function AvatarStack({
  participants,
  totalCount,
  brandColor,
}: {
  participants: ParticipantAvatar[];
  totalCount: number;
  brandColor: string;
}) {
  const displayAvatars = participants.slice(0, 4);
  const remainingCount = totalCount - displayAvatars.length;

  return (
    <div className="flex items-center -space-x-2">
      {displayAvatars.map((participant, index) => (
        <div
          key={participant.id}
          className="relative h-8 w-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
          style={{ zIndex: displayAvatars.length - index }}
        >
          {participant.imageUrl ? (
            <Image
              src={participant.imageUrl}
              alt={participant.initials}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white text-xs font-semibold`}
            >
              {participant.initials}
            </div>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="relative h-8 w-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-semibold text-white"
          style={{
            zIndex: 0,
            backgroundColor: brandColor,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

/**
 * FrontRowMD-inspired floating badge widget
 *
 * Features:
 * - Stacked participant avatars for social proof
 * - Clear, contextualized messaging
 * - Dismiss (X) button with localStorage persistence
 * - "Verified by Reputable · Learn more →" attribution
 * - Brand color customization
 */
export function FloatingBadgeWidget({
  participantCount,
  studyTitle,
  onOpenModal,
  badgeHeadline,
  participants = [],
  brandColor = "#00D1C1",
  storageKey,
  onDismiss,
}: FloatingBadgeWidgetProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check localStorage for dismiss state on mount
  useEffect(() => {
    if (storageKey) {
      const dismissed = localStorage.getItem(`reputable-widget-dismissed-${storageKey}`);
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    }
  }, [storageKey]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    if (storageKey) {
      localStorage.setItem(`reputable-widget-dismissed-${storageKey}`, "true");
    }
    onDismiss?.();
  };

  // Don't render if dismissed
  if (isDismissed) return null;

  // Default headline if not provided
  const headline = badgeHeadline || `${participantCount} people verified this product`;

  // Generate placeholder avatars if none provided
  const displayParticipants: ParticipantAvatar[] =
    participants.length > 0
      ? participants
      : Array.from({ length: Math.min(4, participantCount) }, (_, i) => ({
          id: `placeholder-${i}`,
          initials: ["SM", "JR", "AL", "MK"][i] || "??",
        }));

  return (
    <div
      className={`
        relative bg-white border border-gray-200 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-200
        ${isHovered ? "scale-[1.02]" : "scale-100"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors z-10"
        aria-label="Dismiss widget"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Main clickable area */}
      <button
        onClick={onOpenModal}
        className="flex flex-col gap-3 p-4 cursor-pointer text-left w-full"
        aria-label={`View verified study results for ${studyTitle}`}
      >
        {/* Top row: Avatars + Headline */}
        <div className="flex items-center gap-3">
          <AvatarStack
            participants={displayParticipants}
            totalCount={participantCount}
            brandColor={brandColor}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {headline}
            </p>
          </div>
        </div>

        {/* Bottom row: Attribution + Learn more */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Image
              src="/logos/reputable-icon-dark.png"
              alt="Reputable"
              width={16}
              height={16}
              className="h-4 w-4"
              unoptimized
            />
            <span className="text-xs text-gray-500">
              Verified by Reputable
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: brandColor }}
          >
            <span>Learn more</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </button>
    </div>
  );
}

/**
 * Inline badge variant - for placement within product info section
 * Simpler design without dismiss button, for embedded use
 */
export function InlineBadgeWidget({
  participantCount,
  studyTitle,
  onOpenModal,
  badgeHeadline,
  participants = [],
  brandColor = "#00D1C1",
}: Omit<FloatingBadgeWidgetProps, "storageKey" | "onDismiss">) {
  // Default headline if not provided
  const headline = badgeHeadline || `${participantCount} people verified this product`;

  // Generate placeholder avatars if none provided
  const displayParticipants: ParticipantAvatar[] =
    participants.length > 0
      ? participants
      : Array.from({ length: Math.min(3, participantCount) }, (_, i) => ({
          id: `placeholder-${i}`,
          initials: ["SM", "JR", "AL"][i] || "??",
        }));

  return (
    <button
      onClick={onOpenModal}
      className="group w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      aria-label={`View verified study results for ${studyTitle}`}
    >
      {/* Avatars */}
      <div className="flex items-center -space-x-1.5">
        {displayParticipants.slice(0, 3).map((participant, index) => (
          <div
            key={participant.id}
            className="relative h-7 w-7 rounded-full border-2 border-white shadow-sm overflow-hidden"
            style={{ zIndex: 3 - index }}
          >
            {participant.imageUrl ? (
              <Image
                src={participant.imageUrl}
                alt={participant.initials}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white text-[10px] font-semibold`}
              >
                {participant.initials}
              </div>
            )}
          </div>
        ))}
        {participantCount > 3 && (
          <div
            className="relative h-7 w-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-semibold text-white"
            style={{ backgroundColor: brandColor }}
          >
            +{participantCount - 3}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {headline}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Image
            src="/logos/reputable-icon-dark.png"
            alt="Reputable"
            width={12}
            height={12}
            className="h-3 w-3"
            unoptimized
          />
          <span>Verified by Reputable</span>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight
        className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform"
        style={{ color: brandColor }}
      />
    </button>
  );
}

// Legacy export for backwards compatibility
export { FloatingBadgeWidget as CompactBadgeWidget };
