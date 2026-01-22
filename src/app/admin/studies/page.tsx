"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Building2,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";

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

export default function AdminStudiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");

  // Get data from stores
  const brands = useBrandsStore((state) => state.brands);
  const studies = useStudiesStore((state) => state.studies);
  const resetStudies = useStudiesStore((state) => state.resetToSeedData);

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || study.status === statusFilter;

    const matchesBrand =
      brandFilter === "all" || study.brandId === brandFilter;

    return matchesSearch && matchesStatus && matchesBrand;
  });

  const activeCount = studies.filter((s) => s.status === "active").length;
  const completedCount = studies.filter((s) => s.status === "completed").length;
  const draftCount = studies.filter((s) => s.status === "draft").length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studies</h1>
          <p className="text-muted-foreground mt-1">
            Manage all studies across all brands
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetStudies}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo Data
          </Button>
          <Link href="/admin/studies/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {completedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[180px]">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Studies Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Study</th>
                  <th className="p-4 font-medium">Brand</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium text-center">Participants</th>
                  <th className="p-4 font-medium">Rebate</th>
                  <th className="p-4 font-medium">Started</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudies.map((study) => (
                  <tr key={study.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{study.name}</p>
                            {study.isDemo && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                Sample
                              </Badge>
                            )}
                          </div>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              study.status
                            )}`}
                          >
                            {study.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <Link
                        href={`/admin/brands/${study.brandId}`}
                        className="hover:text-primary hover:underline"
                      >
                        {study.brandName}
                      </Link>
                    </td>
                    <td className="p-4 text-sm">{study.categoryLabel}</td>
                    <td className="p-4 text-center text-sm">
                      <span className="font-medium">{study.participants}</span>
                      <span className="text-muted-foreground">
                        /{study.targetParticipants}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      ${study.rebateAmount}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {study.startDate
                        ? new Date(study.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Not started"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/studies/${study.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
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
                              <Link href={`/admin/studies/${study.id}/edit`}>
                                Edit Study
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/verify/sample-${study.categoryKey}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Sample Verification
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/brands/${study.brandId}`}>
                                View Brand
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudies.length === 0 && (
            <div className="text-center py-12">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No studies found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== "all" || brandFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first study to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && brandFilter === "all" && (
                <Link href="/admin/studies/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Study
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
