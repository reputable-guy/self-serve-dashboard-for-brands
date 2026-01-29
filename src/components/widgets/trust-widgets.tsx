"use client";

/**
 * Trust Widgets — Multiple styles for product page integration
 * 
 * Three widget styles:
 * 1. TrustStrip — Compact horizontal bar, minimal footprint
 * 2. TrustCard — Polished floating/positioned card
 * 3. TrustSection — Full-width inline section with participant previews
 * 
 * Design principles:
 * - Clean, professional, unobtrusive
 * - Clear value proposition in one glance
 * - Something brands would actually put on their sites
 */

import { Shield, ChevronRight, Check, Users, Star, ExternalLink } from "lucide-react";
import Image from "next/image";

// ============================================
// TYPES
// ============================================

export interface TrustWidgetParticipant {
  id: string;
  initials: string;
  imageUrl?: string;
  name?: string;
  metric?: string;
}

export interface TrustWidgetProps {
  participantCount: number;
  headline: string;
  subheadline?: string;
  participants?: TrustWidgetParticipant[];
  brandColor?: string;
  onOpenModal: () => void;
}

// ============================================
// AVATAR STACK (shared)
// ============================================

const AVATAR_COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#8B5CF6", // purple
  "#F59E0B", // amber
  "#EC4899", // pink
];

function MiniAvatarStack({
  participants,
  totalCount,
  brandColor = "#00D1C1",
  size = "sm",
}: {
  participants: TrustWidgetParticipant[];
  totalCount: number;
  brandColor?: string;
  size?: "sm" | "md";
}) {
  const displayAvatars = participants.slice(0, 3);
  const remainingCount = totalCount - displayAvatars.length;
  const sizeClass = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

  return (
    <div className="flex items-center -space-x-1.5">
      {displayAvatars.map((participant, index) => (
        <div
          key={participant.id}
          className={`relative ${sizeClass} rounded-full border-2 border-white shadow-sm overflow-hidden`}
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
              className="h-full w-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
            >
              {participant.initials}
            </div>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`relative ${sizeClass} rounded-full border-2 border-white shadow-sm flex items-center justify-center font-semibold text-white`}
          style={{ backgroundColor: brandColor }}
        >
          +{remainingCount > 99 ? "99" : remainingCount}
        </div>
      )}
    </div>
  );
}

// ============================================
// 1. TRUST STRIP — Compact horizontal bar
// ============================================

export function TrustStripWidget({
  participantCount,
  headline,
  participants = [],
  brandColor = "#00D1C1",
  onOpenModal,
}: TrustWidgetProps) {
  const displayParticipants = participants.length > 0
    ? participants
    : [
        { id: "1", initials: "JR" },
        { id: "2", initials: "SM" },
        { id: "3", initials: "AL" },
      ];

  return (
    <button
      onClick={onOpenModal}
      className="group w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        {/* Verification badge */}
        <div 
          className="flex items-center justify-center h-5 w-5 rounded-full"
          style={{ backgroundColor: `${brandColor}20` }}
        >
          <Shield className="h-3 w-3" style={{ color: brandColor }} />
        </div>
        
        {/* Avatars */}
        <MiniAvatarStack
          participants={displayParticipants}
          totalCount={participantCount}
          brandColor={brandColor}
          size="sm"
        />
        
        {/* Text */}
        <span className="text-sm text-gray-700">
          <span className="font-medium">{participantCount} verified</span>
          <span className="text-gray-500 hidden sm:inline"> · Tracked with wearables</span>
        </span>
      </div>
      
      {/* CTA */}
      <div 
        className="flex items-center gap-1 text-xs font-medium group-hover:gap-1.5 transition-all"
        style={{ color: brandColor }}
      >
        <span>See results</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

// ============================================
// 2. TRUST CARD — Polished positioned card
// ============================================

export function TrustCardWidget({
  participantCount,
  headline,
  subheadline,
  participants = [],
  brandColor = "#00D1C1",
  onOpenModal,
}: TrustWidgetProps) {
  const displayParticipants = participants.length > 0
    ? participants
    : [
        { id: "1", initials: "JR" },
        { id: "2", initials: "SM" },
        { id: "3", initials: "AL" },
      ];

  return (
    <button
      onClick={onOpenModal}
      className="group w-full max-w-[280px] bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden text-left"
    >
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatars */}
          <MiniAvatarStack
            participants={displayParticipants}
            totalCount={participantCount}
            brandColor={brandColor}
            size="md"
          />
          
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-snug">
              {headline}
            </p>
            {subheadline && (
              <p className="text-xs text-gray-500 mt-0.5">
                {subheadline}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div 
        className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100"
        style={{ backgroundColor: `${brandColor}08` }}
      >
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" style={{ color: brandColor }} />
          <span className="text-xs text-gray-600">Verified by Reputable</span>
        </div>
        <div 
          className="flex items-center gap-1 text-xs font-medium group-hover:gap-1.5 transition-all"
          style={{ color: brandColor }}
        >
          <span>Learn more</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}

// ============================================
// 3. TRUST SECTION — Full-width inline section
// ============================================

export function TrustSectionWidget({
  participantCount,
  headline,
  subheadline,
  participants = [],
  brandColor = "#00D1C1",
  onOpenModal,
}: TrustWidgetProps & { showParticipantPreviews?: boolean }) {
  const displayParticipants = participants.length > 0
    ? participants.slice(0, 3)
    : [
        { id: "1", initials: "JR", name: "James R.", metric: "+18% HRV" },
        { id: "2", initials: "SM", name: "Sarah M.", metric: "+24% Deep Sleep" },
        { id: "3", initials: "AL", name: "Alex L.", metric: "+12% Recovery" },
      ];

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center justify-center h-6 w-6 rounded-full"
            style={{ backgroundColor: `${brandColor}15` }}
          >
            <Shield className="h-3.5 w-3.5" style={{ color: brandColor }} />
          </div>
          <span className="text-sm font-medium text-gray-900">
            Verified Results
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            · {participantCount} participants
          </span>
        </div>
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: brandColor }}
        >
          View study
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
      
      {/* Main content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-4">
          {headline}
        </p>
        
        {/* Participant previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {displayParticipants.map((participant, index) => (
            <div 
              key={participant.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              >
                {participant.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {participant.name || `Participant ${index + 1}`}
                </p>
                <p 
                  className="text-xs font-medium"
                  style={{ color: brandColor }}
                >
                  {participant.metric || "Verified"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            28-day study · Oura Ring verified · Independent analysis
          </p>
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            <Users className="h-3 w-3" />
            See all results
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLE SELECTOR TYPE
// ============================================

export type WidgetStyle = "strip" | "card" | "section";

export const WIDGET_STYLES: { value: WidgetStyle; label: string; description: string }[] = [
  {
    value: "strip",
    label: "Trust Strip",
    description: "Compact bar — minimal footprint, works anywhere",
  },
  {
    value: "card",
    label: "Trust Card", 
    description: "Floating card — more prominent, positioned placement",
  },
  {
    value: "section",
    label: "Trust Section",
    description: "Full-width section — maximum visibility, shows participants",
  },
];
