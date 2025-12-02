"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudies } from "@/lib/studies-store";
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
} from "lucide-react";

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: "completion",
    message: "Sarah M. completed Better Sleep Study",
    detail: "testimonial ready",
    timestamp: "2 hours ago",
    icon: CheckCircle2,
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "enrollment",
    message: "12 new enrollments in Energy Boost Study",
    detail: null,
    timestamp: "5 hours ago",
    icon: UserPlus,
    iconColor: "text-[#00D1C1]",
  },
  {
    id: 3,
    type: "milestone",
    message: "Recovery Pro Study is 80% full",
    detail: "only 10 spots left",
    timestamp: "1 day ago",
    icon: TrendingUp,
    iconColor: "text-yellow-500",
  },
  {
    id: 4,
    type: "completion",
    message: "Mike T. completed Better Sleep Study",
    detail: "testimonial ready",
    timestamp: "1 day ago",
    icon: CheckCircle2,
    iconColor: "text-green-500",
  },
  {
    id: 5,
    type: "enrollment",
    message: "5 new enrollments in Better Sleep Study",
    detail: null,
    timestamp: "2 days ago",
    icon: UserPlus,
    iconColor: "text-[#00D1C1]",
  },
];

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
                  {mockActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div
                        className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}
                      >
                        <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
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
                  ))}
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
