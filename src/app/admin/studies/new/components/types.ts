import type { WhatYoullDoSection, WhatYoullGetItem } from "@/lib/types";
import type { StudyAutoConfig, GeneratedStudyContent } from "@/lib/study-generator";

// ============================================
// CONSTANTS
// ============================================

export const STORAGE_KEY = "study-wizard-draft";
export const STEP_LABELS = ["Basics", "Preview", "Customize", "Publish"];

// Default values with named constants
export const DEFAULT_TARGET_PARTICIPANTS = 50;
export const DEFAULT_REBATE_AMOUNT = 50;
export const ENROLLMENT_CAP_MULTIPLIER = 1.5; // Account for participants who may not complete
export const DEFAULT_ENROLLMENT_CAP = Math.round(DEFAULT_TARGET_PARTICIPANTS * ENROLLMENT_CAP_MULTIPLIER);
export const DEFAULT_STUDY_DURATION_DAYS = 28;

// ============================================
// TYPES
// ============================================

export interface StudyFormData {
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

  // Tracking flags to preserve manual edits
  _hasManuallyEditedContent: boolean;
  _hasManuallyEditedEnrollmentCap: boolean;
}

export interface StudyFormHandlers {
  updateFormData: (updates: Partial<StudyFormData>) => void;
  markContentAsEdited: () => void;
  updateDoSection: (sectionIndex: number, updates: Partial<WhatYoullDoSection>) => void;
  updateDoItem: (sectionIndex: number, itemIndex: number, updates: Partial<{ icon: string; title: string; subtitle: string }>) => void;
  addDoItem: (sectionIndex: number) => void;
  removeDoItem: (sectionIndex: number, itemIndex: number) => void;
  addDoSection: () => void;
  removeDoSection: (sectionIndex: number) => void;
  updateGetItem: (index: number, updates: Partial<WhatYoullGetItem>) => void;
  addGetItem: () => void;
  removeGetItem: (index: number) => void;
  toggleSection: (index: number) => void;
}

export interface StepProps {
  formData: StudyFormData;
  handlers: StudyFormHandlers;
  expandedSections: Record<number, boolean>;
  generatedContent: GeneratedStudyContent | null;
}
