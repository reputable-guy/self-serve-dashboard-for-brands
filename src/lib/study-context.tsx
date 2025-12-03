"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface DiscoverItem {
  question: string;
  explanation: string;
}

export interface RoutineStep {
  action: string;
  details: string;
}

export interface ValueItem {
  item: string;
  value: string;
  note: string;
}

export interface CustomQuestion {
  questionText: string;
  questionType: "multiple_choice" | "text" | "voice_and_text" | "likert_scale";
  options: string[];
  showOnDays: number[];
  // Likert scale specific fields
  likertMin?: number;
  likertMax?: number;
  likertMinLabel?: string;
  likertMaxLabel?: string;
}

export interface StudyFormData {
  // Step 1: Product Info
  productName: string;
  productImage: string;
  productDescription: string;
  productPrice: string;
  productUrl: string;
  category: string;
  // Step 2: Study Settings
  rebateAmount: string;
  durationDays: string;
  totalSpots: string;
  requiredDevice: string;
  metricsToTrack: string[];
  // Step 2: Weekly Check-in Questions (Optional)
  villainVariable: string;
  villainQuestionDays: number[];
  customQuestions: CustomQuestion[];
  // Step 3: Generated Content
  studyTitle: string;
  hookQuestion: string;
  discoverItems: DiscoverItem[];
  dailyRoutine: RoutineStep[];
  whatYouGet: ValueItem[];
}

const initialFormData: StudyFormData = {
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
  metricsToTrack: [],
  villainVariable: "",
  villainQuestionDays: [7, 14, 21, 28],
  customQuestions: [],
  studyTitle: "",
  hookQuestion: "",
  discoverItems: [],
  dailyRoutine: [],
  whatYouGet: [],
};

interface StudyContextType {
  formData: StudyFormData;
  updateField: <K extends keyof StudyFormData>(field: K, value: StudyFormData[K]) => void;
  updateFields: (fields: Partial<StudyFormData>) => void;
  resetForm: () => void;
  loadStudy: (data: StudyFormData) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<StudyFormData>(initialFormData);

  const updateField = <K extends keyof StudyFormData>(field: K, value: StudyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFields = (fields: Partial<StudyFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const loadStudy = (data: StudyFormData) => {
    setFormData(data);
  };

  return (
    <StudyContext.Provider value={{ formData, updateField, updateFields, resetForm, loadStudy }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyForm() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudyForm must be used within a StudyProvider");
  }
  return context;
}
