"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CompactBadgeWidget,
  FloatingBadgeWidget,
} from "@/components/widgets/compact-badge-widget";
import { VerificationModal } from "@/components/widgets/verification-modal";
import { SENSATE_REAL_STORIES } from "@/lib/sensate-real-data";

// Transform Sensate real data into participant previews
const sensateParticipants = SENSATE_REAL_STORIES.slice(0, 6).map((story) => ({
  id: story.verificationId || `participant-${story.initials}`,
  name: story.name,
  initials: story.initials,
  rating: story.finalTestimonial?.overallRating || story.overallRating || 4,
  primaryMetric: {
    label: story.wearableMetrics?.hrvChange ? "HRV" : "Deep Sleep",
    value: story.wearableMetrics?.hrvChange
      ? `+${story.wearableMetrics.hrvChange.changePercent}%`
      : story.wearableMetrics?.deepSleepChange
        ? `+${story.wearableMetrics.deepSleepChange.changePercent}%`
        : "+20%",
  },
  quote:
    story.finalTestimonial?.quote ||
    story.journey.keyQuotes[story.journey.keyQuotes.length - 1]?.quote ||
    "This product made a real difference.",
  device: story.wearableMetrics?.device || "Oura Ring",
  verificationId: story.verificationId || "SENSATE-REAL-001",
}));

const studyInfo = {
  title: "Sensate Sleep & Stress Study",
  participantCount: 18,
  durationDays: 28,
  wearableType: "Oura Ring",
  compensationNote:
    "Yes, participants received a rebate for completing the study. Compensation was the same regardless of their feedback or results.",
};

export default function DemoProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBadge, setShowFloatingBadge] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#00D1C1] to-[#00A89D] text-white py-2 px-4">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
              DEMO
            </span>
            <span className="text-sm">
              This is a mock product page showing the Reputable widget
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showFloatingBadge}
                onChange={(e) => setShowFloatingBadge(e.target.checked)}
                className="rounded"
              />
              Show floating badge
            </label>
            <Link
              href="/demo/widget-preview"
              className="text-sm underline hover:no-underline"
            >
              ← Back to Widget Preview
            </Link>
          </div>
        </div>
      </div>

      {/* Fake Store Header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-purple-600">Sensate</span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Shop
              </span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Science
              </span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
                About
              </span>
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart (0)
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-gray-900 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-gray-900 cursor-pointer">Shop</span>
          <span>/</span>
          <span className="text-gray-900">Sensate 2</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="h-48 w-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 shadow-lg" />
                <p className="text-sm text-gray-400">[Product Image]</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 ring-purple-400"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sensate 2 - Relaxation Device
              </h1>
              <p className="text-gray-600">
                The 10-Minute Vagus Nerve Device Shown to Cut Stress by 48% and
                Boost Sleep
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.8 (2,341 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">$299.00</span>
              <span className="text-lg text-gray-400 line-through">
                $349.00
              </span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Save $50
              </span>
            </div>

            {/* Reputable Widget - INLINE PLACEMENT */}
            <div className="py-2">
              <CompactBadgeWidget
                participantCount={18}
                studyTitle="Sensate Sleep & Stress Study"
                onOpenModal={() => setIsModalOpen(true)}
              />
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full h-12">
                Buy with Shop Pay
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-purple-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span>30 Day Returns</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sensate uses gentle sound vibrations to quickly calm your
                nervous system. Just 10 minutes a day can help reduce stress,
                improve sleep quality, and increase heart rate variability.
                Backed by clinical research and used by over 100,000 customers
                worldwide.
              </p>
            </div>

            {/* What's Included */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">What&apos;s Included</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Sensate 2 Device
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  USB-C Charging Cable
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Carry Pouch
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Free App Access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge (optional) */}
      {showFloatingBadge && (
        <div className="fixed bottom-6 left-6 z-40">
          <FloatingBadgeWidget
            participantCount={18}
            studyTitle="Sensate Sleep & Stress Study"
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {/* Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        study={studyInfo}
        participants={sensateParticipants}
        verifyPageUrl="/verify/sensate-results"
      />
    </div>
  );
}
