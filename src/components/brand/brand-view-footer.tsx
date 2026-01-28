"use client";

import { Shield } from "lucide-react";
import Image from "next/image";

interface BrandViewFooterProps {
  verificationUrl?: string;
}

export function BrandViewFooter({ verificationUrl }: BrandViewFooterProps) {
  return (
    <footer className="border-t bg-gray-50/50 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image
              src="/logos/reputable-icon-dark.png"
              alt="Reputable"
              width={20}
              height={20}
              className="h-5 w-5 opacity-60"
              unoptimized
            />
            <span>Powered by Reputable</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-[#00D1C1]" />
              <span>Third-party verified</span>
            </div>
            {verificationUrl && (
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00D1C1] hover:underline"
              >
                View methodology
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
