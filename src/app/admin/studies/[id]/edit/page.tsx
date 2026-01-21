"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Building2,
  Package,
  Target,
  DollarSign,
  Sparkles,
  Save,
  Watch,
  Heart,
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getAllBrands, Brand } from "@/lib/roles";
import { useStudiesStore } from "@/lib/studies-store";
import {
  CATEGORY_CONFIGS,
  getTierDisplayInfo,
} from "@/lib/assessments";
import { getCategory } from "@/lib/categories";
import {
  getStudyAutoConfig,
  getNonWearableDescription,
  StudyAutoConfig,
} from "@/lib/study-generator";
import { calculateHeartbeats } from "@/lib/heartbeat-calculator";
import {
  StudyDetailsFullPreview,
  WhatYoullDoSection,
  WhatYoullDoItem,
  WhatYoullGetItem,
  generateDefaultWhatYoullDo,
  generateDefaultWhatYoullGet,
} from "@/components/study-details-full-preview";
import { StudyPreview } from "@/components/study-preview";

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


interface EditFormData {
  brandId: string;
  productName: string;
  productDescription: string;
  productImage: string;
  category: string;
  rebateAmount: number;
  targetParticipants: number;
  autoConfig: StudyAutoConfig | null;
  // Catalog card fields
  studyTitle: string;
  hookQuestion: string;
  // Participant tracking
  villainVariable: string;
  // Study details fields
  whatYoullDiscover: string[];
  howItWorksTitle: string;
  howItWorksDescription: string;
  allowNonWearable: boolean;
  // New structured fields
  whatYoullDoSections: WhatYoullDoSection[];
  whatYoullGet: WhatYoullGetItem[];
}

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

function StudyEditContent() {
  const router = useRouter();
  const params = useParams();
  const studyId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [brands] = useState<Brand[]>(getAllBrands());
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  // Use Zustand store for study data
  const getStudyById = useStudiesStore((state) => state.getStudyById);
  const updateStudy = useStudiesStore((state) => state.updateStudy);
  const study = getStudyById(studyId);

  const [formData, setFormData] = useState<EditFormData>({
    brandId: "",
    productName: "",
    productDescription: "",
    productImage: "",
    category: "",
    rebateAmount: 50,
    targetParticipants: 50,
    autoConfig: null,
    studyTitle: "",
    hookQuestion: "",
    villainVariable: "",
    whatYoullDiscover: [],
    howItWorksTitle: "",
    howItWorksDescription: "",
    allowNonWearable: true,
    whatYoullDoSections: [],
    whatYoullGet: [],
  });

  // Load study data from Zustand store
  useEffect(() => {
    if (study) {
      const autoConfig = getStudyAutoConfig(study.category);

      // Use stored whatYoullDoSections if available, otherwise generate defaults
      const doSections = study.whatYoullDoSections || generateDefaultWhatYoullDo(
        study.name,
        study.categoryLabel,
        28,
        study.tier
      );

      // Use stored whatYoullGet if available, otherwise generate defaults
      const getItems = study.whatYoullGet || generateDefaultWhatYoullGet(
        study.name,
        study.categoryLabel,
        study.rebateAmount,
        28
      );

      // Get default villain variable from category, use study's override if saved
      const categoryDef = getCategory(study.category);
      const defaultVillainVariable = categoryDef?.villainVariable || study.categoryLabel.toLowerCase();

      setFormData({
        brandId: study.brandId,
        productName: study.name,
        productDescription: study.productDescription,
        productImage: study.productImage,
        category: study.category,
        rebateAmount: study.rebateAmount,
        targetParticipants: study.targetParticipants,
        autoConfig,
        studyTitle: study.studyTitle || `${study.name} Study`,
        hookQuestion: study.hookQuestion || `Can ${study.name} improve your ${study.categoryLabel.toLowerCase()}?`,
        villainVariable: study.villainVariable || defaultVillainVariable,
        whatYoullDiscover: study.whatYoullDiscover,
        howItWorksTitle: `What is ${study.name}?`,
        howItWorksDescription: study.howItWorks,
        allowNonWearable: !study.hasWearables,
        whatYoullDoSections: doSections,
        whatYoullGet: getItems,
      });

      // Expand all sections by default
      const expanded: Record<number, boolean> = {};
      doSections.forEach((_, i) => (expanded[i] = true));
      setExpandedSections(expanded);
    }
    setIsLoading(false);
  }, [study]);

  // Update autoConfig and villain variable when category changes
  useEffect(() => {
    if (formData.category) {
      const autoConfig = getStudyAutoConfig(formData.category);
      const categoryDef = getCategory(formData.category);
      const defaultVillainVariable = categoryDef?.villainVariable || formData.category;

      setFormData((prev) => ({
        ...prev,
        autoConfig,
        // Only auto-update villain variable if it's empty or matches a previous category's default
        villainVariable: prev.villainVariable || defaultVillainVariable,
      }));
    }
  }, [formData.category]);

  const updateFormData = (updates: Partial<EditFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
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

  const handleSave = async () => {
    setIsSaving(true);

    // Find the brand name for the selected brand
    const selectedBrand = brands.find((b) => b.id === formData.brandId);

    // Update the study in Zustand store (persisted to localStorage)
    updateStudy(studyId, {
      name: formData.productName,
      brandId: formData.brandId,
      brandName: selectedBrand?.name || study?.brandName || "Unknown Brand",
      productDescription: formData.productDescription,
      productImage: formData.productImage,
      category: formData.category,
      categoryKey: formData.category,
      categoryLabel: selectedCategory?.label || formData.category,
      rebateAmount: formData.rebateAmount,
      targetParticipants: formData.targetParticipants,
      tier: formData.autoConfig?.tier || 1,
      hasWearables: !formData.allowNonWearable,
      studyTitle: formData.studyTitle,
      hookQuestion: formData.hookQuestion,
      villainVariable: formData.villainVariable,
      whatYoullDiscover: formData.whatYoullDiscover,
      dailyRoutine: formData.whatYoullDoSections.length > 0
        ? `Follow your personalized ${formData.whatYoullDoSections.length}-step routine.`
        : "Complete your daily check-ins and follow the study routine.",
      howItWorks: formData.howItWorksDescription,
      whatYoullDoSections: formData.whatYoullDoSections,
      whatYoullGet: formData.whatYoullGet,
    });

    // Small delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    setHasChanges(false);
    router.push(`/admin/studies/${studyId}`);
  };

  const selectedCategory = CATEGORY_CONFIGS.find((c) => c.value === formData.category);
  const tierInfo = formData.autoConfig ? getTierDisplayInfo(formData.autoConfig.tier) : null;
  const heartbeats = calculateHeartbeats(formData.rebateAmount);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-medium">Study not found</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The study you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/studies")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Studies
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/studies/${studyId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Study Details
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Study</h1>
            <p className="text-muted-foreground mt-1">{formData.productName}</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600">Unsaved changes</span>
            )}
            <Button variant="outline" onClick={() => router.push(`/admin/studies/${studyId}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core study settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
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
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Name
                </Label>
                <Input
                  value={formData.productName}
                  onChange={(e) => updateFormData({ productName: e.target.value })}
                />
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <Label>Product Description</Label>
                <Textarea
                  value={formData.productDescription}
                  onChange={(e) => updateFormData({ productDescription: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Image URL
                </Label>
                <Input
                  placeholder="https://example.com/product-image.jpg"
                  value={formData.productImage}
                  onChange={(e) => updateFormData({ productImage: e.target.value })}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    const categoryDef = getCategory(value);
                    const defaultVillainVariable = categoryDef?.villainVariable || value;
                    updateFormData({
                      category: value,
                      villainVariable: defaultVillainVariable,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Tier 1: Wearables Primary
                    </div>
                    {CATEGORY_CONFIGS.filter((c) => c.tier === 1).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                      Tier 2: Co-Primary
                    </div>
                    {CATEGORY_CONFIGS.filter((c) => c.tier === 2).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                      Tier 3: Assessment Primary
                    </div>
                    {CATEGORY_CONFIGS.filter((c) => c.tier === 3).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
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
                {formData.autoConfig && (
                  <p className="text-xs text-muted-foreground">
                    Tier {formData.autoConfig.tier}: {tierInfo?.label}
                  </p>
                )}
              </div>

              {/* Participant Tracking (Villain Variable) */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#00D1C1]" />
                  Participant Tracking
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  What are participants tracking throughout the study? This appears on interim cards and in check-in questions.
                </p>
                <Input
                  value={formData.villainVariable}
                  onChange={(e) => updateFormData({ villainVariable: e.target.value })}
                  placeholder="e.g., energy levels, sleep quality"
                />
                <p className="text-[11px] text-muted-foreground italic">
                  Shown as &ldquo;Tracking: <span className="font-medium capitalize">{formData.villainVariable || "your metric"}</span>&rdquo; on participant cards
                </p>
              </div>

              {/* Rebate Amount */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Rebate Amount
                </Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
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
              </div>

              {/* Target Participants */}
              <div className="space-y-2">
                <Label>Target Participants</Label>
                <Input
                  type="number"
                  min={10}
                  max={500}
                  className="w-32"
                  value={formData.targetParticipants}
                  onChange={(e) => updateFormData({ targetParticipants: parseInt(e.target.value) || 50 })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Card Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Study Card Content
              </CardTitle>
              <CardDescription>How the study appears in the catalog</CardDescription>
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
                Step-by-step activities for participants. Each section has a title and items with icons.
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
              <CardDescription>Explain the product and study methodology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={formData.howItWorksTitle}
                  onChange={(e) => updateFormData({ howItWorksTitle: e.target.value })}
                  placeholder="e.g., What is SleepWell Premium?"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.howItWorksDescription}
                  onChange={(e) => updateFormData({ howItWorksDescription: e.target.value })}
                  rows={4}
                  placeholder="Explain how the product works..."
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
                Rewards and benefits for participants. Each item has an icon, name, description, and value.
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

          {/* Wearable Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Watch className="h-5 w-5" />
                Wearable Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Allow participants without wearables</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.allowNonWearable
                      ? getNonWearableDescription(formData.category)
                      : "Only participants with compatible wearable devices can join"}
                  </p>
                </div>
                <Switch
                  checked={formData.allowNonWearable}
                  onCheckedChange={(checked) => updateFormData({ allowNonWearable: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        <div>
          <div className="sticky top-8 space-y-6">
            {/* Catalog Card Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground text-center">
                Study Catalog Card
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
                Study Details Page
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
                requiredDevice={formData.allowNonWearable ? "optional" : "required"}
                whatYoullDiscover={formData.whatYoullDiscover}
                howItWorks={formData.howItWorksDescription}
                whatYoullDoSections={formData.whatYoullDoSections}
                whatYoullGet={formData.whatYoullGet}
                tier={formData.autoConfig?.tier || 1}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudyEditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <StudyEditContent />
    </Suspense>
  );
}
