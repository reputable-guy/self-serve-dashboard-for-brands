"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Star,
  ExternalLink,
  Shield,
} from "lucide-react";

interface ParticipantPreview {
  id: string;
  name: string;
  initials: string;
  rating: number;
  primaryMetric: {
    label: string;
    value: string;
  };
  quote: string;
  device: string;
  verificationId: string;
}

interface StudyInfo {
  title: string;
  participantCount: number;
  durationDays: number;
  wearableType: string;
  compensationNote?: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  study: StudyInfo;
  participants: ParticipantPreview[];
  verifyPageUrl?: string;
  brandColor?: string;
}

// FAQ item component with expand/collapse
function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

// Participant card in the modal
function ParticipantCard({ participant, brandColor = "#00D1C1" }: { participant: ParticipantPreview; brandColor?: string }) {
  // Compute darker shade for hover/gradient
  const darkerColor = brandColor.replace(/^#/, '');
  const r = Math.max(0, parseInt(darkerColor.substring(0, 2), 16) - 20);
  const g = Math.max(0, parseInt(darkerColor.substring(2, 4), 16) - 20);
  const b = Math.max(0, parseInt(darkerColor.substring(4, 6), 16) - 20);
  const darkColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Avatar */}
      <div 
        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${brandColor}, ${darkColor})` }}
      >
        {participant.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 text-sm">
            {participant.name}
          </span>
          <BadgeCheck className="h-4 w-4" style={{ color: brandColor }} />
          {/* Star rating */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= participant.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Metric + Device */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
          <span className="font-semibold" style={{ color: brandColor }}>
            {participant.primaryMetric.value} {participant.primaryMetric.label}
          </span>
          <span className="text-gray-400">·</span>
          <span>{participant.device}</span>
        </div>

        {/* Quote */}
        <p className="text-xs text-gray-500 italic line-clamp-2">
          &quot;{participant.quote}&quot;
        </p>
      </div>

      {/* View Story Link */}
      <Link
        href={`/verify/${participant.verificationId}`}
        target="_blank"
        className="flex items-center gap-1 text-xs font-medium flex-shrink-0 hover:opacity-80"
        style={{ color: brandColor }}
      >
        View Story
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

export function VerificationModal({
  isOpen,
  onClose,
  study,
  participants,
  verifyPageUrl,
  brandColor = "#00D1C1",
}: VerificationModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // FAQs - FrontRowMD inspired
  const faqs = [
    {
      question: "What is Reputable?",
      answer:
        "Reputable runs verified studies where real people test products and track their results using wearable devices like Oura Ring. We independently verify the data to ensure authenticity.",
      defaultOpen: true,
    },
    {
      question: "How was this study conducted?",
      answer: `Participants tracked their baseline metrics for 14-30 days before starting the product. They then used the product for ${study.durationDays} days while continuing to track with their ${study.wearableType}. Daily check-ins captured their subjective experience alongside the objective wearable data.`,
    },
    {
      question: "Were participants compensated?",
      answer:
        study.compensationNote ||
        "Yes, participants received a rebate for completing the study. Compensation was the same regardless of their feedback or results, ensuring honest and unbiased reviews.",
    },
    {
      question: "How is data verified?",
      answer:
        "All wearable data is synced directly from participants' devices. We verify device ownership, study compliance, and cross-reference subjective reports with objective biometric data. Each verified participant has a unique verification ID you can check.",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Image
                src="/logos/reputable-icon-dark.png"
                alt="Reputable"
                width={24}
                height={24}
                className="h-6 w-6"
                unoptimized
              />
              <span className="font-semibold text-gray-900">Reputable</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-130px)]">
            {/* FAQs Section */}
            <div className="border-b border-gray-200">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={faq.defaultOpen}
                />
              ))}
            </div>

            {/* Participants Section */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Participants Who Completed This Study
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Below are {Math.min(3, participants.length)} of {study.participantCount}{" "}
                  participants who completed the {study.durationDays}-day
                  verified study.{" "}
                  {verifyPageUrl && (
                    <Link
                      href={verifyPageUrl}
                      className="hover:underline"
                      style={{ color: brandColor }}
                    >
                      View all participants →
                    </Link>
                  )}
                </p>
              </div>

              {/* Participant Cards */}
              <div className="space-y-2">
                {participants.slice(0, 3).map((participant) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    brandColor={brandColor}
                  />
                ))}
              </div>

              {/* View All Button */}
              {verifyPageUrl && participants.length > 3 && (
                <Link
                  href={verifyPageUrl}
                  target="_blank"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  View All {study.participantCount} Participants
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4" style={{ color: brandColor }} />
                <span>Independently verified by Reputable</span>
              </div>
              {verifyPageUrl && (
                <Link
                  href={verifyPageUrl}
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-medium hover:opacity-80"
                  style={{ color: brandColor }}
                >
                  View Full Study
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
