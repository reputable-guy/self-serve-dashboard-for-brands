/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useStudies } from "@/lib/studies-store";
import { StudyPreview } from "@/components/study-preview";
import { StudyDetailsPreview } from "@/components/study-details-preview";
import { ImageUpload } from "@/components/image-upload";
import { DiscoverItem, RoutineStep, ValueItem, CustomQuestion, BaselineQuestion, DEFAULT_BASELINE_QUESTIONS } from "@/lib/study-context";
import { CATEGORIES, DEVICES, METRICS, DEFAULT_VILLAIN_DAYS } from "@/lib/constants";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  Mic,
  RotateCcw,
  ClipboardList,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function EditStudyPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudy, updateStudy } = useStudies();
  const [isSaving, setIsSaving] = useState(false);
  const [openSections, setOpenSections] = useState({
    product: true,
    settings: true,
    baseline: false,
    checkin: false,
    content: true,
    discover: false,
    routine: false,
    value: false,
  });
  const [isCustomQuestionsOpen, setIsCustomQuestionsOpen] = useState(false);
  const [isBaselineQuestionsOpen, setIsBaselineQuestionsOpen] = useState(true);

  const study = getStudy(params.id as string);

  // Local form state
  const [formData, setFormData] = useState({
    productName: "",
    productImage: "",
    productDescription: "",
    productPrice: "",
    productUrl: "",
    category: "",
    rebateAmount: "",
    durationDays: "30",
    totalSpots: "",
    requiredDevice: "",
    metricsToTrack: [] as string[],
    villainVariable: "",
    villainQuestionDays: [7, 14, 21, 28] as number[],
    customQuestions: [] as CustomQuestion[],
    baselineQuestions: [] as BaselineQuestion[],
    studyTitle: "",
    hookQuestion: "",
    discoverItems: [] as DiscoverItem[],
    dailyRoutine: [] as RoutineStep[],
    whatYouGet: [] as ValueItem[],
  });

  // Load study data on mount
  useEffect(() => {
    if (study) {
      setFormData({
        productName: study.productName,
        productImage: study.productImage,
        productDescription: study.productDescription,
        productPrice: study.productPrice,
        productUrl: study.productUrl,
        category: study.category,
        rebateAmount: study.rebateAmount,
        durationDays: study.durationDays,
        totalSpots: study.totalSpots,
        requiredDevice: study.requiredDevice,
        metricsToTrack: study.metricsToTrack,
        villainVariable: study.villainVariable || "",
        villainQuestionDays: study.villainQuestionDays || [7, 14, 21, 28],
        customQuestions: study.customQuestions || [],
        baselineQuestions: study.baselineQuestions || DEFAULT_BASELINE_QUESTIONS,
        studyTitle: study.studyTitle,
        hookQuestion: study.hookQuestion,
        discoverItems: study.discoverItems,
        dailyRoutine: study.dailyRoutine,
        whatYouGet: study.whatYouGet,
      });
      // Auto-expand custom questions section if there are existing questions
      if (study.customQuestions && study.customQuestions.length > 0) {
        setIsCustomQuestionsOpen(true);
      }
    }
  }, [study]);

  if (!study) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <h2 className="text-xl font-semibold mb-2">Study not found</h2>
          <p className="text-muted-foreground mb-4">
            This study may have been deleted or doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/studies">Back to Studies</Link>
          </Button>
        </div>
      </div>
    );
  }

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMetricToggle = (metricId: string) => {
    const current = formData.metricsToTrack;
    if (current.includes(metricId)) {
      updateField(
        "metricsToTrack",
        current.filter((m) => m !== metricId)
      );
    } else {
      updateField("metricsToTrack", [...current, metricId]);
    }
  };

  // Discover items handlers
  const addDiscoverItem = () => {
    updateField("discoverItems", [
      ...formData.discoverItems,
      { question: "", explanation: "" },
    ]);
  };

  const updateDiscoverItem = (
    index: number,
    field: keyof DiscoverItem,
    value: string
  ) => {
    const updated = [...formData.discoverItems];
    updated[index] = { ...updated[index], [field]: value };
    updateField("discoverItems", updated);
  };

  const removeDiscoverItem = (index: number) => {
    updateField(
      "discoverItems",
      formData.discoverItems.filter((_, i) => i !== index)
    );
  };

  // Routine steps handlers
  const addRoutineStep = () => {
    updateField("dailyRoutine", [
      ...formData.dailyRoutine,
      { action: "", details: "" },
    ]);
  };

  const updateRoutineStep = (
    index: number,
    field: keyof RoutineStep,
    value: string
  ) => {
    const updated = [...formData.dailyRoutine];
    updated[index] = { ...updated[index], [field]: value };
    updateField("dailyRoutine", updated);
  };

  const removeRoutineStep = (index: number) => {
    updateField(
      "dailyRoutine",
      formData.dailyRoutine.filter((_, i) => i !== index)
    );
  };

  // Value items handlers
  const addValueItem = () => {
    updateField("whatYouGet", [
      ...formData.whatYouGet,
      { item: "", value: "", note: "" },
    ]);
  };

  const updateValueItem = (
    index: number,
    field: keyof ValueItem,
    value: string
  ) => {
    const updated = [...formData.whatYouGet];
    updated[index] = { ...updated[index], [field]: value };
    updateField("whatYouGet", updated);
  };

  const removeValueItem = (index: number) => {
    updateField(
      "whatYouGet",
      formData.whatYouGet.filter((_, i) => i !== index)
    );
  };

  // Villain days handlers
  const handleVillainDayToggle = (day: number) => {
    const currentDays = formData.villainQuestionDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    updateField("villainQuestionDays", newDays);
  };

  // Custom questions handlers
  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      questionText: "",
      questionType: "text",
      options: ["", "", "", ""],
      showOnDays: [7],
    };
    updateField("customQuestions", [...formData.customQuestions, newQuestion]);
  };

  const updateCustomQuestion = (
    index: number,
    field: keyof CustomQuestion,
    value: CustomQuestion[keyof CustomQuestion]
  ) => {
    const updated = [...formData.customQuestions];
    updated[index] = { ...updated[index], [field]: value };
    updateField("customQuestions", updated);
  };

  const updateCustomQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...formData.customQuestions];
    const newOptions = [...updated[questionIndex].options];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    updateField("customQuestions", updated);
  };

  const addOptionToQuestion = (questionIndex: number) => {
    const updated = [...formData.customQuestions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: [...updated[questionIndex].options, ""],
    };
    updateField("customQuestions", updated);
  };

  const removeOptionFromQuestion = (questionIndex: number, optionIndex: number) => {
    const updated = [...formData.customQuestions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: updated[questionIndex].options.filter((_, i) => i !== optionIndex),
    };
    updateField("customQuestions", updated);
  };

  const toggleCustomQuestionDay = (questionIndex: number, day: number) => {
    const updated = [...formData.customQuestions];
    const currentDays = updated[questionIndex].showOnDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    updated[questionIndex] = { ...updated[questionIndex], showOnDays: newDays };
    updateField("customQuestions", updated);
  };

  const removeCustomQuestion = (index: number) => {
    updateField(
      "customQuestions",
      formData.customQuestions.filter((_, i) => i !== index)
    );
  };

  // Baseline questions handlers
  const substituteTemplateVars = (text: string) => {
    return text
      .replace(/\[productName\]/g, formData.productName || "your product")
      .replace(/\[villainVariable\]/g, formData.villainVariable || "this issue");
  };

  const addBaselineQuestion = () => {
    const newQuestion: BaselineQuestion = {
      id: `custom-baseline-${Date.now()}`,
      questionText: "",
      questionType: "text",
      required: true,
    };
    updateField("baselineQuestions", [...formData.baselineQuestions, newQuestion]);
  };

  const updateBaselineQuestion = (
    index: number,
    field: keyof BaselineQuestion,
    value: BaselineQuestion[keyof BaselineQuestion]
  ) => {
    const updated = [...formData.baselineQuestions];
    updated[index] = { ...updated[index], [field]: value };
    updateField("baselineQuestions", updated);
  };

  const updateBaselineQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...formData.baselineQuestions];
    const newOptions = [...(updated[questionIndex].options || [])];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    updateField("baselineQuestions", updated);
  };

  const addOptionToBaselineQuestion = (questionIndex: number) => {
    const updated = [...formData.baselineQuestions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: [...(updated[questionIndex].options || []), ""],
    };
    updateField("baselineQuestions", updated);
  };

  const removeOptionFromBaselineQuestion = (questionIndex: number, optionIndex: number) => {
    const updated = [...formData.baselineQuestions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex),
    };
    updateField("baselineQuestions", updated);
  };

  const removeBaselineQuestion = (index: number) => {
    updateField(
      "baselineQuestions",
      formData.baselineQuestions.filter((_, i) => i !== index)
    );
  };

  const resetBaselineQuestions = () => {
    updateField("baselineQuestions", DEFAULT_BASELINE_QUESTIONS);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStudy(study.id, formData);
    setIsSaving(false);
    router.push(`/studies/${study.id}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/studies/${study.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Edit Study</h1>
              <p className="text-sm text-muted-foreground">
                {formData.studyTitle || study.studyTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/studies/${study.id}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="col-span-3 space-y-4">
            {/* Product Information */}
            <Collapsible
              open={openSections.product}
              onOpenChange={() => toggleSection("product")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Product Information
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.product ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          value={formData.productName}
                          onChange={(e) =>
                            updateField("productName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productPrice">Price ($)</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          value={formData.productPrice}
                          onChange={(e) =>
                            updateField("productPrice", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <ImageUpload
                        value={formData.productImage}
                        onChange={(url) => updateField("productImage", url)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={formData.productDescription}
                        onChange={(e) =>
                          updateField("productDescription", e.target.value)
                        }
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productUrl">Product URL</Label>
                        <Input
                          id="productUrl"
                          value={formData.productUrl}
                          onChange={(e) =>
                            updateField("productUrl", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(val) => updateField("category", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Study Settings */}
            <Collapsible
              open={openSections.settings}
              onOpenChange={() => toggleSection("settings")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Study Settings</CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.settings ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rebateAmount">Rebate Amount ($)</Label>
                        <Input
                          id="rebateAmount"
                          type="number"
                          value={formData.rebateAmount}
                          onChange={(e) =>
                            updateField("rebateAmount", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="durationDays">Duration (Days)</Label>
                        <Input
                          id="durationDays"
                          type="number"
                          value={formData.durationDays}
                          onChange={(e) =>
                            updateField("durationDays", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalSpots">Total Spots</Label>
                        <Input
                          id="totalSpots"
                          type="number"
                          value={formData.totalSpots}
                          onChange={(e) =>
                            updateField("totalSpots", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Required Device</Label>
                        <Select
                          value={formData.requiredDevice}
                          onValueChange={(val) =>
                            updateField("requiredDevice", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEVICES.map((device) => (
                              <SelectItem
                                key={device.value}
                                value={device.value}
                              >
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Metrics to Track</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {METRICS.map((metric) => (
                          <div
                            key={metric.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={metric.id}
                              checked={formData.metricsToTrack.includes(
                                metric.id
                              )}
                              onCheckedChange={() =>
                                handleMetricToggle(metric.id)
                              }
                            />
                            <label
                              htmlFor={metric.id}
                              className="text-sm cursor-pointer"
                            >
                              {metric.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Baseline Questions */}
            <Collapsible
              open={openSections.baseline}
              onOpenChange={() => toggleSection("baseline")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-[#00D1C1]" />
                        Baseline Questions
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.baseline ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-600">
                        These questions are asked when a participant first enrolls in this study.
                        Use <code className="bg-blue-500/20 px-1 rounded">[productName]</code> and{" "}
                        <code className="bg-blue-500/20 px-1 rounded">[villainVariable]</code> as
                        placeholders that will be replaced with study-specific values.
                      </p>
                    </div>

                    <Collapsible open={isBaselineQuestionsOpen} onOpenChange={setIsBaselineQuestionsOpen}>
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm font-medium hover:text-[#00D1C1] transition-colors"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isBaselineQuestionsOpen ? "rotate-180" : ""
                            }`}
                          />
                          {formData.baselineQuestions.length} question{formData.baselineQuestions.length !== 1 ? "s" : ""} configured
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4 space-y-4">
                        {formData.baselineQuestions.map((question, qIndex) => (
                          <div key={question.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Question {qIndex + 1}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBaselineQuestion(qIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label>Question Text</Label>
                              <Input
                                value={question.questionText}
                                onChange={(e) =>
                                  updateBaselineQuestion(qIndex, "questionText", e.target.value)
                                }
                                placeholder="Enter your question..."
                              />
                              {(question.usesProductName || question.usesVillainVariable) && (
                                <p className="text-xs text-muted-foreground">
                                  Preview: {substituteTemplateVars(question.questionText)}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={question.questionType}
                                  onValueChange={(val) =>
                                    updateBaselineQuestion(
                                      qIndex,
                                      "questionType",
                                      val as BaselineQuestion["questionType"]
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text Response</SelectItem>
                                    <SelectItem value="voice_and_text">Voice & Text</SelectItem>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Required</Label>
                                <Select
                                  value={question.required ? "yes" : "no"}
                                  onValueChange={(val) =>
                                    updateBaselineQuestion(qIndex, "required", val === "yes")
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Required</SelectItem>
                                    <SelectItem value="no">Optional</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {question.questionType === "multiple_choice" && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                {(question.options || []).map((option, oIndex) => (
                                  <div key={oIndex} className="flex gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) =>
                                        updateBaselineQuestionOption(qIndex, oIndex, e.target.value)
                                      }
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                    {(question.options || []).length > 2 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOptionFromBaselineQuestion(qIndex, oIndex)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOptionToBaselineQuestion(qIndex)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                            )}

                            {/* Question Preview */}
                            {question.questionText && (
                              <div className="space-y-2 pt-2 border-t">
                                <Label className="text-xs text-muted-foreground">Preview</Label>
                                <div className="bg-[#111827] rounded-xl p-4 border border-gray-700">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0">
                                      <ClipboardList className="h-4 w-4 text-[#00D1C1]" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      <p className="text-white text-sm font-medium">
                                        {substituteTemplateVars(question.questionText)}
                                      </p>
                                      {question.questionType === "multiple_choice" && (
                                        <div className="space-y-1">
                                          {(question.options || [])
                                            .filter((o) => o.trim())
                                            .map((option, i) => (
                                              <div
                                                key={i}
                                                className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 text-sm"
                                              >
                                                {option}
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                      {question.questionType === "text" && (
                                        <div className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-500 text-sm">
                                          Type your answer...
                                        </div>
                                      )}
                                      {question.questionType === "voice_and_text" && (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 text-gray-400 text-sm">
                                          <Mic className="w-4 h-4" />
                                          <span>Tap to record or type...</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          onClick={addBaselineQuestion}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Baseline Question
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Reset to Defaults */}
                    <div className="flex justify-end pt-4 border-t">
                      <Button variant="outline" onClick={resetBaselineQuestions}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Check-in Questions */}
            <Collapsible
              open={openSections.checkin}
              onOpenChange={() => toggleSection("checkin")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>📋</span> Check-in Questions
                        <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.checkin ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {/* Weekly Hero Symptom Check-in */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold">Weekly Hero Symptom Check-in</h4>
                        <p className="text-xs text-muted-foreground">
                          Ask participants about their primary symptom on specific days
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="villainVariable">
                          Hero Symptom (Villain Variable)
                        </Label>
                      <p className="text-xs text-muted-foreground">
                        The symptom or problem your product helps solve (e.g., &quot;afternoon brain fog&quot;, &quot;poor sleep quality&quot;)
                      </p>
                      <Input
                        id="villainVariable"
                        value={formData.villainVariable}
                        onChange={(e) => updateField("villainVariable", e.target.value)}
                        placeholder="e.g., afternoon brain fog"
                      />
                    </div>

                    {/* Question Preview */}
                    {formData.villainVariable && (
                      <div className="space-y-3">
                        <Label>Question Preview</Label>
                        <div className="bg-[#111827] rounded-xl p-4 border border-gray-700">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[#00D1C1] text-sm">📊</span>
                            </div>
                            <div className="space-y-2 flex-1">
                              <p className="text-white text-sm font-medium">
                                How would you rate your {formData.villainVariable} today?
                              </p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <div
                                    key={n}
                                    className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center text-gray-400 text-sm"
                                  >
                                    {n}
                                  </div>
                                ))}
                              </div>
                              <p className="text-gray-500 text-xs">1 = Much worse • 5 = Much better</p>
                              <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                                <Mic className="w-3.5 h-3.5" />
                                <span>+ Add voice/text note (optional)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Question Schedule */}
                    {formData.villainVariable && (
                      <div className="space-y-3">
                        <Label>Question Schedule</Label>
                        <p className="text-xs text-muted-foreground">
                          Select which days to ask this question
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {DEFAULT_VILLAIN_DAYS.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleVillainDayToggle(day)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                formData.villainQuestionDays.includes(day)
                                  ? "bg-[#00D1C1] text-white"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              Day {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>

                    {/* Additional Custom Questions */}
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h4 className="text-sm font-semibold">Additional Questions</h4>
                        <p className="text-xs text-muted-foreground">
                          Add custom questions that can be shown on any day of the study
                        </p>
                      </div>
                      <Collapsible open={isCustomQuestionsOpen} onOpenChange={setIsCustomQuestionsOpen}>
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm font-medium hover:text-[#00D1C1] transition-colors"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isCustomQuestionsOpen ? "rotate-180" : ""
                              }`}
                            />
                            {formData.customQuestions.length} question{formData.customQuestions.length !== 1 ? 's' : ''} configured
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-4">
                          {formData.customQuestions.map((question, qIndex) => (
                            <div key={qIndex} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Question {qIndex + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCustomQuestion(qIndex)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label>Question Text</Label>
                                <Input
                                  value={question.questionText}
                                  onChange={(e) =>
                                    updateCustomQuestion(qIndex, "questionText", e.target.value)
                                  }
                                  placeholder="Enter your question..."
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={question.questionType}
                                  onValueChange={(val) =>
                                    updateCustomQuestion(
                                      qIndex,
                                      "questionType",
                                      val as CustomQuestion["questionType"]
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text Response</SelectItem>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="voice_and_text">Voice & Text</SelectItem>
                                    <SelectItem value="likert_scale">Likert Scale (1-10)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {question.questionType === "multiple_choice" && (
                                <div className="space-y-2">
                                  <Label>Options</Label>
                                  {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex gap-2">
                                      <Input
                                        value={option}
                                        onChange={(e) =>
                                          updateCustomQuestionOption(qIndex, oIndex, e.target.value)
                                        }
                                        placeholder={`Option ${oIndex + 1}`}
                                      />
                                      {question.options.length > 2 && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeOptionFromQuestion(qIndex, oIndex)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOptionToQuestion(qIndex)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Option
                                  </Button>
                                </div>
                              )}

                              {question.questionType === "likert_scale" && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Scale Range</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="1"
                                          max="5"
                                          value={question.likertMin || 1}
                                          onChange={(e) =>
                                            updateCustomQuestion(qIndex, "likertMin", parseInt(e.target.value) || 1)
                                          }
                                          className="w-16"
                                        />
                                        <span className="text-muted-foreground">to</span>
                                        <Input
                                          type="number"
                                          min="5"
                                          max="10"
                                          value={question.likertMax || 10}
                                          onChange={(e) =>
                                            updateCustomQuestion(qIndex, "likertMax", parseInt(e.target.value) || 10)
                                          }
                                          className="w-16"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Low End Label</Label>
                                      <Input
                                        placeholder="e.g., Strongly Disagree"
                                        value={question.likertMinLabel || ""}
                                        onChange={(e) =>
                                          updateCustomQuestion(qIndex, "likertMinLabel", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>High End Label</Label>
                                      <Input
                                        placeholder="e.g., Strongly Agree"
                                        value={question.likertMaxLabel || ""}
                                        onChange={(e) =>
                                          updateCustomQuestion(qIndex, "likertMaxLabel", e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label>Show on Days</Label>
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => toggleCustomQuestionDay(qIndex, day)}
                                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                                        question.showOnDays.includes(day)
                                          ? "bg-[#00D1C1] text-white"
                                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Question Preview */}
                              {question.questionText && (
                                <div className="space-y-2 pt-2 border-t">
                                  <Label className="text-xs text-muted-foreground">Preview</Label>
                                  <div className="bg-[#111827] rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#00D1C1] text-sm">❓</span>
                                      </div>
                                      <div className="space-y-2 flex-1">
                                        <p className="text-white text-sm font-medium">
                                          {question.questionText}
                                        </p>
                                        {question.questionType === "multiple_choice" && (
                                          <div className="space-y-1">
                                            {question.options
                                              .filter((o) => o.trim())
                                              .map((option, i) => (
                                                <div
                                                  key={i}
                                                  className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 text-sm"
                                                >
                                                  {option}
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                        {question.questionType === "text" && (
                                          <div className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-500 text-sm">
                                            Type your answer...
                                          </div>
                                        )}
                                        {question.questionType === "voice_and_text" && (
                                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 text-gray-400 text-sm">
                                            <Mic className="w-4 h-4" />
                                            <span>Tap to record or type...</span>
                                          </div>
                                        )}
                                        {question.questionType === "likert_scale" && (
                                          <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-400 px-1">
                                              <span>{question.likertMinLabel || "Strongly Disagree"}</span>
                                              <span>{question.likertMaxLabel || "Strongly Agree"}</span>
                                            </div>
                                            <div className="flex justify-between gap-1">
                                              {Array.from(
                                                { length: (question.likertMax || 10) - (question.likertMin || 1) + 1 },
                                                (_, i) => (question.likertMin || 1) + i
                                              ).map((num) => (
                                                <div
                                                  key={num}
                                                  className={`flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                                                    num === 7
                                                      ? "bg-[#00D1C1] text-white"
                                                      : "bg-gray-800 text-gray-400"
                                                  }`}
                                                >
                                                  {num}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                                          <Mic className="w-3.5 h-3.5" />
                                          <span>+ Add voice/text note (optional)</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            onClick={addCustomQuestion}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Custom Question
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Study Content */}
            <Collapsible
              open={openSections.content}
              onOpenChange={() => toggleSection("content")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Study Content</CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.content ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="studyTitle">Study Title</Label>
                      <Input
                        id="studyTitle"
                        value={formData.studyTitle}
                        onChange={(e) =>
                          updateField("studyTitle", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hookQuestion">Hook Question</Label>
                      <Input
                        id="hookQuestion"
                        value={formData.hookQuestion}
                        onChange={(e) =>
                          updateField("hookQuestion", e.target.value)
                        }
                        placeholder="A question that hooks participants..."
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* What You'll Discover */}
            <Collapsible
              open={openSections.discover}
              onOpenChange={() => toggleSection("discover")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>✨</span> What You&apos;ll Discover
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.discover ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.discoverItems.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Item {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDiscoverItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Question"
                          value={item.question}
                          onChange={(e) =>
                            updateDiscoverItem(index, "question", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Explanation"
                          value={item.explanation}
                          onChange={(e) =>
                            updateDiscoverItem(
                              index,
                              "explanation",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addDiscoverItem}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Discovery Item
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Daily Routine */}
            <Collapsible
              open={openSections.routine}
              onOpenChange={() => toggleSection("routine")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>📋</span> Daily Routine
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.routine ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.dailyRoutine.map((step, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Step {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRoutineStep(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Action"
                          value={step.action}
                          onChange={(e) =>
                            updateRoutineStep(index, "action", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Details"
                          value={step.details}
                          onChange={(e) =>
                            updateRoutineStep(index, "details", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addRoutineStep}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Routine Step
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* What You'll Get */}
            <Collapsible
              open={openSections.value}
              onOpenChange={() => toggleSection("value")}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>🎁</span> What You&apos;ll Get
                      </CardTitle>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSections.value ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.whatYouGet.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Reward {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeValueItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Item name"
                            value={item.item}
                            onChange={(e) =>
                              updateValueItem(index, "item", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Value (e.g. $25)"
                            value={item.value}
                            onChange={(e) =>
                              updateValueItem(index, "value", e.target.value)
                            }
                          />
                        </div>
                        <Input
                          placeholder="Note (optional)"
                          value={item.note}
                          onChange={(e) =>
                            updateValueItem(index, "note", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addValueItem}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reward Item
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Right: Live Preview */}
          <div className="col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Live Preview
                </h3>
              </div>

              {/* Card Preview */}
              <div className="flex justify-center">
                <StudyPreview
                  productName={formData.productName}
                  productImage={formData.productImage}
                  category={formData.category}
                  rebateAmount={formData.rebateAmount}
                  durationDays={formData.durationDays}
                  totalSpots={formData.totalSpots}
                  requiredDevice={formData.requiredDevice}
                  studyTitle={formData.studyTitle}
                  hookQuestion={formData.hookQuestion}
                  villainVariable={formData.villainVariable}
                />
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Scroll down to see the full details preview
                </p>
              </div>

              {/* Details Preview */}
              <div className="flex justify-center">
                <StudyDetailsPreview
                  productName={formData.productName}
                  productImage={formData.productImage}
                  studyTitle={formData.studyTitle}
                  hookQuestion={formData.hookQuestion}
                  rebateAmount={formData.rebateAmount}
                  durationDays={formData.durationDays}
                  totalSpots={formData.totalSpots}
                  requiredDevice={formData.requiredDevice}
                  discoverItems={formData.discoverItems}
                  dailyRoutine={formData.dailyRoutine}
                  whatYouGet={formData.whatYouGet}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
