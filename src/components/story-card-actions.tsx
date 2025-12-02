"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Download, Copy, Check } from "lucide-react";
import { QRCodePopover } from "@/components/qr-code-popover";
import { MockTestimonial } from "@/lib/mock-data";

interface StoryCardActionsProps {
  testimonial: MockTestimonial;
  studyId: string;
}

export function StoryCardActions({ testimonial, studyId }: StoryCardActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${testimonial.verificationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleCopyEmbed = async () => {
    const embedCode = `<div data-reputable-testimonial="${testimonial.verificationId}" data-study="${studyId}"></div>
<script src="https://embed.reputable.health/testimonial.js" async></script>`;

    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (err) {
      console.error("Failed to copy embed code:", err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);

    // Create a simple card image using canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Card dimensions
    canvas.width = 600;
    canvas.height = 400;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#00D1C1");
    gradient.addColorStop(1, "#00A89D");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 60);

    // Verified badge in header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText("✓ Verified by Reputable Health", 20, 38);

    // Participant circle
    ctx.fillStyle = "#00D1C1";
    ctx.beginPath();
    ctx.arc(50, 110, 30, 0, Math.PI * 2);
    ctx.fill();

    // Initials
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(testimonial.initials, 50, 117);
    ctx.textAlign = "left";

    // Name and details
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillText(testimonial.participant, 95, 100);

    ctx.fillStyle = "#6b7280";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(`${testimonial.age} · ${testimonial.location} · ${testimonial.device}`, 95, 125);

    // Rating stars
    ctx.fillStyle = "#fbbf24";
    ctx.font = "18px system-ui, sans-serif";
    const stars = "★".repeat(Math.floor(testimonial.overallRating)) + "☆".repeat(5 - Math.floor(testimonial.overallRating));
    ctx.fillText(stars + ` ${testimonial.overallRating}`, 20, 175);

    // Metrics
    const metrics = testimonial.metrics.slice(0, 3);
    const metricWidth = 180;
    metrics.forEach((metric, idx) => {
      const x = 20 + idx * metricWidth;

      // Metric box
      ctx.fillStyle = "#e6faf9";
      ctx.fillRect(x, 195, metricWidth - 10, 60);

      // Value
      ctx.fillStyle = "#00D1C1";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(metric.value, x + (metricWidth - 10) / 2, 225);

      // Label
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(metric.label, x + (metricWidth - 10) / 2, 245);
    });
    ctx.textAlign = "left";

    // Quote
    ctx.fillStyle = "#374151";
    ctx.font = "italic 14px system-ui, sans-serif";
    const quote = `"${testimonial.story.slice(0, 120)}..."`;

    // Word wrap quote
    const words = quote.split(" ");
    let line = "";
    let y = 290;
    const maxWidth = 560;

    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line, 20, y);
        line = word + " ";
        y += 20;
        if (y > 340) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 20, y);

    // Footer
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 360, canvas.width, 40);

    ctx.fillStyle = "#00D1C1";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(`Verification #${testimonial.verificationId}`, 20, 385);

    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "right";
    ctx.fillText("reputable.health/verify/" + testimonial.verificationId, 580, 385);
    ctx.textAlign = "left";

    // Download the image
    const link = document.createElement("a");
    link.download = `testimonial-${testimonial.verificationId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    setDownloading(false);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title={copiedLink ? "Copied!" : "Copy verification link"}
        onClick={handleCopyLink}
      >
        {copiedLink ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </Button>
      <QRCodePopover
        verificationId={testimonial.verificationId}
        participantName={testimonial.participant}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Download card as image"
        onClick={handleDownload}
        disabled={downloading}
      >
        <Download className={`h-4 w-4 ${downloading ? "animate-pulse" : ""}`} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title={copiedEmbed ? "Copied!" : "Copy embed code"}
        onClick={handleCopyEmbed}
      >
        {copiedEmbed ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
