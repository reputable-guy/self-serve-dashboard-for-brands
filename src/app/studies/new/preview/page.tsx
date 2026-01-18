/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StudyPreview } from "@/components/study-preview";
import { StudyDetailsPreview } from "@/components/study-details-preview";
import { useStudyForm, DiscoverItem, RoutineStep, ValueItem } from "@/lib/study-context";
import { useStudies } from "@/lib/studies-store";
import { generateStudyContent } from "@/lib/generate-study-content";
import { ChevronDown, Sparkles, Plus, Trash2, Loader2, Check } from "lucide-react";

export default function CreateStudyStep3() {
  const router = useRouter();
  const { formData, updateField, updateFields } = useStudyForm();
  const { addStudy } = useStudies();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openSections, setOpenSections] = useState({
    title: true,
    discover: true,
    routine: true,
    value: true,
  });

  // Generate content on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const content = generateStudyContent({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: formData.productPrice,
        category: formData.category,
        rebateAmount: formData.rebateAmount,
        durationDays: formData.durationDays,
        metricsToTrack: formData.metricsToTrack,
      });
      updateFields(content);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    router.push("/studies/new/settings");
  };

  const handleCreateStudy = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Save the study
    const studyId = addStudy(formData);
    setIsCreating(false);
    setIsSuccess(true);
    // Redirect to the study details page
    setTimeout(() => {
      router.push(`/studies/${studyId}`);
    }, 1500);
  };

  const handleRegenerate = (section: "title" | "discover" | "routine") => {
    const content = generateStudyContent({
      productName: formData.productName,
      productDescription: formData.productDescription,
      productPrice: formData.productPrice,
      category: formData.category,
      rebateAmount: formData.rebateAmount,
      durationDays: formData.durationDays,
      metricsToTrack: formData.metricsToTrack,
    });

    if (section === "title") {
      updateFields({
        studyTitle: content.studyTitle,
        hookQuestion: content.hookQuestion,
      });
    } else if (section === "discover") {
      updateField("discoverItems", content.discoverItems);
    } else if (section === "routine") {
      updateField("dailyRoutine", content.dailyRoutine);
    }
  };

  const updateDiscoverItem = (index: number, field: keyof DiscoverItem, value: string) => {
    const newItems = [...formData.discoverItems];
    newItems[index] = { ...newItems[index], [field]: value };
    updateField("discoverItems", newItems);
  };

  const addDiscoverItem = () => {
    updateField("discoverItems", [
      ...formData.discoverItems,
      { question: "", explanation: "" },
    ]);
  };

  const removeDiscoverItem = (index: number) => {
    updateField(
      "discoverItems",
      formData.discoverItems.filter((_, i) => i !== index)
    );
  };

  const updateRoutineStep = (index: number, field: keyof RoutineStep, value: string) => {
    const newSteps = [...formData.dailyRoutine];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateField("dailyRoutine", newSteps);
  };

  const addRoutineStep = () => {
    updateField("dailyRoutine", [
      ...formData.dailyRoutine,
      { action: "", details: "" },
    ]);
  };

  const removeRoutineStep = (index: number) => {
    updateField(
      "dailyRoutine",
      formData.dailyRoutine.filter((_, i) => i !== index)
    );
  };

  const updateValueItem = (index: number, field: keyof ValueItem, value: string) => {
    const newItems = [...formData.whatYouGet];
    newItems[index] = { ...newItems[index], [field]: value };
    updateField("whatYouGet", newItems);
  };

  const addValueItem = () => {
    updateField("whatYouGet", [
      ...formData.whatYouGet,
      { item: "", value: "", note: "" },
    ]);
  };

  const removeValueItem = (index: number) => {
    updateField(
      "whatYouGet",
      formData.whatYouGet.filter((_, i) => i !== index)
    );
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00D1C1]/10 mb-4">
            <Loader2 className="w-8 h-8 text-[#00D1C1] animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Generating your study content...</h2>
          <p className="text-muted-foreground">
            Creating personalized content based on your product and settings
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00D1C1] mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Study Created!</h2>
          <p className="text-muted-foreground">Redirecting to your studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-muted-foreground">
              Step 3 of 3: Preview & Edit
            </h1>
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Form Section - 60% */}
          <div className="flex-[3] space-y-4">
            {/* Title & Hook Section */}
            <Collapsible open={openSections.title} onOpenChange={() => toggleSection("title")}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Study Title & Hook</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openSections.title ? "rotate-180" : ""
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
                        onChange={(e) => updateField("studyTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hookQuestion">Hook Question</Label>
                      <Input
                        id="hookQuestion"
                        value={formData.hookQuestion}
                        onChange={(e) => updateField("hookQuestion", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate("title")}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Regenerate
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* What You'll Discover Section */}
            <Collapsible open={openSections.discover} onOpenChange={() => toggleSection("discover")}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">What You&apos;ll Discover</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openSections.discover ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.discoverItems.map((item, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeDiscoverItem(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Question</Label>
                          <Input
                            value={item.question}
                            onChange={(e) => updateDiscoverItem(index, "question", e.target.value)}
                            placeholder="Does YOUR sleep quality actually improve?"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Explanation</Label>
                          <Input
                            value={item.explanation}
                            onChange={(e) => updateDiscoverItem(index, "explanation", e.target.value)}
                            placeholder="Track real changes in your deep sleep..."
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={addDiscoverItem}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add item
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerate("discover")}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Daily Routine Section */}
            <Collapsible open={openSections.routine} onOpenChange={() => toggleSection("routine")}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Daily Routine</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openSections.routine ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.dailyRoutine.map((step, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeRoutineStep(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                            <span className="text-xs text-[#00D1C1] font-medium">{index + 1}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Action</Label>
                          <Input
                            value={step.action}
                            onChange={(e) => updateRoutineStep(index, "action", e.target.value)}
                            placeholder="Take your supplement"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Details</Label>
                          <Input
                            value={step.details}
                            onChange={(e) => updateRoutineStep(index, "details", e.target.value)}
                            placeholder="One capsule before bed as directed"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={addRoutineStep}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add step
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerate("routine")}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* What You'll Get Section */}
            <Collapsible open={openSections.value} onOpenChange={() => toggleSection("value")}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">What You&apos;ll Get</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openSections.value ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {formData.whatYouGet.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start p-3 border rounded-lg relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeValueItem(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <div className="flex-1 space-y-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Item</Label>
                            <Input
                              value={item.item}
                              onChange={(e) => updateValueItem(index, "item", e.target.value)}
                              placeholder="Product name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Value</Label>
                              <Input
                                value={item.value}
                                onChange={(e) => updateValueItem(index, "value", e.target.value)}
                                placeholder="$99"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Note</Label>
                              <Input
                                value={item.note}
                                onChange={(e) => updateValueItem(index, "note", e.target.value)}
                                placeholder="Yours to keep"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addValueItem}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add item
                    </Button>

                    {/* Total Value Display */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-medium">Total Value</span>
                      <span className="text-xl font-bold text-[#00D1C1]">
                        $
                        {formData.whatYouGet
                          .reduce((sum, item) => {
                            const match = item.value.match(/\$?(\d+)/);
                            return sum + (match ? parseInt(match[1]) : 0);
                          }, 0)}
                        +
                      </span>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleCreateStudy}
                disabled={isCreating}
                className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Study...
                  </>
                ) : (
                  "Create Study"
                )}
              </Button>
            </div>
          </div>

          {/* Preview Section - 40% */}
          <div className="flex-[2]">
            <div className="sticky top-8">
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="card">Card View</TabsTrigger>
                  <TabsTrigger value="details">Details View</TabsTrigger>
                </TabsList>
                <TabsContent value="card">
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
                  />
                </TabsContent>
                <TabsContent value="details">
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
