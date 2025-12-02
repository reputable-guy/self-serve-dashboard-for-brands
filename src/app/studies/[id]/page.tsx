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
  QrCode,
  Share2,
  Star,
  BadgeCheck,
  Sparkles,
  ImageIcon,
  Link2,
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

// Mock testimonial data for harvest tab - enhanced with full story card fields
const mockTestimonials = [
  {
    id: 1,
    participant: "Sarah M.",
    initials: "SM",
    age: 34,
    location: "Austin, TX",
    completedDay: 28,
    overallRating: 4.8,
    story: "I've tried many sleep supplements, but this one actually worked. My Oura ring showed a 23% improvement in deep sleep within the first two weeks. I wake up feeling genuinely refreshed for the first time in years.",
    metrics: [
      { label: "Deep Sleep", value: "+23%", positive: true },
      { label: "Sleep Score", value: "+15%", positive: true },
      { label: "Restfulness", value: "+18%", positive: true },
    ],
    benefits: ["Fall asleep faster", "Wake up refreshed", "More consistent sleep schedule"],
    verified: true,
    verificationId: "2025-087",
    device: "Oura Ring",
  },
  {
    id: 2,
    participant: "Emily R.",
    initials: "ER",
    age: 29,
    location: "Denver, CO",
    completedDay: 28,
    overallRating: 4.5,
    story: "Skeptical at first, but the data doesn't lie. My HRV improved significantly and I'm waking up feeling actually rested. This is the first supplement that actually delivered measurable results.",
    metrics: [
      { label: "HRV", value: "+19%", positive: true },
      { label: "Sleep Score", value: "+12%", positive: true },
      { label: "Recovery", value: "+14%", positive: true },
    ],
    benefits: ["Better recovery", "Improved HRV", "Less morning grogginess"],
    verified: true,
    verificationId: "2025-092",
    device: "Whoop",
  },
  {
    id: 3,
    participant: "Mike T.",
    initials: "MT",
    age: 42,
    location: "Seattle, WA",
    completedDay: 28,
    overallRating: 4.9,
    story: "As someone who's tracked my sleep for 3 years, I can confidently say this product made a real difference. The improvement in my deep sleep was consistent week over week.",
    metrics: [
      { label: "Deep Sleep", value: "+28%", positive: true },
      { label: "Light Sleep", value: "+10%", positive: true },
      { label: "Sleep Efficiency", value: "+8%", positive: true },
    ],
    benefits: ["Deeper sleep cycles", "More energy throughout the day", "Better mental clarity"],
    verified: true,
    verificationId: "2025-098",
    device: "Apple Watch",
  },
  {
    id: 4,
    participant: "Lisa K.",
    initials: "LK",
    age: 38,
    location: "Portland, OR",
    completedDay: 28,
    overallRating: 4.6,
    story: "I was dealing with stress-related sleep issues and this really helped. My Garmin showed steady improvements in both sleep quality and recovery scores.",
    metrics: [
      { label: "Stress Score", value: "-15%", positive: true },
      { label: "Sleep Quality", value: "+17%", positive: true },
      { label: "Body Battery", value: "+22%", positive: true },
    ],
    benefits: ["Reduced nighttime anxiety", "More restorative sleep", "Better stress management"],
    verified: true,
    verificationId: "2025-103",
    device: "Garmin",
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
                        <p className="text-2xl font-bold">{mockTestimonials.length}</p>
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
                  {mockTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden hover:border-[#00D1C1]/50 transition-colors">
                      {/* Card Header with Verified Badge */}
                      <div className="bg-gradient-to-r from-[#00D1C1]/10 to-transparent p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                              <span className="font-semibold text-[#00D1C1]">{testimonial.initials}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{testimonial.participant}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{testimonial.age} · {testimonial.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Watch className="h-3 w-3" />
                                <span>{testimonial.device}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Math.floor(testimonial.overallRating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{testimonial.overallRating}</span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {testimonial.metrics.map((metric) => (
                            <div key={metric.label} className="p-2 rounded-lg bg-[#00D1C1]/10 text-center">
                              <p className="text-lg font-bold text-[#00D1C1]">{metric.value}</p>
                              <p className="text-xs text-muted-foreground">{metric.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-1">
                          {testimonial.benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2 text-sm">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Quote */}
                        <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-[#00D1C1]">
                          <p className="text-sm italic">&quot;{testimonial.story}&quot;</p>
                        </div>

                        {/* Verification Footer */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Study ID:</span> {study.id.slice(0, 8)}
                            <span className="mx-2">·</span>
                            <span className="font-medium">Verification:</span> #{testimonial.verificationId}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Link2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                        {mockTestimonials.slice(0, 3).map((t, idx) => (
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

              {/* Embed Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Embed on Your Website</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Add verified story cards to your website with embedded widgets. Each card links to a third-party verified page.
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                      <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                        <MessageSquareQuote className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Carousel</p>
                      <p className="text-xs text-muted-foreground">Rotating cards</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                      <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Data Card</p>
                      <p className="text-xs text-muted-foreground">Single highlight</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                      <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Wall</p>
                      <p className="text-xs text-muted-foreground">Grid display</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-[#00D1C1] transition-colors">
                      <div className="h-16 bg-muted rounded mb-2 flex items-center justify-center">
                        <BadgeCheck className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Trust Badge</p>
                      <p className="text-xs text-muted-foreground">Verification seal</p>
                    </div>
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
