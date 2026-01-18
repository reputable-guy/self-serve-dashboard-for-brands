"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  CreditCard,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore, Study } from "@/lib/studies-store";
import {
  usePlatformSettingsStore,
  calculateEarningBreakdown,
} from "@/lib/platform-settings-store";

// Backloaded Earning Model - participants earn through heartbeats
// Progressive (25%): Earned throughout study regardless of completion
// Completion Bonus (75%): Only earned if study is completed

// Mock participant completion data - in production this would come from actual participant data
function getMockParticipantData(study: Study) {
  if (study.status === "completed") {
    // Completed studies have final numbers
    const total = study.participants;
    const completed = Math.floor(total * 0.80); // 80% completed fully (met all requirements)
    const dropped = total - completed; // Rest dropped out
    return { completed, dropped, total };
  } else if (study.status === "active") {
    // Active studies - show projected based on current participants
    const enrolled = study.participants;
    // Estimate based on historical completion rates
    const projectedCompleted = Math.floor(enrolled * 0.75);
    const projectedDropped = enrolled - projectedCompleted;
    return {
      completed: projectedCompleted,
      dropped: projectedDropped,
      total: enrolled,
      isProjected: true,
    };
  }
  return { completed: 0, dropped: 0, total: 0 };
}

interface ParticipantData {
  completed: number;
  dropped: number;
  total: number;
  isProjected?: boolean;
}

function calculateTotalCost(
  participantData: ParticipantData,
  rebateAmount: number,
  heartbeatsPerDollar: number,
  distributionFormula: { onboarding: number; dailyCheckIn: number; weeklyAssessment: number; endpointAssessment: number; completionBonus: number }
) {
  const breakdown = calculateEarningBreakdown(rebateAmount, heartbeatsPerDollar, distributionFormula);

  // Completed participants get full rebate
  const completedCost = participantData.completed * rebateAmount;

  // Dropped participants get only progressive earnings (avg 50% of progressive portion)
  // On average, dropouts complete about half the progressive activities
  const avgProgressiveEarned = breakdown.progressive.dollars * 0.5;
  const droppedCost = participantData.dropped * avgProgressiveEarned;

  const totalCost = completedCost + droppedCost;

  return {
    completedCost,
    droppedCost,
    totalCost,
    progressivePerCompleter: breakdown.progressive.dollars,
    completionBonusPerCompleter: breakdown.completion.dollars,
  };
}

type PaymentStatus = "paid" | "pending" | "upcoming";

function getPaymentStatus(study: Study): PaymentStatus {
  if (study.status === "completed") {
    // Randomly assign paid/pending for demo
    return study.id.includes("5") || study.id.includes("6") ? "paid" : "pending";
  }
  return "upcoming";
}

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case "upcoming":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <TrendingUp className="h-3 w-3" />
          Projected
        </span>
      );
  }
}

export default function BrandBillingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Use direct state access to avoid infinite re-renders
  const brands = useBrandsStore((state) => state.brands);
  const allStudies = useStudiesStore((state) => state.studies);
  const heartbeatsPerDollar = usePlatformSettingsStore((state) => state.heartbeatsPerDollar);
  const distributionFormula = usePlatformSettingsStore((state) => state.distributionFormula);

  const brand = useMemo(() => brands.find((b) => b.id === id), [brands, id]);
  const studies = useMemo(() => allStudies.filter((s) => s.brandId === id), [allStudies, id]);

  if (!brand) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Brand not found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The brand you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/brands")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals using backloaded earning model
  const studyBilling = studies.map((study) => {
    const participantData = getMockParticipantData(study);
    const costBreakdown = calculateTotalCost(
      participantData,
      study.rebateAmount,
      heartbeatsPerDollar,
      distributionFormula
    );
    const paymentStatus = getPaymentStatus(study);
    const earningBreakdown = calculateEarningBreakdown(
      study.rebateAmount,
      heartbeatsPerDollar,
      distributionFormula
    );
    return {
      study,
      participantData,
      costBreakdown,
      paymentStatus,
      earningBreakdown,
    };
  });

  const totals = studyBilling.reduce(
    (acc, { costBreakdown, paymentStatus }) => {
      acc.total += costBreakdown.totalCost;
      if (paymentStatus === "paid") {
        acc.paid += costBreakdown.totalCost;
      } else if (paymentStatus === "pending") {
        acc.pending += costBreakdown.totalCost;
      } else {
        acc.upcoming += costBreakdown.totalCost;
      }
      return acc;
    },
    { total: 0, paid: 0, pending: 0, upcoming: 0 }
  );

  return (
    <div className="p-8 space-y-6">
      {/* Back Link */}
      <Link
        href={`/admin/brands/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to {brand.name}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-xl font-semibold">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Billing & Rebates
            </h1>
            <p className="text-muted-foreground">{brand.name}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Rebates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totals.total.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              ${totals.paid.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-700">
              ${totals.pending.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Due now</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Projected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">
              ${totals.upcoming.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Active studies</p>
          </CardContent>
        </Card>
      </div>

      {/* Backloaded Earning Model Explanation */}
      <Card className="bg-gradient-to-r from-[#00D1C1]/10 to-[#00D1C1]/5 border-[#00D1C1]/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-[#00D1C1] mt-0.5" />
            <div>
              <p className="font-medium">Backloaded Earning Model</p>
              <p className="text-sm text-muted-foreground mt-1">
                Participant rebates are distributed as heartbeats (1♥ = {(100/heartbeatsPerDollar).toFixed(2)}¢):
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                      Progressive: {distributionFormula.onboarding + distributionFormula.dailyCheckIn + distributionFormula.weeklyAssessment + distributionFormula.endpointAssessment}%
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-700">
                    Earned throughout study (onboarding, daily check-ins, assessments)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max exposure for dropouts: ~{Math.round((distributionFormula.onboarding + distributionFormula.dailyCheckIn + distributionFormula.weeklyAssessment + distributionFormula.endpointAssessment) / 2)}% of rebate
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Completion Bonus: {distributionFormula.completionBonus}%
                    </Badge>
                  </div>
                  <p className="text-xs text-green-700">
                    The &quot;big prize&quot; - only earned if study requirements are met
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drives 80%+ completion rates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Study Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {studyBilling.length > 0 ? (
            <div className="space-y-4">
              {studyBilling.map(
                ({ study, participantData, costBreakdown, paymentStatus, earningBreakdown }) => (
                  <div
                    key={study.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    {/* Study Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{study.name}</p>
                            {getStatusBadge(paymentStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {study.categoryLabel} &middot; ${study.rebateAmount} rebate per completer
                            &middot; {earningBreakdown.total.heartbeats.toLocaleString()} ♥ total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          ${costBreakdown.totalCost.toLocaleString()}
                        </p>
                        {participantData.isProjected && (
                          <p className="text-xs text-muted-foreground">
                            Projected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Participant Breakdown */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <p className="text-green-700 font-medium">
                            Completed
                          </p>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Full Rebate
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-800 mt-1">
                          {participantData.completed}
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          × ${study.rebateAmount} = ${costBreakdown.completedCost.toLocaleString()}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-green-200">
                          <div className="flex justify-between">
                            <span>Progressive earned:</span>
                            <span>${earningBreakdown.progressive.dollars.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-green-700">
                            <span>Completion bonus:</span>
                            <span>${earningBreakdown.completion.dollars.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <p className="text-blue-700 font-medium">
                            Dropped Out
                          </p>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                            Progressive Only
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-blue-800 mt-1">
                          {participantData.dropped}
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                          avg ~${(costBreakdown.droppedCost / Math.max(participantData.dropped, 1)).toFixed(0)} each = ${costBreakdown.droppedCost.toLocaleString()}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-blue-200">
                          <div className="flex justify-between">
                            <span>Max progressive:</span>
                            <span>${earningBreakdown.progressive.dollars.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-blue-700">
                            <span>No completion bonus</span>
                            <span>$0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Heartbeat Distribution Preview */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium mb-2">Heartbeat Distribution per Participant</p>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground">Onboarding</p>
                          <p className="font-medium">{earningBreakdown.breakdown.onboarding.toLocaleString()} ♥</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Daily</p>
                          <p className="font-medium">{earningBreakdown.breakdown.dailyCheckIn.toLocaleString()} ♥</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Weekly</p>
                          <p className="font-medium">{earningBreakdown.breakdown.weeklyAssessment.toLocaleString()} ♥</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Final</p>
                          <p className="font-medium">{earningBreakdown.breakdown.endpointAssessment.toLocaleString()} ♥</p>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700">Completion</p>
                          <p className="font-bold text-green-700">{earningBreakdown.breakdown.completionBonus.toLocaleString()} ♥</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Link
                        href={`/admin/studies/${study.id}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Study Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      {paymentStatus === "pending" && (
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No studies yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Rebate information will appear here once studies are created
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History - Future Enhancement Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Payment History
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
              Coming Soon
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Payment history and transaction records will be available here once
            payment processing is integrated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
