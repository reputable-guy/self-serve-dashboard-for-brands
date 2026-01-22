"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Lock,
  Rocket,
  Eye,
  Package,
  Settings,
} from "lucide-react";
import type { LaunchChecklist } from "@/lib/types";

interface LaunchChecklistProps {
  checklist: LaunchChecklist;
  targetParticipants: number;
  onPreviewReview: () => void;
  onInventoryConfirm: () => void;
  onGoLive: () => void;
}

interface ChecklistItem {
  id: keyof Omit<LaunchChecklist, "goLiveAt">;
  label: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Launch checklist banner shown on study detail page until go-live.
 * Tracks 4 prerequisites:
 * 1. Configure study settings (always complete after creation)
 * 2. Review participant experience (click through preview)
 * 3. Confirm product inventory (ready to ship)
 * 4. Go Live (locked until 1-3 complete)
 */
export function LaunchChecklist({
  checklist,
  targetParticipants,
  onPreviewReview,
  onInventoryConfirm,
  onGoLive,
}: LaunchChecklistProps) {
  const items: ChecklistItem[] = [
    {
      id: "settingsComplete",
      label: "Configure study settings",
      description: "Brand, category, rebate, and fulfillment model set",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: "previewReviewed",
      label: "Review participant experience",
      description: "Preview what participants will see in the app",
      icon: <Eye className="h-4 w-4" />,
      action: checklist.previewReviewed
        ? undefined
        : { label: "View", onClick: onPreviewReview },
    },
    {
      id: "inventoryConfirmed",
      label: "Confirm product inventory",
      description: `Ensure you have enough product to ship (target: ${targetParticipants} units)`,
      icon: <Package className="h-4 w-4" />,
      action: checklist.inventoryConfirmed
        ? undefined
        : { label: "Confirm", onClick: onInventoryConfirm },
    },
  ];

  const prerequisiteCount = items.filter((item) => checklist[item.id]).length;
  const allPrerequisitesComplete = prerequisiteCount === items.length;
  const isPublished = !!checklist.goLiveAt;
  const completedCount = prerequisiteCount + (isPublished ? 1 : 0);
  const totalCount = items.length + 1; // 3 prerequisites + 1 publish step
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-[#00D1C1]/30 bg-[#00D1C1]/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#00D1C1]" />
            Publish Checklist
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} done
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <Progress value={progressPercent} className="h-2" />

        {/* Checklist items */}
        <div className="space-y-3">
          {items.map((item) => {
            const isComplete = checklist[item.id];

            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isComplete
                    ? "bg-green-50 border border-green-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Status icon */}
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium ${
                        isComplete ? "text-green-700" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={item.action.onClick}
                        className="flex-shrink-0"
                      >
                        {item.action.label}
                      </Button>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isComplete ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Go Live item (special) */}
          <div
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              isPublished
                ? "bg-green-50 border border-green-200"
                : allPrerequisitesComplete
                ? "bg-[#00D1C1]/10 border border-[#00D1C1]/30"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {/* Status icon */}
            {isPublished ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : allPrerequisitesComplete ? (
              <Circle className="h-5 w-5 text-[#00D1C1] flex-shrink-0 mt-0.5" />
            ) : (
              <Lock className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-medium ${
                    isPublished
                      ? "text-green-700"
                      : allPrerequisitesComplete
                      ? "text-[#00D1C1]"
                      : "text-gray-400"
                  }`}
                >
                  Publish as Coming Soon
                </span>
                {!isPublished && (
                  <Button
                    size="sm"
                    disabled={!allPrerequisitesComplete}
                    onClick={onGoLive}
                    className={
                      allPrerequisitesComplete
                        ? "bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                        : ""
                    }
                  >
                    {allPrerequisitesComplete ? (
                      <>
                        <Rocket className="h-4 w-4 mr-1" />
                        Publish
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </>
                    )}
                  </Button>
                )}
              </div>
              <p
                className={`text-sm ${
                  isPublished
                    ? "text-green-600"
                    : allPrerequisitesComplete
                    ? "text-[#00D1C1]/80"
                    : "text-gray-400"
                }`}
              >
                {isPublished
                  ? "Your study is visible in the catalogue"
                  : "Make your study visible in the catalogue to build a waitlist"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
