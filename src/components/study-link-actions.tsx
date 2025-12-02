"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";

interface StudyLinkActionsProps {
  studyId: string;
}

export function StudyLinkActions({ studyId }: StudyLinkActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const studyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/study/${studyId}`;
  const displayUrl = `reputable.health/study/${studyId.slice(0, 8)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(studyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePreview = () => {
    router.push(`/study/${studyId}`);
  };

  return (
    <div className="flex items-center gap-2">
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {displayUrl}
      </code>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePreview}>
        <ExternalLink className="h-3 w-3 mr-1" />
        Preview
      </Button>
    </div>
  );
}
