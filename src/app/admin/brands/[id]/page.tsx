"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Calendar,
  FlaskConical,
  ExternalLink,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Receipt,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const brand = useBrandsStore((state) => state.getBrandById(id));
  const allStudies = useStudiesStore((state) => state.studies);

  // Filter studies for this brand
  const brandStudies = useMemo(() =>
    allStudies.filter((s) => s.brandId === id),
    [allStudies, id]
  );

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

  return (
    <div className="p-8 space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/brands"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Brands
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-xl font-semibold">
            {brand.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-muted-foreground">
              {brand.studyCount} {brand.studyCount === 1 ? "study" : "studies"}{" "}
              &middot; {brand.activeStudyCount} active
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/brands/${brand.id}/billing`}>
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Billing
            </Button>
          </Link>
          <Link href={`/admin/brands/${brand.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/admin/brands/${brand.id}/view-as`}>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View as Brand
            </Button>
          </Link>
          <Link href={`/admin/studies/new?brand=${brand.id}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{brand.contactName}</p>
            <a
              href={`mailto:${brand.contactEmail}`}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Mail className="h-3 w-3" />
              {brand.contactEmail}
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {(brand.createdAt instanceof Date ? brand.createdAt : new Date(brand.createdAt)).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {Math.floor(
                (Date.now() - (brand.createdAt instanceof Date ? brand.createdAt : new Date(brand.createdAt)).getTime()) / (1000 * 60 * 60 * 24)
              )}{" "}
              days ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{brand.studyCount} total</p>
            <p className="text-sm text-muted-foreground">
              {brand.activeStudyCount} currently active
            </p>
          </CardContent>
        </Card>

        <Link href={`/admin/brands/${brand.id}/billing`} className="block">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Rebates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">View billing</p>
              <p className="text-sm text-muted-foreground">
                Rebates & payments
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Studies
            <Link
              href={`/admin/studies/new?brand=${brand.id}`}
              className="text-sm font-normal text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Create Study
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {brandStudies.length > 0 ? (
            <div className="space-y-3">
              {brandStudies.map((study) => (
                <div
                  key={study.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FlaskConical className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{study.name}</p>
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
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/studies/${study.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/studies/${study.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/verify/sample-${study.category}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Verification
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FlaskConical className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No studies yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create the first study for this brand
              </p>
              <Link href={`/admin/studies/new?brand=${brand.id}`}>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Brand</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this brand and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Brand</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
