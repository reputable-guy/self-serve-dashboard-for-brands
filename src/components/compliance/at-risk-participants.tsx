"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ParticipantCompliance } from "@/lib/types";
import { getComplianceStatusLabel } from "@/lib/types/compliance";

interface AtRiskParticipantsProps {
  participants: ParticipantCompliance[];
  totalParticipants: number;
}

/**
 * Table showing participants who need attention (at_risk or critical status).
 * Sorted by severity, then by days since last check-in.
 */
export function AtRiskParticipants({ participants, totalParticipants }: AtRiskParticipantsProps) {
  // Format time ago
  const formatLastCheckIn = (daysSince: number): string => {
    if (daysSince === 0) return "Today";
    if (daysSince === 1) return "1 day ago";
    return `${daysSince} days ago`;
  };

  // Get status badge variant
  const getStatusBadge = (status: ParticipantCompliance["status"]) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertOctagon className="h-3 w-3" />
            Critical
          </Badge>
        );
      case "at_risk":
        return (
          <Badge variant="outline" className="gap-1 border-amber-500 text-amber-700 bg-amber-50">
            <AlertTriangle className="h-3 w-3" />
            At Risk
          </Badge>
        );
      default:
        return <Badge variant="outline">{getComplianceStatusLabel(status)}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Participants Needing Attention
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {participants.length} of {totalParticipants}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No participants need attention right now.</p>
            <p className="text-sm">All participants are on track!</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead className="text-center">Day</TableHead>
                    <TableHead className="text-center">Lifelines</TableHead>
                    <TableHead>Last Check-in</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((p) => (
                    <TableRow key={p.participantId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {p.initials}
                          </div>
                          {p.displayName}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        C{p.cohortNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.studyDay}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={
                          p.lifelinesRemaining <= 2
                            ? "text-red-600 font-medium"
                            : "text-amber-600"
                        }>
                          {p.lifelinesRemaining}/{p.totalLifelines}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLastCheckIn(p.daysSinceLastCheckIn)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(p.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                Participants are automatically notified when lifelines get low.
                After 0 lifelines, they are withdrawn from the study.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
