"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudies } from "@/lib/studies-store";
import { MOCK_ACTIVITIES } from "@/lib/mock-data";
import {
  FlaskConical,
  Users,
  MessageSquareQuote,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  UserPlus,
  DollarSign,
  Calculator,
  Target,
} from "lucide-react";

// Map activity types to icons and colors
const activityIconMap = {
  completion: { icon: CheckCircle2, color: "text-green-500" },
  enrollment: { icon: UserPlus, color: "text-[#00D1C1]" },
  milestone: { icon: TrendingUp, color: "text-yellow-500" },
};

export default function DashboardPage() {
  const { studies } = useStudies();

  // Calculate stats
  const activeStudies = studies.filter(
    (s) => s.status === "recruiting" || s.status === "filling-fast"
  ).length;
  const totalParticipants = studies.reduce((sum, s) => sum + s.enrolledCount, 0);
  // Mock testimonials count (would come from real data)
  const testimonialsReady = studies.length > 0 ? 3 : 0;

  const hasActivity = studies.length > 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your studies
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Studies</p>
                <p className="text-3xl font-bold mt-1">{activeStudies}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-[#00D1C1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-3xl font-bold mt-1">{totalParticipants}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Testimonials Ready</p>
                <p className="text-3xl font-bold mt-1">{testimonialsReady}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageSquareQuote className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Summary - Only show when there are studies */}
      {studies.length > 0 && (
        <Card className="mb-8 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-500" />
              Rebate Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              // Calculate aggregate ROI metrics across all studies
              const totalRebatesPaid = studies.reduce((sum, s) => {
                const rebateAmount = parseFloat(s.rebateAmount || "0");
                const completed = s.completedCount || 0;
                return sum + (rebateAmount * completed);
              }, 0);

              const totalCompleted = studies.reduce((sum, s) => sum + (s.completedCount || 0), 0);
              const totalEnrolled = studies.reduce((sum, s) => sum + s.enrolledCount, 0);

              // Use mock data for demonstration if no completions yet
              const displayRebatesPaid = totalRebatesPaid > 0 ? totalRebatesPaid :
                studies.reduce((sum, s) => sum + (parseFloat(s.rebateAmount || "0") * 4), 0);
              const displayCompleted = totalCompleted > 0 ? totalCompleted : studies.length * 4;
              const displayEnrolled = totalEnrolled > 0 ? totalEnrolled : studies.length * 38;

              const costPerTestimonial = displayCompleted > 0 ? displayRebatesPaid / displayCompleted : 0;
              const completionRate = displayEnrolled > 0 ? (displayCompleted / displayEnrolled) * 100 : 0;

              const showMockBanner = totalCompleted === 0;

              return (
                <>
                  {showMockBanner && (
                    <div className="mb-4 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <p className="text-xs text-blue-400">
                        Showing projected data based on your studies. Real metrics will appear once participants complete.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Total Rebates Paid */}
                    <div className="p-4 rounded-xl bg-background border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Rebates Paid</p>
                          <p className="text-2xl font-bold text-emerald-600">${displayRebatesPaid.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across {studies.length} {studies.length === 1 ? "study" : "studies"}
                      </p>
                    </div>

                    {/* Cost per Verified Testimonial */}
                    <div className="p-4 rounded-xl bg-background border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Calculator className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Cost per Testimonial</p>
                          <p className="text-2xl font-bold text-blue-600">${costPerTestimonial.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {displayCompleted} verified testimonials
                      </p>
                    </div>

                    {/* Completion Rate */}
                    <div className="p-4 rounded-xl bg-background border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                          <p className="text-2xl font-bold text-purple-600">{completionRate.toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${Math.min(completionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasActivity ? (
                <div className="space-y-4">
                  {MOCK_ACTIVITIES.map((activity) => {
                    const { icon: Icon, color } = activityIconMap[activity.type];
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div
                          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
                        >
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          {activity.detail && (
                            <p className="text-xs text-muted-foreground">{activity.detail}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {activity.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No activity yet. Create your first study to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                <Link href="/studies/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Study
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/studies">
                  View All Studies
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {studies.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Studies by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Draft</span>
                  <span className="font-medium">
                    {studies.filter((s) => s.status === "draft").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recruiting</span>
                  <span className="font-medium text-[#00D1C1]">
                    {studies.filter((s) => s.status === "recruiting").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Filling Fast</span>
                  <span className="font-medium text-yellow-500">
                    {studies.filter((s) => s.status === "filling-fast").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <span className="font-medium text-blue-500">
                    {studies.filter((s) => s.status === "completed").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
