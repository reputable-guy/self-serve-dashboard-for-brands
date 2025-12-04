"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Calculator,
  Users,
  BadgeCheck,
  Zap,
  MessageSquareQuote,
  FileText,
  Code,
  HelpCircle,
  Mail,
  Calendar,
} from "lucide-react";

export default function PricingPage() {
  const [participants, setParticipants] = useState(50);
  const [rebateAmount, setRebateAmount] = useState(30);
  const [completionRate, setCompletionRate] = useState(70);

  // Calculate costs
  const platformFee = 199;
  const perEnrolledFee = 10;
  const perTestimonialFee = 25;

  const enrolledCost = participants * perEnrolledFee;
  const estimatedCompletions = Math.round(participants * (completionRate / 100));
  const testimonialCost = estimatedCompletions * perTestimonialFee;
  const totalPlatformCost = platformFee + enrolledCost + testimonialCost;
  const totalRebateCost = estimatedCompletions * rebateAmount;
  const totalCost = totalPlatformCost + totalRebateCost;
  const costPerTestimonial = estimatedCompletions > 0
    ? totalCost / estimatedCompletions
    : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pay for what you use. No hidden fees, no long-term contracts.
        </p>
      </div>

      {/* Pricing Model */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Platform Fee */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00D1C1]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#00D1C1]" />
              Platform Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">$199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Full access to the Reputable platform
            </p>
            <ul className="space-y-3">
              {[
                "Unlimited studies",
                "Study creation wizard",
                "Participant dashboard",
                "Embeddable widgets",
                "Basic analytics",
                "Email support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[#00D1C1]" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Per Enrolled */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Per Enrolled Participant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">$10</span>
              <span className="text-muted-foreground">/participant</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Covers participant management & support
            </p>
            <ul className="space-y-3">
              {[
                "Participant onboarding",
                "Wearable data sync",
                "Check-in management",
                "Compliance tracking",
                "Support handling",
                "Rebate distribution (Amazon gift cards)",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Per Testimonial */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
              Per Verified Testimonial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">$25</span>
              <span className="text-muted-foreground">/testimonial</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Only pay when participants complete
            </p>
            <ul className="space-y-3">
              {[
                "Verified testimonial card",
                "Biometric data proof",
                "Third-party verification stamp",
                "Shareable verification link",
                "PDF verification report",
                "Embed-ready widgets",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cost Calculator */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Study Cost Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="participants">Number of Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="10"
                  max="500"
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value) || 50)}
                />
                <p className="text-xs text-muted-foreground">
                  How many spots in your study?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rebate">Rebate Amount ($)</Label>
                <Input
                  id="rebate"
                  type="number"
                  min="5"
                  max="200"
                  value={rebateAmount}
                  onChange={(e) => setRebateAmount(parseInt(e.target.value) || 30)}
                />
                <p className="text-xs text-muted-foreground">
                  What rebate will you offer participants?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion">Expected Completion Rate (%)</Label>
                <Input
                  id="completion"
                  type="number"
                  min="30"
                  max="100"
                  value={completionRate}
                  onChange={(e) => setCompletionRate(parseInt(e.target.value) || 70)}
                />
                <p className="text-xs text-muted-foreground">
                  Industry average is 60-75%
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Estimated Costs</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee (monthly)</span>
                  <span>${platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {participants} participants x ${perEnrolledFee}
                  </span>
                  <span>${enrolledCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ~{estimatedCompletions} testimonials x ${perTestimonialFee}
                  </span>
                  <span>${testimonialCost.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Platform fees</span>
                  <span>${totalPlatformCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Rebates (~{estimatedCompletions} x ${rebateAmount})
                  </span>
                  <span>${totalRebateCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span>Total Investment</span>
                  <span className="text-[#00D1C1]">${totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Cost per verified testimonial</span>
                  <span className="font-medium text-foreground">
                    ${costPerTestimonial.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Everything You Need to Run Studies
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <MessageSquareQuote className="h-8 w-8 text-[#00D1C1] mb-4" />
              <h3 className="font-semibold mb-2">Verified Testimonials</h3>
              <p className="text-sm text-muted-foreground">
                Every testimonial comes with a verification stamp backed by real
                biometric data from wearables like Oura, Whoop, and Apple Watch.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Code className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="font-semibold mb-2">Embeddable Widgets</h3>
              <p className="text-sm text-muted-foreground">
                Drop testimonial carousels, data cards, and trust badges onto
                your website with a simple embed code. No coding required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-emerald-500 mb-4" />
              <h3 className="font-semibold mb-2">Verification Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate PDF reports for each testimonial with full biometric
                data, perfect for regulatory or marketing review.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Common Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What if a participant doesn&apos;t complete?</h4>
              <p className="text-sm text-muted-foreground">
                You only pay the $25 testimonial fee when a participant completes
                the full study. Testimonials are built from the data and responses
                collected throughout the study. The $10 enrollment fee covers
                participant support and management regardless of completion.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How do rebates work?</h4>
              <p className="text-sm text-muted-foreground">
                You set the rebate amount and we handle distribution. Participants
                who complete the study receive their rebate as an Amazon gift card,
                automatically sent upon completion.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Can I run multiple studies?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! The $199/month platform fee covers unlimited studies. You only
                pay per-participant and per-testimonial fees based on actual usage.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">What wearables are supported?</h4>
              <p className="text-sm text-muted-foreground">
                We support Oura Ring, Apple Watch, Whoop, Garmin, and Fitbit.
                Participants connect their device through our mobile app.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-[#00D1C1]/10 to-emerald-500/10 border-[#00D1C1]/30">
        <CardContent className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a demo to see how Reputable can help you collect verified
            testimonials with real biometric data.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book a Demo
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
