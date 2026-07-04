type CycleStatusBadgeProps = {
  startDate: string;
  endDate: string;
};

type CycleStatus = "active" | "upcoming" | "completed";

function getCycleStatus(startDate: string, endDate: string): CycleStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

const statusConfig: Record<
  CycleStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600",
  },
};

export const CycleStatusBadge = ({ startDate, endDate }: CycleStatusBadgeProps) => {
  const status = getCycleStatus(startDate, endDate);
  const { label, className } = statusConfig[status];

  return (
    <span
      className={`
        shrink-0
        rounded-full
        px-2.5 py-0.5
        text-xs font-medium
        ${className}
      `}
    >
      {label}
    </span>
  );
};
