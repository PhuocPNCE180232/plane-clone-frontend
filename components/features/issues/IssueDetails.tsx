import { MoreHorizontal } from "lucide-react";
import { IssuePriorityBadge } from "./IssuePriorityBadge";
import { IssueStatusBadge } from "./IssueStatusBadge";

type NamedEntity = string | { id?: string; name?: string } | undefined;

export interface IssueDetailsProps {
  issue?: {
    labels?: string[] | string;
    start_date?: string;
    due_date?: string;
    title?: string;
    description?: string;
    state?: string;
    priority?: string;
    project?: NamedEntity;
    assignee?: NamedEntity;
    module?: NamedEntity;
    cycle?: NamedEntity;
  };

  onEdit?: () => void;
}

export const IssueDetails = ({
  issue,
  onEdit,
}: IssueDetailsProps) => {
  const {
    title,
    description,
    state,
    priority,
    project,
    assignee,
    module,
    cycle,
    labels,
    start_date,
    due_date,
  } = issue || {};

  const formattedLabels = Array.isArray(labels) ? labels.join(", ") : labels;

  // Helper để lấy chuỗi hiển thị kể cả khi dữ liệu trả về là Object hay String
  const renderName = (val: NamedEntity) => {
    if (!val) return "-";
    if (typeof val === "string") return val;
    return val.name ?? "-";
  };

  return (
    <div>
      {/* Header with badges and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IssueStatusBadge state={state ?? "Todo"} />
          <IssuePriorityBadge priority={priority ?? "Low"} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded border px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Edit
          </button>

          <button className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-semibold text-gray-900">
        {title ?? "Untitled Issue"}
      </h1>

      {/* Metadata Section */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
        <div>
          <p className="text-xs text-gray-500">Project</p>
          <p>{renderName(project)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Assignee</p>
          <p>{renderName(assignee)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Module</p>
          <p>{renderName(module)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Cycle</p>
          <p>{renderName(cycle)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Labels</p>
          <p>{formattedLabels || "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Start Date</p>
          <p>{start_date ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Due Date</p>
          <p>{due_date ?? "-"}</p>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-sm mt-6 max-w-none">
        {description ? (
          <p className="whitespace-pre-wrap">
            {description}
          </p>
        ) : (
          <p className="italic text-gray-400">
            No description
          </p>
        )}
      </div>
    </div>
  );
};