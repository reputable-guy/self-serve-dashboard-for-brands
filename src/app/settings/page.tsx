"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  User,
  UserCircle,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Calendar,
  ClipboardList,
  Camera,
} from "lucide-react";
import {
  ProfileQuestion,
  loadProfileQuestions,
  saveProfileQuestions,
  resetProfileQuestions,
} from "@/lib/profile-config";
import {
  DemographicsQuestion,
  loadDemographicsQuestions,
  saveDemographicsQuestions,
  resetDemographicsQuestions,
} from "@/lib/demographics-config";
import {
  REPUTABLE_ASSESSMENTS,
  CATEGORY_CONFIGS,
  getScorableQuestions,
  TierLevel,
  AssessmentQuestion,
} from "@/lib/assessments";
import { Users } from "lucide-react";

// Helper function to get response type display label
function getResponseTypeLabel(responseType: string): string {
  switch (responseType) {
    case 'scale_5': return '5-point scale';
    case 'scale_10': return '10-point scale';
    case 'scale_11': return '0-10 scale';
    case 'frequency_5': return '5-point frequency';
    case 'frequency_4': return '4-point frequency (GAD-7)';
    case 'open_text': return 'Open text';
    case 'photo': return 'Photo upload';
    case 'numeric': return 'Numeric';
    default: return responseType;
  }
}

// Helper to get tier color
function getTierColor(tier: TierLevel): string {
  switch (tier) {
    case 1: return 'bg-blue-100 text-blue-700';
    case 2: return 'bg-purple-100 text-purple-700';
    case 3: return 'bg-green-100 text-green-700';
    case 4: return 'bg-orange-100 text-orange-700';
  }
}

export default function SettingsPage() {
  const [profileQuestions, setProfileQuestions] = useState<ProfileQuestion[]>([]);
  const [demographicsQuestions, setDemographicsQuestions] = useState<DemographicsQuestion[]>([]);
  const [isProfileQuestionsOpen, setIsProfileQuestionsOpen] = useState(true);
  const [isDemographicsOpen, setIsDemographicsOpen] = useState(false);
  const [isAssessmentsOpen, setIsAssessmentsOpen] = useState(false);
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [hasDemographicsChanges, setHasDemographicsChanges] = useState(false);

  // Toggle assessment expansion
  const toggleAssessment = (assessmentId: string) => {
    setExpandedAssessments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assessmentId)) {
        newSet.delete(assessmentId);
      } else {
        newSet.add(assessmentId);
      }
      return newSet;
    });
  };

  // Get categories using an assessment
  const getCategoriesForAssessment = (assessmentId: string) => {
    return CATEGORY_CONFIGS.filter(c => c.assessmentId === assessmentId);
  };

  // Load profile questions and demographics on mount
  useEffect(() => {
    setProfileQuestions(loadProfileQuestions());
    setDemographicsQuestions(loadDemographicsQuestions());
  }, []);

  const handleSave = () => {
    saveProfileQuestions(profileQuestions);
    setHasChanges(false);
  };

  const handleReset = () => {
    const defaults = resetProfileQuestions();
    setProfileQuestions(defaults);
    setHasChanges(false);
  };

  // Demographics handlers
  const handleDemographicsSave = () => {
    saveDemographicsQuestions(demographicsQuestions);
    setHasDemographicsChanges(false);
  };

  const handleDemographicsReset = () => {
    const defaults = resetDemographicsQuestions();
    setDemographicsQuestions(defaults);
    setHasDemographicsChanges(false);
  };

  const updateDemographicsQuestion = (index: number, field: keyof DemographicsQuestion, value: string | string[] | boolean) => {
    setDemographicsQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasDemographicsChanges(true);
  };

  const addDemographicsQuestion = () => {
    const newQuestion: DemographicsQuestion = {
      id: `custom-demo-${Date.now()}`,
      questionText: "",
      questionType: "multiple_choice",
      options: [],
      fieldKey: `custom_${Date.now()}`,
      required: false,
      enabled: true,
    };
    setDemographicsQuestions((prev) => [...prev, newQuestion]);
    setHasDemographicsChanges(true);
  };

  const removeDemographicsQuestion = (index: number) => {
    setDemographicsQuestions((prev) => prev.filter((_, i) => i !== index));
    setHasDemographicsChanges(true);
  };

  const updateDemographicsOption = (questionIndex: number, optionIndex: number, value: string) => {
    setDemographicsQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[questionIndex].options || [])];
      options[optionIndex] = value;
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasDemographicsChanges(true);
  };

  const addDemographicsOption = (questionIndex: number) => {
    setDemographicsQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[questionIndex].options || []), ""];
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasDemographicsChanges(true);
  };

  const removeDemographicsOption = (questionIndex: number, optionIndex: number) => {
    setDemographicsQuestions((prev) => {
      const updated = [...prev];
      const options = (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex);
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasDemographicsChanges(true);
  };

  const updateQuestion = (index: number, field: keyof ProfileQuestion, value: string | number | string[] | boolean) => {
    setProfileQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasChanges(true);
  };

  const addQuestion = () => {
    const newQuestion: ProfileQuestion = {
      id: `custom-${Date.now()}`,
      questionText: "",
      questionType: "text",
      collectOnDay: profileQuestions.length + 1,
      fieldKey: `custom_${Date.now()}`,
      required: true,
    };
    setProfileQuestions((prev) => [...prev, newQuestion]);
    setHasChanges(true);
  };

  const removeQuestion = (index: number) => {
    setProfileQuestions((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setProfileQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[questionIndex].options || [])];
      options[optionIndex] = value;
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasChanges(true);
  };

  const addOption = (questionIndex: number) => {
    setProfileQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[questionIndex].options || []), ""];
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasChanges(true);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setProfileQuestions((prev) => {
      const updated = [...prev];
      const options = (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex);
      updated[questionIndex] = { ...updated[questionIndex], options };
      return updated;
    });
    setHasChanges(true);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your brand profile and platform preferences.
        </p>
      </div>

      {/* Profile Questions Section */}
      <Collapsible open={isProfileQuestionsOpen} onOpenChange={setIsProfileQuestionsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-[#00D1C1]" />
                  Participant Profile Questions
                </CardTitle>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isProfileQuestionsOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-600">
                  These questions are asked progressively during a participant&apos;s first study to build their profile.
                  Once collected, this information is reused across all future studies.
                </p>
              </div>

              {profileQuestions.map((question, qIndex) => (
                <div key={question.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-[#00D1C1]" />
                      </div>
                      <span className="text-sm font-medium">Day {question.collectOnDay}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      placeholder="Enter your question..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.questionType}
                        onValueChange={(value) =>
                          updateQuestion(qIndex, "questionType", value as ProfileQuestion["questionType"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Response</SelectItem>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="likert_scale">Likert Scale (1-10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Collect on Day</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={question.collectOnDay}
                        onChange={(e) => updateQuestion(qIndex, "collectOnDay", parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  {question.questionType === "multiple_choice" && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {(question.options || []).map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(qIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Profile Question
              </Button>

              {/* Save/Reset Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Demographics Questions Section */}
      <Collapsible open={isDemographicsOpen} onOpenChange={setIsDemographicsOpen}>
        <Card className="mt-6">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#00D1C1]" />
                  Demographic Questions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {demographicsQuestions.filter(q => q.enabled).length} enabled
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isDemographicsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-600">
                  Configure demographic questions asked during study enrollment. These help build richer participant profiles
                  for more credible verified stories. Toggle questions on/off to customize what data is collected.
                </p>
              </div>

              {demographicsQuestions.map((question, qIndex) => (
                <div key={question.id} className={`p-4 border rounded-lg space-y-4 ${question.enabled ? 'bg-muted/30' : 'bg-muted/10 opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={question.enabled}
                          onChange={(e) => updateDemographicsQuestion(qIndex, "enabled", e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-[#00D1C1] focus:ring-[#00D1C1]"
                        />
                        <span className="text-sm font-medium">
                          {question.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {question.fieldKey}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDemographicsQuestion(qIndex)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      value={question.questionText}
                      onChange={(e) => updateDemographicsQuestion(qIndex, "questionText", e.target.value)}
                      placeholder="Enter your question..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.questionType}
                        onValueChange={(value) =>
                          updateDemographicsQuestion(qIndex, "questionType", value as DemographicsQuestion["questionType"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Response</SelectItem>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Required</Label>
                      <Select
                        value={question.required ? "yes" : "no"}
                        onValueChange={(value) =>
                          updateDemographicsQuestion(qIndex, "required", value === "yes")
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
                            onChange={(e) => updateDemographicsOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDemographicsOption(qIndex, oIndex)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addDemographicsOption(qIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addDemographicsQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Demographic Question
              </Button>

              {/* Save/Reset Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleDemographicsReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleDemographicsSave}
                  disabled={!hasDemographicsChanges}
                  className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Assessments Section */}
      <Collapsible open={isAssessmentsOpen} onOpenChange={setIsAssessmentsOpen}>
        <Card className="mt-6">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#00D1C1]" />
                  Assessments Library
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {REPUTABLE_ASSESSMENTS.length} assessments
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isAssessmentsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-600">
                  These assessments are used to measure participant outcomes. Each is inspired by validated scientific instruments
                  and uses a 0-100 normalized scoring system for consistent comparison across categories.
                </p>
              </div>

              {/* Tier Legend */}
              <div className="flex flex-wrap gap-2 pb-4 border-b">
                <Badge className={getTierColor(1)}>Tier 1: Wearables Primary</Badge>
                <Badge className={getTierColor(2)}>Tier 2: Co-Primary</Badge>
                <Badge className={getTierColor(3)}>Tier 3: Assessment Primary</Badge>
                <Badge className={getTierColor(4)}>Tier 4: Assessment Only</Badge>
              </div>

              {/* Assessment List */}
              {REPUTABLE_ASSESSMENTS.map((assessment) => {
                const categories = getCategoriesForAssessment(assessment.id);
                void categories; // Categories available for future tier display
                const scorableCount = getScorableQuestions(assessment).length;
                const isExpanded = expandedAssessments.has(assessment.id);

                return (
                  <div key={assessment.id} className="border rounded-lg overflow-hidden">
                    {/* Assessment Header */}
                    <button
                      onClick={() => toggleAssessment(assessment.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                          <ClipboardList className="h-5 w-5 text-[#00D1C1]" />
                        </div>
                        <div>
                          <div className="font-medium">{assessment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {assessment.shortName} • {assessment.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex gap-1">
                            {categories.map(cat => (
                              <Badge key={cat.value} className={`text-xs ${getTierColor(cat.tier)}`}>
                                {cat.label}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {scorableCount} scored questions • Check-in: Days {assessment.checkInDays.join(', ')}
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {/* Assessment Questions (Expanded) */}
                    {isExpanded && (
                      <div className="border-t bg-muted/30 p-4">
                        <div className="text-xs text-muted-foreground mb-3">
                          Inspired by: {assessment.inspiredBy}
                          {assessment.requiresPhotos && (
                            <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                              <Camera className="h-3 w-3" /> Requires photos
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {assessment.questions.map((question: AssessmentQuestion, qIndex: number) => (
                            <div
                              key={question.id}
                              className={`p-3 rounded border bg-background ${
                                question.isPrimary ? 'border-[#00D1C1] ring-1 ring-[#00D1C1]/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-muted-foreground font-mono w-6">
                                  Q{qIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="text-sm">
                                    {question.text}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {getResponseTypeLabel(question.responseType)}
                                    </Badge>
                                    {question.isPrimary && (
                                      <Badge className="text-xs bg-[#00D1C1] text-white">
                                        Primary Metric
                                      </Badge>
                                    )}
                                    {question.reverseScored && (
                                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                        Reverse scored
                                      </Badge>
                                    )}
                                    {question.dayOnly && (
                                      <Badge variant="outline" className="text-xs">
                                        Day {question.dayOnly.join(', ')} only
                                      </Badge>
                                    )}
                                    {question.responseType === 'open_text' && (
                                      <Badge variant="outline" className="text-xs text-gray-500">
                                        Not scored
                                      </Badge>
                                    )}
                                    {question.responseType === 'photo' && (
                                      <Badge variant="outline" className="text-xs text-gray-500">
                                        <Camera className="h-3 w-3 mr-1" /> Photo
                                      </Badge>
                                    )}
                                  </div>
                                  {/* Show response options if available */}
                                  {question.responseOptions && question.responseOptions.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {question.responseOptions.map((opt, i) => (
                                        <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">
                                          {opt.value}: {opt.label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Scoring Summary */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-medium text-sm">Scoring System</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-red-100 text-red-700">
                    <span className="font-mono">0-24</span> Poor
                  </div>
                  <div className="p-2 rounded bg-yellow-100 text-yellow-700">
                    <span className="font-mono">25-49</span> Fair
                  </div>
                  <div className="p-2 rounded bg-green-100 text-green-700">
                    <span className="font-mono">50-74</span> Good
                  </div>
                  <div className="p-2 rounded bg-emerald-100 text-emerald-700">
                    <span className="font-mono">75-100</span> Excellent
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  All responses are normalized to a 0-100 scale. Composite score = average of all normalized responses.
                  Primary metric provides the headline number for marketing claims.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Future: Brand Profile Section */}
      <Card className="mt-6 opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Brand Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Brand profile settings coming soon. Configure your company information, logo, and preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
