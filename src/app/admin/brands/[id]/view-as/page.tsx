"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Eye,
  X,
  Building2,
  FlaskConical,
  TrendingUp,
  Users,
  ChevronRight,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBrandsStore } from "@/lib/brands-store";

// Mock studies for brand view - diverse categories to showcase different tiers
const mockBrandStudies = [
  {
    id: "study-1",
    name: "SleepWell Premium",
    category: "sleep", // Tier 1: Wearables Primary
    categoryLabel: "Sleep",
    status: "active",
    participants: 45,
    targetParticipants: 50,
    completionRate: 90,
    avgImprovement: 23,
    rebateOwed: 2250,
  },
  {
    id: "study-2",
    name: "Recovery Plus",
    category: "recovery", // Tier 1: Wearables Primary
    categoryLabel: "Recovery",
    status: "active",
    participants: 32,
    targetParticipants: 40,
    completionRate: 80,
    avgImprovement: 18,
    rebateOwed: 1600,
  },
  {
    id: "study-3",
    name: "Calm Focus Formula",
    category: "stress", // Tier 2: Co-Primary
    categoryLabel: "Stress Management",
    status: "active",
    participants: 28,
    targetParticipants: 35,
    completionRate: 80,
    avgImprovement: 33,
    rebateOwed: 1400,
  },
  {
    id: "study-4",
    name: "Energy Boost Complex",
    category: "energy", // Tier 3: Assessment Primary
    categoryLabel: "Energy & Vitality",
    status: "active",
    participants: 22,
    targetParticipants: 30,
    completionRate: 73,
    avgImprovement: 42,
    rebateOwed: 1100,
  },
  {
    id: "study-5",
    name: "Gut Health Pro",
    category: "gut", // Tier 4: Assessment Only
    categoryLabel: "Gut Health",
    status: "completed",
    participants: 50,
    targetParticipants: 50,
    completionRate: 100,
    avgImprovement: 52,
    rebateOwed: 0,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ViewAsBrandPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const brand = useBrandsStore((state) => state.getBrandById(id));

  if (!brand) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Brand not found</h3>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/brands")}
          >
            Back to Brands
          </Button>
        </div>
      </div>
    );
  }

  const totalRebateOwed = mockBrandStudies.reduce(
    (sum, s) => sum + s.rebateOwed,
    0
  );
  const activeStudies = mockBrandStudies.filter((s) => s.status === "active");
  const totalParticipants = mockBrandStudies.reduce(
    (sum, s) => sum + s.participants,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Preview Banner */}
      <div className="bg-orange-500 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">
            VIEWING AS: {brand.name}
          </span>
        </div>
        <Link href={`/admin/brands/${brand.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-orange-600"
          >
            <X className="h-4 w-4 mr-1" />
            Exit Preview
          </Button>
        </Link>
      </div>

      {/* Brand Dashboard Content */}
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {brand.contactName}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Studies
              </CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudies.length}</div>
              <p className="text-xs text-muted-foreground">
                of {mockBrandStudies.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Participants
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                Across all studies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Improvement
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+23%</div>
              <p className="text-xs text-muted-foreground">
                Primary metrics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rebates Owed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRebateOwed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link
                  href="/financials"
                  className="text-primary hover:underline"
                >
                  View details
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Studies List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBrandStudies.map((study) => (
                <div
                  key={study.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FlaskConical className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{study.name}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            study.status
                          )}`}
                        >
                          {study.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {study.categoryLabel} &middot; {study.participants}/
                        {study.targetParticipants} participants
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Avg. Improvement
                      </p>
                      <p className="font-semibold text-green-600">
                        +{study.avgImprovement}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/verify/sample-${study.category}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Stories
                        </Button>
                      </Link>
                      <Link href={`/admin/studies/${study.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request More Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Need more participants for your active studies? Submit a request
                and we&apos;ll help you expand your reach.
              </p>
              <Button>Request Participants</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about your studies or need support? Our team is
                here to help.
              </p>
              <Button variant="outline">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
