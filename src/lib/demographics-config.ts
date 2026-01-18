// Demographics questions configuration
// These are platform-wide demographic questions that can be asked during study enrollment
// Admins can configure which questions to ask and customize options

export interface DemographicsQuestion {
  id: string;
  questionText: string;
  questionType: "multiple_choice" | "text";
  options?: string[];
  fieldKey: string; // The profile field this populates
  required: boolean;
  enabled: boolean; // Whether to include this question in surveys
}

// Default demographic questions based on Sensate study fields
export const DEFAULT_DEMOGRAPHICS_QUESTIONS: DemographicsQuestion[] = [
  {
    id: "gender",
    questionText: "What is your gender?",
    questionType: "multiple_choice",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    fieldKey: "gender",
    required: false,
    enabled: true,
  },
  {
    id: "education-level",
    questionText: "What is your highest level of education?",
    questionType: "multiple_choice",
    options: [
      "High school or less",
      "Some college credit, no degree",
      "Trade, technical, or vocational training",
      "Bachelor's degree",
      "Master's degree",
      "Doctorate degree",
    ],
    fieldKey: "educationLevel",
    required: false,
    enabled: true,
  },
  {
    id: "employment-status",
    questionText: "What is your current employment status?",
    questionType: "multiple_choice",
    options: [
      "Employed for wages - full time",
      "Employed for wages - part time",
      "Self-employed",
      "Student",
      "Retired",
      "Not employed",
    ],
    fieldKey: "employmentStatus",
    required: false,
    enabled: true,
  },
  {
    id: "household-income",
    questionText: "What is your annual household income?",
    questionType: "multiple_choice",
    options: [
      "Under $25,000",
      "$25,000 - $49,999",
      "$50,000 - $100,000",
      "Greater than $100,000",
      "Prefer not to say",
    ],
    fieldKey: "householdIncome",
    required: false,
    enabled: true,
  },
  {
    id: "marital-status",
    questionText: "What is your marital status?",
    questionType: "multiple_choice",
    options: [
      "Single",
      "Married or in a domestic partnership",
      "Divorced",
      "Widowed",
      "Prefer not to say",
    ],
    fieldKey: "maritalStatus",
    required: false,
    enabled: true,
  },
  {
    id: "ethnicity",
    questionText: "What is your ethnicity?",
    questionType: "multiple_choice",
    options: [
      "Caucasian or White",
      "Black or African American",
      "Hispanic or Latino",
      "Asian or Pacific Islander",
      "Native American or Alaska Native",
      "Other",
      "Prefer not to say",
    ],
    fieldKey: "ethnicity",
    required: false,
    enabled: true,
  },
  {
    id: "country",
    questionText: "What country do you live in?",
    questionType: "text",
    fieldKey: "location",
    required: false,
    enabled: true,
  },
];

// Storage key for demographics questions in localStorage
const DEMOGRAPHICS_QUESTIONS_STORAGE_KEY = "reputable-demographics-questions";

// Load demographics questions from localStorage or return defaults
export function loadDemographicsQuestions(): DemographicsQuestion[] {
  if (typeof window === "undefined") return DEFAULT_DEMOGRAPHICS_QUESTIONS;

  try {
    const stored = localStorage.getItem(DEMOGRAPHICS_QUESTIONS_STORAGE_KEY);
    if (!stored) return DEFAULT_DEMOGRAPHICS_QUESTIONS;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_DEMOGRAPHICS_QUESTIONS;
  }
}

// Save demographics questions to localStorage
export function saveDemographicsQuestions(questions: DemographicsQuestion[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(DEMOGRAPHICS_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error("Failed to save demographics questions:", e);
  }
}

// Reset demographics questions to defaults
export function resetDemographicsQuestions(): DemographicsQuestion[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMOGRAPHICS_QUESTIONS_STORAGE_KEY);
  }
  return DEFAULT_DEMOGRAPHICS_QUESTIONS;
}

// Get only enabled questions
export function getEnabledDemographicsQuestions(): DemographicsQuestion[] {
  const questions = loadDemographicsQuestions();
  return questions.filter((q) => q.enabled);
}
