import { Inbox } from "lucide-react";

interface AnalyticsEmptyStateProps {
  title: string;
  description: string;
}

export const AnalyticsEmptyState = ({
  title,
  description,
}: AnalyticsEmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center">
      <Inbox className="mx-auto mb-3 h-9 w-9 text-gray-300" />

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
};