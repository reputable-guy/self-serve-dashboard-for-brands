"use client";

import { ArrowLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface BrandViewHeaderProps {
  studyName: string;
  brandName?: string;
  brandLogoUrl?: string;
  status: string;
  onBackToAdmin: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; pulse: boolean }> = {
  recruiting: { label: "Enrolling", color: "text-blue-500", pulse: true },
  active: { label: "Live", color: "text-emerald-500", pulse: true },
  completed: { label: "Complete", color: "text-gray-500", pulse: false },
  draft: { label: "Draft", color: "text-amber-500", pulse: false },
  "filling-fast": { label: "Filling Fast", color: "text-orange-500", pulse: true },
  "coming_soon": { label: "Coming Soon", color: "text-purple-500", pulse: false },
};

export function BrandViewHeader({
  studyName,
  brandName,
  brandLogoUrl,
  status,
  onBackToAdmin,
}: BrandViewHeaderProps) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back button + Study info */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToAdmin}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Admin
            </Button>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              {brandLogoUrl && (
                <Image
                  src={brandLogoUrl}
                  alt={brandName || "Brand"}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain rounded"
                  unoptimized
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                  {studyName}
                </h1>
                {brandName && (
                  <p className="text-sm text-muted-foreground">{brandName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <Circle
                className={`h-2 w-2 fill-current ${statusConfig.color} ${
                  statusConfig.pulse ? "animate-pulse" : ""
                }`}
              />
              <span className="text-sm font-medium">{statusConfig.label}</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
