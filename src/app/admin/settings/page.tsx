"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FileText,
  Users,
  Heart,
  Shield,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
  ClipboardList,
  Camera,
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  usePlatformSettingsStore,
  validateDistribution,
  DEFAULT_DISTRIBUTION,
} from "@/lib/platform-settings-store";
import {
  REPUTABLE_ASSESSMENTS,
  CATEGORY_CONFIGS,
  getScorableQuestions,
  TierLevel,
  AssessmentQuestion,
} from "@/lib/assessments";

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

export default function AdminSettingsPage() {
  const [isAssessmentsOpen, setIsAssessmentsOpen] = useState(false);
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  // Platform settings from Zustand store
  const {
    distributionFormula,
    trustStackPillars,
    setDistributionFormula,
    updateTrustPillar,
    resetToDefaults,
  } = usePlatformSettingsStore();

  // Local state for editing distribution
  const [localDistribution, setLocalDistribution] = useState(distributionFormula);

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

  // Handle save
  const handleSave = () => {
    if (validateDistribution(localDistribution)) {
      setDistributionFormula(localDistribution);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Handle reset
  const handleReset = () => {
    resetToDefaults();
    setLocalDistribution(DEFAULT_DISTRIBUTION);
  };

  const distributionTotal =
    localDistribution.onboarding +
    localDistribution.dailyCheckIn +
    localDistribution.weeklyAssessment +
    localDistribution.endpointAssessment +
    localDistribution.completionBonus;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform-wide settings and defaults
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} className="bg-[#00D1C1] hover:bg-[#00B8A9]">
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
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

      {/* Settings Categories */}
      <div className="grid gap-6">
        {/* Assessment Library - Collapsible with full viewer */}
        <Collapsible open={isAssessmentsOpen} onOpenChange={setIsAssessmentsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#00D1C1]" />
                      Assessment Library
                    </CardTitle>
                    <CardDescription>
                      View all validated assessments and their questions
                    </CardDescription>
                  </div>
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

            {/* Quick Stats when collapsed */}
            {!isAssessmentsOpen && (
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-muted-foreground">Tier 1</p>
                    <p className="font-medium text-blue-700">3 assessments</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-muted-foreground">Tier 2</p>
                    <p className="font-medium text-purple-700">1 assessment</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-muted-foreground">Tier 3</p>
                    <p className="font-medium text-green-700">5 assessments</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-muted-foreground">Tier 4</p>
                    <p className="font-medium text-orange-700">5 assessments</p>
                  </div>
                </div>
              </CardContent>
            )}

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

        {/* Profile Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#00D1C1]" />
                  Profile Questions
                </CardTitle>
                <CardDescription>
                  Questions asked to participants during onboarding
                </CardDescription>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  Edit Questions
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Age range</span>
                <span className="text-muted-foreground">Required</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Location (City, State)</span>
                <span className="text-muted-foreground">Required</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Lifestyle description</span>
                <span className="text-muted-foreground">Optional</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>How did you hear about us?</span>
                <span className="text-muted-foreground">Optional</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heartbeat Reward System - Milestone-Based Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#00D1C1]" />
              Rebate Distribution
            </CardTitle>
            <CardDescription>
              How participant rebates are distributed as heartbeats throughout the 28-day study
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Heartbeat Conversion - Read Only Info */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#00D1C1]" />
                  <span className="text-sm font-medium">Heartbeat Value</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  1 heartbeat = 0.05¢ &nbsp;•&nbsp; 2,000 heartbeats = $1
                </span>
              </div>
            </div>

            {/* Visual Split Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Distribution Model</span>
                <span className={`text-xs ${distributionTotal === 100 ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                  {distributionTotal === 100 ? '✓ Totals 100%' : `⚠ Total: ${distributionTotal}% (must equal 100%)`}
                </span>
              </div>
              <div className="h-10 rounded-lg overflow-hidden flex">
                <div
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                  style={{ width: `${localDistribution.onboarding + localDistribution.dailyCheckIn + localDistribution.weeklyAssessment + localDistribution.endpointAssessment}%` }}
                >
                  Progressive {localDistribution.onboarding + localDistribution.dailyCheckIn + localDistribution.weeklyAssessment + localDistribution.endpointAssessment}%
                </div>
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                  style={{ width: `${localDistribution.completionBonus}%` }}
                >
                  Completion Bonus {localDistribution.completionBonus}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Earned throughout study</span>
                <span>Earned when completed</span>
              </div>
            </div>

            {/* Progressive Milestones */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Progressive Earnings
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Keep participants engaged with steady progress
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Onboarding */}
                <div className="p-3 rounded-lg border bg-blue-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700">Onboarding</span>
                    <span className="text-xs text-muted-foreground">Day 1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={localDistribution.onboarding}
                      onChange={(e) => setLocalDistribution({
                        ...localDistribution,
                        onboarding: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-center"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseline assessment
                  </p>
                </div>

                {/* Daily Check-ins */}
                <div className="p-3 rounded-lg border bg-blue-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700">Daily Check-ins</span>
                    <span className="text-xs text-muted-foreground">÷ 28 days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={localDistribution.dailyCheckIn}
                      onChange={(e) => setLocalDistribution({
                        ...localDistribution,
                        dailyCheckIn: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-center"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(localDistribution.dailyCheckIn / 28).toFixed(2)}% per day
                  </p>
                </div>

                {/* Weekly Surveys */}
                <div className="p-3 rounded-lg border bg-blue-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700">Weekly Surveys</span>
                    <span className="text-xs text-muted-foreground">÷ 4 weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={localDistribution.weeklyAssessment}
                      onChange={(e) => setLocalDistribution({
                        ...localDistribution,
                        weeklyAssessment: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-center"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(localDistribution.weeklyAssessment / 4).toFixed(2)}% per week
                  </p>
                </div>

                {/* Final Survey */}
                <div className="p-3 rounded-lg border bg-blue-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700">Final Survey</span>
                    <span className="text-xs text-muted-foreground">Day 28</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={localDistribution.endpointAssessment}
                      onChange={(e) => setLocalDistribution({
                        ...localDistribution,
                        endpointAssessment: parseInt(e.target.value) || 0
                      })}
                      className="h-8 text-center"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Endpoint assessment
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Bonus */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Completion Bonus
                </Badge>
                <span className="text-xs text-muted-foreground">
                  The &quot;big prize&quot; that drives 80%+ completion rates
                </span>
              </div>

              <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">
                      Unlocked when participant completes all study requirements
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requires: baseline + 70% daily check-ins + final assessment
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={localDistribution.completionBonus}
                      onChange={(e) => setLocalDistribution({
                        ...localDistribution,
                        completionBonus: parseInt(e.target.value) || 0
                      })}
                      className="w-20 h-10 text-center text-lg font-bold"
                    />
                    <span className="text-lg font-bold text-green-700">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview with Example */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Example: $50 Rebate</span>
                <span className="text-xs text-muted-foreground">100,000 heartbeats total</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-blue-700">Progressive Earnings</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Onboarding (Day 1)</span>
                      <span className="font-medium">${(50 * localDistribution.onboarding / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily check-ins ({(50 * localDistribution.dailyCheckIn / 100 / 28).toFixed(2)}/day × 28)</span>
                      <span className="font-medium">${(50 * localDistribution.dailyCheckIn / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly surveys ({(50 * localDistribution.weeklyAssessment / 100 / 4).toFixed(2)}/wk × 4)</span>
                      <span className="font-medium">${(50 * localDistribution.weeklyAssessment / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Final survey (Day 28)</span>
                      <span className="font-medium">${(50 * localDistribution.endpointAssessment / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-muted-foreground">Max if dropped</span>
                      <span className="font-medium text-blue-700">
                        ${(50 * (localDistribution.onboarding + localDistribution.dailyCheckIn + localDistribution.weeklyAssessment + localDistribution.endpointAssessment) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-green-700">Completion Bonus</p>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-700">
                        ${(50 * localDistribution.completionBonus / 100).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Awarded at final ceremony
                    </p>
                  </div>
                  <div className="flex justify-between text-xs pt-2">
                    <span className="font-medium">Total on completion</span>
                    <span className="font-bold text-green-700">$50.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Stack - Now Editable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00D1C1]" />
              Trust Stack Configuration
            </CardTitle>
            <CardDescription>
              Configure trust verification pillars shown on verification pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trustStackPillars.map((pillar, index) => (
                <div key={pillar.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      pillar.enabled ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className={`text-sm ${pillar.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <Input
                        value={pillar.title}
                        onChange={(e) => updateTrustPillar(pillar.id, { title: e.target.value })}
                        className="font-medium h-7 w-48 mb-1"
                      />
                      <Input
                        value={pillar.description}
                        onChange={(e) => updateTrustPillar(pillar.id, { description: e.target.value })}
                        className="text-sm text-muted-foreground h-6 w-64"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`pillar-${pillar.id}`} className="text-xs text-muted-foreground">
                      {pillar.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`pillar-${pillar.id}`}
                      checked={pillar.enabled}
                      onCheckedChange={(checked) => updateTrustPillar(pillar.id, { enabled: checked })}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              These pillars appear on all verification pages to establish credibility with viewers.
              Toggle to disable specific pillars for studies that don&apos;t use wearables.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
