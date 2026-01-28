"use client";

/**
 * Brand Widget Tab — "Here's how you use this on your product page"
 *
 * Shows the embeddable widget in context on a mock product page,
 * plus embed code and verification link.
 * 
 * Uses enrollment store (simulation pipeline) for participant data,
 * NOT the hard-coded widget-data.ts which only covers Sensate/LyfeFuel.
 */

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { FloatingBadgeWidget } from "@/components/widgets/compact-badge-widget";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import type { ParticipantStory } from "@/lib/types";

interface BrandWidgetTabProps {
  studyId: string;
  studyName: string;
  brandName?: string;
  realStories?: ParticipantStory[] | null;
}

export function BrandWidgetTab({ studyId, studyName, brandName, realStories }: BrandWidgetTabProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [, setShowWidgetModal] = useState(false);

  const isRealData = !!realStories && realStories.length > 0;

  // Get data from the simulation pipeline (for demo studies)
  const allEnrollments = useEnrollmentStore((s) => s.enrollments);
  const studyEnrollments = useMemo(
    () => allEnrollments.filter((e) => e.studyId === studyId && e.stage !== "clicked"),
    [allEnrollments, studyId]
  );
  const completedEnrollments = useMemo(
    () => studyEnrollments.filter((e) => e.stage === "completed"),
    [studyEnrollments]
  );

  // Use real data or simulation data
  const participantCount = isRealData ? realStories.length : studyEnrollments.length;
  const completedCount = isRealData
    ? realStories.length  // All real stories are completed participants
    : completedEnrollments.length;
  const hasParticipants = participantCount > 0;

  // Build avatar data from real stories or enrollments
  const participantAvatars = useMemo(() => {
    if (isRealData) {
      return realStories.slice(0, 4).map((s) => ({
        id: s.id,
        initials: s.initials || s.name?.[0] || "?",
      }));
    }
    return studyEnrollments.slice(0, 4).map((e) => ({
      id: e.id,
      initials: e.name
        ? e.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "??",
    }));
  }, [isRealData, realStories, studyEnrollments]);

  // Build headline based on data
  const badgeHeadline = hasParticipants
    ? completedCount > 0
      ? `${completedCount} people verified this product`
      : `${participantCount} people are testing this product`
    : "Verified by real participants";

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  // Real data studies link to their results page, demo studies link to verify
  const verifyUrl = isRealData
    ? `${baseUrl}/verify/${studyId === "study-sensate-real" ? "sensate-results" : studyId === "study-lyfefuel-real" ? "lyfefuel-results" : studyId + "/results"}`
    : `${baseUrl}/verify/${studyId}/results`;

  const embedCode = `<!-- Reputable Verification Widget -->
<script
  src="https://embed.reputable.health/widget.js"
  data-study-id="${studyId}"
  data-position="bottom-right"
  async>
</script>`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mock Product Page with Widget */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00D1C1]" />
            Widget Preview
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            This is how the verification badge appears on your product page
          </p>
        </CardHeader>
        <CardContent>
          {/* Mock Product Page */}
          <div className="relative border rounded-xl bg-white p-8 min-h-[350px]">
            {/* Fake product page content */}
            <div className="max-w-lg mx-auto">
              <div className="flex gap-6">
                {/* Product image placeholder */}
                <div className="w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-400">Your Product</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{brandName || "Your Brand"}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{brandName ? studyName.replace(/\s*\(.*?\)\s*/g, '').replace(/study/gi, '').trim() || studyName : "Your Product"}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-amber-400 text-sm">★</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(142 reviews)</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-3">$49.99</p>
                  <div className="bg-gray-900 text-white text-center py-2.5 px-4 rounded-lg text-sm font-medium">
                    Add to Cart
                  </div>
                </div>
              </div>
            </div>

            {/* Actual Widget */}
            <div className="absolute bottom-4 right-4 w-[280px]">
              <FloatingBadgeWidget
                participantCount={hasParticipants ? participantCount : 47}
                studyTitle={studyName}
                badgeHeadline={hasParticipants ? badgeHeadline : "47 people verified this product"}
                participants={
                  hasParticipants
                    ? participantAvatars
                    : [
                        { id: "demo-1", initials: "SM" },
                        { id: "demo-2", initials: "JR" },
                        { id: "demo-3", initials: "AL" },
                        { id: "demo-4", initials: "MK" },
                      ]
                }
                brandColor="#00D1C1"
                onOpenModal={() => setShowWidgetModal(true)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click the widget to preview the modal that opens for customers
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Embed Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto">
              {embedCode}
            </div>
            <Button
              onClick={handleCopyCode}
              variant={copiedCode ? "default" : "outline"}
              size="sm"
              className={`mt-3 w-full ${copiedCode ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
            >
              {copiedCode ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Verification Page */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00D1C1]" />
              Verification Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Your public results page — full methodology, participant data, and verification details.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-600 truncate mb-3">
              {verifyUrl}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopyLink}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open Page
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology FAQ — FrontrowMD-style trust transparency */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            How It Works — FAQ
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            These questions appear when customers click &quot;Learn more&quot; on the widget
          </p>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            {
              q: "How was this study conducted?",
              a: "Participants used the product daily for 28 days while wearing an Oura Ring to track objective health metrics. They completed validated assessments at baseline and endpoint.",
            },
            {
              q: "Who are the participants?",
              a: "Real customers who volunteered for the study. They represent a diverse range of ages, backgrounds, and starting health conditions.",
            },
            {
              q: "Were participants compensated?",
              a: "Yes, participants received a rebate for completing the full 28-day study. Compensation was the same regardless of their feedback or results.",
            },
            {
              q: "How is the data verified?",
              a: "All wearable data is pulled directly from Oura Ring APIs — participants cannot modify it. Assessments use clinically validated instruments. Results are independently verified by Reputable.",
            },
            {
              q: "Who owns the data?",
              a: "Participants own their personal data. Aggregate, anonymized results are shared with the brand to display on their product page.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group border-b border-gray-100 last:border-0"
            >
              <summary className="flex items-center justify-between py-3 cursor-pointer text-sm font-medium text-gray-900 hover:text-[#00D1C1] transition-colors list-none">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground pb-3 pr-8 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </CardContent>
      </Card>

      {/* Installation Steps */}
      <Card className="bg-gradient-to-r from-[#00D1C1]/5 to-transparent border-[#00D1C1]/20">
        <CardContent className="pt-6 pb-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            3 Simple Steps to Install
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Copy the embed code",
                desc: "Click the copy button above",
              },
              {
                step: "2",
                title: "Paste into your product page",
                desc: "Add it before the closing </body> tag",
              },
              {
                step: "3",
                title: "Results auto-update",
                desc: "The widget refreshes as new results come in",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-[#00D1C1] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
