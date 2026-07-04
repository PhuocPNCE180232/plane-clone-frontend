import { Circle, CircleDot, Timer, CheckCircle2, XCircle } from "lucide-react";

type IssueState =
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "Done"
  | "Cancelled";

type IssueStatusBadgeProps = {
  state: IssueState;
};

const stateConfig: Record<
  IssueState,
  { label: string; icon: React.ReactNode; className: string }
> = {
  Backlog: {
    label: "Backlog",
    icon: <Circle className="h-3 w-3" />,
    className: "text-gray-500",
  },
  Todo: {
    label: "Todo",
    icon: <CircleDot className="h-3 w-3" />,
    className: "text-gray-700",
  },
  "In Progress": {
    label: "In Progress",
    icon: <Timer className="h-3 w-3" />,
    className: "text-orange-500",
  },
  Done: {
    label: "Done",
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: "text-green-600",
  },
  Cancelled: {
    label: "Cancelled",
    icon: <XCircle className="h-3 w-3" />,
    className: "text-red-400",
  },
};

export const IssueStatusBadge = ({ state }: IssueStatusBadgeProps) => {
  const config = stateConfig[state] ?? stateConfig["Backlog"];

  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
      {config.icon}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
};
