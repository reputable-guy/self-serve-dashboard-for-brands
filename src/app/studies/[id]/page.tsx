"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudies, Study } from "@/lib/studies-store";
import { StudyPreview } from "@/components/study-preview";
import { StudyDetailsPreview } from "@/components/study-details-preview";
import {
  ArrowLeft,
  Clock,
  Watch,
  Users,
  Check,
  Edit,
  Play,
  ExternalLink,
  Copy,
  Smartphone,
  Code,
  BarChart3,
  MessageSquareQuote,
  Settings,
  Activity,
  Gift,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  QrCode,
  Share2,
  Star,
  BadgeCheck,
  Sparkles,
  ImageIcon,
  DollarSign,
  Calculator,
  Target,
} from "lucide-react";
import { STUDY_STATUSES, DEVICE_LABELS } from "@/lib/constants";
import {
  MOCK_PARTICIPANTS,
  MOCK_TESTIMONIALS,
  MOCK_DEMOGRAPHICS,
  MOCK_BASELINE_DATA,
} from "@/lib/mock-data";
import {
  CarouselWidgetPreview,
  DataCardWidgetPreview,
  WallWidgetPreview,
  TrustBadgeWidgetPreview,
  EmbedCodeDisplay,
} from "@/components/embed-widgets";
import { StudyLinkActions } from "@/components/study-link-actions";
import { VideoTestimonialCard } from "@/components/video-testimonial-card";

// Determine the default tab based on study status
function getDefaultTab(status: Study["status"]): string {
  switch (status) {
    case "draft":
      return "setup";
    case "recruiting":
    case "filling-fast":
    case "full":
      return "monitor";
    case "completed":
      return "harvest";
    default:
      return "setup";
  }
}

// Simple donut chart component
function DonutChart({ data, size = 80 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const paths = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const radius = size / 2 - 4;
    const innerRadius = radius * 0.6;
    const cx = size / 2;
    const cy = size / 2;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

    return <path key={item.label} d={d} fill={item.color} />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
    </svg>
  );
}

// Horizontal bar component
function HorizontalBar({ label, value, maxValue, color = "#00D1C1" }: { label: string; value: number; maxValue: number; color?: string }) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

type WidgetType = "carousel" | "data-card" | "wall" | "trust-badge";

export default function StudyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudy, updateStudy } = useStudies();
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>("carousel");

  const study = getStudy(params.id as string);

  if (!study) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <h2 className="text-xl font-semibold mb-2">Study not found</h2>
          <p className="text-muted-foreground mb-4">
            This study may have been deleted or doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/studies">Back to Studies</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = STUDY_STATUSES[study.status];
  const device = DEVICE_LABELS[study.requiredDevice] || "Any Device";
  const totalSpots = parseInt(study.totalSpots) || 50; // Default to 50 if not set
  const spotsRemaining = totalSpots - study.enrolledCount;
  const rebateNum = parseFloat(study.rebateAmount || "0");
  const heartbeats = rebateNum > 0 ? Math.round(rebateNum * 100) : 0;

  // Calculate total value
  const totalValue = study.whatYouGet.reduce((sum, item) => {
    const match = item.value.match(/\$?(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const handleLaunchStudy = () => {
    updateStudy(study.id, { status: "recruiting" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/studies")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{study.studyTitle}</h1>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{study.hookQuestion}</p>
            </div>
            <div className="flex items-center gap-2">
              {study.status === "draft" && (
                <Button onClick={handleLaunchStudy} className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Launch Study
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/studies/${study.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{study.enrolledCount}</strong>/{totalSpots} enrolled
              </span>
              <span className="text-muted-foreground">({spotsRemaining} spots left)</span>
            </div>
            <div className="flex items-center gap-2">
              <Watch className="h-4 w-4 text-muted-foreground" />
              <span>{device}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{study.durationDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00D1C1] font-semibold">${study.rebateAmount}</span>
              <span className="text-muted-foreground">rebate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue={getDefaultTab(study.status)} className="w-full">
          {/* Phase-based Tabs */}
          <TabsList className="mb-6">
            <TabsTrigger value="setup" className="flex items-center gap-2 px-6">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2 px-6">
              <Activity className="h-4 w-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="harvest" className="flex items-center gap-2 px-6">
              <Gift className="h-4 w-4" />
              Harvest
            </TabsTrigger>
          </TabsList>

          {/* SETUP TAB */}
          <TabsContent value="setup">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Study Content */}
              <div className="col-span-2 space-y-6">
                {/* Product Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {study.productImage ? (
                          <img
                            src={study.productImage}
                            alt={study.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{study.productName}</h3>
                        <p className="text-muted-foreground mt-1">{study.productDescription}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-lg font-semibold">${study.productPrice}</span>
                          {study.productUrl && (
                            <a
                              href={study.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00D1C1] hover:underline flex items-center gap-1 text-sm"
                            >
                              View Product <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What You'll Discover */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>✨</span> What Participants Will Discover
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {study.discoverItems.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-[#00D1C1]" />
                        </div>
                        <div>
                          <p className="font-medium">{item.question}</p>
                          <p className="text-sm text-muted-foreground">{item.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Daily Routine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>📋</span> Daily Routine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {study.dailyRoutine.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-[#00D1C1]">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{step.action}</p>
                          <p className="text-sm text-muted-foreground">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* What You'll Get */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>🎁</span> What Participants Get
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {study.whatYouGet.map((item, index) => (
                        <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.item}</p>
                            <p className="text-sm text-muted-foreground">{item.note}</p>
                          </div>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="font-semibold">Total Value</span>
                      <span className="text-2xl font-bold text-[#00D1C1]">${totalValue}+</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metrics Tracked */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metrics Being Tracked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {study.metricsToTrack.map((metric) => (
                        <span
                          key={metric}
                          className="px-3 py-1 bg-muted rounded-full text-sm"
                        >
                          {metric.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Check-in Questions */}
                {(study.villainVariable || (study.customQuestions && study.customQuestions.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>📋</span> Weekly Check-in Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {study.villainVariable && (
                        <div className="p-4 bg-[#111827] rounded-lg">
                          <p className="text-sm text-white mb-2">
                            &quot;This week, did you notice any changes regarding your{" "}
                            <span className="text-[#00D1C1] font-medium">{study.villainVariable}</span>?&quot;
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(study.villainQuestionDays || [7, 14, 21, 28]).map((day) => (
                              <span key={day} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                                Day {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {study.customQuestions && study.customQuestions.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">Custom Questions</p>
                          {study.customQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 border rounded-lg">
                              <p className="text-sm font-medium mb-1">{q.questionText || `Question ${idx + 1}`}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="px-2 py-0.5 bg-muted rounded">
                                  {q.questionType === "multiple_choice" ? "Multiple Choice" :
                                   q.questionType === "voice_and_text" ? "Voice + Text" : "Text"}
                                </span>
                                <span>Days: {q.showOnDays.join(", ")}</span>
                              </div>
                              {q.questionType === "multiple_choice" && q.options.filter(o => o).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {q.options.filter(o => o).map((opt, oIdx) => (
                                    <span key={oIdx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Reward Summary */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-[#00D1C1]/10 to-[#00D1C1]/5 border-[#00D1C1]/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Reward Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Rebate Amount</p>
                      <p className="text-3xl font-bold text-[#00D1C1]">${study.rebateAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heartbeats Reward</p>
                      <p className="text-xl font-semibold">💗 {heartbeats.toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Study Duration</p>
                      <p className="text-lg font-semibold">{study.durationDays} Days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Required Device</p>
                      <p className="text-lg font-semibold">{device}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">
                          {study.enrolledCount}/{totalSpots}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00D1C1] rounded-full transition-all"
                          style={{
                            width: `${totalSpots > 0 ? (study.enrolledCount / totalSpots) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {spotsRemaining} spots remaining
                    </p>
                  </CardContent>
                </Card>

                {study.status !== "draft" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Share Study</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Share this link with potential participants
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded text-sm truncate">
                          reputable.health/s/{study.id}
                        </code>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Participant Preview Section */}
            <div className="mt-8 pt-8 border-t">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Participant Preview
                </h2>
                <p className="text-muted-foreground">
                  This is exactly how participants will see your study in the Reputable app.
                </p>
              </div>

              <div className="flex justify-center gap-12">
                {/* Card View */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Study Card (Catalog View)
                  </h3>
                  <StudyPreview
                    productName={study.productName}
                    productImage={study.productImage}
                    category={study.category}
                    rebateAmount={study.rebateAmount}
                    durationDays={study.durationDays}
                    totalSpots={study.totalSpots}
                    requiredDevice={study.requiredDevice}
                    studyTitle={study.studyTitle}
                    hookQuestion={study.hookQuestion}
                  />
                </div>

                {/* Details View */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Study Details (Full Page)
                  </h3>
                  <StudyDetailsPreview
                    productName={study.productName}
                    productImage={study.productImage}
                    studyTitle={study.studyTitle}
                    hookQuestion={study.hookQuestion}
                    rebateAmount={study.rebateAmount}
                    durationDays={study.durationDays}
                    totalSpots={study.totalSpots}
                    requiredDevice={study.requiredDevice}
                    discoverItems={study.discoverItems}
                    dailyRoutine={study.dailyRoutine}
                    whatYouGet={study.whatYouGet}
                  />
                </div>
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => router.push(`/studies/${study.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Study Content
                </Button>
              </div>
            </div>

            {/* Embed Code Section */}
            <div className="mt-8 pt-8 border-t">
              <div className="max-w-3xl">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Embed Code
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add the widget to your checkout page to offer the rebate study to customers.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>Checkout Widget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`<script src="https://reputable.health/widget.js"></script>
<div
  id="reputable-widget"
  data-study-id="${study.id}"
></div>`}
                      </pre>
                    </div>
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Widget Customization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Theme</h4>
                        <p className="text-sm text-muted-foreground">Light / Dark / Auto</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Position</h4>
                        <p className="text-sm text-muted-foreground">Inline / Modal / Floating</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full customization options coming soon.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* MONITOR TAB */}
          <TabsContent value="monitor">
            <div className="space-y-6">
              {/* Sample Data Banner */}
              {study.enrolledCount === 0 && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                  <p className="text-sm text-blue-400">
                    Showing sample data for preview purposes. Real data will appear once participants enroll.
                  </p>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Enrolled</p>
                        <p className="text-2xl font-bold">{study.enrolledCount > 0 ? `${study.enrolledCount}/${totalSpots}` : `38/${totalSpots}`}</p>
                      </div>
                      <Users className="h-8 w-8 text-[#00D1C1]" />
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D1C1] rounded-full"
                        style={{ width: `${study.enrolledCount > 0 ? (study.enrolledCount / totalSpots) * 100 : 76}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Now</p>
                        <p className="text-2xl font-bold">{study.enrolledCount > 0 ? Math.max(1, study.enrolledCount - 1) : 32}</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Compliance</p>
                        <p className="text-2xl font-bold">82%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">At Risk</p>
                        <p className="text-2xl font-bold">1</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Participant List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Participants</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {study.enrolledCount > 0 ? spotsRemaining : 12} spots remaining
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_PARTICIPANTS.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">{participant.name.split(" ")[0][0]}{participant.name.split(" ")[1][0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{participant.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              participant.status === "active" ? "bg-green-500/20 text-green-500" :
                              participant.status === "completed" ? "bg-blue-500/20 text-blue-500" :
                              "bg-yellow-500/20 text-yellow-500"
                            }`}>
                              {participant.status === "at-risk" ? "At Risk" : participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Day {participant.day} · {participant.lastActive}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{participant.compliance}%</p>
                          <p className="text-xs text-muted-foreground">compliance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Participant Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Participant Insights</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Based on {study.enrolledCount > 0 ? study.enrolledCount : 38} participants
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                      {/* Key Insights Banner */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-[#00D1C1]/10 border border-[#00D1C1]/20">
                          <p className="text-xs text-muted-foreground">Top Motivation</p>
                          <p className="text-sm font-semibold text-[#00D1C1]">Better sleep (45%)</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <p className="text-xs text-muted-foreground">Exercise 3+ days/week</p>
                          <p className="text-sm font-semibold text-blue-500">78%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <p className="text-xs text-muted-foreground">Already takes supplements</p>
                          <p className="text-sm font-semibold text-purple-500">68%</p>
                        </div>
                      </div>

                      {/* Demographics */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">Demographics</h4>
                        <div className="grid grid-cols-2 gap-6">
                          {/* Age */}
                          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                            <DonutChart data={MOCK_DEMOGRAPHICS.age} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Age</p>
                              <div className="space-y-1">
                                {MOCK_DEMOGRAPHICS.age.map((item) => (
                                  <div key={item.label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Gender */}
                          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                            <DonutChart data={MOCK_DEMOGRAPHICS.gender} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Gender</p>
                              <div className="space-y-1">
                                {MOCK_DEMOGRAPHICS.gender.map((item) => (
                                  <div key={item.label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Location */}
                          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                            <DonutChart data={MOCK_DEMOGRAPHICS.location} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Location</p>
                              <div className="space-y-1">
                                {MOCK_DEMOGRAPHICS.location.map((item) => (
                                  <div key={item.label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Income */}
                          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                            <DonutChart data={MOCK_DEMOGRAPHICS.income} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Income</p>
                              <div className="space-y-1">
                                {MOCK_DEMOGRAPHICS.income.map((item) => (
                                  <div key={item.label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle & Baseline */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Purchase Motivation</h4>
                            <div className="space-y-2">
                              {MOCK_BASELINE_DATA.purchaseMotivation.map((item) => (
                                <HorizontalBar
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  maxValue={100}
                                  color="#00D1C1"
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-3">Expected Results</h4>
                            <div className="space-y-2">
                              {MOCK_BASELINE_DATA.expectedResults.map((item) => (
                                <HorizontalBar
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  maxValue={100}
                                  color="#3B82F6"
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Exercise Frequency</h4>
                            <div className="space-y-2">
                              {MOCK_BASELINE_DATA.exerciseFrequency.map((item) => (
                                <HorizontalBar
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  maxValue={100}
                                  color="#84CC16"
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-3">Stress Level</h4>
                            <div className="space-y-2">
                              {MOCK_BASELINE_DATA.stressLevel.map((item) => (
                                <HorizontalBar
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  maxValue={100}
                                  color="#F97316"
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-3">Wearable Devices</h4>
                            <div className="space-y-2">
                              {MOCK_BASELINE_DATA.wearableDevices.map((item) => (
                                <HorizontalBar
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  maxValue={100}
                                  color="#8B5CF6"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Sarah M. completed day 12 check-in</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="h-8 w-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-[#00D1C1]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Mike T. synced wearable data</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Lisa K. hasn&apos;t synced in 3 days</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* HARVEST TAB */}
          <TabsContent value="harvest">
            <div className="space-y-6">
              {/* Sample Data Banner */}
              {study.enrolledCount === 0 && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                  <p className="text-sm text-blue-400">
                    Showing sample story cards for preview purposes. Real verified stories will appear once participants complete the study.
                  </p>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Story Cards Ready</p>
                        <p className="text-2xl font-bold">{MOCK_TESTIMONIALS.length}</p>
                      </div>
                      <BadgeCheck className="h-8 w-8 text-[#00D1C1]" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Rating</p>
                        <p className="text-2xl font-bold flex items-center gap-1">
                          4.7 <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </p>
                      </div>
                      <Sparkles className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <p className="text-2xl font-bold">87%</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                        <p className="text-2xl font-bold text-[#00D1C1]">+18%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ROI Insights */}
              <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-emerald-500" />
                    ROI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Calculate ROI metrics
                    const completedTestimonials = MOCK_TESTIMONIALS.filter(t => t.verified).length;
                    const mockEnrolled = study.enrolledCount > 0 ? study.enrolledCount : 38;
                    const mockCompleted = study.completedCount > 0 ? study.completedCount : completedTestimonials;
                    const totalRebatesPaid = mockCompleted * rebateNum;
                    const costPerTestimonial = mockCompleted > 0 ? totalRebatesPaid / completedTestimonials : 0;
                    const completionRate = mockEnrolled > 0 ? (mockCompleted / mockEnrolled) * 100 : 0;

                    return (
                      <div className="grid grid-cols-3 gap-6">
                        {/* Total Rebates Paid */}
                        <div className="p-4 rounded-xl bg-background border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Rebates Paid</p>
                              <p className="text-2xl font-bold text-emerald-600">${totalRebatesPaid.toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {mockCompleted} completions × ${rebateNum} rebate
                          </p>
                        </div>

                        {/* Cost per Verified Testimonial */}
                        <div className="p-4 rounded-xl bg-background border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <Calculator className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Cost per Testimonial</p>
                              <p className="text-2xl font-bold text-blue-600">${costPerTestimonial.toFixed(2)}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            ${totalRebatesPaid.toLocaleString()} ÷ {completedTestimonials} verified stories
                          </p>
                        </div>

                        {/* Completion Rate */}
                        <div className="p-4 rounded-xl bg-background border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <Target className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Completion Rate</p>
                              <p className="text-2xl font-bold text-purple-600">{completionRate.toFixed(0)}%</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full transition-all"
                                style={{ width: `${Math.min(completionRate, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {mockCompleted} of {mockEnrolled} enrolled finished
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      💡 <span className="font-medium">Benchmark:</span> Industry average cost per testimonial via traditional methods is $150-$500.
                      Study-verified testimonials typically see 3-5x higher conversion rates.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Export & Distribution Tools */}
              <Card className="bg-gradient-to-r from-[#00D1C1]/5 to-blue-500/5 border-[#00D1C1]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Export & Share</h3>
                      <p className="text-sm text-muted-foreground">Download story cards for social media or embed on your website</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Download Cards
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Codes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        Embed Widget
                      </Button>
                      <Button className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Story Cards */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Verified Story Cards</h3>
                    <p className="text-sm text-muted-foreground">Each card links to a third-party verified page on Reputable Health</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {MOCK_TESTIMONIALS.map((testimonial) => (
                    <VideoTestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      studyId={study.id}
                    />
                  ))}
                </div>
              </div>

              {/* Aggregate Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#00D1C1]" />
                    Aggregate Study Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Top Metrics */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Improvements</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <span className="text-sm">Deep Sleep</span>
                          <span className="font-semibold text-[#00D1C1]">+22%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <span className="text-sm">HRV</span>
                          <span className="font-semibold text-[#00D1C1]">+17%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <span className="text-sm">Sleep Score</span>
                          <span className="font-semibold text-[#00D1C1]">+14%</span>
                        </div>
                      </div>
                    </div>

                    {/* Common Benefits */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Most Reported Benefits</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#00D1C1]" />
                          <span className="text-sm">Wake up refreshed</span>
                          <span className="text-xs text-muted-foreground ml-auto">78%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm">Fall asleep faster</span>
                          <span className="text-xs text-muted-foreground ml-auto">65%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <span className="text-sm">Better recovery</span>
                          <span className="text-xs text-muted-foreground ml-auto">52%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">More energy</span>
                          <span className="text-xs text-muted-foreground ml-auto">48%</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Performers */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Performers</h4>
                      <div className="space-y-2">
                        {MOCK_TESTIMONIALS.slice(0, 3).map((t, idx) => (
                          <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#00D1C1]/20 text-[#00D1C1] text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{t.participant}</p>
                              <p className="text-xs text-muted-foreground">{t.metrics[0].value} {t.metrics[0].label}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-medium">{t.overallRating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Embed Widgets Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#00D1C1]" />
                    Embed on Your Website
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Add verified story cards to your website with embedded widgets. Each widget links to third-party verified results powered by Reputable Health.
                  </p>

                  {/* Widget Type Selector */}
                  <div className="grid grid-cols-4 gap-3">
                    <button
                      onClick={() => setSelectedWidget("carousel")}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedWidget === "carousel"
                          ? "border-[#00D1C1] bg-[#00D1C1]/5 ring-2 ring-[#00D1C1]/20"
                          : "hover:border-[#00D1C1]/50"
                      }`}
                    >
                      <div className={`h-12 rounded mb-2 flex items-center justify-center ${
                        selectedWidget === "carousel" ? "bg-[#00D1C1]/10" : "bg-muted"
                      }`}>
                        <MessageSquareQuote className={`h-5 w-5 ${
                          selectedWidget === "carousel" ? "text-[#00D1C1]" : "text-muted-foreground"
                        }`} />
                      </div>
                      <p className={`text-sm font-medium ${
                        selectedWidget === "carousel" ? "text-[#00D1C1]" : ""
                      }`}>Carousel</p>
                      <p className="text-xs text-muted-foreground">Rotating cards</p>
                    </button>

                    <button
                      onClick={() => setSelectedWidget("data-card")}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedWidget === "data-card"
                          ? "border-[#00D1C1] bg-[#00D1C1]/5 ring-2 ring-[#00D1C1]/20"
                          : "hover:border-[#00D1C1]/50"
                      }`}
                    >
                      <div className={`h-12 rounded mb-2 flex items-center justify-center ${
                        selectedWidget === "data-card" ? "bg-[#00D1C1]/10" : "bg-muted"
                      }`}>
                        <BarChart3 className={`h-5 w-5 ${
                          selectedWidget === "data-card" ? "text-[#00D1C1]" : "text-muted-foreground"
                        }`} />
                      </div>
                      <p className={`text-sm font-medium ${
                        selectedWidget === "data-card" ? "text-[#00D1C1]" : ""
                      }`}>Data Card</p>
                      <p className="text-xs text-muted-foreground">Hero highlight</p>
                    </button>

                    <button
                      onClick={() => setSelectedWidget("wall")}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedWidget === "wall"
                          ? "border-[#00D1C1] bg-[#00D1C1]/5 ring-2 ring-[#00D1C1]/20"
                          : "hover:border-[#00D1C1]/50"
                      }`}
                    >
                      <div className={`h-12 rounded mb-2 flex items-center justify-center ${
                        selectedWidget === "wall" ? "bg-[#00D1C1]/10" : "bg-muted"
                      }`}>
                        <Users className={`h-5 w-5 ${
                          selectedWidget === "wall" ? "text-[#00D1C1]" : "text-muted-foreground"
                        }`} />
                      </div>
                      <p className={`text-sm font-medium ${
                        selectedWidget === "wall" ? "text-[#00D1C1]" : ""
                      }`}>Wall</p>
                      <p className="text-xs text-muted-foreground">Grid display</p>
                    </button>

                    <button
                      onClick={() => setSelectedWidget("trust-badge")}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedWidget === "trust-badge"
                          ? "border-[#00D1C1] bg-[#00D1C1]/5 ring-2 ring-[#00D1C1]/20"
                          : "hover:border-[#00D1C1]/50"
                      }`}
                    >
                      <div className={`h-12 rounded mb-2 flex items-center justify-center ${
                        selectedWidget === "trust-badge" ? "bg-[#00D1C1]/10" : "bg-muted"
                      }`}>
                        <BadgeCheck className={`h-5 w-5 ${
                          selectedWidget === "trust-badge" ? "text-[#00D1C1]" : "text-muted-foreground"
                        }`} />
                      </div>
                      <p className={`text-sm font-medium ${
                        selectedWidget === "trust-badge" ? "text-[#00D1C1]" : ""
                      }`}>Trust Badge</p>
                      <p className="text-xs text-muted-foreground">Verification seal</p>
                    </button>
                  </div>

                  {/* Widget Preview Area */}
                  <div className="border rounded-xl p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="text-center mb-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Live Preview
                      </span>
                    </div>

                    <div className="flex justify-center">
                      {selectedWidget === "carousel" && (
                        <CarouselWidgetPreview
                          testimonials={MOCK_TESTIMONIALS}
                          studyId={study.id}
                        />
                      )}
                      {selectedWidget === "data-card" && (
                        <DataCardWidgetPreview
                          testimonial={MOCK_TESTIMONIALS[0]}
                          studyId={study.id}
                        />
                      )}
                      {selectedWidget === "wall" && (
                        <WallWidgetPreview
                          testimonials={MOCK_TESTIMONIALS}
                          studyId={study.id}
                        />
                      )}
                      {selectedWidget === "trust-badge" && (
                        <TrustBadgeWidgetPreview
                          testimonialCount={MOCK_TESTIMONIALS.length}
                          avgRating={
                            MOCK_TESTIMONIALS.reduce((sum, t) => sum + t.overallRating, 0) /
                            MOCK_TESTIMONIALS.length
                          }
                          topMetric={{
                            label: MOCK_TESTIMONIALS[0].metrics[0].label,
                            value: MOCK_TESTIMONIALS[0].metrics[0].value,
                          }}
                          studyId={study.id}
                        />
                      )}
                    </div>
                  </div>

                  {/* Embed Code */}
                  <EmbedCodeDisplay widgetType={selectedWidget} studyId={study.id} />

                  {/* Link to Full Study Profile */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">Full Study Verification Page</p>
                      <p className="text-xs text-muted-foreground">
                        Share a link to your complete verified study profile
                      </p>
                    </div>
                    <StudyLinkActions studyId={study.id} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
