"use client";

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
} from "lucide-react";

const statusStyles: Record<Study["status"], { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
  recruiting: { bg: "bg-[#00D1C1]/20", text: "text-[#00D1C1]", label: "Recruiting" },
  "filling-fast": { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "⚡ Filling Fast" },
  full: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Full" },
  completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed" },
};

const deviceLabels: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

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

// Mock participant data for monitor tab
const mockParticipants = [
  { id: 1, name: "Sarah M.", status: "active", day: 12, compliance: 95, lastActive: "2 hours ago" },
  { id: 2, name: "Mike T.", status: "active", day: 8, compliance: 88, lastActive: "5 hours ago" },
  { id: 3, name: "Emily R.", status: "completed", day: 28, compliance: 92, lastActive: "1 day ago" },
  { id: 4, name: "James L.", status: "active", day: 15, compliance: 78, lastActive: "3 hours ago" },
  { id: 5, name: "Lisa K.", status: "at-risk", day: 6, compliance: 45, lastActive: "3 days ago" },
];

// Mock testimonial data for harvest tab
const mockTestimonials = [
  {
    id: 1,
    participant: "Sarah M.",
    completedDay: 28,
    story: "I've tried many sleep supplements, but this one actually worked. My Oura ring showed a 23% improvement in deep sleep within the first two weeks.",
    metrics: { sleepScore: "+15%", deepSleep: "+23%", restfulness: "+18%" },
    verified: true,
    avatar: null,
  },
  {
    id: 2,
    participant: "Emily R.",
    completedDay: 28,
    story: "Skeptical at first, but the data doesn't lie. My HRV improved significantly and I'm waking up feeling actually rested.",
    metrics: { sleepScore: "+12%", hrv: "+8%", recovery: "+14%" },
    verified: true,
    avatar: null,
  },
];

// Mock demographic data for participant insights
const mockDemographics = {
  age: [
    { label: "18-25", value: 15, color: "#84CC16" },
    { label: "26-35", value: 42, color: "#F97316" },
    { label: "36-45", value: 28, color: "#8B5CF6" },
    { label: "46-55", value: 15, color: "#06B6D4" },
  ],
  gender: [
    { label: "Female", value: 58, color: "#F97316" },
    { label: "Male", value: 38, color: "#3B82F6" },
    { label: "Other", value: 4, color: "#84CC16" },
  ],
  location: [
    { label: "US", value: 72, color: "#84CC16" },
    { label: "Canada", value: 18, color: "#F97316" },
    { label: "Other", value: 10, color: "#3B82F6" },
  ],
  income: [
    { label: "$0-$50K", value: 22, color: "#8B5CF6" },
    { label: "$50K-$100K", value: 45, color: "#06B6D4" },
    { label: "$100K+", value: 33, color: "#84CC16" },
  ],
};

// Mock baseline intake data
const mockBaselineData = {
  diet: [
    { label: "No specific diet", value: 35 },
    { label: "Keto/Low-carb", value: 18 },
    { label: "Vegetarian/Vegan", value: 15 },
    { label: "Paleo", value: 12 },
    { label: "Mediterranean", value: 20 },
  ],
  exerciseFrequency: [
    { label: "0-1 days", value: 12 },
    { label: "2-3 days", value: 35 },
    { label: "4-5 days", value: 38 },
    { label: "6-7 days", value: 15 },
  ],
  stressLevel: [
    { label: "Low", value: 15 },
    { label: "Moderate", value: 45 },
    { label: "High", value: 32 },
    { label: "Very High", value: 8 },
  ],
  wearableDevices: [
    { label: "Oura Ring", value: 42 },
    { label: "Apple Watch", value: 35 },
    { label: "Whoop", value: 15 },
    { label: "Fitbit", value: 8 },
  ],
  takesSupplements: { yes: 68, no: 32 },
  purchaseMotivation: [
    { label: "Better sleep", value: 45 },
    { label: "More energy", value: 25 },
    { label: "Stress relief", value: 18 },
    { label: "General wellness", value: 12 },
  ],
  expectedResults: [
    { label: "Improved sleep quality", value: 52 },
    { label: "Fall asleep faster", value: 28 },
    { label: "Wake up refreshed", value: 15 },
    { label: "Reduced anxiety", value: 5 },
  ],
};

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

export default function StudyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudy, updateStudy } = useStudies();

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

  const status = statusStyles[study.status];
  const device = deviceLabels[study.requiredDevice] || "Any Device";
  const spotsRemaining = parseInt(study.totalSpots) - study.enrolledCount;
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
                <strong>{study.enrolledCount}</strong>/{study.totalSpots} enrolled
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
                          {study.enrolledCount}/{study.totalSpots}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00D1C1] rounded-full transition-all"
                          style={{
                            width: `${(study.enrolledCount / parseInt(study.totalSpots)) * 100}%`,
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
                        <p className="text-2xl font-bold">{study.enrolledCount > 0 ? `${study.enrolledCount}/${study.totalSpots}` : `38/${study.totalSpots}`}</p>
                      </div>
                      <Users className="h-8 w-8 text-[#00D1C1]" />
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D1C1] rounded-full"
                        style={{ width: `${study.enrolledCount > 0 ? (study.enrolledCount / parseInt(study.totalSpots)) * 100 : 76}%` }}
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
                    {mockParticipants.map((participant) => (
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
                            <DonutChart data={mockDemographics.age} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Age</p>
                              <div className="space-y-1">
                                {mockDemographics.age.map((item) => (
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
                            <DonutChart data={mockDemographics.gender} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Gender</p>
                              <div className="space-y-1">
                                {mockDemographics.gender.map((item) => (
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
                            <DonutChart data={mockDemographics.location} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Location</p>
                              <div className="space-y-1">
                                {mockDemographics.location.map((item) => (
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
                            <DonutChart data={mockDemographics.income} size={80} />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Income</p>
                              <div className="space-y-1">
                                {mockDemographics.income.map((item) => (
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
                              {mockBaselineData.purchaseMotivation.map((item) => (
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
                              {mockBaselineData.expectedResults.map((item) => (
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
                              {mockBaselineData.exerciseFrequency.map((item) => (
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
                              {mockBaselineData.stressLevel.map((item) => (
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
                              {mockBaselineData.wearableDevices.map((item) => (
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
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Testimonials Ready</p>
                        <p className="text-2xl font-bold">{mockTestimonials.length}</p>
                      </div>
                      <MessageSquareQuote className="h-8 w-8 text-[#00D1C1]" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <p className="text-2xl font-bold">{study.enrolledCount > 0 ? "87%" : "--"}</p>
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
                        <p className="text-2xl font-bold">{study.enrolledCount > 0 ? "+15%" : "--"}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Verified Testimonials</span>
                    {mockTestimonials.length > 0 && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export All
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {study.enrolledCount === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquareQuote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Verified testimonials will appear here as participants complete the study.
                        Each testimonial includes their story paired with real wearable data.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-4 rounded-lg border">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="font-medium">{testimonial.participant.split(" ")[0][0]}{testimonial.participant.split(" ")[1][0]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{testimonial.participant}</span>
                                {testimonial.verified && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-500">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                                <span className="text-sm text-muted-foreground">· Completed {testimonial.completedDay} days</span>
                              </div>
                              <p className="text-sm mb-3">&quot;{testimonial.story}&quot;</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(testimonial.metrics).map(([key, value]) => (
                                  <span key={key} className="px-2 py-1 bg-[#00D1C1]/10 text-[#00D1C1] rounded text-xs font-medium">
                                    {key.replace(/([A-Z])/g, " $1").trim()}: {value}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Code className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Embed Options */}
              {study.enrolledCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Embed Testimonials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Add verified testimonials to your website with embedded widgets.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                        <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                          <MessageSquareQuote className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Carousel</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                        <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Data Card</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                        <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Wall</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
