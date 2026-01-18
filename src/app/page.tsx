"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Shield,
  Building2,
  ArrowRight,
  FlaskConical,
  Settings,
  CheckCircle2,
  Eye,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#00D1C1]" />
            <span className="text-lg font-semibold">Reputable</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Self-Serve Platform
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-4xl w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Reputable
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create verified, wearable-backed studies that transform customer outcomes
              into credible marketing claims.
            </p>
          </div>

          {/* Development Mode Notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-blue-600">Development Mode</span>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Admin Dashboard */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all hover:border-[#00D1C1]/50 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D1C1]/5 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-[#00D1C1]" />
                </div>
                <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                <CardDescription className="text-base">
                  Manage brands, create studies, and configure platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#00D1C1]" />
                    Create and manage brand accounts
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#00D1C1]" />
                    Configure studies with 4-tier measurement
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#00D1C1]" />
                    View Assessment Library (14 validated assessments)
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[#00D1C1]" />
                    Customize Trust Stack & Heartbeats settings
                  </div>
                </div>
                <Link href="/admin" className="block">
                  <Button className="w-full bg-[#00D1C1] hover:bg-[#00B8A9] group-hover:shadow-md transition-all">
                    Enter Admin Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Brand Portal */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-all hover:border-blue-500/50 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Brand Portal</CardTitle>
                <CardDescription className="text-base">
                  View your studies, track results, and access verification pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Monitor study progress and participants
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    View verified participant testimonials
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Access public verification pages
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Track rebates and ROI metrics
                  </div>
                </div>
                <Link href="/admin/brands" className="block">
                  <Button variant="outline" className="w-full group-hover:border-blue-500/50 transition-all">
                    <Eye className="h-4 w-4 mr-2" />
                    View as Brand
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admin/studies/new">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Create Study
                </Button>
              </Link>
              <Link href="/admin/brands/new">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Brand
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </Link>
              <Link href="/verify/demo">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Sample Verification
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-6">
        <div className="container px-8 text-center text-sm text-muted-foreground">
          <p>Reputable Self-Serve Platform - Development Preview</p>
          <p className="mt-1 text-xs">
            4-Tier Measurement System | Wearable Integration | Trust Stack Verification
          </p>
        </div>
      </div>
    </div>
  );
}
