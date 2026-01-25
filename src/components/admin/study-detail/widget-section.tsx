"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Palette,
} from "lucide-react";
import {
  getBestWidgetMode,
  getAllWidgetModes,
  getWidgetDataForStudy,
  hasWidgetData,
  type WidgetModeConfig,
  type WidgetDisplayMode,
} from "@/lib/widget-data";
import { FloatingBadgeWidget } from "@/components/widgets/compact-badge-widget";
import { VerificationModal } from "@/components/widgets/verification-modal";

interface WidgetSectionProps {
  studyId: string;
  studyName: string;
}

// Preset brand colors
const COLOR_PRESETS = [
  { name: "Reputable Teal", value: "#00D1C1" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#059669" },
  { name: "Orange", value: "#EA580C" },
  { name: "Pink", value: "#DB2777" },
];

// Helper to get localStorage key for widget config
const getWidgetConfigKey = (studyId: string) => `reputable-widget-config-${studyId}`;

export interface WidgetConfig {
  brandColor: string;
  position: "bottom-left" | "bottom-right";
  mode: WidgetDisplayMode | null;
}

export function WidgetSection({ studyId }: WidgetSectionProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<WidgetDisplayMode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandColor, setBrandColor] = useState("#00D1C1");
  const [position, setPosition] = useState<"bottom-left" | "bottom-right">("bottom-left");

  // Load saved config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(getWidgetConfigKey(studyId));
    if (saved) {
      try {
        const config: WidgetConfig = JSON.parse(saved);
        if (config.brandColor) setBrandColor(config.brandColor);
        if (config.position) setPosition(config.position);
        if (config.mode) setSelectedMode(config.mode);
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [studyId]);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    const config: WidgetConfig = { brandColor, position, mode: selectedMode };
    localStorage.setItem(getWidgetConfigKey(studyId), JSON.stringify(config));
  }, [brandColor, position, selectedMode, studyId]);

  // Check if widget data is available
  if (!hasWidgetData(studyId)) {
    return null;
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

  // Transform participants for avatar display
  const participantAvatars = widgetData.participants.map((p) => ({
    id: p.id,
    initials: p.initials,
    imageUrl: undefined,
  }));

  const embedCode = `<!-- Reputable Verification Widget -->
<script src="https://embed.reputable.health/widget.js"></script>
<div
  data-reputable-widget="badge"
  data-study-id="${studyId}"
  data-mode="${currentMode.mode}"
  data-color="${brandColor}"
  data-position="${position}"
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
        return "Outcome Highlight";
      case "nps":
        return "Satisfaction Score";
      case "individual":
        return "People Tested";
    }
  };

  const getModeDescription = (modeConfig: WidgetModeConfig): string => {
    switch (modeConfig.mode) {
      case "aggregate":
        return `Shows "${modeConfig.badgeHeadline}"`;
      case "nps":
        return `Shows "${modeConfig.badgeHeadline}"`;
      case "individual":
        return `Shows "X people tested this product..."`;
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
            <div className="p-6 bg-gray-100 rounded-lg flex justify-center">
              <div className="max-w-sm">
                <FloatingBadgeWidget
                  participantCount={widgetData.participantCount}
                  studyTitle={widgetData.studyTitle}
                  badgeHeadline={currentMode.badgeHeadline}
                  participants={participantAvatars}
                  brandColor={brandColor}
                  onOpenModal={() => setIsModalOpen(true)}
                />
              </div>
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
            <div className="pt-4 border-t space-y-6">
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

              {/* Brand Color */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Brand Color</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setBrandColor(preset.value)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          brandColor === preset.value
                            ? "border-gray-900 scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="customColor" className="text-xs text-muted-foreground">
                      Custom:
                    </Label>
                    <Input
                      id="customColor"
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-24 h-8 text-xs font-mono"
                      placeholder="#00D1C1"
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <p className="text-sm font-medium mb-2">Widget Position</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPosition("bottom-left")}
                    className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                      position === "bottom-left"
                        ? "border-[#00D1C1] bg-[#00D1C1]/5 text-[#00D1C1]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Bottom Left
                  </button>
                  <button
                    onClick={() => setPosition("bottom-right")}
                    className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                      position === "bottom-right"
                        ? "border-[#00D1C1] bg-[#00D1C1]/5 text-[#00D1C1]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Bottom Right
                  </button>
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
        verifyPageUrl={widgetData.verifyPageUrl}
      />
    </>
  );
}
