"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MockParticipant,
  ParticipantDetail,
  getParticipantDetail,
} from "@/lib/mock-data";
import {
  X,
  Watch,
  MapPin,
  TrendingUp,
  TrendingDown,
  Moon,
  Heart,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface ParticipantDetailPanelProps {
  participant: MockParticipant;
  onClose: () => void;
}

// Simple sparkline chart component
function SparklineChart({
  data,
  color = "#00D1C1",
  height = 40,
  showBaseline,
  baselineValue,
}: {
  data: number[];
  color?: string;
  height?: number;
  showBaseline?: boolean;
  baselineValue?: number;
}) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 200;
  const padding = 4;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  // Calculate baseline Y position
  const baselineY = baselineValue
    ? height - padding - ((baselineValue - min) / range) * (height - padding * 2)
    : null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Baseline reference line */}
      {showBaseline && baselineY !== null && (
        <line
          x1={padding}
          y1={baselineY}
          x2={width - padding}
          y2={baselineY}
          stroke="#9CA3AF"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      )}
      {/* Data line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End point dot */}
      {data.length > 0 && (
        <circle
          cx={width - padding}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="4"
          fill={color}
        />
      )}
    </svg>
  );
}

// Metric card with sparkline
function MetricCard({
  label,
  currentValue,
  baselineValue,
  unit,
  data,
  color,
  icon: Icon,
  invertTrend = false,
}: {
  label: string;
  currentValue: number;
  baselineValue: number;
  unit: string;
  data: number[];
  color: string;
  icon: React.ElementType;
  invertTrend?: boolean;
}) {
  const change = ((currentValue - baselineValue) / baselineValue) * 100;
  const isPositive = invertTrend ? change < 0 : change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(change).toFixed(0)}%
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold">{currentValue}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
          <span className="text-xs text-muted-foreground">
            (baseline: {baselineValue}{unit})
          </span>
        </div>
        <SparklineChart
          data={data}
          color={color}
          showBaseline
          baselineValue={baselineValue}
        />
      </CardContent>
    </Card>
  );
}

// Check-in timeline component
function CheckInTimeline({
  checkIns,
}: {
  checkIns: ParticipantDetail["checkIns"];
}) {
  // Show last 10 check-ins
  const recentCheckIns = checkIns.slice(-10).reverse();

  return (
    <div className="space-y-3">
      {recentCheckIns.map((checkIn) => (
        <div
          key={checkIn.day}
          className={`p-3 rounded-lg border ${
            checkIn.completed
              ? "bg-green-500/5 border-green-500/20"
              : "bg-red-500/5 border-red-500/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {checkIn.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium text-sm">Day {checkIn.day}</span>
              <span className="text-xs text-muted-foreground">{checkIn.date}</span>
            </div>
            {checkIn.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                Completed
              </span>
            )}
            {!checkIn.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                Missed
              </span>
            )}
          </div>

          {checkIn.completed && (
            <div className="space-y-2 mt-3">
              {/* Villain Response */}
              {checkIn.villainResponse && (
                <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{checkIn.villainResponse.question}</p>
                      <p className="text-sm font-medium text-purple-600">{checkIn.villainResponse.answer}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Responses */}
              {checkIn.customResponses && checkIn.customResponses.length > 0 && (
                <div className="space-y-1.5">
                  {checkIn.customResponses.map((response, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">{response.question}</span>
                        <span className="font-medium ml-2">{response.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Sync history calendar
function SyncCalendar({
  syncHistory,
}: {
  syncHistory: ParticipantDetail["syncHistory"];
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {syncHistory.map((day, idx) => (
        <div
          key={idx}
          className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
            day.synced
              ? "bg-green-500/20 text-green-600"
              : "bg-red-500/20 text-red-600"
          }`}
          title={`${day.date}: ${day.synced ? "Synced" : "Not synced"}`}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  );
}

export function ParticipantDetailPanel({ participant, onClose }: ParticipantDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("metrics");
  const detail = getParticipantDetail(participant.id);

  // Calculate current averages from last 3 days of metrics
  const currentMetrics = useMemo(() => {
    if (!detail || detail.dailyMetrics.length === 0) {
      return null;
    }

    const last3Days = detail.dailyMetrics.slice(-3);
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      deepSleep: Math.round(avg(last3Days.map(d => d.deepSleep))),
      remSleep: Math.round(avg(last3Days.map(d => d.remSleep))),
      totalSleep: Math.round(avg(last3Days.map(d => d.totalSleep))),
      hrv: Math.round(avg(last3Days.map(d => d.hrv))),
      restingHr: Math.round(avg(last3Days.map(d => d.restingHr))),
      sleepScore: Math.round(avg(last3Days.map(d => d.sleepScore))),
      recoveryScore: Math.round(avg(last3Days.map(d => d.recoveryScore))),
    };
  }, [detail]);

  if (!detail) {
    return (
      <div className="fixed inset-y-0 right-0 w-[480px] bg-background border-l shadow-xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Participant Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-muted-foreground">No detailed data available for this participant.</p>
      </div>
    );
  }

  const statusColors = {
    active: "bg-green-500/20 text-green-600",
    completed: "bg-blue-500/20 text-blue-600",
    "at-risk": "bg-yellow-500/20 text-yellow-600",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-[520px] bg-background border-l shadow-xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-[#00D1C1]">{participant.initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{participant.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[participant.status]}`}>
                    {participant.status === "at-risk" ? "At Risk" : participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {participant.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Watch className="h-3.5 w-3.5" />
                    {participant.device}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{participant.day}</p>
              <p className="text-xs text-muted-foreground">Day</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{participant.compliance}%</p>
              <p className="text-xs text-muted-foreground">Compliance</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{detail.syncHistory.filter(s => s.synced).length}</p>
              <p className="text-xs text-muted-foreground">Syncs</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{detail.checkIns.filter(c => c.completed).length}</p>
              <p className="text-xs text-muted-foreground">Check-ins</p>
            </div>
          </div>

          {/* At-risk warning */}
          {participant.status === "at-risk" && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Participant at risk</p>
                <p className="text-xs text-muted-foreground">
                  Last synced {participant.lastActive}. Consider sending a reminder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="metrics"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D1C1] data-[state=active]:bg-transparent px-6 py-3"
              >
                Wearable Metrics
              </TabsTrigger>
              <TabsTrigger
                value="checkins"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D1C1] data-[state=active]:bg-transparent px-6 py-3"
              >
                Check-in Responses
              </TabsTrigger>
              <TabsTrigger
                value="sync"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D1C1] data-[state=active]:bg-transparent px-6 py-3"
              >
                Sync History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="p-6 space-y-4 mt-0">
              {currentMetrics && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      label="Deep Sleep"
                      currentValue={currentMetrics.deepSleep}
                      baselineValue={detail.baselineMetrics.avgDeepSleep}
                      unit="min"
                      data={detail.dailyMetrics.map(d => d.deepSleep)}
                      color="#8B5CF6"
                      icon={Moon}
                    />
                    <MetricCard
                      label="REM Sleep"
                      currentValue={currentMetrics.remSleep}
                      baselineValue={detail.baselineMetrics.avgRemSleep}
                      unit="min"
                      data={detail.dailyMetrics.map(d => d.remSleep)}
                      color="#06B6D4"
                      icon={Moon}
                    />
                    <MetricCard
                      label="HRV"
                      currentValue={currentMetrics.hrv}
                      baselineValue={detail.baselineMetrics.avgHrv}
                      unit="ms"
                      data={detail.dailyMetrics.map(d => d.hrv)}
                      color="#00D1C1"
                      icon={Heart}
                    />
                    <MetricCard
                      label="Resting HR"
                      currentValue={currentMetrics.restingHr}
                      baselineValue={detail.baselineMetrics.avgRestingHr}
                      unit="bpm"
                      data={detail.dailyMetrics.map(d => d.restingHr)}
                      color="#F97316"
                      icon={Activity}
                      invertTrend
                    />
                    <MetricCard
                      label="Sleep Score"
                      currentValue={currentMetrics.sleepScore}
                      baselineValue={detail.baselineMetrics.avgSleepScore}
                      unit="/100"
                      data={detail.dailyMetrics.map(d => d.sleepScore)}
                      color="#84CC16"
                      icon={Zap}
                    />
                    <MetricCard
                      label="Recovery"
                      currentValue={currentMetrics.recoveryScore}
                      baselineValue={65}
                      unit="/100"
                      data={detail.dailyMetrics.map(d => d.recoveryScore)}
                      color="#3B82F6"
                      icon={TrendingUp}
                    />
                  </div>

                  {/* Daily breakdown table */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Daily Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-background">
                            <tr className="text-left text-muted-foreground">
                              <th className="pb-2 font-medium">Day</th>
                              <th className="pb-2 font-medium">Deep</th>
                              <th className="pb-2 font-medium">REM</th>
                              <th className="pb-2 font-medium">HRV</th>
                              <th className="pb-2 font-medium">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.dailyMetrics.slice().reverse().map((day) => (
                              <tr key={day.day} className="border-t">
                                <td className="py-2">{day.day}</td>
                                <td className="py-2">{day.deepSleep}m</td>
                                <td className="py-2">{day.remSleep}m</td>
                                <td className="py-2">{day.hrv}ms</td>
                                <td className="py-2">{day.sleepScore}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="checkins" className="p-6 mt-0">
              <CheckInTimeline checkIns={detail.checkIns} />
            </TabsContent>

            <TabsContent value="sync" className="p-6 space-y-4 mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Device Sync Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <SyncCalendar syncHistory={detail.syncHistory} />
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500/20" />
                      Synced
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500/20" />
                      Missed
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Sync Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Days</span>
                    <span className="font-medium">{detail.syncHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Days Synced</span>
                    <span className="font-medium text-green-600">
                      {detail.syncHistory.filter(s => s.synced).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Days Missed</span>
                    <span className="font-medium text-red-600">
                      {detail.syncHistory.filter(s => !s.synced).length}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Sync Rate</span>
                    <span className="font-medium">
                      {Math.round((detail.syncHistory.filter(s => s.synced).length / detail.syncHistory.length) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
