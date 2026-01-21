import JSZip from "jszip";
import html2canvas from "html2canvas";
import { ParticipantStory } from "./types";

interface CarouselDownloadOptions {
  productName: string;
  brandName: string;
  studyDuration: number;
  totalParticipants: number;
  avgActivityChange: number;
  avgStepsChange: number;
  starParticipant: ParticipantStory;
}

/**
 * Generate Instagram caption for the carousel
 */
function generateCarouselCaption(options: CarouselDownloadOptions): string {
  const {
    productName,
    brandName,
    studyDuration,
    totalParticipants,
    avgActivityChange,
    starParticipant,
  } = options;

  const starSteps = starParticipant.wearableMetrics?.stepsChange?.changePercent || 0;
  const starQuote = starParticipant.finalTestimonial?.quote || "";

  return `${productName} - Independent Study Results 🧪

What happens when ${totalParticipants} real people try @${brandName.toLowerCase().replace(/\s+/g, '')} for ${studyDuration} days?

We tracked them with Oura Rings. Here's what we found:

📈 +${avgActivityChange}% average increase in daily activity
⭐ ${starParticipant.name} saw +${starSteps}% more steps
💬 "${starQuote.slice(0, 100)}${starQuote.length > 100 ? '...' : ''}"

The difference? This isn't cherry-picked marketing.
All ${totalParticipants} participants are shown — the good, the neutral, and the ones who didn't see results.

That's what verified wellness looks like.

See everyone's individual results → link in bio

#IndependentStudy #VerifiedResults #WellnessResearch #${brandName.replace(/\s+/g, '')} #ReputableHealth #OuraRing

---

Slide-by-slide breakdown:

Slide 1: The hook - ${totalParticipants} real people, ${studyDuration} days, Oura Ring tracked

Slide 2: The headline result - +${avgActivityChange}% more active on average

Slide 3: Star performer - ${starParticipant.name}'s story
"${starQuote}"
+${starSteps}% steps | +${starParticipant.wearableMetrics?.activeMinutesChange?.changePercent || 0}% activity

Slide 4: The transparency message - All ${totalParticipants} shown, not cherry-picked
`;
}

/**
 * Render a slide element and capture it as a PNG blob
 */
async function captureSlideAsBlob(slideElement: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(slideElement, {
    scale: 2, // 2x for retina quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width: 1080,
    height: 1350,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/png", 1.0);
  });
}

/**
 * Download Instagram carousel slides as a ZIP file
 */
export async function downloadInstagramCarousel(
  options: CarouselDownloadOptions,
  slideElements: HTMLElement[]
): Promise<void> {
  const { brandName, productName, starParticipant } = options;

  const zip = new JSZip();

  // Generate caption
  const caption = generateCarouselCaption(options);
  zip.file("caption.txt", caption);

  // Generate metadata
  const metadata = {
    generatedAt: new Date().toISOString(),
    productName,
    brandName,
    format: "Instagram Carousel (1080x1350px)",
    slides: [
      { number: 1, description: "The Hook - Study introduction" },
      { number: 2, description: "The Result - Headline metric" },
      { number: 3, description: `The Star - ${starParticipant.name}'s story` },
      { number: 4, description: "The Proof - Transparency message" },
    ],
    starParticipant: {
      name: starParticipant.name,
      verificationId: starParticipant.verificationId,
      nps: starParticipant.finalTestimonial?.npsScore,
      stepsChange: starParticipant.wearableMetrics?.stepsChange?.changePercent,
      activityChange: starParticipant.wearableMetrics?.activeMinutesChange?.changePercent,
      quote: starParticipant.finalTestimonial?.quote,
    },
    studyStats: {
      totalParticipants: options.totalParticipants,
      avgActivityChange: options.avgActivityChange,
      avgStepsChange: options.avgStepsChange,
      studyDuration: options.studyDuration,
    },
  };
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  // Slide names for the ZIP
  const slideNames = [
    "01-hook-study-intro",
    "02-result-headline",
    "03-star-performer",
    "04-proof-transparency",
  ];

  // Capture each slide as PNG
  for (let i = 0; i < slideElements.length; i++) {
    const element = slideElements[i];

    try {
      const blob = await captureSlideAsBlob(element);
      const filename = `${slideNames[i]}.png`;
      zip.file(filename, blob);
    } catch (error) {
      console.error(`Failed to capture slide ${i + 1}:`, error);
    }
  }

  // Generate and download the ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);

  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().split("T")[0];
  link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-instagram-carousel-${date}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Keep legacy export for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function downloadInstagramCards(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: {
    stories: ParticipantStory[];
    productName: string;
    brandName: string;
    studyDuration: number;
    studyTitle: string;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cardElements: HTMLElement[]
): Promise<void> {
  // Deprecated - use downloadInstagramCarousel instead
  console.warn("downloadInstagramCards is deprecated. Use downloadInstagramCarousel instead.");
}
