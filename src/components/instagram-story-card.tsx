"use client";

import { ParticipantStory } from "@/lib/types";
import React from "react";

/**
 * Instagram Carousel - 4-Slide Story Format (1080x1350px each)
 *
 * Bold, attention-grabbing design with lifestyle photography backgrounds
 * Typography: Large, bold, high contrast
 * Images: Full-bleed with gradient overlays for text readability
 */

// Slide 1: The Hook - Question that creates curiosity
export function InstagramSlide1Hook({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productName,
  studyDuration,
  totalParticipants,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productImageUrl,
}: {
  productName: string;
  studyDuration: number;
  totalParticipants: number;
  productImageUrl: string;
}) {
  return (
    <div
      data-slide="1"
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Image - Active lifestyle */}
      <img
        src="/images/lyfefuel-bg-active.png"
        alt=""
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          justifyContent: "space-between",
        }}
      >
        {/* Top - Verified badge */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#00D1C1",
              padding: "14px 32px 20px",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ✓ Independent Study
            </span>
          </div>
        </div>

        {/* Main Content - Bottom */}
        <div style={{ textAlign: "center" }}>
          {/* The question - creates curiosity */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 32,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            Does{" "}
            <span style={{ color: "#00D1C1" }}>LYFEfuel Daily Essentials</span>
            {" "}actually boost your energy?
          </h1>

          {/* The proof setup */}
          <p
            style={{
              fontSize: 38,
              fontWeight: 500,
              color: "rgba(255,255,255,0.95)",
              margin: 0,
              marginBottom: 40,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              lineHeight: 1.4,
            }}
          >
            We tested it.
            <br />
            <strong>{totalParticipants} people. {studyDuration} days. Oura Ring tracked.</strong>
          </p>

          {/* CTA Button */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#00D1C1",
              padding: "18px 48px 26px",
              borderRadius: 16,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "white",
              }}
            >
              See what we found →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 2: The Result - Massive number, impossible to ignore
export function InstagramSlide2Result({
  avgActivityChange,
  totalParticipants,
}: {
  avgActivityChange: number;
  totalParticipants: number;
}) {
  return (
    <div
      data-slide="2"
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Image - Shake pouring */}
      <img
        src="/images/lyfefuel-bg-shake.png"
        alt=""
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 64,
        }}
      >
        {/* Label */}
        <p
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 24,
          }}
        >
          On Average
        </p>

        {/* MASSIVE NUMBER */}
        <div
          style={{
            fontSize: 280,
            fontWeight: 900,
            lineHeight: 0.85,
            color: "#00D1C1",
            textShadow: "0 8px 40px rgba(0,209,193,0.5), 0 0 80px rgba(0,209,193,0.3)",
            marginBottom: 16,
          }}
        >
          +{avgActivityChange}%
        </div>

        {/* Descriptor */}
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            margin: 0,
            marginBottom: 48,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          MORE ACTIVE
        </p>

        {/* Supporting text */}
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            margin: 0,
            maxWidth: 600,
          }}
        >
          Measured by Oura Ring wearable data
          <br />
          across {totalParticipants} verified participants
        </p>
      </div>
    </div>
  );
}

// Slide 3: Star Performer - Personal story with compelling stats
export function InstagramSlide3Star({
  starParticipant,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productImageUrl,
}: {
  starParticipant: ParticipantStory;
  productImageUrl: string;
}) {
  const stepsChange = starParticipant.wearableMetrics?.stepsChange?.changePercent || 0;
  const activityChange = starParticipant.wearableMetrics?.activeMinutesChange?.changePercent || 0;
  const quote = starParticipant.finalTestimonial?.quote || "";
  const stars = starParticipant.finalTestimonial?.overallRating || 5;

  return (
    <div
      data-slide="3"
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Image - Kitchen/lifestyle */}
      <img
        src="/images/lyfefuel-bg-kitchen.png"
        alt=""
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
        }}
      >
        {/* Top label */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#00D1C1",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Real Story
          </span>
        </div>

        {/* Stars */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, letterSpacing: 12 }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < stars ? "#FFD700" : "rgba(255,255,255,0.3)" }}>
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 52,
              fontWeight: 600,
              lineHeight: 1.3,
              fontStyle: "italic",
              color: "white",
              maxWidth: 900,
              margin: 0,
              marginBottom: 48,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>

          {/* Attribution */}
          <p
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "white",
              margin: 0,
              marginBottom: 8,
            }}
          >
            — {starParticipant.name}
          </p>
          <p
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          >
            {starParticipant.profile.ageRange} • Verified Participant
          </p>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            padding: 32,
            backgroundColor: "rgba(0,209,193,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            border: "2px solid rgba(0,209,193,0.3)",
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#00D1C1",
                margin: 0,
                lineHeight: 1,
              }}
            >
              +{stepsChange}%
            </p>
            <p style={{ fontSize: 22, color: "white", margin: 0, marginTop: 8 }}>
              MORE STEPS
            </p>
          </div>
          <div
            style={{
              width: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#00D1C1",
                margin: 0,
                lineHeight: 1,
              }}
            >
              +{activityChange}%
            </p>
            <p style={{ fontSize: 22, color: "white", margin: 0, marginTop: 8 }}>
              MORE ACTIVE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 4: Transparency - CTA to see full results with methodology
export function InstagramSlide4Proof({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalParticipants,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brandName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brandLogoUrl,
}: {
  totalParticipants: number;
  brandName: string;
  brandLogoUrl?: string;
}) {
  return (
    <div
      data-slide="4"
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Image - Product shot */}
      <img
        src="/images/lyfefuel-bg-product.png"
        alt=""
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          justifyContent: "space-between",
        }}
      >
        {/* Top - Reputable branding */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#00D1C1",
              padding: "14px 32px 20px",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ✓ Verified by Reputable Health
            </span>
          </div>
        </div>

        {/* Main Message */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "white",
              margin: 0,
              marginBottom: 32,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            SEE THE
            <br />
            <span style={{ color: "#00D1C1" }}>FULL STUDY</span>
            <br />
            RESULTS
          </h2>

          <p
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.5,
              maxWidth: 750,
              margin: "0 auto 40px",
            }}
          >
            Every participant&apos;s data is published—
            <br />
            the improvements, the unchanged, and everything in between.
          </p>

          {/* CTA Button */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#00D1C1",
              padding: "22px 56px 30px",
              borderRadius: 16,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "white",
              }}
            >
              reputable.health/lyfefuel
            </span>
          </div>
        </div>

        {/* Bottom - Study methodology */}
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 24,
            borderRadius: 16,
            borderTop: "2px solid rgba(0,209,193,0.3)",
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.5,
              margin: 0,
              textAlign: "center",
            }}
          >
            This study was conducted independently by Reputable Health. Participants used LYFEfuel Daily Essentials Shake daily over 24 days, with wearable data (Oura Ring) collected throughout a 14-day baseline and 24-day intervention period. All participants received the same compensation regardless of their feedback or results.
          </p>
        </div>
      </div>
    </div>
  );
}

// Legacy exports for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InstagramStoryCardSimple(props: {
  story: ParticipantStory;
  productName: string;
  brandName: string;
  studyDuration: number;
}) {
  return <div>Deprecated - use carousel slides</div>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InstagramCarouselPreview(props: {
  productName: string;
  brandName: string;
  studyDuration: number;
  totalParticipants: number;
  avgActivityChange: number;
  avgStepsChange: number;
  starParticipant: ParticipantStory;
  productImageUrl: string;
  brandLogoUrl?: string;
}) {
  return <div>Use individual slide components</div>;
}
