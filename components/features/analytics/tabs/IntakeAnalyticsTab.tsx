import {
  BarChart2,
  CircleDot,
  Inbox,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { AnalyticsEmptyState } from "../AnalyticsEmptyState";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

export const IntakeAnalyticsTab = () => {
  const intakeStats = [
    { label: "Accepted", count: 0 },
    { label: "Declined", count: 0 },
    { label: "Duplicate", count: 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Intake</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <Inbox className="h-4 w-4" />,
            label: "Total Intake",
            value: 0,
            helper: "Pending intake data",
          },
          {
            icon: <ShieldCheck className="h-4 w-4" />,
            label: "Accepted",
            value: 0,
            helper: "Pending intake data",
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "Declined",
            value: 0,
            helper: "Pending intake data",
          },
          {
            icon: <CircleDot className="h-4 w-4" />,
            label: "Duplicate",
            value: 0,
            helper: "Pending intake data",
          },
        ]}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<BarChart2 className="h-4 w-4" />}
          title="Intake Trends"
        />

        <AnalyticsSimpleBarChart items={intakeStats} axisLabel="Intake" />
      </section>

      <AnalyticsEmptyState
        title="No intake submissions yet"
        description="New intake requests will appear here once your workspace starts receiving them."
      />
    </div>
  );
};
