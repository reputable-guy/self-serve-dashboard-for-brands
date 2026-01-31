"use client";

import { useEffect, useState } from "react";
import { useComplianceStore } from "@/lib/compliance-store";
import {
  StudyProgressCard,
  ComplianceStatsCards,
  ComplianceTrendChart,
  AtRiskParticipants,
  ComplianceSettings,
  SimulationControls,
} from "@/components/compliance";
import { DEFAULT_COMPLIANCE_CONFIG } from "@/lib/types/compliance";

interface ComplianceTabProps {
  /** Only requires the study ID - other fields are managed by compliance store */
  study: { id: string };
}

/**
 * Compliance tab for monitoring participant engagement during the 28-day study.
 * Shows compliance stats, trend chart, at-risk participants, and settings.
 *
 * Includes simulation controls for demo purposes (advancing days, simulating
 * missed check-ins, etc.)
 */
export function ComplianceTab({ study }: ComplianceTabProps) {
  const [initialized, setInitialized] = useState(false);

  const {
    getStudyStats,
    getParticipantsNeedingAttention,
    studyConfigs,
    updateConfig,
    advanceDay,
    simulateMiss,
    simulateCheckIn,
    resetStudy,
    generateMockData,
    participants,
  } = useComplianceStore();

  // Initialize mock data on first render
  useEffect(() => {
    if (!initialized) {
      // Check if we already have participants for this study
      const existingParticipants = Object.values(participants).filter(
        (p) => p.studyId === study.id
      );

      if (existingParticipants.length === 0) {
        // Generate mock data: Day 14, 22 participants (realistic for demo)
        generateMockData(study.id, 14, 22);
      }
      setInitialized(true);
    }
  }, [initialized, study.id, participants, generateMockData]);

  const stats = getStudyStats(study.id);
  const atRiskParticipants = getParticipantsNeedingAttention(study.id);
  const config = studyConfigs[study.id] || DEFAULT_COMPLIANCE_CONFIG;

  // Get study participants for picking a random one for simulate miss/check-in
  const studyParticipants = Object.values(participants).filter(
    (p) => p.studyId === study.id && p.status !== "withdrawn"
  );

  const handleSimulateMiss = () => {
    // Pick a random non-withdrawn participant
    if (studyParticipants.length > 0) {
      const randomIndex = Math.floor(Math.random() * studyParticipants.length);
      simulateMiss(studyParticipants[randomIndex].participantId);
    }
  };

  const handleSimulateCheckIn = () => {
    // Pick a random at-risk or critical participant
    const needingAttention = studyParticipants.filter(
      (p) => p.status === "at_risk" || p.status === "critical"
    );
    const target = needingAttention.length > 0 ? needingAttention : studyParticipants;
    if (target.length > 0) {
      const randomIndex = Math.floor(Math.random() * target.length);
      simulateCheckIn(target[randomIndex].participantId);
    }
  };

  if (!stats) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No compliance data available yet.</p>
        <p className="text-sm mt-2">
          Compliance tracking begins when participants start the study.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top row: Progress + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudyProgressCard stats={stats} />
        </div>
        <div className="lg:col-span-2">
          <ComplianceStatsCards stats={stats} config={config} />
        </div>
      </div>

      {/* Compliance Trend Chart */}
      <ComplianceTrendChart stats={stats} />

      {/* Participants Needing Attention */}
      <AtRiskParticipants
        participants={atRiskParticipants}
        totalParticipants={stats.totalActive + stats.withdrawnCount}
      />

      {/* Bottom row: Settings + Simulation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComplianceSettings
          config={config}
          onConfigChange={(updates) => updateConfig(study.id, updates)}
        />
        <SimulationControls
          onAdvanceDay={() => advanceDay(study.id)}
          onSimulateMiss={handleSimulateMiss}
          onSimulateCheckIn={handleSimulateCheckIn}
          onReset={() => resetStudy(study.id)}
          currentDay={stats.currentDay}
          totalDays={stats.totalDays}
        />
      </div>
    </div>
  );
}
