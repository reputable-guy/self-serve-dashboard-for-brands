"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { X, Download, Copy, Check, QrCode } from "lucide-react";

interface QRCodePopoverProps {
  verificationId: string;
  participantName?: string;
}

export function QRCodePopover({ verificationId, participantName }: QRCodePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const verifyUrl = `https://reputable.health/verify/${verificationId}`;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Create a temporary canvas to convert SVG to PNG
    const svg = document.getElementById(`qr-${verificationId}`) as unknown as SVGElement;
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `verification-${verificationId}.png`;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Show QR code"
        onClick={() => setIsOpen(!isOpen)}
      >
        <QrCode className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute bottom-full right-0 mb-2 z-50 bg-white rounded-xl shadow-xl border p-4 w-72"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="font-semibold text-sm">Verification QR Code</h3>
            {participantName && (
              <p className="text-xs text-muted-foreground">{participantName}</p>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4 p-4 bg-white rounded-lg border">
            <QRCodeSVG
              id={`qr-${verificationId}`}
              value={verifyUrl}
              size={160}
              level="M"
              fgColor="#00D1C1"
              bgColor="#ffffff"
              includeMargin={false}
            />
          </div>

          {/* Verification ID */}
          <div className="text-center mb-4">
            <code className="text-xs bg-muted px-2 py-1 rounded">
              #{verificationId}
            </code>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy URL
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>

          {/* URL Preview */}
          <p className="text-[10px] text-muted-foreground text-center mt-3 break-all">
            {verifyUrl}
          </p>
        </div>
      )}
    </div>
  );
}
