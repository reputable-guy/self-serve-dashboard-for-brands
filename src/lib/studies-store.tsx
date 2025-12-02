"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StudyFormData } from "./study-context";

const STORAGE_KEY = "reputable-studies";

export interface Study extends StudyFormData {
  id: string;
  status: "draft" | "recruiting" | "filling-fast" | "full" | "completed";
  createdAt: Date;
  enrolledCount: number;
}

// Serialize study for localStorage (convert Date to string)
function serializeStudies(studies: Study[]): string {
  return JSON.stringify(
    studies.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    }))
  );
}

// Deserialize studies from localStorage (convert string back to Date)
function deserializeStudies(json: string): Study[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s: Study & { createdAt: string }) => ({
      ...s,
      createdAt: new Date(s.createdAt),
    }));
  } catch {
    return [];
  }
}

// Load studies from localStorage
function loadStudiesFromStorage(): Study[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return deserializeStudies(stored);
  } catch {
    return [];
  }
}

// Save studies to localStorage
function saveStudiesToStorage(studies: Study[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, serializeStudies(studies));
  } catch (e) {
    console.error("Failed to save studies to localStorage:", e);
  }
}

interface StudiesContextType {
  studies: Study[];
  addStudy: (study: StudyFormData) => string;
  getStudy: (id: string) => Study | undefined;
  updateStudy: (id: string, updates: Partial<Study>) => void;
  deleteStudy: (id: string) => void;
  isLoading: boolean;
}

const StudiesContext = createContext<StudiesContextType | undefined>(undefined);

export function StudiesProvider({ children }: { children: ReactNode }) {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load studies from localStorage on mount
  useEffect(() => {
    const stored = loadStudiesFromStorage();
    setStudies(stored);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever studies change
  useEffect(() => {
    if (!isLoading) {
      saveStudiesToStorage(studies);
    }
  }, [studies, isLoading]);

  const addStudy = (studyData: StudyFormData): string => {
    const id = `study-${Date.now()}`;
    const newStudy: Study = {
      ...studyData,
      id,
      status: "draft",
      createdAt: new Date(),
      enrolledCount: 0,
    };
    setStudies((prev) => [newStudy, ...prev]);
    return id;
  };

  const getStudy = (id: string): Study | undefined => {
    return studies.find((s) => s.id === id);
  };

  const updateStudy = (id: string, updates: Partial<Study>) => {
    setStudies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudy = (id: string) => {
    setStudies((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudiesContext.Provider
      value={{ studies, addStudy, getStudy, updateStudy, deleteStudy, isLoading }}
    >
      {children}
    </StudiesContext.Provider>
  );
}

export function useStudies() {
  const context = useContext(StudiesContext);
  if (context === undefined) {
    throw new Error("useStudies must be used within a StudiesProvider");
  }
  return context;
}
