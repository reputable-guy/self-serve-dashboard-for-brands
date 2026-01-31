"use client";

import { Eye, Sparkles } from "lucide-react";
import { CATEGORY_CONFIGS } from "@/lib/assessments";
import { StudyDetailsFullPreview } from "@/components/study-details-full-preview";
import type { StudyFormData } from "./types";
import type { GeneratedStudyContent } from "@/lib/study-generator";

interface StepPreviewProps {
  formData: StudyFormData;
  generatedContent: GeneratedStudyContent | null;
}

export function StepPreview({ formData, generatedContent }: StepPreviewProps) {
  const selectedCategory = CATEGORY_CONFIGS.find((c) => c.value === formData.category);
  const tier = formData.autoConfig?.tier || 1;
  const requiredDevice = formData.allowNonWearable ? "optional" : tier <= 2 ? "required" : "none";

  return (
    <div className="flex flex-col items-center">
      {/* Context Header */}
      <div className="text-center mb-6 max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-[#00D1C1]" />
          <span className="text-sm font-medium text-[#00D1C1]">App Preview</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Here&apos;s how participants will discover your study
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve generated content based on your product and category.
          In the next step, you can customize everything to match your brand voice.
        </p>
      </div>

      {/* Mobile Preview */}
      <div className="flex justify-center mb-6">
        <StudyDetailsFullPreview
          productName={formData.productName || "Your Product"}
          productImage={formData.productImage}
          productDescription={generatedContent?.heroQuestion || `Study the effects of ${formData.productName} on ${selectedCategory?.label?.toLowerCase() || "wellness"}`}
          category={selectedCategory?.label || "Wellness"}
          rebateAmount={formData.rebateAmount}
          durationDays={28}
          totalSpots={formData.targetParticipants}
          requiredDevice={requiredDevice}
          whatYoullDiscover={formData.whatYoullDiscover.length > 0 ? formData.whatYoullDiscover : [
            `How ${formData.productName} affects your ${selectedCategory?.label?.toLowerCase() || "wellness"}`,
            "Track your daily progress with personalized metrics",
            "Compare your results with verified participants",
            "Receive insights backed by real data",
          ]}
          howItWorks={formData.howItWorks}
          whatYoullDoSections={formData.whatYoullDoSections}
          whatYoullGet={formData.whatYoullGet}
          tier={tier}
        />
      </div>

      {/* Helpful context */}
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>All content is editable in the next step</span>
        </div>
      </div>
    </div>
  );
}
