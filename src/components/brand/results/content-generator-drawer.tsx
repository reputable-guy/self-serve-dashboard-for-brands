"use client";

/**
 * Content Generator Drawer
 *
 * A slide-out drawer that provides quick-copy content for participant stories:
 * - Best Bits: Hero metric, key quote, struggle, verification URL
 * - Captions: 3 tones (casual, professional, urgency)
 * - Playbook: Downloadable posting strategy guide
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  Sparkles,
  FileText,
  BookOpen,
  Quote,
  TrendingUp,
  Link2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ParticipantStory } from "@/lib/types";
import {
  extractBestBits,
  generateEnhancedCaption,
  generatePlaybookText,
  type CaptionTone,
} from "@/lib/content-generator";

// ============================================
// TYPES
// ============================================

interface ContentGeneratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  story: ParticipantStory;
  brandName?: string;
  productName?: string;
  category?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ContentGeneratorDrawer({
  isOpen,
  onClose,
  story,
  brandName,
  productName,
}: ContentGeneratorDrawerProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [expandedCaption, setExpandedCaption] = useState<CaptionTone | null>(null);

  const bestBits = extractBestBits(story);
  const firstName = story.name.split(" ")[0];

  const handleCopy = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDownloadPlaybook = () => {
    const text = generatePlaybookText(story, brandName, productName);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${firstName.toLowerCase()}-content-playbook.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const captions: { tone: CaptionTone; label: string; description: string }[] = [
    { tone: "casual", label: "Casual", description: "Friendly, conversational" },
    { tone: "professional", label: "Professional", description: "Credible, data-forward" },
    { tone: "urgency", label: "Urgency", description: "Action-oriented, direct" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#00D1C1]" />
            Create Content for {story.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Best Bits Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-emerald-500" />
              Best Bits
            </h3>
            <div className="space-y-2">
              {/* Hero Metric */}
              {bestBits.heroMetric ? (
                <CopyableField
                  label="Hero Metric"
                  value={bestBits.heroMetric}
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  itemId="hero-metric"
                  copiedItem={copiedItem}
                  onCopy={handleCopy}
                />
              ) : (
                <EmptyField label="Hero Metric" message="No metric data available" />
              )}

              {/* Key Quote */}
              {bestBits.keyQuote ? (
                <CopyableField
                  label="Key Quote"
                  value={`"${bestBits.keyQuote}"`}
                  icon={<Quote className="h-3.5 w-3.5" />}
                  itemId="key-quote"
                  copiedItem={copiedItem}
                  onCopy={handleCopy}
                  truncate
                />
              ) : (
                <EmptyField label="Key Quote" message="No quote available" />
              )}

              {/* Struggle */}
              {bestBits.struggle ? (
                <CopyableField
                  label="The Struggle"
                  value={bestBits.struggle}
                  icon={<AlertCircle className="h-3.5 w-3.5" />}
                  itemId="struggle"
                  copiedItem={copiedItem}
                  onCopy={handleCopy}
                  truncate
                />
              ) : (
                <EmptyField label="The Struggle" message="No baseline data available" />
              )}

              {/* Verification Link */}
              <CopyableField
                label="Verification Link"
                value={bestBits.verificationUrl}
                icon={<Link2 className="h-3.5 w-3.5" />}
                itemId="verification-url"
                copiedItem={copiedItem}
                onCopy={handleCopy}
              />
            </div>
          </section>

          {/* Captions Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-purple-500" />
              Captions
            </h3>
            <div className="space-y-2">
              {captions.map(({ tone, label, description }) => {
                const caption = generateEnhancedCaption(story, tone, brandName, productName);
                const isExpanded = expandedCaption === tone;
                const isCopied = copiedItem === `caption-${tone}`;

                return (
                  <div
                    key={tone}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(caption, `caption-${tone}`)}
                        className={`h-7 px-2 ${
                          isCopied ? "bg-emerald-50 border-emerald-200 text-emerald-700" : ""
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-3 border-t">
                      <p
                        className={`text-xs text-gray-600 whitespace-pre-line ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {caption}
                      </p>
                      <button
                        onClick={() => setExpandedCaption(isExpanded ? null : tone)}
                        className="flex items-center gap-1 text-xs text-[#00D1C1] mt-2 hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Show full caption
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Playbook Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-orange-500" />
              Playbook
            </h3>
            <Button
              onClick={handleDownloadPlaybook}
              variant="outline"
              className="w-full justify-center gap-2 text-orange-700 border-orange-200 hover:bg-orange-50"
            >
              <Download className="h-4 w-4" />
              Download Posting Guide
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Includes all captions + posting strategy for Days 1-5
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function CopyableField({
  label,
  value,
  icon,
  itemId,
  copiedItem,
  onCopy,
  truncate = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  itemId: string;
  copiedItem: string | null;
  onCopy: (text: string, itemId: string) => void;
  truncate?: boolean;
}) {
  const isCopied = copiedItem === itemId;
  const displayValue = truncate && value.length > 100 ? value.slice(0, 100) + "..." : value;

  return (
    <div className="border rounded-lg p-3 hover:border-[#00D1C1]/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-muted-foreground mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-sm text-gray-900 break-words">{displayValue}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(value, itemId)}
          className={`h-7 px-2 shrink-0 ${
            isCopied ? "text-emerald-600" : "text-muted-foreground hover:text-gray-900"
          }`}
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

function EmptyField({ label, message }: { label: string; message: string }) {
  return (
    <div className="border border-dashed rounded-lg p-3 bg-gray-50/50">
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      <p className="text-xs text-gray-400 italic">{message}</p>
    </div>
  );
}
