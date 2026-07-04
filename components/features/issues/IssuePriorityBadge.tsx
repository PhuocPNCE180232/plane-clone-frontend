import {
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Minus,
} from "lucide-react";

type IssuePriority = "Urgent" | "High" | "Medium" | "Low" | "None";

type IssuePriorityBadgeProps = {
  priority: IssuePriority;
};

const priorityConfig: Record<
  IssuePriority,
  { label: string; icon: React.ReactNode; textClass: string }
> = {
  Urgent: {
    label: "Urgent",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    textClass: "text-red-500",
  },
  High: {
    label: "High",
    icon: <ArrowUp className="h-3.5 w-3.5" />,
    textClass: "text-orange-500",
  },
  Medium: {
    label: "Medium",
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    textClass: "text-yellow-500",
  },
  Low: {
    label: "Low",
    icon: <ArrowDown className="h-3.5 w-3.5" />,
    textClass: "text-blue-400",
  },
  None: {
    label: "None",
    icon: <Minus className="h-3.5 w-3.5" />,
    textClass: "text-gray-400",
  },
};

export const IssuePriorityBadge = ({ priority }: IssuePriorityBadgeProps) => {
  const config = priorityConfig[priority] ?? priorityConfig["None"];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${config.textClass}`}
      title={config.label}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
