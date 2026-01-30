"use client";

/**
 * Carousel Templates for Marketing Kit Export
 * 
 * Instagram carousel slide templates (1080x1350 at 2x resolution)
 * Each slide follows the PRD structure:
 * 1. The Hook - Hero metric + participant photo
 * 2. The Struggle - Quote about what they tried before + baseline metrics
 * 3. The Transformation - Before → After metrics comparison
 * 4. The Testimonial - Full quote + verification
 * 5. The CTA - QR code to verification page (optional)
 */

import { QRCodeSVG } from "qrcode.react";
import { Shield, Quote, ArrowRight, TrendingUp, Star } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface BrandSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  logoUrl?: string;
  logoPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  fontFamily: string;
}

export interface ParticipantData {
  id: string;
  name: string;
  initials: string;
  ageRange?: string;
  photoUrl?: string;
  quote: string;
  struggleQuote?: string;
  rating: number;
  studyDuration: number;
  device: string;
  verificationId: string;
  verificationUrl: string;
  metrics: {
    label: string;
    before: number | string;
    after: number | string;
    unit: string;
    changePercent: number;
    lowerIsBetter?: boolean;
  }[];
}

export interface SlideProps {
  participant: ParticipantData;
  brand: BrandSettings;
  studyName?: string;
  brandName?: string;
  aspectRatio?: "4:5" | "1:1";
}

// ============================================
// UTILITIES
// ============================================

function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

function formatMetricValue(value: number | string, unit: string): string {
  if (typeof value === "string") return value;
  if (unit === "min") {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }
  return `${value}${unit}`;
}

// ============================================
// SHARED COMPONENTS
// ============================================

function VerificationBadge({ 
  position = "bottom-right",
  size = "normal"
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "normal" | "small";
}) {
  const badgeStyle = size === "small" 
    ? { fontSize: "12px", padding: "6px 12px", gap: "6px" }
    : { fontSize: "14px", padding: "10px 18px", gap: "8px" };
    
  return (
    <div
      className={`absolute ${position.includes("top") ? "top-[40px]" : "bottom-[40px]"} ${position.includes("left") ? "left-[40px]" : "right-[40px]"}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: badgeStyle.gap,
        backgroundColor: "#ffffff",
        borderRadius: "100px",
        padding: badgeStyle.padding,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Shield
        style={{ 
          width: size === "small" ? "14px" : "18px", 
          height: size === "small" ? "14px" : "18px", 
          color: "#10B981" 
        }}
        fill="#10B981"
      />
      <span style={{ fontWeight: 600, color: "#1a1a1a", fontSize: badgeStyle.fontSize }}>
        Verified by Reputable
      </span>
    </div>
  );
}

function BrandLogo({
  logoUrl,
  position,
  brandName,
  primaryColor,
}: {
  logoUrl?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  brandName?: string;
  primaryColor: string;
}) {
  const positionStyle = {
    "top-left": { top: "40px", left: "40px" },
    "top-right": { top: "40px", right: "40px" },
    "bottom-left": { bottom: "40px", left: "40px" },
    "bottom-right": { bottom: "40px", right: "40px" },
  };

  return (
    <div
      className="absolute"
      style={{
        ...positionStyle[position],
        maxWidth: "140px",
        maxHeight: "50px",
      }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={brandName || "Brand Logo"}
          style={{ maxWidth: "140px", maxHeight: "50px", objectFit: "contain" }}
        />
      ) : brandName ? (
        <div
          style={{
            fontWeight: 700,
            fontSize: "20px",
            color: getContrastColor(primaryColor),
          }}
        >
          {brandName}
        </div>
      ) : null}
    </div>
  );
}

// Badge position opposite to logo
function getBadgePosition(logoPosition: string): "top-left" | "top-right" | "bottom-left" | "bottom-right" {
  switch (logoPosition) {
    case "top-left": return "bottom-right";
    case "top-right": return "bottom-left";
    case "bottom-left": return "top-right";
    case "bottom-right": return "top-left";
    default: return "bottom-right";
  }
}

// ============================================
// SLIDE 1: THE HOOK
// ============================================

export function SlideHook({ participant, brand, brandName, aspectRatio = "4:5" }: SlideProps) {
  const heroMetric = participant.metrics[0] || {
    label: "Improvement",
    before: 50,
    after: 75,
    unit: "/100",
    changePercent: 50,
    lowerIsBetter: false,
  };
  const dimensions = aspectRatio === "4:5" 
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };
  
  const changeDisplay = heroMetric.lowerIsBetter
    ? `-${Math.abs(heroMetric.changePercent)}%`
    : `+${heroMetric.changePercent}%`;

  return (
    <div
      className="slide-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: brand.primaryColor,
        fontFamily: brand.fontFamily,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        boxSizing: "border-box",
      }}
    >
      <BrandLogo
        logoUrl={brand.logoUrl}
        position={brand.logoPosition}
        brandName={brandName}
        primaryColor={brand.primaryColor}
      />

      {/* Hero Metric */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <div
          style={{
            fontSize: "120px",
            fontWeight: 800,
            color: getContrastColor(brand.primaryColor),
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          {changeDisplay}
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: getContrastColor(brand.primaryColor),
            opacity: 0.9,
          }}
        >
          {heroMetric.label}
        </div>
      </div>

      {/* Participant */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Avatar */}
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            border: "4px solid rgba(255,255,255,0.4)",
            overflow: "hidden",
          }}
        >
          {participant.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={participant.photoUrl}
              alt={participant.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: getContrastColor(brand.primaryColor),
              }}
            >
              {participant.initials}
            </span>
          )}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: getContrastColor(brand.primaryColor),
          }}
        >
          {participant.name}{participant.ageRange ? `, ${participant.ageRange}` : ""}
        </div>
      </div>

      <VerificationBadge position={getBadgePosition(brand.logoPosition)} />
    </div>
  );
}

// ============================================
// SLIDE 2: THE STRUGGLE
// ============================================

export function SlideStruggle({ participant, brand, brandName, aspectRatio = "4:5" }: SlideProps) {
  const dimensions = aspectRatio === "4:5" 
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };
  
  // Use struggle quote or derive from baseline
  const struggleText = participant.struggleQuote || 
    "I tried everything. Nothing seemed to work for me until I found this.";

  return (
    <div
      className="slide-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontFamily,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        boxSizing: "border-box",
      }}
    >
      <BrandLogo
        logoUrl={brand.logoUrl}
        position={brand.logoPosition}
        brandName={brandName}
        primaryColor={brand.backgroundColor}
      />

      {/* Quote */}
      <div style={{ marginBottom: "60px" }}>
        <Quote
          style={{
            width: "48px",
            height: "48px",
            color: brand.primaryColor,
            opacity: 0.6,
            marginBottom: "24px",
          }}
        />
        <p
          style={{
            fontSize: "42px",
            fontWeight: 500,
            color: brand.textColor,
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          &quot;{struggleText}&quot;
        </p>
      </div>

      {/* Baseline Metrics */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.05)",
          borderRadius: "20px",
          padding: "32px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: brand.textColor,
            opacity: 0.6,
            marginBottom: "16px",
          }}
        >
          Baseline Metrics
        </p>
        <div style={{ display: "flex", gap: "32px" }}>
          {participant.metrics.slice(0, 3).map((metric, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: "24px", fontWeight: 600, color: brand.textColor }}>
                {formatMetricValue(metric.before, metric.unit)}
              </div>
              <div style={{ fontSize: "16px", color: brand.textColor, opacity: 0.7 }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <VerificationBadge position={getBadgePosition(brand.logoPosition)} />
    </div>
  );
}

// ============================================
// SLIDE 3: THE TRANSFORMATION
// ============================================

export function SlideTransformation({ participant, brand, brandName, aspectRatio = "4:5" }: SlideProps) {
  const dimensions = aspectRatio === "4:5" 
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };

  return (
    <div
      className="slide-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontFamily,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        boxSizing: "border-box",
      }}
    >
      <BrandLogo
        logoUrl={brand.logoUrl}
        position={brand.logoPosition}
        brandName={brandName}
        primaryColor={brand.backgroundColor}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: brand.textColor,
          }}
        >
          BEFORE
        </span>
        <ArrowRight
          style={{ width: "32px", height: "32px", color: brand.primaryColor }}
        />
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: brand.primaryColor,
          }}
        >
          AFTER
        </span>
      </div>

      {/* Metrics Comparison */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {participant.metrics.slice(0, 4).map((metric, i) => {
          const changeDisplay = metric.lowerIsBetter
            ? `↓${Math.abs(metric.changePercent)}%`
            : `↑${metric.changePercent}%`;
          
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 32px",
                backgroundColor: "rgba(0,0,0,0.03)",
                borderRadius: "16px",
                borderLeft: `4px solid ${brand.primaryColor}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: brand.textColor }}>
                  {metric.label}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <span style={{ fontSize: "28px", fontWeight: 500, color: brand.textColor, opacity: 0.6 }}>
                  {formatMetricValue(metric.before, metric.unit)}
                </span>
                <ArrowRight
                  style={{ width: "24px", height: "24px", color: brand.textColor, opacity: 0.4 }}
                />
                <span style={{ fontSize: "28px", fontWeight: 700, color: brand.textColor }}>
                  {formatMetricValue(metric.after, metric.unit)}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: brand.secondaryColor,
                    marginLeft: "8px",
                  }}
                >
                  {changeDisplay}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <VerificationBadge position={getBadgePosition(brand.logoPosition)} />
    </div>
  );
}

// ============================================
// SLIDE 4: THE TESTIMONIAL
// ============================================

export function SlideTestimonial({ participant, brand, brandName, aspectRatio = "4:5" }: SlideProps) {
  const dimensions = aspectRatio === "4:5" 
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };

  return (
    <div
      className="slide-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: brand.primaryColor,
        fontFamily: brand.fontFamily,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        boxSizing: "border-box",
      }}
    >
      <BrandLogo
        logoUrl={brand.logoUrl}
        position={brand.logoPosition}
        brandName={brandName}
        primaryColor={brand.primaryColor}
      />

      {/* Quote */}
      <div style={{ marginBottom: "48px" }}>
        <Quote
          style={{
            width: "64px",
            height: "64px",
            color: getContrastColor(brand.primaryColor),
            opacity: 0.4,
            marginBottom: "32px",
          }}
        />
        <p
          style={{
            fontSize: "48px",
            fontWeight: 500,
            color: getContrastColor(brand.primaryColor),
            lineHeight: 1.3,
          }}
        >
          &quot;{participant.quote}&quot;
        </p>
      </div>

      {/* Attribution */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Avatar */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid rgba(255,255,255,0.4)",
            overflow: "hidden",
          }}
        >
          {participant.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={participant.photoUrl}
              alt={participant.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: getContrastColor(brand.primaryColor),
              }}
            >
              {participant.initials}
            </span>
          )}
        </div>
        
        <div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: getContrastColor(brand.primaryColor),
            }}
          >
            — {participant.name}, verified participant
          </div>
          <div
            style={{
              fontSize: "18px",
              color: getContrastColor(brand.primaryColor),
              opacity: 0.8,
              marginTop: "4px",
            }}
          >
            {participant.studyDuration}-day study, {participant.device} tracked
          </div>
          {/* Rating */}
          <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                style={{
                  width: "20px",
                  height: "20px",
                  color: star <= Math.round(participant.rating) ? "#FFD700" : "rgba(255,255,255,0.3)",
                  fill: star <= Math.round(participant.rating) ? "#FFD700" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <VerificationBadge position={getBadgePosition(brand.logoPosition)} />
    </div>
  );
}

// ============================================
// SLIDE 5: THE CTA
// ============================================

export function SlideCTA({ participant, brand, brandName, aspectRatio = "4:5" }: SlideProps) {
  const dimensions = aspectRatio === "4:5" 
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };

  return (
    <div
      className="slide-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontFamily,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        boxSizing: "border-box",
      }}
    >
      {/* Main CTA */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <TrendingUp
          style={{
            width: "64px",
            height: "64px",
            color: brand.primaryColor,
            marginBottom: "24px",
          }}
        />
        <h2
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: brand.textColor,
            marginBottom: "16px",
          }}
        >
          See {participant.name.split(" ")[0]}&apos;s full story
        </h2>
        <p
          style={{
            fontSize: "24px",
            color: brand.textColor,
            opacity: 0.7,
          }}
        >
          Scan to view complete verification data
        </p>
      </div>

      {/* QR Code */}
      <div
        style={{
          padding: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "60px",
        }}
      >
        <QRCodeSVG
          value={participant.verificationUrl}
          size={200}
          level="M"
          fgColor={brand.primaryColor}
          bgColor="#ffffff"
        />
      </div>

      {/* Brand & Verification */}
      <div style={{ textAlign: "center" }}>
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brandName || "Brand Logo"}
            style={{ maxWidth: "180px", maxHeight: "60px", objectFit: "contain", marginBottom: "20px" }}
          />
        ) : brandName ? (
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: brand.textColor,
              marginBottom: "20px",
            }}
          >
            {brandName}
          </div>
        ) : null}
        
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#10B981",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "100px",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          <Shield style={{ width: "20px", height: "20px" }} fill="#ffffff" />
          Verified by Reputable
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export const SLIDE_COMPONENTS = {
  hook: SlideHook,
  struggle: SlideStruggle,
  transformation: SlideTransformation,
  testimonial: SlideTestimonial,
  cta: SlideCTA,
};

export type SlideType = keyof typeof SLIDE_COMPONENTS;

export const SLIDE_METADATA: Record<SlideType, { name: string; description: string }> = {
  hook: { name: "The Hook", description: "Hero metric + participant photo" },
  struggle: { name: "The Struggle", description: "What they tried before + baseline" },
  transformation: { name: "The Transformation", description: "Before → After comparison" },
  testimonial: { name: "The Testimonial", description: "Full quote + verification" },
  cta: { name: "The CTA", description: "QR code to verification page" },
};
