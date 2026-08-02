import type { ChartItem } from "./analytics.helpers";

interface AnalyticsSimpleBarChartProps {
  items: ChartItem[];
  axisLabel: string;
}

export const AnalyticsSimpleBarChart = ({
  items,
  axisLabel,
}: AnalyticsSimpleBarChartProps) => {
  const maxCount = Math.max(
    ...items.map((item) => item.count),
    1,
  );

  return (
    <div>
      <div className="flex h-64 items-end gap-4 border-b border-l border-gray-200 px-4 pt-4">
        {items.map((item) => {
          const height = Math.max(
            (item.count / maxCount) * 100,
            2,
          );

          return (
            <div
              key={item.label}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <div
                className="mx-auto w-8 rounded-t-md bg-[#3f76ff]"
                style={{ height: `${height}%` }}
              />

              <p className="truncate text-center text-xs text-gray-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {axisLabel}
      </p>
    </div>
  );
};