"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Link as LinkIcon,
  Users,
  MousePointerClick,
  UserPlus,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  ExternalLink,
  TrendingUp,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { useStudiesStore } from "@/lib/studies-store";
import type { Enrollment } from "@/lib/enrollment-store";

interface EnrollmentTabProps {
  studyId: string;
  studyName: string;
  studyCategory?: string;
  enrollmentSlug: string;
  enrollmentCap: number;
  enrollmentStatus: "draft" | "open" | "paused" | "closed";
  enrolledCount: number;
  rebateAmount?: number;
  isDemo?: boolean;
}

// Stage badge styling
function getStageBadge(stage: Enrollment["stage"]) {
  switch (stage) {
    case "clicked":
      return <Badge variant="outline" className="text-gray-600">Clicked</Badge>;
    case "signed_up":
      return <Badge className="bg-blue-100 text-blue-700">Signed Up</Badge>;
    case "waiting":
      return <Badge className="bg-amber-100 text-amber-700">Waiting</Badge>;
    case "started":
    case "active":
      return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    case "completed":
      return <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>;
    case "dropped":
      return <Badge className="bg-red-100 text-red-700">Dropped</Badge>;
    default:
      return <Badge variant="outline">{stage}</Badge>;
  }
}

export function EnrollmentTab({
  studyId,
  studyName,
  studyCategory,
  enrollmentSlug,
  enrollmentCap,
  enrollmentStatus,
  enrolledCount,
  rebateAmount = 50,
  isDemo = false,
}: EnrollmentTabProps) {
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = useState(true); // Auto-expand by default

  // Get enrollments from store
  const { getEnrollmentsByStudy, getEnrollmentStats } = useEnrollmentStore();
  const { updateStudy } = useStudiesStore();

  const enrollments = getEnrollmentsByStudy(studyId);
  const stats = getEnrollmentStats(studyId);

  // Derive actual enrolled count from store (signed_up + waiting + active + completed)
  const actualEnrolledCount = stats.signedUp + stats.waiting + stats.active + stats.completed;

  // Build enrollment URL
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const enrollmentUrl = `${baseUrl}/join/${enrollmentSlug}`;

  // Email template content
  const emailSubject = `Share your experience with ${studyName} - Earn $${rebateAmount}`;
  const emailBody = `Hi [Customer Name],

Thank you for your recent purchase of ${studyName}!

We're inviting you to participate in an exclusive study to share your experience. As a thank you for your participation, you'll earn a $${rebateAmount} testing reward.

Here's how it works:
• Sign up using the link below
• Use ${studyName} as you normally would for 28 days
• Complete brief daily check-ins (~1 minute each)
• Receive your $${rebateAmount} reward upon completion

Join the study: ${enrollmentUrl}

Your feedback helps us improve our products and helps other customers make informed decisions.

Questions? Reply to this email and we'll be happy to help.

Best,
[Your Name]`;

  // Copy email handler
  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(emailBody);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Copy link handler
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(enrollmentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status change handlers
  const handlePauseEnrollment = () => {
    updateStudy(studyId, {
      enrollmentConfig: {
        enrollmentCap,
        enrollmentSlug,
        enrollmentStatus: "paused",
        enrolledCount,
      },
    });
  };

  const handleResumeEnrollment = () => {
    updateStudy(studyId, {
      enrollmentConfig: {
        enrollmentCap,
        enrollmentSlug,
        enrollmentStatus: "open",
        enrolledCount,
      },
    });
  };

  const handleCloseEnrollment = () => {
    updateStudy(studyId, {
      enrollmentConfig: {
        enrollmentCap,
        enrollmentSlug,
        enrollmentStatus: "closed",
        enrolledCount,
      },
    });
  };

  // Signed-up enrollments (exclude just clicked)
  const signedUpEnrollments = enrollments.filter(e => e.stage !== "clicked");

  return (
    <div className="space-y-6">
      {/* Enrollment Link Card */}
      <Card className="border-[#00D1C1]/30 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-[#00D1C1]" />
            Enrollment Link
          </CardTitle>
          <CardDescription>
            Share this link with your customers to let them join the study
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 bg-white rounded-lg border font-mono text-sm truncate">
              {enrollmentUrl}
            </div>
            <Button
              onClick={handleCopyLink}
              variant={copied ? "default" : "outline"}
              className={copied ? "bg-green-600 hover:bg-green-600" : ""}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <a href={enrollmentUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Email Template Card */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => setShowEmailTemplate(!showEmailTemplate)}
            className="flex items-center justify-between w-full text-left"
          >
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Customer Email Template
              </CardTitle>
              <CardDescription className="mt-1">
                Copy and customize this email to invite your customers
              </CardDescription>
            </div>
            {showEmailTemplate ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {showEmailTemplate && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Subject Line</p>
                <div className="p-2 bg-muted rounded text-sm font-medium">
                  {emailSubject}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Email Body</p>
                <pre className="p-3 bg-muted rounded text-sm whitespace-pre-wrap font-sans">
                  {emailBody}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyEmail}
                  variant={emailCopied ? "default" : "outline"}
                  className={emailCopied ? "bg-green-600 hover:bg-green-600" : ""}
                  size="sm"
                >
                  {emailCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Email Body
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground flex items-center">
                  Customize the [bracketed] sections before sending
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Enrollment Status + Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Enrollment Status</CardTitle>
            <Badge className={
              enrollmentStatus === "open" ? "bg-green-100 text-green-700" :
              enrollmentStatus === "paused" ? "bg-amber-100 text-amber-700" :
              enrollmentStatus === "closed" ? "bg-gray-100 text-gray-700" :
              "bg-gray-100 text-gray-700"
            }>
              {enrollmentStatus === "open" ? "Open" :
               enrollmentStatus === "paused" ? "Paused" :
               enrollmentStatus === "closed" ? "Closed" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-3xl font-bold">{actualEnrolledCount}</p>
              <p className="text-sm text-muted-foreground">
                of {enrollmentCap} enrolled
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D1C1] transition-all"
                style={{ width: `${Math.min((actualEnrolledCount / enrollmentCap) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex gap-2">
            {enrollmentStatus === "open" && (
              <>
                <Button variant="outline" size="sm" onClick={handlePauseEnrollment}>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button variant="outline" size="sm" onClick={handleCloseEnrollment}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </>
            )}
            {enrollmentStatus === "paused" && (
              <>
                <Button variant="outline" size="sm" onClick={handleResumeEnrollment}>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
                <Button variant="outline" size="sm" onClick={handleCloseEnrollment}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </>
            )}
            {enrollmentStatus === "closed" && (
              <Button variant="outline" size="sm" onClick={handleResumeEnrollment}>
                <Play className="h-4 w-4 mr-1" />
                Reopen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Funnel Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.clicked + stats.signedUp + stats.waiting + stats.active + stats.completed}</p>
            <p className="text-sm text-muted-foreground">Total clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Signed Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.signedUp + stats.waiting + stats.active + stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed signup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-muted-foreground">In study</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Finished study</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Enrollments
          </CardTitle>
          <CardDescription>
            {signedUpEnrollments.length} participant{signedUpEnrollments.length !== 1 ? "s" : ""} enrolled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signedUpEnrollments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No enrollments yet</p>
              <p className="text-sm mt-1">
                Share your enrollment link to get started
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {signedUpEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#00D1C1]/10 flex items-center justify-center text-sm font-semibold text-[#00D1C1]">
                      {enrollment.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{enrollment.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {enrollment.orderConfirmation && (
                      <span className="text-xs text-muted-foreground">
                        Order: {enrollment.orderConfirmation}
                      </span>
                    )}
                    {getStageBadge(enrollment.stage)}
                    <span className="text-xs text-muted-foreground">
                      {enrollment.signedUpAt ? new Date(enrollment.signedUpAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
