"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VerificationPage } from "@/components/verification-page";
import { MOCK_TESTIMONIALS, MOCK_PARTICIPANT_STORIES } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

// This page displays the verification landing page for a specific testimonial
// In a real app, this would fetch the testimonial data from an API based on the verification ID
export default function VerifyPage() {
  const params = useParams();
  const verificationId = params.id as string;

  // Find the testimonial by verification ID
  // In production, this would be an API call
  const testimonial = MOCK_TESTIMONIALS.find(
    (t) => t.verificationId === verificationId
  );

  // Also find matching rich story data
  const story = testimonial
    ? MOCK_PARTICIPANT_STORIES.find(
        (s) => s.verificationId === verificationId ||
               s.name === testimonial.participant ||
               s.initials === testimonial.initials
      )
    : undefined;

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">Verification Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find a verified result with ID #{verificationId}.
            This verification may have expired or the ID may be incorrect.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock study data - in production this would come from the API
  const studyData = {
    studyTitle: "Better Sleep Study",
    productName: "SleepWell Premium",
    studyDuration: 28,
    studyId: "study-001",
  };

  return (
    <VerificationPage
      testimonial={testimonial}
      studyTitle={studyData.studyTitle}
      productName={studyData.productName}
      studyDuration={studyData.studyDuration}
      studyId={studyData.studyId}
      story={story}
    />
  );
}
