"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, UserMinus, UserCheck, RotateCcw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimulationControlsProps {
  onAdvanceDay: () => void;
  onSimulateMiss: () => void;
  onSimulateCheckIn: () => void;
  onReset: () => void;
  currentDay: number;
  totalDays: number;
}

/**
 * Demo controls for simulating compliance events.
 * Only shown in development/demo mode.
 */
export function SimulationControls({
  onAdvanceDay,
  onSimulateMiss,
  onSimulateCheckIn,
  onReset,
  currentDay,
  totalDays,
}: SimulationControlsProps) {
  const isLastDay = currentDay >= totalDays;

  return (
    <Card className="border-dashed border-2 border-amber-300 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-amber-800">
          <span>Simulation Controls</span>
          <span className="text-xs font-normal bg-amber-200 px-2 py-0.5 rounded">
            Demo Only
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvanceDay}
            disabled={isLastDay}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Advance 1 Day
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSimulateMiss}
            className="gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Simulate Miss
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSimulateCheckIn}
            className="gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Simulate Check-in
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2 ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <Alert variant="default" className="mt-4 bg-amber-100 border-amber-300">
          <Info className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-800 text-xs">
            In production, compliance data comes from the mobile app.
            These controls are for demonstration purposes only.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
