"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CompactBadgeWidget,
  FloatingBadgeWidget,
} from "@/components/widgets/compact-badge-widget";
import { VerificationModal } from "@/components/widgets/verification-modal";
import { SENSATE_REAL_STORIES } from "@/lib/sensate-real-data";

// Transform Sensate real data into participant previews for the modal
const sensateParticipants = SENSATE_REAL_STORIES.slice(0, 6).map((story) => ({
  id: story.verificationId || `participant-${story.initials}`,
  name: story.name,
  initials: story.initials,
  rating: story.finalTestimonial?.overallRating || story.overallRating || 4,
  primaryMetric: {
    label: story.wearableMetrics?.hrvChange ? "HRV" : "Deep Sleep",
    value: story.wearableMetrics?.hrvChange
      ? `+${story.wearableMetrics.hrvChange.changePercent}%`
      : story.wearableMetrics?.deepSleepChange
        ? `+${story.wearableMetrics.deepSleepChange.changePercent}%`
        : "+20%",
  },
  quote:
    story.finalTestimonial?.quote ||
    story.journey.keyQuotes[story.journey.keyQuotes.length - 1]?.quote ||
    "This product made a real difference.",
  device: story.wearableMetrics?.device || "Oura Ring",
  verificationId: story.verificationId || "SENSATE-REAL-001",
}));

const studyInfo = {
  title: "Sensate Sleep & Stress Study",
  participantCount: 18,
  durationDays: 28,
  wearableType: "Oura Ring",
  compensationNote:
    "Yes, participants received a rebate for completing the study. Compensation was the same regardless of their feedback or results.",
};

export default function WidgetPreviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const embedCode = `<!-- Reputable Verification Widget -->
<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="badge"
  data-study-id="study-sensate-real"
  data-theme="light"
></div>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold">Widget Preview</h1>
                <p className="text-sm text-gray-500">
                  FrontRowMD-inspired embeddable verification widget
                </p>
              </div>
            </div>
            <Link href="/demo/product-page">
              <Button variant="outline" className="gap-2">
                View on Product Page
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Widget Variants */}
          <div className="space-y-6">
            {/* Compact Badge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compact Badge Widget</CardTitle>
                <p className="text-sm text-gray-500">
                  Place near "Add to Cart" button for instant trust signal
                </p>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CompactBadgeWidget
                    participantCount={18}
                    studyTitle="Sensate Sleep & Stress Study"
                    onOpenModal={() => setIsModalOpen(true)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Floating Badge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Floating Badge (Corner Placement)
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Like FrontRowMD - fixed position at bottom left
                </p>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gray-100 rounded-lg relative h-48 overflow-hidden">
                  <p className="text-xs text-gray-400 mb-2">
                    Preview (actual widget floats in corner):
                  </p>
                  <div className="absolute bottom-4 left-4">
                    <FloatingBadgeWidget
                      participantCount={18}
                      studyTitle="Sensate Sleep & Stress Study"
                      onOpenModal={() => setIsModalOpen(true)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embed Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Embed Code</CardTitle>
                <p className="text-sm text-gray-500">
                  Copy and paste into your product page HTML
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 h-8"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Modal Preview */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Modal Preview</CardTitle>
                <p className="text-sm text-gray-500">
                  What users see when they click the widget (FrontRowMD-inspired
                  with FAQs)
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#00D1C1] hover:bg-[#00A89D]"
                >
                  Open Verification Modal
                </Button>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Modal Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>
                      ✓ <strong>FAQs first</strong> - Address trust concerns
                      before showing results
                    </li>
                    <li>
                      ✓ <strong>Compensation transparency</strong> - "Were
                      participants compensated?" FAQ
                    </li>
                    <li>
                      ✓ <strong>Individual stories</strong> - Real participants
                      with their personal metrics
                    </li>
                    <li>
                      ✓ <strong>Verifiable</strong> - "View Story" links to full
                      verification page
                    </li>
                    <li>
                      ✓ <strong>Mobile friendly</strong> - Responsive design
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">
                    Key Learning from FrontRowMD
                  </h4>
                  <p className="text-xs text-amber-700">
                    Credibility comes from transparency, not impressive numbers.
                    Lead with real people + honest FAQs about how it works.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        study={studyInfo}
        participants={sensateParticipants}
        verifyPageUrl="/verify/sensate-results"
      />
    </div>
  );
}
