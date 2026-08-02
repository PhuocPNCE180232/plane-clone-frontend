import type { ReactNode } from "react";

export interface AnalyticsMetricCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  helper: string;
}

export const AnalyticsMetricCard = ({
  icon,
  label,
  value,
  helper,
}: AnalyticsMetricCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-gray-400">{icon}</div>

      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">{helper}</p>
    </div>
  );
};

interface AnalyticsMetricGridProps {
  items: AnalyticsMetricCardProps[];
}

export const AnalyticsMetricGrid = ({
  items,
}: AnalyticsMetricGridProps) => {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <AnalyticsMetricCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          helper={item.helper}
        />
      ))}
    </div>
  );
};