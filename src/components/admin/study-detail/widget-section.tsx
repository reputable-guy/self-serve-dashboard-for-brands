"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  getBestWidgetMode,
  getAllWidgetModes,
  getWidgetDataForStudy,
  hasWidgetData,
  type WidgetModeConfig,
  type WidgetDisplayMode,
} from "@/lib/widget-data";
import { VerificationModal } from "@/components/widgets/verification-modal";

interface WidgetSectionProps {
  studyId: string;
  studyName: string;
}

/**
 * Widget preview badge - headline varies by mode, subtitle stays constant
 *
 * Design:
 * - Aggregate: "23% more daily activity" + "Verified by Reputable"
 * - NPS: "83% would recommend" + "Verified by Reputable"
 * - Simple: "18 participants verified" + "Verified by Reputable"
 */
function WidgetPreviewBadge({
  mode,
  onClick,
}: {
  mode: WidgetModeConfig;
  participantCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Reputable logo icon */}
      <Image
        src="/logos/reputable-icon-dark.png"
        alt="Reputable"
        width={24}
        height={24}
        className="h-6 w-6"
        unoptimized
      />

      {/* Content - Headline varies by mode, subtitle stays constant */}
      <div className="text-left">
        <span className="text-sm font-medium text-gray-900">
          {mode.badgeHeadline}
        </span>
        <p className="text-[10px] text-gray-400">
          Verified by Reputable
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00D1C1] transition-colors" />
    </button>
  );
}

export function WidgetSection({ studyId }: WidgetSectionProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<WidgetDisplayMode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if widget data is available
  if (!hasWidgetData(studyId)) {
    return null; // Don't show widget section for studies without data
  }

  const bestMode = getBestWidgetMode(studyId);
  const allModes = getAllWidgetModes(studyId);
  const widgetData = getWidgetDataForStudy(studyId);

  if (!bestMode || !widgetData) {
    return null;
  }

  // Use selected mode or fall back to best mode
  const currentMode = selectedMode
    ? allModes.find((m) => m.mode === selectedMode) || bestMode
    : bestMode;

  const embedCode = `<!-- Reputable Verification Widget -->
<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="badge"
  data-study-id="${studyId}"
  data-mode="${currentMode.mode}"
  data-theme="light"
></div>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getModeLabel = (mode: WidgetDisplayMode): string => {
    switch (mode) {
      case "aggregate":
        return "Aggregate Metric";
      case "nps":
        return "Satisfaction Score";
      case "individual":
        return "Individual Story";
    }
  };

  const getModeDescription = (modeConfig: WidgetModeConfig): string => {
    switch (modeConfig.mode) {
      case "aggregate":
        return `Shows "${modeConfig.friendlyDescription}"`;
      case "nps":
        return `Shows "${modeConfig.friendlyDescription}"`;
      case "individual":
        return `Shows featured participant story`;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code2 className="h-5 w-5 text-[#00D1C1]" />
              Embeddable Widget
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-[#00D1C1]/10 text-[#00D1C1] border-[#00D1C1]/20"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Auto-optimized
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add this widget to your product page to show verified study results
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Widget Preview */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Preview
            </p>
            <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
              <WidgetPreviewBadge
                mode={currentMode}
                participantCount={widgetData.participantCount}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click to preview the modal that opens when users click the widget
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="text-muted-foreground"
            >
              {isConfigOpen ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              Configure widget
            </Button>

            <Link href={`/demo/product-page/${studyId}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1">
                View on product page
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Expanded Configuration */}
          {isConfigOpen && (
            <div className="pt-4 border-t space-y-4">
              {/* Mode Selection */}
              <div>
                <p className="text-sm font-medium mb-2">Display Mode</p>
                <div className="space-y-2">
                  {allModes.map((modeConfig) => {
                    const isSelected = currentMode.mode === modeConfig.mode;
                    const isBest = bestMode.mode === modeConfig.mode;

                    return (
                      <button
                        key={modeConfig.mode}
                        onClick={() => setSelectedMode(modeConfig.mode)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-[#00D1C1] bg-[#00D1C1]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-[#00D1C1]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-[#00D1C1]" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium flex items-center gap-2">
                              {getModeLabel(modeConfig.mode)}
                              {isBest && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
                                >
                                  Recommended
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getModeDescription(modeConfig)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <p className="text-sm font-medium mb-2">Embed Code</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 h-7 bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        study={{
          title: widgetData.studyTitle,
          participantCount: widgetData.participantCount,
          durationDays: widgetData.durationDays,
          wearableType: widgetData.wearableType,
          compensationNote: widgetData.compensationNote,
        }}
        participants={widgetData.participants}
        verifyPageUrl={`/verify/${studyId}-results`}
      />
    </>
  );
}
