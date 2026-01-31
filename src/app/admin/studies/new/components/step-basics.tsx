"use client";

import Link from "next/link";
import {
  Building2,
  Package,
  Target,
  DollarSign,
  Check,
  Heart,
  Truck,
  CreditCard,
  Watch,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandsStore } from "@/lib/brands-store";
import { CATEGORY_CONFIGS, getTierDisplayInfo } from "@/lib/assessments";
import { getCheckInDescription, getNonWearableDescription } from "@/lib/study-generator";
import { calculateHeartbeats } from "@/lib/heartbeat-calculator";
import type { StudyFormData } from "./types";
import {
  DEFAULT_TARGET_PARTICIPANTS,
  ENROLLMENT_CAP_MULTIPLIER,
} from "./types";

interface StepBasicsProps {
  formData: StudyFormData;
  updateFormData: (updates: Partial<StudyFormData>) => void;
}

export function StepBasics({ formData, updateFormData }: StepBasicsProps) {
  const brands = useBrandsStore((state) => state.brands);
  const selectedCategory = CATEGORY_CONFIGS.find((c) => c.value === formData.category);
  const tierInfo = formData.autoConfig ? getTierDisplayInfo(formData.autoConfig.tier) : null;
  const heartbeats = calculateHeartbeats(formData.rebateAmount);
  const tier = formData.autoConfig?.tier || 1;

  return (
    <div className="space-y-6">
      {/* Brand Selection */}
      <div className="space-y-2">
        <Label htmlFor="brand" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Brand
        </Label>
        <Select
          value={formData.brandId}
          onValueChange={(value) => updateFormData({ brandId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          <Link href="/admin/brands" className="text-primary hover:underline">
            + Add new brand
          </Link>
        </p>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="productName" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Product Name
        </Label>
        <Input
          id="productName"
          placeholder="e.g., SleepWell Premium"
          value={formData.productName}
          onChange={(e) => updateFormData({ productName: e.target.value })}
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Category
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Key Field</span>
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => updateFormData({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select wellness category" />
          </SelectTrigger>
          <SelectContent>
            {/* Tier 1 */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Tier 1: Wearables Primary
            </div>
            {CATEGORY_CONFIGS.filter((c) => c.tier === 1).map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}

            {/* Tier 2 */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
              Tier 2: Co-Primary
            </div>
            {CATEGORY_CONFIGS.filter((c) => c.tier === 2).map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}

            {/* Tier 3 */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
              Tier 3: Assessment Primary
            </div>
            {CATEGORY_CONFIGS.filter((c) => c.tier === 3).map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}

            {/* Tier 4 */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
              Tier 4: Assessment Only
            </div>
            {CATEGORY_CONFIGS.filter((c) => c.tier === 4).map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Auto-Config Display */}
      {formData.autoConfig && selectedCategory && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-green-800">
                  Auto-configured based on {selectedCategory.label}:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    <span className="font-medium">Tier {formData.autoConfig.tier}:</span>{" "}
                    {tierInfo?.label}
                  </li>
                  <li>
                    <span className="font-medium">Duration:</span> 28 days
                  </li>
                  <li>
                    <span className="font-medium">Check-ins:</span>{" "}
                    {getCheckInDescription(formData.autoConfig.checkInDays)}
                  </li>
                  <li>
                    <span className="font-medium">Primary metric:</span>{" "}
                    {formData.autoConfig.primaryMetric}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rebate Amount */}
      <div className="space-y-2">
        <Label htmlFor="rebate" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Rebate Amount
        </Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="rebate"
              type="number"
              min={10}
              max={200}
              className="pl-7 w-32"
              value={formData.rebateAmount}
              onChange={(e) => updateFormData({ rebateAmount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-400" />
            {heartbeats.total.toLocaleString()} heartbeats
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Distributed over 28 days: ~{heartbeats.daily}/day + bonuses
        </p>
      </div>

      {/* Target Participants */}
      <div className="space-y-2">
        <Label htmlFor="participants" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Target Participants
        </Label>
        <Input
          id="participants"
          type="number"
          min={10}
          max={500}
          className="w-32"
          value={formData.targetParticipants}
          onChange={(e) => {
            const newTarget = parseInt(e.target.value) || DEFAULT_TARGET_PARTICIPANTS;
            updateFormData({
              targetParticipants: newTarget,
              // Auto-update enrollment cap to 1.5x when target changes (for rebate model)
              // But only if user hasn't manually set the enrollment cap
              ...(formData.fulfillmentModel === "rebate" && !formData._hasManuallyEditedEnrollmentCap
                ? { enrollmentCap: Math.round(newTarget * ENROLLMENT_CAP_MULTIPLIER) }
                : {}
              ),
            });
          }}
        />
        <p className="text-xs text-muted-foreground">
          {formData.fulfillmentModel === "rebate"
            ? `Estimated testing rewards: $${(formData.rebateAmount * formData.targetParticipants).toLocaleString()}`
            : `Estimated cost: $${(formData.rebateAmount * formData.targetParticipants).toLocaleString()}`
          }
        </p>
      </div>

      {/* Product Fulfillment */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Product Fulfillment
        </Label>
        <p className="text-sm text-muted-foreground">
          How will participants receive your product?
        </p>

        <div className="space-y-3">
          {/* Recruited Option */}
          <Card
            className={`cursor-pointer transition-colors ${
              formData.fulfillmentModel === "recruited"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => updateFormData({ fulfillmentModel: "recruited" })}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    formData.fulfillmentModel === "recruited"
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {formData.fulfillmentModel === "recruited" && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="font-medium">We ship to recruited participants</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reputable recruits participants, you ship products to them in batches
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Recruits Option */}
          <Card
            className={`cursor-pointer transition-colors ${
              formData.fulfillmentModel === "rebate"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => updateFormData({
              fulfillmentModel: "rebate",
              // Auto-set enrollment cap to 1.5x target when switching (only if not manually edited)
              ...(!formData._hasManuallyEditedEnrollmentCap
                ? { enrollmentCap: Math.round(formData.targetParticipants * ENROLLMENT_CAP_MULTIPLIER) }
                : {}
              ),
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    formData.fulfillmentModel === "rebate"
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {formData.fulfillmentModel === "rebate" && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-medium">Your customers</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You invite customers who&apos;ve purchased. They earn a testing reward for sharing their results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Settings - Only show for brand-recruited model */}
        {formData.fulfillmentModel === "rebate" && (
          <Card className="border-dashed border-primary/50 bg-primary/5 mt-4">
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Info className="h-4 w-4" />
                Enrollment Settings
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentCap">Enrollment Cap</Label>
                <Input
                  id="enrollmentCap"
                  type="number"
                  min={formData.targetParticipants}
                  className="w-32"
                  value={formData.enrollmentCap}
                  onChange={(e) => updateFormData({
                    enrollmentCap: parseInt(e.target.value) || formData.targetParticipants,
                    _hasManuallyEditedEnrollmentCap: true,
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Recommend {ENROLLMENT_CAP_MULTIPLIER}x your target ({Math.round(formData.targetParticipants * ENROLLMENT_CAP_MULTIPLIER)}) to account for participants who may not complete
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.hasEnrollmentDeadline}
                    onCheckedChange={(checked) => updateFormData({ hasEnrollmentDeadline: checked })}
                  />
                  <Label>Set enrollment deadline</Label>
                </div>
                {formData.hasEnrollmentDeadline && (
                  <Input
                    type="date"
                    value={formData.enrollmentDeadline}
                    onChange={(e) => updateFormData({ enrollmentDeadline: e.target.value })}
                    className="w-48"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Optional. Enrollment closes automatically when cap is reached or deadline passes.
                </p>
              </div>

              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">
                  After publishing, you&apos;ll get an enrollment link and email template to share with your customers.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Wearable Settings - ONLY HERE */}
      {tier <= 2 && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Watch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Allow participants without wearables</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.allowNonWearable
                      ? getNonWearableDescription(formData.category)
                      : "Only participants with compatible wearable devices can join"}
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowNonWearable}
                onCheckedChange={(checked) => updateFormData({ allowNonWearable: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
