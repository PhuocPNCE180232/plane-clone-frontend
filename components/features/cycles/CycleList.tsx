"use client";

import { RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CycleCard } from "./CycleCard";
import { ActiveCyclePanel } from "./ActiveCyclePanel";
import { mockIssues } from "@/mocks/db";
import { useQuery } from "@tanstack/react-query";
import { getCycles, type Cycle } from "@/lib/services/cycle.service";

export const CycleList = () => {
  const { data: cycles = [], isLoading } = useQuery<Cycle[], Error>({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <RefreshCcw className="mb-4 h-10 w-10 text-gray-300 animate-spin" />
          <h3 className="mb-1 text-sm font-medium text-gray-700">Loading Cycles...</h3>
        </div>
      </Card>
    );
  }

  if (cycles.length === 0) {
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
      <ActiveSection cycles={cycles} />
      <CycleSection cycles={cycles} label="Upcoming Cycles" status="upcoming" />
      <CycleSection cycles={cycles} label="Completed Cycles" status="completed" />
    </div>
  );
};

// ─── Types / helpers ─────────────────────────────────────────────────────────

type Status = "active" | "upcoming" | "completed";

type CycleListProps = {
  cycles: Cycle[];
};

function getCycleStatus(startDate: string, endDate: string): Status {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

const ActiveSection = ({ cycles }: CycleListProps) => {
  const activeCycles = cycles.filter((c) => getCycleStatus(c.start_date, c.end_date) === "active");

  if (activeCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Active Cycles
      </h2>
      <div className="space-y-4">
        {activeCycles.map((cycle) => {
          const cycleIssues = mockIssues.filter((i) => i.cycle_id === cycle.id);
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

const CycleSection = ({ cycles, label, status }: CycleSectionProps) => {
  const filteredCycles = cycles.filter((c) => getCycleStatus(c.start_date, c.end_date) === status);

  if (filteredCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCycles.map((cycle) => {
          const cycleIssues = mockIssues.filter((i) => i.cycle_id === cycle.id);
          return <CycleCard key={cycle.id} cycle={cycle} issues={cycleIssues} />;
        })}
      </div>
    </section>
  );
};