"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Package,
  Target,
  DollarSign,
  Sparkles,
  Pencil,
  Eye,
  Rocket,
  Info,
  Watch,
  FileText,
  Heart,
  Truck,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";
import {
  CATEGORY_CONFIGS,
  getTierDisplayInfo,
} from "@/lib/assessments";
import {
  generateStudyContent,
  getStudyAutoConfig,
  getNonWearableDescription,
  getCheckInDescription,
  GeneratedStudyContent,
  StudyAutoConfig,
} from "@/lib/study-generator";
import { calculateHeartbeats, formatRebateWithHeartbeats } from "@/lib/heartbeat-calculator";
import { generateSampleStory, getSampleHeadline } from "@/lib/sample-story";
import {
  generateDefaultWhatYoullDo,
  generateDefaultWhatYoullGet,
} from "@/components/study-details-full-preview";

// ============================================
// TYPES
// ============================================

interface StudyFormData {
  // Step 1: Basics
  brandId: string;
  productName: string;
  category: string;
  rebateAmount: number;

  // Shipping/Fulfillment
  fulfillmentModel: "recruited" | "rebate";
  shippingProductDescription: string;

  // Auto-configured
  autoConfig: StudyAutoConfig | null;

  // Step 2: Content (editable)
  whatYoullDiscover: string[];
  dailyRoutine: string;
  howItWorks: string;
  allowNonWearable: boolean;

  // Step 3: Launch
  targetParticipants: number;
}

// ============================================
// COMPONENT
// ============================================

function AdminStudyCreationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBrandId = searchParams.get("brand");

  const [step, setStep] = useState(1);
  const brands = useBrandsStore((state) => state.brands);
  const addStudy = useStudiesStore((state) => state.addStudy);

  const [formData, setFormData] = useState<StudyFormData>({
    brandId: preselectedBrandId || "",
    productName: "",
    category: "",
    rebateAmount: 50,
    fulfillmentModel: "recruited", // Default: we ship to participants
    shippingProductDescription: "",
    autoConfig: null,
    whatYoullDiscover: [],
    dailyRoutine: "",
    howItWorks: "",
    allowNonWearable: true, // Default: allow participants without wearables
    targetParticipants: 50,
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedStudyContent | null>(null);
  const [isEditingDiscover, setIsEditingDiscover] = useState(false);
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [isEditingHowItWorks, setIsEditingHowItWorks] = useState(false);

  // Auto-configure when category changes
  useEffect(() => {
    if (formData.category && formData.productName) {
      const autoConfig = getStudyAutoConfig(formData.category);
      const content = generateStudyContent(
        formData.productName,
        formData.category,
        formData.rebateAmount
      );

      // Generate "How It Works" content based on category
      const howItWorksContent = generateHowItWorks(formData.productName, formData.category);

      setFormData((prev) => ({
        ...prev,
        autoConfig,
        whatYoullDiscover: content.whatYoullDiscover,
        dailyRoutine: content.dailyRoutine,
        howItWorks: howItWorksContent,
      }));
      setGeneratedContent(content);
    }
  }, [formData.category, formData.productName, formData.rebateAmount]);

  // Generate "How It Works" content based on category
  function generateHowItWorks(productName: string, category: string): string {
    const categoryDescriptions: Record<string, string> = {
      sleep: `${productName} is designed to support healthy sleep patterns. This study will track how it affects your sleep quality, duration, and how refreshed you feel upon waking.`,
      recovery: `${productName} is formulated to support post-workout recovery. This study will measure its impact on your recovery metrics, muscle soreness, and HRV.`,
      fitness: `${productName} is designed to support your fitness goals. This study will track how it affects your activity levels, workout performance, and overall fitness metrics.`,
      stress: `${productName} is formulated to support stress resilience. This study will measure its impact on your stress levels, HRV, and overall sense of calm and focus.`,
      energy: `${productName} is designed to support sustained energy levels. This study will track how it affects your daily energy, afternoon alertness, and overall vitality.`,
      focus: `${productName} is formulated to support mental clarity and concentration. This study will measure its impact on your focus, cognitive performance, and productivity.`,
      mood: `${productName} is designed to support emotional wellbeing. This study will track how it affects your mood stability, positive outlook, and overall emotional balance.`,
      anxiety: `${productName} is formulated to support calm and relaxation. This study will measure its impact on your anxiety levels, sense of peace, and stress response.`,
      pain: `${productName} is designed to support comfort and mobility. This study will track how it affects your pain levels, physical comfort, and daily activities.`,
      gut: `${productName} is formulated to support digestive wellness. This study will measure its impact on your gut health, digestive comfort, and regularity.`,
      skin: `${productName} is designed to support skin health. This study will track how it affects your skin appearance, hydration, and overall complexion.`,
      immunity: `${productName} is formulated to support immune function. This study will measure its impact on your immune health markers and overall wellness.`,
      hair: `${productName} is designed to support hair health. This study will track how it affects your hair strength, growth, and overall appearance.`,
      weight: `${productName} is formulated to support healthy metabolism. This study will measure its impact on your weight management goals and metabolic markers.`,
    };
    return categoryDescriptions[category] || `${productName} is a wellness product. This study will track how it affects your health and wellbeing over ${28} days.`;
  }

  const selectedBrand = brands.find((b) => b.id === formData.brandId);
  const selectedCategory = CATEGORY_CONFIGS.find((c) => c.value === formData.category);
  const tierInfo = formData.autoConfig ? getTierDisplayInfo(formData.autoConfig.tier) : null;
  const heartbeats = calculateHeartbeats(formData.rebateAmount);

  const canProceedStep1 =
    formData.brandId && formData.productName && formData.category && formData.rebateAmount > 0;

  const canProceedStep2 =
    formData.whatYoullDiscover.length > 0 && formData.dailyRoutine;

  // ============================================
  // STEP 1: BASICS
  // ============================================

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Brand Selection */}
      <div className="space-y-2">
        <Label htmlFor="brand" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Brand
        </Label>
        <Select
          value={formData.brandId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, brandId: value }))}
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
          onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
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
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rebateAmount: parseInt(e.target.value) || 0,
                }))
              }
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
            onClick={() =>
              setFormData((prev) => ({ ...prev, fulfillmentModel: "recruited" }))
            }
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
                    Reputable recruits participants, you ship products to them
                  </p>
                  <p className="text-xs text-primary mt-1">
                    → Cohort-based recruitment with fulfillment tracking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rebate Option */}
          <Card
            className={`cursor-pointer transition-colors ${
              formData.fulfillmentModel === "rebate"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, fulfillmentModel: "rebate" }))
            }
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
                    <span className="font-medium">Participants purchase directly (rebate model)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Participants buy from your site, you provide rebate
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    → No shipping coordination needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Product Description (only for recruited) */}
        {formData.fulfillmentModel === "recruited" && (
          <div className="space-y-2 pl-7">
            <Label htmlFor="shippingDesc" className="text-sm">
              What&apos;s being shipped?
            </Label>
            <Input
              id="shippingDesc"
              placeholder="e.g., 30-day supply of Sleep Support supplement (1 bottle)"
              value={formData.shippingProductDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingProductDescription: e.target.value,
                }))
              }
            />
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 text-xs text-blue-800">
                <p className="font-medium mb-1">How cohort recruitment works:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Your study starts with a waitlist (participants join via app)</li>
                  <li>When you start recruiting, a 24-hour enrollment window opens</li>
                  <li>Everyone who enrolls becomes a cohort</li>
                  <li>You ship to that cohort and enter tracking codes</li>
                  <li>Once all tracking entered, you can open the next window</li>
                </ol>
                <p className="mt-2 text-blue-600">
                  This ensures you get predictable batches, not a constant trickle.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // STEP 2: PARTICIPANT EXPERIENCE
  // ============================================

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* What You'll Discover */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What Participants Will Discover
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingDiscover(!isEditingDiscover)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditingDiscover ? "Done" : "Edit"}
          </Button>
        </div>

        {isEditingDiscover ? (
          <Textarea
            value={formData.whatYoullDiscover.join("\n")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                whatYoullDiscover: e.target.value.split("\n").filter(Boolean),
              }))
            }
            rows={5}
            placeholder="One discovery point per line..."
          />
        ) : (
          <Card>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {formData.whatYoullDiscover.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-generated based on {selectedCategory?.label || "category"}
        </p>
      </div>

      {/* Daily Routine */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Daily Routine
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingRoutine(!isEditingRoutine)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditingRoutine ? "Done" : "Edit"}
          </Button>
        </div>

        {isEditingRoutine ? (
          <Textarea
            value={formData.dailyRoutine}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dailyRoutine: e.target.value }))
            }
            rows={4}
          />
        ) : (
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm">{formData.dailyRoutine}</p>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-generated for Tier {formData.autoConfig?.tier || "?"} experience
        </p>
      </div>

      {/* How It Works */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            How It Works
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingHowItWorks(!isEditingHowItWorks)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditingHowItWorks ? "Done" : "Edit"}
          </Button>
        </div>

        {isEditingHowItWorks ? (
          <Textarea
            value={formData.howItWorks}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, howItWorks: e.target.value }))
            }
            rows={4}
            placeholder="Explain how the product works and what the study will measure..."
          />
        ) : (
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm">{formData.howItWorks || "Enter product name and category to generate"}</p>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-generated based on {selectedCategory?.label || "category"}
        </p>
      </div>

      {/* Reward Breakdown */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-400" />
          Reward Breakdown
        </Label>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-3">
              ${formData.rebateAmount} rebate distributed as:
            </p>
            <div className="space-y-2 text-sm">
              {generatedContent?.rewardBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-muted-foreground">• {item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          Auto-calculated from ${formData.rebateAmount} rebate
        </p>
      </div>

      {/* Non-Wearable Toggle */}
      <Card className={formData.allowNonWearable ? "border-primary" : ""}>
        <CardContent className="pt-4">
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
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, allowNonWearable: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================
  // STEP 3: PREVIEW & LAUNCH
  // ============================================

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Study Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Study Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brand</span>
            <span className="font-medium">{selectedBrand?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product</span>
            <span className="font-medium">{formData.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium">
              {selectedCategory?.label} (Tier {formData.autoConfig?.tier}:{" "}
              {tierInfo?.label})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">28 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rebate</span>
            <span className="font-medium">{formatRebateWithHeartbeats(formData.rebateAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Non-wearable</span>
            <span className="font-medium">
              {formData.allowNonWearable ? "Allowed" : "Not allowed"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fulfillment</span>
            <span className="font-medium">
              {formData.fulfillmentModel === "recruited"
                ? "Ship to participants"
                : "Rebate model"}
            </span>
          </div>
          {formData.fulfillmentModel === "recruited" && formData.shippingProductDescription && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-right max-w-[200px]">
                {formData.shippingProductDescription}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Verification Preview */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            Example Verification Page
            <Badge variant="outline" className="ml-2 text-xs font-normal">Preview</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This shows how a participant&apos;s verified results page will look
          </p>
        </CardHeader>
        <CardContent>
          {(() => {
            const sampleStory = formData.category && formData.productName
              ? generateSampleStory(formData.productName, formData.category, 28)
              : null;
            const sampleHeadline = formData.category && formData.productName
              ? getSampleHeadline(formData.category, formData.productName)
              : null;
            const tier = formData.autoConfig?.tier || 1;
            const isWearablePrimary = tier <= 2;
            const hasDevice = !formData.allowNonWearable || tier <= 2;

            return (
              <>
                <div className="rounded-lg border bg-white p-4 space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">VERIFIED</span>
                    {hasDevice && (
                      <span className="text-sm text-muted-foreground">
                        with {sampleStory?.wearableMetrics?.device || "Oura Ring"}
                      </span>
                    )}
                    {!hasDevice && tier >= 3 && (
                      <span className="text-sm text-muted-foreground">via structured assessment</span>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">
                      {sampleStory?.name || "Sample Participant"} • Age {sampleStory?.profile?.ageRange || "25-34"}
                    </p>
                    <p className="text-sm text-muted-foreground">Example verified participant</p>
                  </div>

                  <p className="text-sm italic text-muted-foreground">
                    &quot;{sampleStory?.journey?.keyQuotes?.[0]?.quote ||
                      `${formData.productName} helped me finally get the results I was looking for.`}&quot;
                  </p>

                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-sm font-medium text-green-700">
                      {sampleHeadline || `${selectedCategory?.label} improved from 4/10 to 7/10 (+75%)`}
                    </p>
                  </div>

                  {/* Tier-specific trust messaging */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Trust Stack:</p>
                    <p>✓ Real person (identity verified)</p>
                    {isWearablePrimary ? (
                      <>
                        <p>✓ Real device (connected and syncing)</p>
                        <p>✓ Real participation (28 days active)</p>
                      </>
                    ) : hasDevice ? (
                      <>
                        <p>✓ Structured assessment (validated methodology)</p>
                        <p>✓ Real device (supporting evidence)</p>
                      </>
                    ) : (
                      <>
                        <p>✓ Structured assessment (validated methodology)</p>
                        <p>✓ Real participation (weekly check-ins verified)</p>
                      </>
                    )}
                    <p>✓ No incentive to lie (same rebate regardless)</p>
                  </div>

                  {/* Tier indicator */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-center text-muted-foreground">
                      Tier {tier}: {tierInfo?.label}
                      {tier >= 3 && " • Assessment measures primary outcome"}
                      {tier <= 2 && isWearablePrimary && " • Device data measures primary outcome"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Sample story generated for {selectedCategory?.label || "category"}
                  {formData.allowNonWearable && tier >= 3 && " (non-wearable mode)"}
                </p>
              </>
            );
          })()}
        </CardContent>
      </Card>

      {/* Target Participants */}
      <div className="space-y-2">
        <Label htmlFor="participants">Target Participants</Label>
        <Input
          id="participants"
          type="number"
          min={10}
          max={500}
          className="w-32"
          value={formData.targetParticipants}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              targetParticipants: parseInt(e.target.value) || 50,
            }))
          }
        />
        <p className="text-xs text-muted-foreground">
          Estimated cost: ${(formData.rebateAmount * formData.targetParticipants).toLocaleString()}
        </p>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/studies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Studies
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create New Study</h1>
        <p className="text-muted-foreground mt-1">
          Set up a study in less than 10 minutes
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span
              className={`text-sm ${
                step === s ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s === 1 && "Basics"}
              {s === 2 && "Experience"}
              {s === 3 && "Review"}
            </span>
            {s < 3 && <div className="w-12 h-px bg-muted mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Study Basics"}
            {step === 2 && "Participant Experience"}
            {step === 3 && "Review & Create"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              // Save to store
              const selectedBrandData = brands.find((b) => b.id === formData.brandId);
              const tier = formData.autoConfig?.tier || 1;
              const categoryLabel = selectedCategory?.label || formData.category;

              // Generate structured content for the study
              const whatYoullDoSections = generateDefaultWhatYoullDo(
                formData.productName,
                categoryLabel,
                28,
                tier
              );
              const whatYoullGet = generateDefaultWhatYoullGet(
                formData.productName,
                categoryLabel,
                formData.rebateAmount,
                28
              );

              const study = addStudy({
                name: formData.productName,
                brandId: formData.brandId,
                brandName: selectedBrandData?.name || "Unknown Brand",
                category: formData.category,
                categoryKey: formData.category,
                categoryLabel: categoryLabel,
                status: "draft",
                tier: tier,
                targetParticipants: formData.targetParticipants,
                startDate: null,
                endDate: null,
                rebateAmount: formData.rebateAmount,
                hasWearables: tier <= 2,
                productDescription: formData.howItWorks,
                productImage: "",
                hookQuestion: `Can ${formData.productName} improve your ${categoryLabel.toLowerCase()}?`,
                studyTitle: `${formData.productName} Study`,
                whatYoullDiscover: formData.whatYoullDiscover,
                dailyRoutine: formData.dailyRoutine,
                howItWorks: formData.howItWorks,
                whatYoullDoSections: whatYoullDoSections,
                whatYoullGet: whatYoullGet,
                // Lock assessment version at study creation time
                assessmentVersion: selectedCategory?.assessmentVersion || "1.0",
                // Shipping configuration
                fulfillmentModel: formData.fulfillmentModel,
                shippingProductDescription:
                  formData.fulfillmentModel === "recruited"
                    ? formData.shippingProductDescription
                    : undefined,
              });

              // Redirect to the new study with success flag
              router.push(`/admin/studies/${study.id}?created=true`);
            }}
          >
            <Rocket className="h-4 w-4 mr-2" />
            Create Study
          </Button>
        )}
      </div>

      {/* Time Estimate */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        <Info className="h-3 w-3 inline mr-1" />
        Estimated time: ~7 minutes
      </p>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function AdminStudyCreationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminStudyCreationContent />
    </Suspense>
  );
}
