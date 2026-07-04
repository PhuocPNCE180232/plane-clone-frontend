import { RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CycleCard } from "./CycleCard";
import { ActiveCyclePanel } from "./ActiveCyclePanel";
import { mockCycles, mockIssues } from "@/mocks/db";

export const CycleList = () => {
  if (mockCycles.length === 0) {
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
      {/* Active Cycles — large hero panel */}
      <ActiveSection />

      {/* Upcoming Cycles — compact grid */}
      <CycleSection label="Upcoming Cycles" status="upcoming" />

      {/* Completed Cycles — compact grid */}
      <CycleSection label="Completed Cycles" status="completed" />
    </div>
  );
};

// ─── Status helper ────────────────────────────────────────────────────────────

type Status = "active" | "upcoming" | "completed";

function getCycleStatus(startDate: string, endDate: string): Status {
  const now   = new Date();
  const start = new Date(startDate);
  const end   = new Date(endDate);
  if (now < start) return "upcoming";
  if (now > end)   return "completed";
  return "active";
}

// ─── Active section (hero layout) ────────────────────────────────────────────

const ActiveSection = () => {
  const activeCycles = mockCycles.filter(
    (c) => getCycleStatus(c.start_date, c.end_date) === "active"
  );

  if (activeCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Active Cycles
      </h2>
      <div className="space-y-4">
        {activeCycles.map((cycle) => {
          const cycleIssues = mockIssues.filter((i) => i.cycle_id === cycle.id);
          return (
            <ActiveCyclePanel key={cycle.id} cycle={cycle} issues={cycleIssues} />
          );
        })}
      </div>
    </section>
  );
};

// ─── Compact grid section (upcoming / completed) ──────────────────────────────

type CycleSectionProps = {
  label: string;
  status: Status;
};

const CycleSection = ({ label, status }: CycleSectionProps) => {
  const filteredCycles = mockCycles.filter(
    (c) => getCycleStatus(c.start_date, c.end_date) === status
  );

  if (filteredCycles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCycles.map((cycle) => {
          const cycleIssues = mockIssues.filter((i) => i.cycle_id === cycle.id);
          return (
            <CycleCard key={cycle.id} cycle={cycle} issues={cycleIssues} />
          );
        })}
      </div>
    </section>
  );
};
