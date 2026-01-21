"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  FileText,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { CATEGORY_CONFIGS } from "@/lib/assessments";
import type { StudyData } from "./types";
import { getTierLabel } from "./mock-data";

interface ConfigTabProps {
  study: StudyData;
  categoryConfig: (typeof CATEGORY_CONFIGS)[0] | undefined;
}

export function ConfigTab({ study, categoryConfig }: ConfigTabProps) {
  return (
    <div className="space-y-6">
      {/* Study Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Study Configuration
              </CardTitle>
              <CardDescription>
                Measurement methodology and data collection settings
              </CardDescription>
            </div>
            <Link href={`/admin/studies/${study.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Measurement Tier</p>
              <p className="font-medium">{getTierLabel(study.tier)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Wearable Data</p>
              <p className="font-medium">
                {study.hasWearables ? "Required" : "Optional"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Rebate Amount</p>
              <p className="font-medium">${study.rebateAmount}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">
                {categoryConfig?.label || study.category}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {study.productImage && (
              <img
                src={study.productImage}
                alt={study.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium">{study.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {study.productDescription}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">How It Works</h4>
            <p className="text-sm text-muted-foreground">{study.howItWorks}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">
              What Participants Discover
            </h4>
            <ul className="space-y-1">
              {study.whatYoullDiscover.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#00D1C1] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
