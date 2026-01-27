"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Gift,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Shield,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useStudiesStore, useStudiesHydrated } from "@/lib/studies-store";
import { useBrandsStore } from "@/lib/brands-store";
import { useEnrollmentStore } from "@/lib/enrollment-store";

type EnrollmentState = "loading" | "open" | "closed" | "full" | "not_found" | "success";

export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Store hooks
  const { getStudyByEnrollmentSlug, incrementEnrolledCount } = useStudiesStore();
  const { getBrandById } = useBrandsStore();
  const { trackClick, signUp } = useEnrollmentStore();
  const isHydrated = useStudiesHydrated();

  // Local state
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>("loading");
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get study and brand
  const study = isHydrated ? getStudyByEnrollmentSlug(slug) : undefined;
  const brand = study ? getBrandById(study.brandId) : undefined;

  // Check enrollment status once hydrated
  useEffect(() => {
    if (!isHydrated) return;

    if (!study) {
      setEnrollmentState("not_found");
      return;
    }

    const config = study.enrollmentConfig;
    if (!config) {
      setEnrollmentState("not_found");
      return;
    }

    // Check if enrollment is closed
    if (config.enrollmentStatus === "closed" || config.enrollmentStatus === "paused") {
      setEnrollmentState("closed");
      return;
    }

    // Check if cap is reached
    if ((config.enrolledCount || 0) >= config.enrollmentCap) {
      setEnrollmentState("full");
      return;
    }

    // Check deadline
    if (config.enrollmentDeadline) {
      const deadline = new Date(config.enrollmentDeadline);
      if (new Date() > deadline) {
        setEnrollmentState("closed");
        return;
      }
    }

    // Track click and set state to open
    const enrollment = trackClick(study.id, slug);
    setEnrollmentId(enrollment.id);
    setEnrollmentState("open");
  }, [isHydrated, study, slug, trackClick]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError("Please enter your name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Sign up the enrollment
    if (enrollmentId) {
      signUp(enrollmentId, {
        name: formData.name,
        email: formData.email,
        orderConfirmation: formData.orderConfirmation || undefined,
      });
    }

    // Increment enrolled count on the study
    if (study) {
      incrementEnrolledCount(study.id);
    }

    setIsSubmitting(false);
    setEnrollmentState("success");
  };

  // Loading state
  if (!isHydrated || enrollmentState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00D1C1]" />
      </div>
    );
  }

  // Not found state
  if (enrollmentState === "not_found") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Study Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This enrollment link may be expired or invalid. Please check with the brand for a valid link.
            </p>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enrollment closed state
  if (enrollmentState === "closed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Enrollment Closed</h1>
            <p className="text-muted-foreground mb-6">
              This study is no longer accepting new participants. Thank you for your interest!
            </p>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Study full state
  if (enrollmentState === "full") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Study is Full</h1>
            <p className="text-muted-foreground mb-6">
              This study has reached its enrollment cap. Thank you for your interest!
            </p>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (enrollmentState === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#00D1C1]/5 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#00D1C1]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-[#00D1C1]" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">You&apos;re In!</h1>
            <p className="text-muted-foreground mb-6">
              Welcome to the {study?.name || "study"}! Check your email for next steps.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="font-semibold text-[#00D1C1]">1.</span>
                  Download the Reputable app (link in your email)
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#00D1C1]">2.</span>
                  Complete your baseline period while waiting for your product
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#00D1C1]">3.</span>
                  Start your 28-day study when your product arrives
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#00D1C1]">4.</span>
                  Earn ${study?.rebateAmount || 50} when you complete the study
                </li>
              </ol>
            </div>

            <p className="text-xs text-muted-foreground">
              Questions? Contact us at support@reputable.health
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Open enrollment - show form
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logos/reputable-icon-dark.png"
              alt="Reputable"
              width={28}
              height={28}
              className="h-7 w-7"
              unoptimized
            />
            <span className="font-semibold text-gray-900">Reputable</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Verified Studies
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Brand & Study Info */}
        <div className="text-center mb-8">
          {brand?.logoUrl && (
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              width={48}
              height={48}
              className="h-12 w-12 object-contain mx-auto mb-3"
              unoptimized
            />
          )}
          <p className="text-sm text-muted-foreground mb-1">
            {brand?.name || "Brand"} Study
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {study?.studyTitle || study?.name || "Product Study"}
          </h1>
          <p className="text-muted-foreground">
            {study?.hookQuestion || "Join our verified study and share your experience"}
          </p>
        </div>

        {/* Study Details Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <Calendar className="h-5 w-5 text-[#00D1C1] mx-auto mb-1" />
                <p className="text-lg font-semibold">28</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
              <div>
                <Users className="h-5 w-5 text-[#00D1C1] mx-auto mb-1" />
                <p className="text-lg font-semibold">
                  {study?.enrollmentConfig?.enrollmentCap || study?.targetParticipants || 50}
                </p>
                <p className="text-xs text-muted-foreground">Spots</p>
              </div>
              <div>
                <Gift className="h-5 w-5 text-[#00D1C1] mx-auto mb-1" />
                <p className="text-lg font-semibold">${study?.rebateAmount || 50}</p>
                <p className="text-xs text-muted-foreground">Reward</p>
              </div>
            </div>

            {/* What You'll Do */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">What You&apos;ll Do</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  Complete brief daily check-ins (2-3 min)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  Use the product as directed for 28 days
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  Optionally connect your wearable device
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  Share your honest feedback at the end
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Form */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Join This Study</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="flex items-center gap-1">
                  Order Confirmation
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="order"
                  type="text"
                  placeholder="e.g., #12345"
                  value={formData.orderConfirmation}
                  onChange={(e) => setFormData({ ...formData, orderConfirmation: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  If you have an order number from your purchase
                </p>
              </div>

              {formError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#00D1C1] hover:bg-[#00B8A9]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Study
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By joining, you agree to share your anonymized study data with {brand?.name || "the brand"} and Reputable.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-[#00D1C1]" />
            <span>Verified by Reputable</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your data is encrypted and your privacy is protected.
          </p>
        </div>
      </main>
    </div>
  );
}
