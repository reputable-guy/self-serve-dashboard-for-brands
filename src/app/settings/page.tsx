"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import {
  ProfileQuestion,
  loadProfileQuestions,
  saveProfileQuestions,
  resetProfileQuestions,
} from "@/lib/profile-config";

export default function SettingsPage() {
  const [profileQuestions, setProfileQuestions] = useState<ProfileQuestion[]>([]);
  const [isProfileQuestionsOpen, setIsProfileQuestionsOpen] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load profile questions on mount
  useEffect(() => {
    setProfileQuestions(loadProfileQuestions());
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
