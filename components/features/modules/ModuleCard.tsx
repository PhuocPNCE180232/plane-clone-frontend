import { MoreHorizontal, CircleDot, Clock, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockIssues } from "@/mocks/db";
import type { Module } from "@/lib/services/module.service";
import { deleteModule, updateModule } from "@/lib/services/module.service";
import { createModuleSchema } from "@/lib/validations/module";
import { toast } from "@/hooks/use-toast";
import { confirm } from "@/hooks/use-confirm";

type ModuleCardProps = {
  module: Module;
};

// Deterministic accent colour per module name
const ACCENT_COLOURS = [
  { bg: "bg-violet-100", text: "text-violet-600", bar: "bg-violet-500" },
  { bg: "bg-sky-100",    text: "text-sky-600",    bar: "bg-sky-500"    },
  { bg: "bg-rose-100",   text: "text-rose-600",   bar: "bg-rose-500"   },
  { bg: "bg-amber-100",  text: "text-amber-600",  bar: "bg-amber-500"  },
  { bg: "bg-emerald-100",text: "text-emerald-600",bar: "bg-emerald-500"},
];

function accentFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return ACCENT_COLOURS[hash % ACCENT_COLOURS.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const accent = accentFor(module.name);

  const { mutate: handleDeleteModule, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteModule(module.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module deleted successfully.");
      setIsMenuOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete module:", error);
      toast.error("Failed to delete module. Please try again.");
    },
  });

  // Derive counts from mockIssues — read-only, no backend
  const moduleIssues = mockIssues.filter((i) => i.module_id === module.id);
  const total        = moduleIssues.length;
  const completed    = moduleIssues.filter((i) => i.state === "Done").length;
  const inProgress   = moduleIssues.filter((i) => i.state === "In Progress").length;
  const progressPct  = module.progress ?? (total > 0 ? Math.round((completed / total) * 100) : 0);

  const onDelete = async () => {
    setIsMenuOpen(false);
    const ok = await confirm({
      title: "Delete Module",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (ok) {
      handleDeleteModule();
    }
  };

  return (
    <>
      <div
        className="
          group relative flex flex-col
          rounded-xl border border-gray-200 bg-white
          p-4 shadow-sm
          cursor-pointer
          hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
          transition-all duration-200
        "
      >
        {/* ── Top row: icon + title + ••• menu ──────────────────────── */}
        <div className="mb-2 flex items-center gap-2.5">
          {/* Identifier avatar — smaller, inline */}
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-wide ${accent.bg} ${accent.text}`}
          >
            {initials(module.name)}
          </div>

          {/* Title */}
          <h3 className="flex-1 truncate text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
            {module.name}
          </h3>

          {/* ••• menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((current) => !current);
              }}
              className="
                shrink-0 rounded p-1 text-gray-300
                hover:bg-gray-100 hover:text-gray-600
                transition-all
              "
              aria-label="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
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
        </div>

      {/* ── Description ───────────────────────────────────────────── */}
      <p className="mb-3 text-[11px] leading-relaxed text-gray-400 line-clamp-2">
        {module.description}
      </p>

      {/* ── Progress ──────────────────────────────────────────────── */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Progress</span>
          <span className="text-[10px] font-semibold text-gray-600">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${accent.bar}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-2.5 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <CircleDot className="h-3 w-3 text-gray-400" />
          {total} {total === 1 ? "Issue" : "Issues"}
        </span>

        {inProgress > 0 && (
          <span className="flex items-center gap-1 text-orange-500">
            <CheckCircle2 className="h-3 w-3" />
            {inProgress} active
          </span>
        )}

        <span className="ml-auto flex items-center gap-1 text-gray-400">
          <Clock className="h-3 w-3" />
          2h ago
        </span>
      </div>
    </div>

    {isEditOpen && (
      <ModuleEditModal
        module={module}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
      />
    )}
  </>
  );
};

const ModuleEditModal = ({
  module,
  onClose,
  onSuccess,
}: {
  module: Module;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(module.name);
  const [description, setDescription] = useState(module.description ?? "");
  const [startDate, setStartDate] = useState(module.start_date ?? "");
  const [endDate, setEndDate] = useState(module.end_date ?? "");

  const { mutate: handleUpdateModule, isPending } = useMutation({
    mutationFn: () =>
      updateModule(module.id, {
        name: title,
        description,
        start_date: startDate,
        end_date: endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module updated successfully.");
      onSuccess();
    },
    onError: (error) => {
      console.error("Failed to update module:", error);
      toast.error("Failed to update module. Please try again.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = createModuleSchema.safeParse({ title, description, startDate, endDate });
    if (!validation.success) {
      const first = validation.error.issues[0];
      toast.warning(first.message || "Validation error");
      return;
    }

    handleUpdateModule();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit module</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update the module title and description.
            </p>
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
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-3 py-1 text-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
