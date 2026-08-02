interface AnalyticsChartData {
  label: string;
  value?: number;
  count?: number;
}

interface NormalizedChartData {
  label: string;
  value: number;
}

interface AnalyticsSimpleBarChartProps {
  title: string;
  data?: AnalyticsChartData[];
  items?: AnalyticsChartData[];
  axisLabel?: string;
  emptyText?: string;
}

const getSafeValue = (item: AnalyticsChartData) => {
  const rawValue = item.value ?? item.count ?? 0;
  const value = Number(rawValue);

  return Number.isFinite(value) ? value : 0;
};

export const AnalyticsSimpleBarChart = ({
  title,
  data,
  items,
  axisLabel,
  emptyText = "No data available",
}: AnalyticsSimpleBarChartProps) => {
  const chartData: NormalizedChartData[] = (data ?? items ?? []).map((item) => ({
    label: item.label,
    value: getSafeValue(item),
  }));

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const totalValue = chartData.reduce((total, item) => total + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        <div className="mt-8 flex h-52 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-gray-400">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-400">
          Total:{" "}
          <span className="font-semibold text-gray-700">
            {String(totalValue)}
          </span>
        </p>
      </div>

      <div className="mt-6 h-72 border-b border-l border-gray-200 px-4">
        <div className="flex h-full items-end justify-between gap-5">
          {chartData.map((item) => {
            const barHeight =
              item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 8);

            return (
              <div
                key={item.label}
                className="flex h-full min-w-16 flex-1 flex-col items-center justify-end"
              >
                <span className="mb-2 text-sm font-semibold text-gray-800">
                  {String(item.value)}
                </span>

                <div
                  className="w-10 rounded-t-lg bg-[#3f76ff]"
                  style={{ height: `${barHeight}%` }}
                  title={`${item.label}: ${item.value}`}
                />

                <p className="mt-2 w-full truncate text-center text-xs font-medium text-gray-600">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {axisLabel && (
        <p className="mt-3 text-center text-xs font-medium uppercase tracking-wide text-gray-400">
          {axisLabel}
        </p>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {chartData.map((item) => {
          const percentage =
            totalValue === 0 ? 0 : Math.round((item.value / totalValue) * 100);

          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-gray-600">{item.label}</span>

              <span className="font-semibold text-gray-900">
                {String(item.value)}
                <span className="ml-1 text-xs font-medium text-gray-400">
                  ({String(percentage)}%)
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};