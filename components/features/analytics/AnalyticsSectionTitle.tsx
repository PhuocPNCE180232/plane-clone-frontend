import type { ReactNode } from "react";

interface AnalyticsSectionTitleProps {
  icon: ReactNode;
  title: string;
}

export const AnalyticsSectionTitle = ({
  icon,
  title,
}: AnalyticsSectionTitleProps) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>
    </div>
  );
};