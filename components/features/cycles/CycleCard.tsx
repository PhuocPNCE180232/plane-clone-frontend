import { CalendarDays, Clock3, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Cycle, Issue } from "@/mocks/db";
import { deleteCycle, updateCycle } from "@/lib/services/cycle.service";
import { CycleProgressBar } from "./CycleProgressBar";
import { CycleStatusBadge } from "./CycleStatusBadge";
import { toast } from "@/hooks/use-toast";
import { confirm } from "@/hooks/use-confirm";

type CycleCardProps = {
  cycle: Cycle;
  issues: Issue[];
};

type CycleEditFormValues = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysLeft(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export const CycleCard = ({ cycle, issues }: CycleCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleDeleteCycle, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteCycle(cycle.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      toast.success("Cycle deleted successfully.");
      setIsMenuOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete cycle:", error);
      toast.error("Failed to delete cycle. Please try again.");
    },
  });

  const totalIssues     = issues.length;
  const completedIssues = issues.filter((i) => i.state === "Done").length;
  const progressPercent = cycle.progress ?? (totalIssues > 0
    ? Math.round((completedIssues / totalIssues) * 100)
    : 0);
  const daysLeft = getDaysLeft(cycle.end_date);

  const daysLabel =
    daysLeft > 0
      ? `${daysLeft}d left`
      : daysLeft === 0
      ? "Ends today"
      : `Ended ${Math.abs(daysLeft)}d ago`;

  const onDelete = async () => {
    setIsMenuOpen(false);
    const ok = await confirm({
      title: "Delete Cycle",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (ok) {
      handleDeleteCycle();
    }
  };

  return (
    <>
      <Card
        className="
          group relative
          cursor-pointer
          hover:shadow-md hover:-translate-y-0.5
          transition-all duration-200
        "
      >
        {/* Three-dot menu */}
        <div className="absolute right-4 top-4">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((current) => !current);
            }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl z-20">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Top row: title + badge */}
        <div className="mb-2 flex items-start justify-between gap-2 pr-6">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
            {cycle.name}
          </h3>
          <CycleStatusBadge startDate={cycle.start_date} endDate={cycle.end_date} />
        </div>

      {/* Date range */}
      <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span>
          {formatDate(cycle.start_date)}&nbsp;&ndash;&nbsp;{formatDate(cycle.end_date)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <CycleProgressBar percent={progressPercent} />
      </div>

      {/* Footer: issue count + days remaining */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {totalIssues === 0
            ? "No issues"
            : `${completedIssues} / ${totalIssues} issues`}
        </span>

        <span className="flex items-center gap-1 text-gray-400">
          <Clock3 className="h-3.5 w-3.5" />
          {daysLabel}
        </span>
      </div>
    </Card>

    {isEditOpen && (
      <CycleEditModal
        cycle={cycle}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
      />
    )}
  </>
  );
};

const CycleEditModal = ({
  cycle,
  onClose,
  onSuccess,
}: {
  cycle: Cycle;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(cycle.name);
  const [description, setDescription] = useState(cycle.description ?? "");
  const [startDate, setStartDate] = useState(cycle.start_date);
  const [endDate, setEndDate] = useState(cycle.end_date);

  const { mutate: handleUpdateCycle, isPending } = useMutation({
    mutationFn: () =>
      updateCycle(cycle.id, {
        project_id: cycle.project_id,
        name: title,
        description,
        start_date: startDate,
        end_date: endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      toast.success("Cycle updated successfully.");
      onSuccess();
    },
    onError: (error) => {
      console.error("Failed to update cycle:", error);
      toast.error("Failed to update cycle. Please try again.");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateCycle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Update cycle</h2>
            <p className="mt-1 text-sm text-gray-500">Edit cycle details and save changes.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-gray-600">
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-black"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-600">
              End date
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-black"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-3 py-1 text-sm bg-white text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#3f76ff] px-4 py-2 text-white disabled:opacity-60"
            >
              {isPending ? "Updating..." : "Update cycle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
