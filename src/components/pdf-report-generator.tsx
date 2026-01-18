"use client";

import { jsPDF } from "jspdf";
import { Study } from "@/lib/studies-store";
import { MockTestimonial, MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { DEVICE_LABELS } from "@/lib/constants";

interface ReportData {
  study: Study;
  featuredTestimonials: MockTestimonial[];
  allTestimonials: MockTestimonial[];
}

// Helper to load image as base64
async function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Helper to draw rounded rectangle
function roundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "S" | "F" | "FD" = "S"
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

// Draw star rating as filled/empty circles (avoids font issues)
function drawStarRating(doc: jsPDF, x: number, y: number, rating: number, size: number = 3) {
  const filledColor: [number, number, number] = [250, 204, 21]; // yellow
  const emptyColor: [number, number, number] = [209, 213, 219]; // gray

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      doc.setFillColor(...filledColor);
    } else {
      doc.setFillColor(...emptyColor);
    }
    doc.circle(x + i * (size + 1.5), y, size / 2, "F");
  }
}

// Draw simple star icon in a circle (for header badge)
function drawStarIcon(
  doc: jsPDF,
  centerX: number,
  centerY: number,
  radius: number
) {
  const primaryColor: [number, number, number] = [0, 209, 193]; // #00D1C1
  const whiteColor: [number, number, number] = [255, 255, 255];

  // Teal circle background
  doc.setFillColor(...primaryColor);
  doc.circle(centerX, centerY, radius, "F");

  // Draw 5-pointed star in white
  doc.setFillColor(...whiteColor);
  const starRadius = radius * 0.55;
  const innerRadius = starRadius * 0.4;
  const points = 5;

  // Calculate star points
  const starPoints: [number, number][] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? starRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    starPoints.push([
      centerX + Math.cos(angle) * r,
      centerY + Math.sin(angle) * r,
    ]);
  }

  // Draw star using triangles from center
  for (let i = 0; i < starPoints.length; i++) {
    const next = (i + 1) % starPoints.length;
    doc.triangle(
      centerX, centerY,
      starPoints[i][0], starPoints[i][1],
      starPoints[next][0], starPoints[next][1],
      "F"
    );
  }
}

// Draw full verification certificate (for end of report)
function drawVerificationCertificate(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  study: Study
) {
  const primaryColor: [number, number, number] = [0, 209, 193]; // #00D1C1
  const darkColor: [number, number, number] = [17, 24, 39];
  const mutedColor: [number, number, number] = [107, 114, 128];
  const whiteColor: [number, number, number] = [255, 255, 255];

  const height = 55;
  const centerX = x + width / 2;

  // Card background with teal border
  doc.setFillColor(...whiteColor);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  roundedRect(doc, x, y, width, height, 4, "FD");

  // Star icon at top center
  const iconY = y + 12;
  drawStarIcon(doc, centerX, iconY, 8);

  // "VERIFIED BY REPUTABLE HEALTH" title
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFIED BY REPUTABLE HEALTH", centerX, y + 26, { align: "center" });

  // Subtitle
  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Third-Party Biometric Verification Platform", centerX, y + 32, { align: "center" });

  // Divider line
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.3);
  doc.line(x + 15, y + 37, x + width - 15, y + 37);

  // Three columns of info
  const colWidth = (width - 30) / 3;
  const infoY = y + 43;

  // Column 1: Study ID
  doc.setTextColor(...mutedColor);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("STUDY ID", x + 15 + colWidth / 2, infoY, { align: "center" });
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const shortId = `SEN-${new Date().getFullYear()}-${study.id.slice(0, 3).toUpperCase()}`;
  doc.text(shortId, x + 15 + colWidth / 2, infoY + 5, { align: "center" });

  // Column 2: Verification Date
  doc.setTextColor(...mutedColor);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("VERIFICATION DATE", x + 15 + colWidth + colWidth / 2, infoY, { align: "center" });
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const verificationDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  doc.text(verificationDate, x + 15 + colWidth + colWidth / 2, infoY + 5, { align: "center" });

  // Column 3: Data Points
  doc.setTextColor(...mutedColor);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("DATA POINTS COLLECTED", x + 15 + colWidth * 2 + colWidth / 2, infoY, { align: "center" });
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("20,000+ per day", x + 15 + colWidth * 2 + colWidth / 2, infoY + 5, { align: "center" });
}

// Generate PDF report for sales/fundraising
export async function generateStudyPDF(data: ReportData): Promise<void> {
  const { study, featuredTestimonials, allTestimonials } = data;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Colors
  const primaryColor: [number, number, number] = [0, 209, 193]; // #00D1C1
  const darkColor: [number, number, number] = [17, 24, 39]; // gray-900
  const mutedColor: [number, number, number] = [107, 114, 128]; // gray-500
  const lightBg: [number, number, number] = [249, 250, 251]; // gray-50
  const greenColor: [number, number, number] = [34, 197, 94]; // green-500

  // Use featured testimonials if available, otherwise use all
  const testimonials = featuredTestimonials.length > 0 ? featuredTestimonials : allTestimonials;
  const avgRating = testimonials.reduce((sum, t) => sum + t.overallRating, 0) / testimonials.length;
  const completionRate = 87;

  // ============ PAGE 1: COVER & EXECUTIVE SUMMARY ============

  // Header bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Logo with white pill background (so dark logo is visible on teal header)
  doc.setFillColor(255, 255, 255);
  roundedRect(doc, margin, 6, 52, 16, 3, "F");

  // Try to load and add dark logo (works better than white logo with transparency issues)
  try {
    const logoBase64 = await loadImageAsBase64("/logos/reputable-logo-dark-compact.png");
    doc.addImage(logoBase64, "PNG", margin + 3, 8, 45, 12);
  } catch {
    // Fallback to text if logo fails to load
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("REPUTABLE", margin + 5, 16);
  }

  // Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Third-Party Biometric Verification Platform", margin, 28);

  yPos = 42;

  // Study Title
  doc.setTextColor(...darkColor);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const title = study.studyTitle || `${study.productName} Study`;
  doc.text(title, margin, yPos);
  yPos += 8;

  // Product name
  doc.setTextColor(...mutedColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Product: ${study.productName}`, margin, yPos);
  yPos += 12;

  // Executive Summary Box
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  roundedRect(doc, margin, yPos, contentWidth, 28, 3, "FD");

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE SUMMARY", margin + 5, yPos + 8);

  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const summaryText = `This ${study.durationDays}-day verified study tracked ${testimonials.length} participants using wearable devices. Participants reported an average rating of ${avgRating.toFixed(1)}/5.0 with ${completionRate}% completion rate. Key improvements include +22% deep sleep, +17% HRV, and +14% sleep score.`;
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 10);
  doc.text(splitSummary, margin + 5, yPos + 15);

  yPos += 35;

  // Key Metrics - 4 cards in a row
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 28;

  // Card 1: Participants
  doc.setFillColor(...lightBg);
  roundedRect(doc, margin, yPos, cardWidth, cardHeight, 2, "F");
  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  doc.text("PARTICIPANTS", margin + 3, yPos + 7);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(String(testimonials.length), margin + 3, yPos + 20);

  // Card 2: Average Rating
  doc.setFillColor(...lightBg);
  roundedRect(doc, margin + cardWidth + 3, yPos, cardWidth, cardHeight, 2, "F");
  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("AVG RATING", margin + cardWidth + 6, yPos + 7);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${avgRating.toFixed(1)}/5`, margin + cardWidth + 6, yPos + 20);

  // Card 3: Completion
  doc.setFillColor(...lightBg);
  roundedRect(doc, margin + (cardWidth + 3) * 2, yPos, cardWidth, cardHeight, 2, "F");
  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("COMPLETION", margin + (cardWidth + 3) * 2 + 3, yPos + 7);
  doc.setTextColor(...greenColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${completionRate}%`, margin + (cardWidth + 3) * 2 + 3, yPos + 20);

  // Card 4: Duration
  doc.setFillColor(...lightBg);
  roundedRect(doc, margin + (cardWidth + 3) * 3, yPos, cardWidth, cardHeight, 2, "F");
  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("DURATION", margin + (cardWidth + 3) * 3 + 3, yPos + 7);
  doc.setTextColor(...darkColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${study.durationDays}d`, margin + (cardWidth + 3) * 3 + 3, yPos + 20);

  yPos += cardHeight + 10;

  // Key Improvements Section - horizontal bars
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Key Improvements Measured", margin, yPos);
  yPos += 8;

  const improvements = [
    { label: "Deep Sleep", value: 22, color: primaryColor },
    { label: "HRV (Heart Rate Variability)", value: 17, color: [59, 130, 246] as [number, number, number] },
    { label: "Sleep Score", value: 14, color: [139, 92, 246] as [number, number, number] },
    { label: "Energy Levels", value: 12, color: greenColor },
  ];

  improvements.forEach((item) => {
    // Label
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, margin, yPos + 4);

    // Background bar
    doc.setFillColor(229, 231, 235);
    roundedRect(doc, margin + 50, yPos, 90, 6, 1.5, "F");

    // Filled bar
    doc.setFillColor(...item.color);
    const barWidth = Math.min(item.value * 3.5, 90);
    roundedRect(doc, margin + 50, yPos, barWidth, 6, 1.5, "F");

    // Value
    doc.setTextColor(...item.color);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`+${item.value}%`, margin + 145, yPos + 5);

    yPos += 10;
  });

  yPos += 5;

  // ============ FEATURED TESTIMONIALS ============

  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Featured Verified Testimonials", margin, yPos);
  yPos += 6;

  // Show testimonials
  const testimonialsToShow = testimonials.slice(0, 3);

  testimonialsToShow.forEach((t) => {
    // Check if we need a new page
    if (yPos > pageHeight - 55) {
      doc.addPage();
      yPos = margin;
    }

    // Testimonial card
    doc.setFillColor(...lightBg);
    roundedRect(doc, margin, yPos, contentWidth, 42, 3, "F");

    // Left side - participant info
    doc.setTextColor(...darkColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t.participant, margin + 5, yPos + 8);

    doc.setTextColor(...mutedColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`${t.age} · ${t.location} · ${t.device}`, margin + 5, yPos + 14);

    // Star rating (using circles instead of text)
    drawStarRating(doc, margin + 5, yPos + 20, t.overallRating, 2.5);
    doc.setTextColor(...mutedColor);
    doc.setFontSize(8);
    doc.text(`${t.overallRating}`, margin + 22, yPos + 21);

    // Right side - metrics
    const metricsStartX = margin + 70;
    t.metrics.slice(0, 3).forEach((m, idx) => {
      const mX = metricsStartX + idx * 35;
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(m.value, mX, yPos + 10);

      doc.setTextColor(...mutedColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(m.label, mX, yPos + 15);
    });

    // Verification badge
    doc.setFillColor(...greenColor);
    roundedRect(doc, pageWidth - margin - 25, yPos + 3, 23, 6, 1.5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(`#${t.verificationId}`, pageWidth - margin - 23, yPos + 7);

    // Quote
    doc.setTextColor(...darkColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const quote = `"${t.story.slice(0, 140)}..."`;
    const splitQuote = doc.splitTextToSize(quote, contentWidth - 12);
    doc.text(splitQuote.slice(0, 2), margin + 5, yPos + 30);

    yPos += 46;
  });

  // ============ PAGE 2: MORE TESTIMONIALS & METHODOLOGY ============

  if (testimonials.length > 3) {
    doc.addPage();
    yPos = margin;

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Verified Testimonials", margin, 12);

    yPos = 25;

    // Remaining testimonials in compact format
    testimonials.slice(3).forEach((t) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(...lightBg);
      roundedRect(doc, margin, yPos, contentWidth, 32, 2, "F");

      // Name and info
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(t.participant, margin + 4, yPos + 8);

      doc.setTextColor(...mutedColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`${t.age} · ${t.location} · ${t.device}`, margin + 4, yPos + 13);

      // Rating circles
      drawStarRating(doc, margin + 4, yPos + 19, t.overallRating, 2);

      // Metrics inline
      const metricsText = t.metrics.map((m) => `${m.value} ${m.label}`).join("  |  ");
      doc.setTextColor(...primaryColor);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(metricsText, margin + 60, yPos + 10);

      // Short quote
      doc.setTextColor(...darkColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(`"${t.story.slice(0, 90)}..."`, margin + 60, yPos + 18);

      // Verification
      doc.setTextColor(...greenColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(`Verified #${t.verificationId}`, pageWidth - margin - 28, yPos + 10);

      yPos += 36;
    });
  }

  // ============ METHODOLOGY & FOOTER ============

  // Check if we need a new page for methodology
  if (yPos > pageHeight - 70) {
    doc.addPage();
    yPos = margin;
  } else {
    yPos += 8;
  }

  // Methodology box (clean, no seal)
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  roundedRect(doc, margin, yPos, contentWidth, 40, 3, "FD");

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Verification Methodology", margin + 5, yPos + 9);

  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const deviceLabel = study.requiredDevice ? DEVICE_LABELS[study.requiredDevice] || "Various" : "Various";
  const methodology = [
    "• All participants verified through connected wearable devices (" + deviceLabel + ")",
    "• Biometric data collected continuously throughout the " + (study.durationDays || 28) + "-day study period",
    "• Baseline measurements established during 7-day pre-study period",
    "• Results independently verified by Reputable Health platform",
    "• Each testimonial linked to verifiable third-party data page",
  ];
  methodology.forEach((line, idx) => {
    doc.text(line, margin + 5, yPos + 17 + idx * 5);
  });

  yPos += 47;

  // Call to Action / Link box with logo
  doc.setFillColor(...lightBg);
  roundedRect(doc, margin, yPos, contentWidth, 24, 3, "F");

  // Try to add small dark logo
  try {
    const darkLogoBase64 = await loadImageAsBase64("/logos/reputable-logo-dark-compact.png");
    doc.addImage(darkLogoBase64, "PNG", margin + 4, yPos + 4, 28, 8);
  } catch {
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REPUTABLE", margin + 5, yPos + 10);
  }

  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("View Full Interactive Results:", margin + 36, yPos + 10);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`reputable.health/study/${study.id}`, margin + 36, yPos + 17);

  // Generated date
  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Report generated: ${generatedDate}`, pageWidth - margin - 42, yPos + 17);

  yPos += 32;

  // Verification Certificate at the end
  drawVerificationCertificate(doc, margin, yPos, contentWidth, study);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...mutedColor);
    doc.setFontSize(7);
    doc.text(
      `Page ${i} of ${totalPages}  |  Verified by Reputable Health  |  reputable.health`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  // Save the PDF
  const studyName = study.name || study.productName || "Study";
  const fileName = `${studyName.replace(/\s+/g, "-")}-Study-Report.pdf`;
  doc.save(fileName);
}

// Component wrapper for download button (can be used in multiple places)
export function DownloadReportButton({
  study,
  featuredTestimonials,
  className,
  children,
}: {
  study: Study;
  featuredTestimonials: string[];
  className?: string;
  children: React.ReactNode;
}) {
  const handleDownload = async () => {
    const featured = featuredTestimonials.length > 0
      ? MOCK_TESTIMONIALS.filter((t) => featuredTestimonials.includes(String(t.id)))
      : MOCK_TESTIMONIALS;

    await generateStudyPDF({
      study,
      featuredTestimonials: featured,
      allTestimonials: MOCK_TESTIMONIALS,
    });
  };

  return (
    <button onClick={handleDownload} className={className}>
      {children}
    </button>
  );
}
