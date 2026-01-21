"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StudyComplianceConfig } from "@/lib/types";

interface ComplianceSettingsProps {
  config: StudyComplianceConfig;
  onConfigChange: (config: Partial<StudyComplianceConfig>) => void;
  disabled?: boolean;
}

/**
 * Settings card for configuring lifelines per participant.
 * Note: Changing settings only affects NEW participants.
 */
export function ComplianceSettings({
  config,
  onConfigChange,
  disabled = false
}: ComplianceSettingsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <span>Study Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Lifelines per participant</div>
              <div className="text-xs text-muted-foreground">
                Days they can miss before withdrawal
              </div>
            </div>
            <Select
              value={String(config.totalLifelines)}
              onValueChange={(value) => onConfigChange({ totalLifelines: parseInt(value) })}
              disabled={disabled}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert variant="default" className="bg-gray-50 border-gray-200">
            <Info className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700 text-xs">
              Changing this only affects new participants. Existing participants
              keep their current lifeline count.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
