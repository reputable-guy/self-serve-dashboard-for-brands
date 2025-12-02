"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FlaskConical, Clock, Watch, Users, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { useStudies, Study } from "@/lib/studies-store";
import { STUDY_STATUSES, DEVICE_LABELS } from "@/lib/constants";

function StudyCard({ study }: { study: Study }) {
  const status = STUDY_STATUSES[study.status];
  const totalSpots = parseInt(study.totalSpots) || 50; // Default to 50 if not set
  const spotsRemaining = totalSpots - study.enrolledCount;
  const device = DEVICE_LABELS[study.requiredDevice] || "Any Device";
  const enrollmentPercent = totalSpots > 0 ? (study.enrolledCount / totalSpots) * 100 : 0;

  // Mock data for completed studies
  const mockCompletionRate = 87;
  const mockTestimonials = 12;

  return (
    <Link href={`/studies/${study.id}`}>
      <Card className="overflow-hidden hover:border-[#00D1C1]/50 transition-colors cursor-pointer group">
        {/* Image */}
        <div className="relative aspect-video bg-muted">
          {study.productImage ? (
            <img
              src={study.productImage}
              alt={study.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FlaskConical className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          {/* Spots */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
              <Users className="w-3 h-3" />
              {spotsRemaining} left
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-[#00D1C1] transition-colors">
            {study.studyTitle || `${study.productName} Study`}
          </h3>

          {/* Product thumbnail and name */}
          <div className="flex items-center gap-2 mb-3">
            {study.productImage && (
              <div className="w-6 h-6 rounded bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={study.productImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground truncate">{study.productName}</p>
          </div>

          {/* Enrollment Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                {study.enrolledCount}/{totalSpots} enrolled
              </span>
              <span className="text-xs font-medium">{Math.round(enrollmentPercent)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D1C1] rounded-full transition-all"
                style={{ width: `${enrollmentPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Stats based on status */}
          {study.status === "completed" ? (
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>{mockCompletionRate}% completed</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#00D1C1]" />
                <span>{mockTestimonials} testimonials</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Watch className="w-3.5 h-3.5" />
                <span>{device}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{study.durationDays} Days</span>
              </div>
            </div>
          )}

          {/* Rebate amount */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Rebate</span>
            <span className="text-sm font-semibold text-[#00D1C1]">
              ${study.rebateAmount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function StudiesPage() {
  const { studies } = useStudies();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Studies</h1>
          <p className="text-muted-foreground mt-1">
            {studies.length} {studies.length === 1 ? "study" : "studies"} total
          </p>
        </div>
        <Button asChild className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
          <Link href="/studies/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Study
          </Link>
        </Button>
      </div>

      {studies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <FlaskConical className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No studies yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first rebate study to start collecting verified testimonials from real customers using their wearable data.
          </p>
          <Button asChild className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
            <Link href="/studies/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Study
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
