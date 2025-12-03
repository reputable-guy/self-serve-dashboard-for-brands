"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StudyPreview } from "@/components/study-preview";
import { useStudyForm, CustomQuestion } from "@/lib/study-context";
import { DEVICES, METRICS, DEFAULT_VILLAIN_DAYS } from "@/lib/constants";
import { ChevronDown, Plus, Trash2, Mic } from "lucide-react";

export default function CreateStudyStep2() {
  const router = useRouter();
  const { formData, updateField } = useStudyForm();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCustomQuestionsOpen, setIsCustomQuestionsOpen] = useState(false);

  const handleMetricToggle = (metricId: string) => {
    const currentMetrics = formData.metricsToTrack;
    const newMetrics = currentMetrics.includes(metricId)
      ? currentMetrics.filter((m) => m !== metricId)
      : [...currentMetrics, metricId];
    updateField("metricsToTrack", newMetrics);
  };

  const handleBack = () => {
    router.push("/studies/new");
  };

  const handleContinue = () => {
    router.push("/studies/new/preview");
  };

  const handleVillainDayToggle = (day: number) => {
    const currentDays = formData.villainQuestionDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    updateField("villainQuestionDays", newDays);
  };

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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-muted-foreground">
              Step 2 of 3: Study Settings
            </h1>
            <span className="text-sm text-muted-foreground">66%</span>
          </div>
          <Progress value={66} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Form Section - 60% */}
          <div className="flex-[3]">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Configure your study
                </h2>

                <div className="space-y-6">
                  {/* Rebate Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="rebateAmount">Rebate Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="rebateAmount"
                        type="text"
                        inputMode="decimal"
                        placeholder="100.00"
                        value={formData.rebateAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          updateField("rebateAmount", value);
                        }}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Amount participants receive upon completing the study
                    </p>
                  </div>

                  {/* Study Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="durationDays">Study Duration</Label>
                    <div className="relative">
                      <Input
                        id="durationDays"
                        type="number"
                        min="7"
                        max="90"
                        value={formData.durationDays}
                        onChange={(e) => updateField("durationDays", e.target.value)}
                        className="pr-14"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        days
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How long participants will track their results
                    </p>
                  </div>

                  {/* Number of Spots */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSpots">Available Spots</Label>
                    <Input
                      id="totalSpots"
                      type="number"
                      min="1"
                      placeholder="50"
                      value={formData.totalSpots}
                      onChange={(e) => updateField("totalSpots", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum participants for this study
                    </p>
                  </div>

                  {/* Required Device */}
                  <div className="space-y-2">
                    <Label htmlFor="requiredDevice">Required Wearable</Label>
                    <Select
                      value={formData.requiredDevice}
                      onValueChange={(value) => updateField("requiredDevice", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select required device" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEVICES.map((device) => (
                          <SelectItem key={device.value} value={device.value}>
                            {device.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Metrics to Track */}
                  <div className="space-y-3">
                    <Label>Metrics to Track</Label>
                    <p className="text-xs text-muted-foreground -mt-1">
                      Select the health metrics relevant to your product
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {METRICS.map((metric) => (
                        <label
                          key={metric.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            id={metric.id}
                            checked={formData.metricsToTrack.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <span className="text-lg">{metric.icon}</span>
                          <span className="text-sm font-medium">{metric.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Check-in Questions */}
                  <Collapsible open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                    <Card className="border-dashed">
                      <CollapsibleTrigger asChild>
                        <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                <span>📋</span> Check-in Questions
                                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                Configure weekly symptom check-ins and custom questions for any day
                              </p>
                            </div>
                            <ChevronDown className={`h-5 w-5 transition-transform ${isCheckInOpen ? "rotate-180" : ""}`} />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-6">
                          {/* Weekly Hero Symptom Check-in */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold">Weekly Hero Symptom Check-in</h4>
                              <p className="text-xs text-muted-foreground">
                                Ask participants about their primary symptom on specific days
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="villainVariable">What problem does your product solve?</Label>
                            <Input
                              id="villainVariable"
                              maxLength={50}
                              placeholder="e.g., afternoon brain fog, poor sleep, stress, bloating"
                              value={formData.villainVariable}
                              onChange={(e) => updateField("villainVariable", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              This will be inserted into weekly questions participants see
                            </p>
                          </div>

                          {/* Question Preview Card */}
                          {formData.villainVariable && (
                            <div className="space-y-2">
                              <Label>Question Preview</Label>
                              <div className="bg-[#111827] rounded-xl p-4 space-y-4">
                                <p className="text-white text-sm">
                                  This week, did you notice any changes regarding your{" "}
                                  <span className="text-[#00D1C1] font-medium">
                                    {formData.villainVariable || "symptom"}
                                  </span>
                                  ?
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {["No change", "A little better", "Much better", "Worse"].map((option) => (
                                    <div
                                      key={option}
                                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs text-center"
                                    >
                                      {option}
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-3 border-t border-gray-700">
                                  <p className="text-gray-400 text-xs mb-2">Tell us more. What felt different?</p>
                                  <div className="flex gap-2">
                                    <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-gray-500 text-xs">
                                      Type your response...
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#00D1C1] flex items-center justify-center">
                                      <Mic className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Question Schedule */}
                          <div className="space-y-2">
                            <Label>When should this question appear?</Label>
                            <div className="flex flex-wrap gap-2">
                              {DEFAULT_VILLAIN_DAYS.map((day) => (
                                <label
                                  key={day}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <Checkbox
                                    checked={formData.villainQuestionDays.includes(day)}
                                    onCheckedChange={() => handleVillainDayToggle(day)}
                                  />
                                  <span className="text-sm">Day {day}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Questions appear after the daily check-in on selected days
                            </p>
                          </div>
                          </div>

                          {/* Additional Questions */}
                          <div className="space-y-4 pt-4 border-t">
                            <div>
                              <h4 className="text-sm font-semibold">Additional Questions</h4>
                              <p className="text-xs text-muted-foreground">
                                Add custom questions that can be shown on any day of the study
                              </p>
                            </div>
                            <Collapsible open={isCustomQuestionsOpen} onOpenChange={setIsCustomQuestionsOpen}>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <span className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    {formData.customQuestions.length} question{formData.customQuestions.length !== 1 ? 's' : ''} configured
                                  </span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${isCustomQuestionsOpen ? "rotate-180" : ""}`} />
                                </Button>
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
                                    <Textarea
                                      placeholder="Enter your question..."
                                      value={question.questionText}
                                      onChange={(e) =>
                                        updateCustomQuestion(qIndex, "questionText", e.target.value)
                                      }
                                      rows={2}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Question Type</Label>
                                    <Select
                                      value={question.questionType}
                                      onValueChange={(value) =>
                                        updateCustomQuestion(
                                          qIndex,
                                          "questionType",
                                          value as CustomQuestion["questionType"]
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                        <SelectItem value="text">Text Response</SelectItem>
                                        <SelectItem value="voice_and_text">Voice + Text</SelectItem>
                                        <SelectItem value="likert_scale">Likert Scale (1-10)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {question.questionType === "multiple_choice" && (
                                    <div className="space-y-2">
                                      <Label>Answer Options</Label>
                                      {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex gap-2">
                                          <Input
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={option}
                                            onChange={(e) =>
                                              updateCustomQuestionOption(qIndex, oIndex, e.target.value)
                                            }
                                          />
                                          {question.options.length > 2 && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeOptionFromQuestion(qIndex, oIndex)}
                                            >
                                              <Trash2 className="h-4 w-4 text-muted-foreground" />
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
                                    <div className="flex flex-wrap gap-2">
                                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                        <button
                                          key={day}
                                          type="button"
                                          onClick={() => toggleCustomQuestionDay(qIndex, day)}
                                          className={`w-8 h-8 text-xs rounded-md border transition-colors ${
                                            question.showOnDays.includes(day)
                                              ? "bg-[#00D1C1] text-white border-[#00D1C1]"
                                              : "bg-background hover:bg-muted/50"
                                          }`}
                                        >
                                          {day}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Live Preview for Custom Question */}
                                  {question.questionText && (
                                    <div className="space-y-2">
                                      <Label>Preview</Label>
                                      <div className="bg-[#111827] rounded-xl p-4 space-y-4">
                                        <p className="text-white text-sm">{question.questionText}</p>

                                        {question.questionType === "multiple_choice" && (
                                          <div className="grid grid-cols-2 gap-2">
                                            {question.options.filter(o => o).map((opt, oIdx) => (
                                              <div
                                                key={oIdx}
                                                className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs text-center"
                                              >
                                                {opt}
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {question.questionType === "text" && (
                                          <div className="bg-gray-800 rounded-lg px-3 py-2 text-gray-500 text-xs">
                                            Type your response...
                                          </div>
                                        )}

                                        {question.questionType === "voice_and_text" && (
                                          <div className="flex gap-2">
                                            <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-gray-500 text-xs">
                                              Type your response...
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-[#00D1C1] flex items-center justify-center">
                                              <Mic className="w-4 h-4 text-white" />
                                            </div>
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

                                        {/* Always show follow-up text/voice option */}
                                        <div className="pt-3 border-t border-gray-700">
                                          <p className="text-gray-400 text-xs mb-2">Tell us more (optional)</p>
                                          <div className="flex gap-2">
                                            <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-gray-500 text-xs">
                                              Add more context...
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-[#00D1C1] flex items-center justify-center">
                                              <Mic className="w-4 h-4 text-white" />
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
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                  >
                    Continue to Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - 40% */}
          <div className="flex-[2]">
            <div className="sticky top-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live Preview
              </h3>
              <StudyPreview
                productName={formData.productName}
                productImage={formData.productImage}
                category={formData.category}
                rebateAmount={formData.rebateAmount}
                durationDays={formData.durationDays}
                totalSpots={formData.totalSpots}
                requiredDevice={formData.requiredDevice}
                villainVariable={formData.villainVariable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
