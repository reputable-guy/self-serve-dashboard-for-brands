"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, Package, LayoutDashboard } from "lucide-react";

interface StudyCreatedSuccessProps {
  studyName: string;
  categoryLabel: string;
  onOpenPreview: () => void;
  onGoToFulfillment: () => void;
  onDismiss: () => void;
}

/**
 * Success screen shown after study creation.
 * Displays checkmark animation and next steps.
 * Auto-dismisses after 15 seconds or on user interaction.
 */
export function StudyCreatedSuccess({
  studyName,
  categoryLabel,
  onOpenPreview,
  onGoToFulfillment,
  onDismiss,
}: StudyCreatedSuccessProps) {
  const [countdown, setCountdown] = useState(15);

  // Auto-dismiss countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
        <CardContent className="pt-8 pb-6 px-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="relative bg-green-100 rounded-full p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Study Created Successfully!</h2>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{studyName}</span>
              <span className="mx-2">-</span>
              <span>{categoryLabel}</span>
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Next Steps
            </h3>
            <div className="space-y-2">
              <NextStepButton
                icon={<Eye className="h-5 w-5" />}
                label="Review Preview"
                description="See how participants will view your study"
                onClick={() => {
                  onOpenPreview();
                  onDismiss();
                }}
              />
              <NextStepButton
                icon={<Package className="h-5 w-5" />}
                label="Configure Fulfillment"
                description="Set up your recruitment and shipping flow"
                onClick={() => {
                  onGoToFulfillment();
                  onDismiss();
                }}
              />
              <NextStepButton
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Go to Dashboard"
                description="View your study overview"
                onClick={onDismiss}
                variant="outline"
              />
            </div>
          </div>

          {/* Auto-dismiss indicator */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This will close automatically in {countdown}s
            </p>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${(countdown / 15) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NextStepButton({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
        variant === "outline"
          ? "border-muted-foreground/20 hover:bg-muted/50"
          : "border-[#00D1C1]/30 bg-[#00D1C1]/5 hover:bg-[#00D1C1]/10"
      }`}
    >
      <div className={`flex-shrink-0 ${variant === "outline" ? "text-muted-foreground" : "text-[#00D1C1]"}`}>
        {icon}
      </div>
      <div>
        <p className={`font-medium ${variant === "outline" ? "" : "text-[#00D1C1]"}`}>{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

/**
 * Hook to detect if study was just created (via URL query param)
 */
export function useStudyCreatedState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("created") === "true") {
      setShowSuccess(true);
      // Remove the query param from URL without refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router]);

  const dismissSuccess = () => setShowSuccess(false);

  return { showSuccess, dismissSuccess };
}
