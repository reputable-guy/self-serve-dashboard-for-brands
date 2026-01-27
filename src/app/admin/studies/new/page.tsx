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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Pencil,
  Eye,
  Info,
  Heart,
  Truck,
  CreditCard,
  Watch,
  Sparkles,
  Save,
  Loader2,
  Image as ImageIcon,
  Plus,
  X,
  MessageSquare,
  HelpCircle,
  Gift,
  Download,
  RefreshCw,
  ClipboardList,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Rocket,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBrandsStore } from "@/lib/brands-store";
import { useStudiesStore } from "@/lib/studies-store";
import {
  CATEGORY_CONFIGS,
  getTierDisplayInfo,
} from "@/lib/assessments";
import { getCategory } from "@/lib/categories";
import {
  generateStudyContent,
  getStudyAutoConfig,
  getCheckInDescription,
  getNonWearableDescription,
  GeneratedStudyContent,
  StudyAutoConfig,
} from "@/lib/study-generator";
import { calculateHeartbeats } from "@/lib/heartbeat-calculator";
import {
  StudyDetailsFullPreview,
  generateDefaultWhatYoullDo,
  generateDefaultWhatYoullGet,
  WhatYoullDoSection,
  WhatYoullDoItem,
  WhatYoullGetItem,
} from "@/components/study-details-full-preview";
import { StudyPreview } from "@/components/study-preview";

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEY = "study-wizard-draft";

const STEP_LABELS = ["Basics", "Preview", "Customize", "Publish"];

// Available icons for What You'll Do
const WHAT_YOULL_DO_ICON_OPTIONS = [
  { value: "download", label: "Download", icon: Download, color: "text-[#00D1C1]" },
  { value: "watch", label: "Watch", icon: Watch, color: "text-gray-400" },
  { value: "gift", label: "Gift", icon: Gift, color: "text-amber-400" },
  { value: "message", label: "Message", icon: MessageSquare, color: "text-blue-400" },
  { value: "refresh", label: "Refresh", icon: RefreshCw, color: "text-gray-400" },
  { value: "clipboard", label: "Clipboard", icon: ClipboardList, color: "text-purple-400" },
  { value: "sparkles", label: "Sparkles", icon: Sparkles, color: "text-yellow-400" },
  { value: "package", label: "Package", icon: Package, color: "text-amber-400" },
];

// Available icons for What You'll Get
const WHAT_YOULL_GET_ICON_OPTIONS = [
  { value: "package", label: "Package/Gift", icon: Gift, color: "text-amber-400" },
  { value: "heart", label: "Heart", icon: Heart, color: "text-red-400" },
  { value: "chart", label: "Chart", icon: BarChart3, color: "text-blue-400" },
];

// ============================================
// TYPES
// ============================================

interface StudyFormData {
  // Step 1: Basics
  brandId: string;
  productName: string;
  category: string;
  rebateAmount: number;
  targetParticipants: number;

  // Shipping/Fulfillment
  fulfillmentModel: "recruited" | "rebate";
  shippingProductDescription: string;

  // Enrollment settings (for brand-recruited / "rebate" model)
  enrollmentCap: number;
  hasEnrollmentDeadline: boolean;
  enrollmentDeadline: string;

  // Wearable settings (ONLY in Step 1)
  allowNonWearable: boolean;

  // Auto-configured
  autoConfig: StudyAutoConfig | null;

  // Generated content (editable in Step 3)
  whatYoullDiscover: string[];
  dailyRoutine: string;
  howItWorks: string;

  // Catalog card fields
  studyTitle: string;
  hookQuestion: string;
  productDescription: string;
  productImage: string;

  // Participant tracking
  villainVariable: string;

  // Structured content
  whatYoullDoSections: WhatYoullDoSection[];
  whatYoullGet: WhatYoullGetItem[];
}

// ============================================
// HELPER COMPONENTS
// ============================================

// Icon selector component
function IconSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: typeof WHAT_YOULL_DO_ICON_OPTIONS;
}) {
  const selected = options.find((o) => o.value === value) || options[0];
  const IconComponent = selected.icon;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px]">
        <div className="flex items-center gap-2">
          <IconComponent className={`h-4 w-4 ${selected.color}`} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${option.color}`} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

function AdminStudyCreationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBrandId = searchParams.get("brand");

  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const brands = useBrandsStore((state) => state.brands);
  const addStudy = useStudiesStore((state) => state.addStudy);

  const getInitialFormData = (): StudyFormData => ({
    brandId: preselectedBrandId || "",
    productName: "",
    category: "",
    rebateAmount: 50,
    targetParticipants: 50,
    fulfillmentModel: "recruited",
    shippingProductDescription: "",
    enrollmentCap: 75, // Default to 1.5x of default target (50)
    hasEnrollmentDeadline: false,
    enrollmentDeadline: "",
    allowNonWearable: true,
    autoConfig: null,
    whatYoullDiscover: [],
    dailyRoutine: "",
    howItWorks: "",
    studyTitle: "",
    hookQuestion: "",
    productDescription: "",
    productImage: "",
    villainVariable: "",
    whatYoullDoSections: [],
    whatYoullGet: [],
  });

  const [formData, setFormData] = useState<StudyFormData>(getInitialFormData);
  const [generatedContent, setGeneratedContent] = useState<GeneratedStudyContent | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!hasLoadedDraft) {
      try {
        const savedDraft = localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({ ...prev, ...parsed }));
          // Expand all sections if they exist
          if (parsed.whatYoullDoSections) {
            const expanded: Record<number, boolean> = {};
            parsed.whatYoullDoSections.forEach((_: WhatYoullDoSection, i: number) => (expanded[i] = true));
            setExpandedSections(expanded);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
      setHasLoadedDraft(true);
    }
  }, [hasLoadedDraft]);

  // Auto-save to localStorage when formData changes
  useEffect(() => {
    if (hasLoadedDraft && formData.productName) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [formData, hasLoadedDraft]);

  // Clear draft from localStorage
  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Auto-configure when category changes
  useEffect(() => {
    if (formData.category && formData.productName) {
      const autoConfig = getStudyAutoConfig(formData.category);
      const content = generateStudyContent(
        formData.productName,
        formData.category,
        formData.rebateAmount
      );

      // Generate "How It Works" content
      const howItWorksContent = generateHowItWorks(formData.productName, formData.category);

      // Get category definition for villain variable
      const categoryDef = getCategory(formData.category);
      const defaultVillainVariable = categoryDef?.villainVariable || formData.category;
      const categoryLabel = CATEGORY_CONFIGS.find((c) => c.value === formData.category)?.label || formData.category;

      // Generate structured content
      const doSections = generateDefaultWhatYoullDo(
        formData.productName,
        categoryLabel,
        28,
        autoConfig.tier
      );
      const getItems = generateDefaultWhatYoullGet(
        formData.productName,
        categoryLabel,
        formData.rebateAmount,
        28
      );

      // Expand all sections
      const expanded: Record<number, boolean> = {};
      doSections.forEach((_, i) => (expanded[i] = true));
      setExpandedSections(expanded);

      setFormData((prev) => ({
        ...prev,
        autoConfig,
        whatYoullDiscover: content.whatYoullDiscover,
        dailyRoutine: content.dailyRoutine,
        howItWorks: howItWorksContent,
        studyTitle: prev.studyTitle || `${prev.productName} Study`,
        hookQuestion: prev.hookQuestion || `Can ${prev.productName} improve your ${categoryLabel.toLowerCase()}?`,
        productDescription: prev.productDescription || howItWorksContent,
        villainVariable: prev.villainVariable || defaultVillainVariable,
        whatYoullDoSections: doSections,
        whatYoullGet: getItems,
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
    return categoryDescriptions[category] || `${productName} is a wellness product. This study will track how it affects your health and wellbeing over 28 days.`;
  }

  const selectedBrand = brands.find((b) => b.id === formData.brandId);
  const selectedCategory = CATEGORY_CONFIGS.find((c) => c.value === formData.category);
  const tierInfo = formData.autoConfig ? getTierDisplayInfo(formData.autoConfig.tier) : null;
  const heartbeats = calculateHeartbeats(formData.rebateAmount);
  const tier = formData.autoConfig?.tier || 1;

  const canProceedStep1 =
    formData.brandId && formData.productName && formData.category && formData.rebateAmount > 0;

  // Form update helper
  const updateFormData = (updates: Partial<StudyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // What You'll Do section handlers
  const updateDoSection = (sectionIndex: number, updates: Partial<WhatYoullDoSection>) => {
    const newSections = [...formData.whatYoullDoSections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates };
    updateFormData({ whatYoullDoSections: newSections });
  };

  const updateDoItem = (sectionIndex: number, itemIndex: number, updates: Partial<WhatYoullDoItem>) => {
    const newSections = [...formData.whatYoullDoSections];
    const newItems = [...newSections[sectionIndex].items];
    newItems[itemIndex] = { ...newItems[itemIndex], ...updates };
    newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems };
    updateFormData({ whatYoullDoSections: newSections });
  };

  const addDoItem = (sectionIndex: number) => {
    const newSections = [...formData.whatYoullDoSections];
    newSections[sectionIndex].items.push({
      icon: "gift",
      title: "",
      subtitle: "",
    });
    updateFormData({ whatYoullDoSections: newSections });
  };

  const removeDoItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...formData.whatYoullDoSections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    updateFormData({ whatYoullDoSections: newSections });
  };

  const addDoSection = () => {
    const newSections = [...formData.whatYoullDoSections];
    const newIndex = newSections.length;
    newSections.push({
      sectionTitle: "New Section",
      items: [{ icon: "gift", title: "", subtitle: "" }],
    });
    updateFormData({ whatYoullDoSections: newSections });
    setExpandedSections((prev) => ({ ...prev, [newIndex]: true }));
  };

  const removeDoSection = (sectionIndex: number) => {
    const newSections = formData.whatYoullDoSections.filter((_, i) => i !== sectionIndex);
    updateFormData({ whatYoullDoSections: newSections });
  };

  // What You'll Get handlers
  const updateGetItem = (index: number, updates: Partial<WhatYoullGetItem>) => {
    const newItems = [...formData.whatYoullGet];
    newItems[index] = { ...newItems[index], ...updates };
    updateFormData({ whatYoullGet: newItems });
  };

  const addGetItem = () => {
    const newItems = [...formData.whatYoullGet];
    newItems.push({
      icon: "package",
      item: "",
      note: "",
      value: "$0",
    });
    updateFormData({ whatYoullGet: newItems });
  };

  const removeGetItem = (index: number) => {
    const newItems = formData.whatYoullGet.filter((_, i) => i !== index);
    updateFormData({ whatYoullGet: newItems });
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Generate URL-friendly slug from product name
  const generateEnrollmentSlug = (productName: string): string => {
    const baseSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    // Add timestamp suffix to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  };

  // Publish study
  const handlePublish = async () => {
    setIsPublishing(true);

    const categoryLabel = selectedCategory?.label || formData.category;

    // Generate enrollment config for brand-recruited studies
    const enrollmentConfig = formData.fulfillmentModel === "rebate" ? {
      enrollmentCap: formData.enrollmentCap,
      enrollmentDeadline: formData.hasEnrollmentDeadline ? formData.enrollmentDeadline : undefined,
      enrollmentSlug: generateEnrollmentSlug(formData.productName),
      enrollmentStatus: 'open' as const,
      enrolledCount: 0,
    } : undefined;

    // Brand-recruited studies go directly to "active" (enrollment open)
    // Reputable-recruited studies go to "coming_soon" (build waitlist first)
    const isBrandRecruits = formData.fulfillmentModel === "rebate";

    const study = addStudy({
      name: formData.productName,
      brandId: formData.brandId,
      category: formData.category,
      categoryKey: formData.category,
      categoryLabel: categoryLabel,
      status: isBrandRecruits ? "active" : "coming_soon",
      tier: tier,
      targetParticipants: formData.targetParticipants,
      startDate: null,
      endDate: null,
      rebateAmount: formData.rebateAmount,
      hasWearables: !formData.allowNonWearable,
      productDescription: formData.productDescription,
      productImage: formData.productImage,
      hookQuestion: formData.hookQuestion,
      studyTitle: formData.studyTitle,
      whatYoullDiscover: formData.whatYoullDiscover,
      dailyRoutine: formData.dailyRoutine,
      howItWorks: formData.howItWorks,
      whatYoullDoSections: formData.whatYoullDoSections,
      whatYoullGet: formData.whatYoullGet,
      villainVariable: formData.villainVariable,
      assessmentVersion: selectedCategory?.assessmentVersion || "1.0",
      fulfillmentModel: formData.fulfillmentModel,
      shippingProductDescription:
        formData.fulfillmentModel === "recruited"
          ? formData.shippingProductDescription
          : undefined,
      enrollmentConfig,
    });

    // Clear draft from localStorage
    clearDraft();

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsPublishing(false);

    // Redirect to the study dashboard
    router.push(`/admin/studies/${study.id}?published=true`);
  };

  // Required device for preview
  const requiredDevice = formData.allowNonWearable ? "optional" : tier <= 2 ? "required" : "none";

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
            const newTarget = parseInt(e.target.value) || 50;
            updateFormData({
              targetParticipants: newTarget,
              // Auto-update enrollment cap to 1.5x when target changes (for rebate model)
              enrollmentCap: formData.fulfillmentModel === "rebate"
                ? Math.round(newTarget * 1.5)
                : formData.enrollmentCap
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
              // Auto-set enrollment cap to 1.5x target when switching
              enrollmentCap: Math.round(formData.targetParticipants * 1.5)
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
                  onChange={(e) => updateFormData({ enrollmentCap: parseInt(e.target.value) || formData.targetParticipants })}
                />
                <p className="text-xs text-muted-foreground">
                  Recommend 1.5x your target ({Math.round(formData.targetParticipants * 1.5)}) to account for participants who may not complete
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

  // ============================================
  // STEP 2: PREVIEW
  // ============================================

  const renderStep2 = () => (
    <div className="flex flex-col items-center">
      {/* Context Header */}
      <div className="text-center mb-6 max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-[#00D1C1]" />
          <span className="text-sm font-medium text-[#00D1C1]">App Preview</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Here&apos;s how participants will discover your study
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve generated content based on your product and category.
          In the next step, you can customize everything to match your brand voice.
        </p>
      </div>

      {/* Mobile Preview */}
      <div className="flex justify-center mb-6">
        <StudyDetailsFullPreview
          productName={formData.productName || "Your Product"}
          productImage={formData.productImage}
          productDescription={generatedContent?.heroQuestion || `Study the effects of ${formData.productName} on ${selectedCategory?.label?.toLowerCase() || "wellness"}`}
          category={selectedCategory?.label || "Wellness"}
          rebateAmount={formData.rebateAmount}
          durationDays={28}
          totalSpots={formData.targetParticipants}
          requiredDevice={requiredDevice}
          whatYoullDiscover={formData.whatYoullDiscover.length > 0 ? formData.whatYoullDiscover : [
            `How ${formData.productName} affects your ${selectedCategory?.label?.toLowerCase() || "wellness"}`,
            "Track your daily progress with personalized metrics",
            "Compare your results with verified participants",
            "Receive insights backed by real data",
          ]}
          howItWorks={formData.howItWorks}
          whatYoullDoSections={formData.whatYoullDoSections}
          whatYoullGet={formData.whatYoullGet}
          tier={tier}
        />
      </div>

      {/* Helpful context */}
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>All content is editable in the next step</span>
        </div>
      </div>
    </div>
  );

  // ============================================
  // STEP 3: CUSTOMIZE (Full-width editing)
  // ============================================

  const renderStep3 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Column */}
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Study Card Content</CardTitle>
            <CardDescription>How your study appears when participants browse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Study Title</Label>
              <Input
                value={formData.studyTitle}
                onChange={(e) => updateFormData({ studyTitle: e.target.value })}
                placeholder="e.g., SleepWell Premium Study"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Hook Question
              </Label>
              <Input
                value={formData.hookQuestion}
                onChange={(e) => updateFormData({ hookQuestion: e.target.value })}
                placeholder="e.g., Can this supplement improve your sleep?"
              />
              <p className="text-xs text-muted-foreground">
                This question appears on the study card to attract participants
              </p>
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <Label>Product Description</Label>
              <Textarea
                value={formData.productDescription}
                onChange={(e) => updateFormData({ productDescription: e.target.value })}
                rows={3}
                placeholder="Brief description of what your product does..."
              />
            </div>

            {/* Product Image */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Product Image
              </Label>

              {/* Image Preview */}
              {formData.productImage && (
                <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData.productImage}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                    onClick={() => updateFormData({ productImage: "" })}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              {/* File Upload */}
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateFormData({ productImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                    <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formData.productImage ? "Change Image" : "Upload Image"}
                    </span>
                  </div>
                </label>
              </div>

              <p className="text-xs text-muted-foreground">
                Leave empty to use a category placeholder image
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Participant Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#00D1C1]" />
              Participant Tracking
            </CardTitle>
            <CardDescription>What participants will track throughout the study</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Tracking Focus</Label>
              <Input
                value={formData.villainVariable}
                onChange={(e) => updateFormData({ villainVariable: e.target.value })}
                placeholder="e.g., energy levels, sleep quality"
              />
              <p className="text-xs text-muted-foreground">
                Shown as &ldquo;Tracking: <span className="font-medium capitalize">{formData.villainVariable || "your metric"}</span>&rdquo; on participant cards
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Discover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              What You&apos;ll Discover
            </CardTitle>
            <CardDescription>Key insights participants will learn about themselves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.whatYoullDiscover.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-[#00D1C1] mt-2.5 flex-shrink-0" />
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...formData.whatYoullDiscover];
                    newItems[index] = e.target.value;
                    updateFormData({ whatYoullDiscover: newItems });
                  }}
                  placeholder="Discovery point..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    const newItems = formData.whatYoullDiscover.filter((_, i) => i !== index);
                    updateFormData({ whatYoullDiscover: newItems });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => updateFormData({ whatYoullDiscover: [...formData.whatYoullDiscover, ""] })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Discovery Point
            </Button>
          </CardContent>
        </Card>

        {/* What You'll Do - Structured Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              What You&apos;ll Do
            </CardTitle>
            <CardDescription>
              Step-by-step activities for participants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.whatYoullDoSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg">
                {/* Section Header */}
                <div
                  className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer"
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={section.sectionTitle}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDoSection(sectionIndex, { sectionTitle: e.target.value });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 text-sm font-medium bg-transparent border-none focus-visible:ring-1 uppercase tracking-wide text-[#00D1C1]"
                      placeholder="Section title..."
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDoSection(sectionIndex);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {expandedSections[sectionIndex] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Section Items */}
                {expandedSections[sectionIndex] && (
                  <div className="p-3 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                        <IconSelect
                          value={item.icon}
                          onChange={(value) => updateDoItem(sectionIndex, itemIndex, { icon: value })}
                          options={WHAT_YOULL_DO_ICON_OPTIONS}
                        />
                        <div className="flex-1 space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) => updateDoItem(sectionIndex, itemIndex, { title: e.target.value })}
                            placeholder="Title (e.g., Receive your product)"
                            className="h-8"
                          />
                          <Input
                            value={item.subtitle}
                            onChange={(e) => updateDoItem(sectionIndex, itemIndex, { subtitle: e.target.value })}
                            placeholder="Subtitle (e.g., Shipped to your door)"
                            className="h-8 text-muted-foreground"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeDoItem(sectionIndex, itemIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => addDoItem(sectionIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={addDoSection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              How It Works
            </CardTitle>
            <CardDescription>Explain the product and what participants will experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.howItWorks}
                onChange={(e) => updateFormData({ howItWorks: e.target.value })}
                rows={4}
                placeholder="Explain how the product works and what the study measures..."
              />
            </div>
          </CardContent>
        </Card>

        {/* What You'll Get - Structured Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              What You&apos;ll Get
            </CardTitle>
            <CardDescription>
              Rewards and benefits for participants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.whatYoullGet.map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                <IconSelect
                  value={item.icon}
                  onChange={(value) => updateGetItem(index, { icon: value })}
                  options={WHAT_YOULL_GET_ICON_OPTIONS}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={item.item}
                      onChange={(e) => updateGetItem(index, { item: e.target.value })}
                      placeholder="Item name (e.g., Product Supply)"
                      className="flex-1"
                    />
                    <Input
                      value={item.value}
                      onChange={(e) => updateGetItem(index, { value: e.target.value })}
                      placeholder="$50"
                      className="w-24"
                    />
                  </div>
                  <Input
                    value={item.note}
                    onChange={(e) => updateGetItem(index, { note: e.target.value })}
                    placeholder="Description (e.g., 28-day supply shipped to your door)"
                    className="text-muted-foreground"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeGetItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={addGetItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reward Item
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Column */}
      <div>
        <div className="sticky top-8 space-y-6">
          {/* Catalog Card Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground text-center">
              Study Card Preview
            </h3>
            <div className="flex justify-center">
              <StudyPreview
                productName={formData.productName}
                productImage={formData.productImage}
                category={selectedCategory?.label || ""}
                rebateAmount={String(formData.rebateAmount)}
                durationDays="28"
                totalSpots={String(formData.targetParticipants)}
                requiredDevice={formData.allowNonWearable ? "any" : "oura"}
                studyTitle={formData.studyTitle}
                hookQuestion={formData.hookQuestion}
              />
            </div>
          </div>

          {/* Full Details Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground text-center">
              Full Study Details
            </h3>
            <div className="flex justify-center">
              <StudyDetailsFullPreview
                productName={formData.productName}
                productImage={formData.productImage}
                productDescription={formData.productDescription}
                category={selectedCategory?.label || ""}
                rebateAmount={formData.rebateAmount}
                durationDays={28}
                totalSpots={formData.targetParticipants}
                requiredDevice={requiredDevice}
                whatYoullDiscover={formData.whatYoullDiscover}
                howItWorks={formData.howItWorks}
                whatYoullDoSections={formData.whatYoullDoSections}
                whatYoullGet={formData.whatYoullGet}
                tier={tier}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // STEP 4: REVIEW & PUBLISH
  // ============================================

  const renderStep4 = () => {
    const isBrandRecruits = formData.fulfillmentModel === "rebate";

    const baseChecklist = [
      {
        label: "Brand selected",
        done: !!formData.brandId,
        detail: selectedBrand?.name || "Not selected",
      },
      {
        label: "Product name set",
        done: !!formData.productName,
        detail: formData.productName || "Not set",
      },
      {
        label: "Category configured",
        done: !!formData.category,
        detail: selectedCategory?.label || "Not set",
      },
      {
        label: "Testing reward set",
        done: formData.rebateAmount > 0,
        detail: `$${formData.rebateAmount} (${heartbeats.total.toLocaleString()} heartbeats)`,
      },
      {
        label: "Target participants set",
        done: formData.targetParticipants > 0,
        detail: `${formData.targetParticipants} participants`,
      },
      {
        label: "Recruitment model selected",
        done: !!formData.fulfillmentModel,
        detail: isBrandRecruits ? "Your customers (brand recruits)" : "Reputable recruits",
      },
      {
        label: "Study content customized",
        done: formData.whatYoullDiscover.length > 0 && formData.whatYoullDoSections.length > 0,
        detail: `${formData.whatYoullDiscover.length} discovery points, ${formData.whatYoullDoSections.length} activity sections`,
      },
    ];

    // Add enrollment-specific items for brand-recruited studies
    const enrollmentChecklist = isBrandRecruits ? [
      {
        label: "Enrollment cap set",
        done: formData.enrollmentCap > 0,
        detail: `${formData.enrollmentCap} max participants`,
      },
      ...(formData.hasEnrollmentDeadline ? [{
        label: "Enrollment deadline set",
        done: !!formData.enrollmentDeadline,
        detail: formData.enrollmentDeadline ? new Date(formData.enrollmentDeadline).toLocaleDateString() : "Not set",
      }] : []),
    ] : [];

    const checklist = [...baseChecklist, ...enrollmentChecklist];

    const allDone = checklist.every((item) => item.done);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Rocket className="h-5 w-5 text-[#00D1C1]" />
            <span className="text-sm font-medium text-[#00D1C1]">Almost there!</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Review your study</h3>
          <p className="text-sm text-muted-foreground">
            Make sure everything looks good before publishing
          </p>
        </div>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Pre-Launch Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.done ? "bg-green-50" : "bg-amber-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-amber-400" />
                  )}
                  <span className={item.done ? "text-green-800" : "text-amber-800"}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-sm ${item.done ? "text-green-600" : "text-amber-600"}`}>
                  {item.detail}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Study Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Study Title</p>
                <p className="font-medium">{formData.studyTitle || formData.productName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">28 days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Participants</p>
                <p className="font-medium">{formData.targetParticipants}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Cost</p>
                <p className="font-medium">${(formData.rebateAmount * formData.targetParticipants).toLocaleString()}</p>
              </div>
              {isBrandRecruits && (
                <>
                  <div>
                    <p className="text-muted-foreground">Enrollment Cap</p>
                    <p className="font-medium">{formData.enrollmentCap} participants</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recruitment Model</p>
                    <p className="font-medium">Your customers</p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Full Study Details
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What happens next */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 mb-2">What happens when you publish?</p>
                {isBrandRecruits ? (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• A unique enrollment page will be created for your study</li>
                    <li>• You&apos;ll get a shareable link to send to your customers</li>
                    <li>• Customers who purchase your product can enroll immediately</li>
                    <li>• You can pause or close enrollment anytime from the dashboard</li>
                    <li>• Testing rewards are paid directly to participants upon completion</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your study will appear in the Reputable app with a &ldquo;Coming Soon&rdquo; badge</li>
                    <li>• Users can join your waitlist while you prepare for launch</li>
                    <li>• You&apos;ll control when to start recruiting from the study dashboard</li>
                    <li>• No participants will be charged until you open recruitment</li>
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publish Button */}
        <div className="pt-4">
          <Button
            className="w-full h-12 text-lg"
            onClick={handlePublish}
            disabled={!allDone || isPublishing}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {isBrandRecruits ? "Launching..." : "Publishing..."}
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                {isBrandRecruits ? "Launch Study" : "Publish as Coming Soon"}
              </>
            )}
          </Button>
          {!allDone && (
            <p className="text-center text-sm text-amber-600 mt-2">
              Please complete all checklist items before publishing
            </p>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className={`p-8 mx-auto ${step === 3 ? "max-w-6xl" : "max-w-3xl"}`}>
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
          Set up your study in 4 simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {STEP_LABELS.map((label, index) => {
          const s = index + 1;
          return (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
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
                {label}
              </span>
              {s < 4 && <div className="w-8 h-px bg-muted mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step < 4 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Study Basics"}
              {step === 2 && "Preview Your Study"}
              {step === 3 && "Customize Your Study"}
            </CardTitle>
            {step === 1 && (
              <CardDescription>Configure the essential details for your study</CardDescription>
            )}
            {step === 2 && (
              <CardDescription>See how participants will discover your study in the app</CardDescription>
            )}
            {step === 3 && (
              <CardDescription>Fine-tune the content to match your brand voice</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </CardContent>
        </Card>
      )}

      {step === 4 && renderStep4()}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => {
            setStep((s) => Math.max(1, s - 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < 4 && (
          <Button
            onClick={() => {
              setStep((s) => Math.min(4, s + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={step === 1 && !canProceedStep1}
          >
            {step === 1 && "Preview Your Study"}
            {step === 2 && "Customize Your Study"}
            {step === 3 && "Review & Publish"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Draft Recovery Notice */}
      {hasLoadedDraft && formData.productName && step === 1 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Save className="h-4 w-4" />
              <span>Draft auto-saved. Your progress will be restored if you leave.</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                clearDraft();
                setFormData(getInitialFormData());
              }}
            >
              Clear Draft
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Study Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4 flex justify-center">
            <StudyDetailsFullPreview
              productName={formData.productName}
              productImage={formData.productImage}
              productDescription={formData.productDescription}
              category={selectedCategory?.label || ""}
              rebateAmount={formData.rebateAmount}
              durationDays={28}
              totalSpots={formData.targetParticipants}
              requiredDevice={requiredDevice}
              whatYoullDiscover={formData.whatYoullDiscover}
              howItWorks={formData.howItWorks}
              whatYoullDoSections={formData.whatYoullDoSections}
              whatYoullGet={formData.whatYoullGet}
              tier={tier}
            />
          </div>
        </DialogContent>
      </Dialog>
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
