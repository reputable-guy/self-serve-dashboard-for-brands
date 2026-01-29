"use client";

/**
 * Marketing Kit Export Modal
 * 
 * Main UI for exporting participant stories to marketing assets.
 * Features:
 * - Live preview of carousel slides
 * - Brand customization (colors, logo)
 * - Aspect ratio selection (4:5 or 1:1)
 * - PNG/JPG download at 2x resolution
 */

import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Image as ImageIcon,
  Settings2,
  Eye,
  Square,
  RectangleVertical,
} from "lucide-react";
import {
  SlideHook,
  SlideStruggle,
  SlideTransformation,
  SlideTestimonial,
  SlideCTA,
  SLIDE_METADATA,
  type SlideType,
  type BrandSettings,
  type ParticipantData,
} from "./carousel-templates";
import { BrandSettingsPanel, DEFAULT_BRAND_SETTINGS } from "./brand-settings";

// ============================================
// TYPES
// ============================================

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantData;
  brandName?: string;
  studyName?: string;
  initialBrandSettings?: BrandSettings;
}

type ExportFormat = "png" | "jpg";
type AspectRatio = "4:5" | "1:1";

// ============================================
// CONSTANTS
// ============================================

const SLIDES_ORDER: SlideType[] = ["hook", "struggle", "transformation", "testimonial", "cta"];

const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: "4:5", label: "4:5 Vertical", icon: <RectangleVertical className="h-4 w-4" /> },
  { value: "1:1", label: "1:1 Square", icon: <Square className="h-4 w-4" /> },
];

// Local storage key for brand settings
const BRAND_SETTINGS_KEY = "reputable-marketing-kit-brand-settings";

// ============================================
// COMPONENT
// ============================================

export function ExportModal({
  isOpen,
  onClose,
  participant,
  brandName,
  studyName,
  initialBrandSettings,
}: ExportModalProps) {
  // State
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(
    initialBrandSettings || DEFAULT_BRAND_SETTINGS
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:5");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");
  const [selectedSlides, setSelectedSlides] = useState<Set<SlideType>>(
    new Set(SLIDES_ORDER.slice(0, 4)) // Default: all except CTA
  );
  const [activeTab, setActiveTab] = useState<"preview" | "settings">("preview");

  // Refs
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const hiddenSlidesRef = useRef<HTMLDivElement>(null);

  // Load saved brand settings from localStorage
  useEffect(() => {
    if (!initialBrandSettings) {
      const saved = localStorage.getItem(BRAND_SETTINGS_KEY);
      if (saved) {
        try {
          setBrandSettings(JSON.parse(saved));
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [initialBrandSettings]);

  // Save brand settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(brandSettings));
  }, [brandSettings]);

  // Navigation
  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : SLIDES_ORDER.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev < SLIDES_ORDER.length - 1 ? prev + 1 : 0));
  };

  // Toggle slide selection
  const toggleSlideSelection = (slideType: SlideType) => {
    const newSelection = new Set(selectedSlides);
    if (newSelection.has(slideType)) {
      // Don't allow deselecting all slides
      if (newSelection.size > 1) {
        newSelection.delete(slideType);
      }
    } else {
      newSelection.add(slideType);
    }
    setSelectedSlides(newSelection);
  };

  // Export functionality
  const captureSlide = useCallback(async (slideElement: HTMLElement): Promise<Blob> => {
    const canvas = await html2canvas(slideElement, {
      scale: 2, // 2x for retina quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      width: aspectRatio === "4:5" ? 1080 : 1080,
      height: aspectRatio === "4:5" ? 1350 : 1080,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        exportFormat === "png" ? "image/png" : "image/jpeg",
        0.95
      );
    });
  }, [aspectRatio, exportFormat]);

  const handleExportAll = async () => {
    if (!hiddenSlidesRef.current) return;

    setIsExporting(true);
    setExportProgress("Preparing slides...");

    try {
      const selectedSlideTypes = SLIDES_ORDER.filter((type) => selectedSlides.has(type));
      const slideElements = hiddenSlidesRef.current.querySelectorAll(".slide-container");

      for (let i = 0; i < selectedSlideTypes.length; i++) {
        const slideType = selectedSlideTypes[i];
        const slideIndex = SLIDES_ORDER.indexOf(slideType);
        const element = slideElements[slideIndex] as HTMLElement;

        if (!element) continue;

        setExportProgress(`Exporting slide ${i + 1}/${selectedSlideTypes.length}...`);

        const blob = await captureSlide(element);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${participant.name.replace(/\s+/g, "-").toLowerCase()}-${slideType}-${aspectRatio}.${exportFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setExportProgress("Export complete!");
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress("");
      }, 1500);
    } catch (error) {
      console.error("Export failed:", error);
      setExportProgress("Export failed. Please try again.");
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress("");
      }, 2000);
    }
  };

  const handleExportCurrent = async () => {
    if (!slideContainerRef.current) return;

    setIsExporting(true);
    setExportProgress("Exporting...");

    try {
      // Find the actual slide content within the preview container
      const slideElement = slideContainerRef.current.querySelector(".slide-container") as HTMLElement;
      if (!slideElement) {
        throw new Error("Slide element not found");
      }

      const blob = await captureSlide(slideElement);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const slideType = SLIDES_ORDER[activeSlide];
      link.download = `${participant.name.replace(/\s+/g, "-").toLowerCase()}-${slideType}-${aspectRatio}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress("Downloaded!");
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress("");
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      setExportProgress("Export failed");
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress("");
      }, 2000);
    }
  };

  // Render current slide
  const renderSlide = (slideType: SlideType) => {
    const props = {
      participant,
      brand: brandSettings,
      brandName,
      studyName,
      aspectRatio,
    };

    const slideComponents: Record<SlideType, React.ReactNode> = {
      hook: <SlideHook {...props} />,
      struggle: <SlideStruggle {...props} />,
      transformation: <SlideTransformation {...props} />,
      testimonial: <SlideTestimonial {...props} />,
      cta: <SlideCTA {...props} />,
    };

    return slideComponents[slideType];
  };

  const currentSlideType = SLIDES_ORDER[activeSlide];
  const currentSlideMeta = SLIDE_METADATA[currentSlideType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">
                Export: {participant.name}&apos;s Story
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create Instagram carousel slides from verified participant data
              </p>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Check className="h-3 w-3 mr-1" />
              Verified Data
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            {/* Preview Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="flex items-center gap-3">
                {/* Aspect Ratio */}
                <div className="flex items-center gap-2">
                  {ASPECT_RATIO_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectRatio(option.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        aspectRatio === option.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Format */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Format:</span>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
              <div
                ref={slideContainerRef}
                className="relative shadow-2xl rounded-lg overflow-hidden"
                style={{
                  transform: "scale(0.35)",
                  transformOrigin: "center center",
                }}
              >
                {renderSlide(currentSlideType)}
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
              <Button variant="outline" size="sm" onClick={handlePrevSlide}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>

              <div className="flex items-center gap-2">
                {SLIDES_ORDER.map((type, index) => (
                  <button
                    key={type}
                    onClick={() => setActiveSlide(index)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                      index === activeSlide
                        ? "bg-gray-900 text-white"
                        : selectedSlides.has(type)
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={handleNextSlide}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-white flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
              <TabsList className="w-full rounded-none border-b h-12 p-0">
                <TabsTrigger
                  value="preview"
                  className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Slides
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-900"
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Brand
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 overflow-auto p-4 mt-0">
                {/* Current Slide Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">
                      Slide {activeSlide + 1}: {currentSlideMeta.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentSlideMeta.description}
                  </p>
                </div>

                {/* Slide Selection */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Include in Export</h4>
                  <div className="space-y-2">
                    {SLIDES_ORDER.map((type, index) => {
                      const meta = SLIDE_METADATA[type];
                      const isSelected = selectedSlides.has(type);
                      return (
                        <label
                          key={type}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSlideSelection(type)}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {index + 1}. {meta.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {meta.description}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Export Info */}
                <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-700 mb-1">Export Details</p>
                  <p>• {selectedSlides.size} slides selected</p>
                  <p>• {aspectRatio === "4:5" ? "1080×1350px" : "1080×1080px"} @ 2x</p>
                  <p>• {exportFormat.toUpperCase()} format</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 overflow-auto p-4 mt-0">
                <BrandSettingsPanel
                  settings={brandSettings}
                  onChange={setBrandSettings}
                />
              </TabsContent>
            </Tabs>

            {/* Export Buttons */}
            <div className="p-4 border-t space-y-2">
              {exportProgress && (
                <div className="text-center text-sm text-muted-foreground mb-2">
                  {exportProgress}
                </div>
              )}
              <Button
                onClick={handleExportAll}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download All ({selectedSlides.size} slides)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCurrent}
                disabled={isExporting}
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Download Current Slide
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden container for full-resolution export */}
        <div
          ref={hiddenSlidesRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
        >
          {SLIDES_ORDER.map((type) => (
            <div key={type}>{renderSlide(type)}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
