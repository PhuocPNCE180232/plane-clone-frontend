"use client";

import { RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CycleCard } from "./CycleCard";
import { ActiveCyclePanel } from "./ActiveCyclePanel";
import { useQuery } from "@tanstack/react-query";
import { getCycles, type Cycle } from "@/lib/services/cycle.service";
import { useIssues } from "@/hooks/use-issues";
import type { Issue } from "@/types";

type CycleFilterStatus = "all" | "active" | "upcoming" | "completed";

type CycleListViewProps = {
  projectId: string;
  filterStatus: CycleFilterStatus;
};

export const CycleList = ({ projectId, filterStatus }: CycleListViewProps) => {
  const { data: cycles = [], isLoading } = useQuery<Cycle[], Error>({
    queryKey: ["cycles", projectId],
    queryFn: () => getCycles(projectId),
  });
  const { data: issues = [], isLoading: isIssuesLoading } = useIssues(projectId);

  const projectCycles = cycles.filter((cycle) => cycle.project_id === projectId);

  if (isLoading || isIssuesLoading) {
    return (
      <Card>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <RefreshCcw className="mb-4 h-10 w-10 text-gray-300 animate-spin" />
          <h3 className="mb-1 text-sm font-medium text-gray-700">Loading Cycles...</h3>
        </div>
      </Card>
    );
  }

  if (projectCycles.length === 0) {
    return (
      <Card>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <RefreshCcw className="mb-4 h-10 w-10 text-gray-300" />
          <h3 className="mb-1 text-sm font-medium text-gray-700">No Cycles Yet</h3>
          <p className="max-w-xs text-xs text-gray-400">
            Create your first cycle to start grouping and shipping issues in sprints.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {(filterStatus === "all" || filterStatus === "active") && (
        <ActiveSection cycles={projectCycles} issues={issues} />
      )}
      {(filterStatus === "all" || filterStatus === "upcoming") && (
        <CycleSection
          cycles={projectCycles}
          issues={issues}
          label="Upcoming Cycles"
          status="upcoming"
        />
      )}
      {(filterStatus === "all" || filterStatus === "completed") && (
        <CycleSection
          cycles={projectCycles}
          issues={issues}
          label="Completed Cycles"
          status="completed"
        />
      )}
    </div>
  );
};

// ─── Types / helpers ─────────────────────────────────────────────────────────

type Status = "active" | "upcoming" | "completed";

type CycleListProps = {
  cycles: Cycle[];
  issues: Issue[];
};

function getCycleStatus(startDate: string, endDate: string): Status {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

const ActiveSection = ({ cycles, issues }: CycleListProps) => {
  const activeCycles = cycles.filter((c) => getCycleStatus(c.start_date, c.end_date) === "active");

  if (activeCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Active Cycles
      </h2>
      <div className="space-y-4">
        {activeCycles.map((cycle) => {
          const cycleIssues = issues.filter((issue) => issue.cycle_id === cycle.id);
          return <ActiveCyclePanel key={cycle.id} cycle={cycle} issues={cycleIssues} />;
        })}
      </div>
    </section>
  );
};

type CycleSectionProps = CycleListProps & {
  label: string;
  status: Status;
};

const CycleSection = ({ cycles, issues, label, status }: CycleSectionProps) => {
  const filteredCycles = cycles.filter((c) => getCycleStatus(c.start_date, c.end_date) === status);

  if (filteredCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCycles.map((cycle) => {
          const cycleIssues = issues.filter((issue) => issue.cycle_id === cycle.id);
          return <CycleCard key={cycle.id} cycle={cycle} issues={cycleIssues} />;
        })}
      </div>
    </section>
  );
};
