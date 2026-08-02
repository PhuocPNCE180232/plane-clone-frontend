import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  Check,
  Globe,
  ListFilter,
  Lock,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  ISSUE_PRIORITIES,
  ISSUE_STATES,
} from "./views.helpers";

import type {
  AddViewDraft,
  DisplayOptions,
  IssuePriorityFilter,
  IssueStateFilter,
} from "./types";

type QueryMode = "basic" | "pql";

interface AddViewModalProps {
  draft: AddViewDraft;
  setDraft: Dispatch<SetStateAction<AddViewDraft>>;
  onClose: () => void;
  onCreate: () => void;
}

export const AddViewModal = ({
  draft,
  setDraft,
  onClose,
  onCreate,
}: AddViewModalProps) => {
  const [queryMode, setQueryMode] = useState<QueryMode>("basic");
  const [showDisplayOptions, setShowDisplayOptions] = useState(false);
  const [pqlQuery, setPqlQuery] = useState("");

  const updateDraft = <Key extends keyof AddViewDraft>(
    key: Key,
    value: AddViewDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  const toggleDisplayOption = (key: keyof DisplayOptions) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      displayOptions: {
        ...currentDraft.displayOptions,
        [key]: !currentDraft.displayOptions[key],
      },
    }));
  };

  const canCreateView = draft.name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Create view
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close create view modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 pb-5">
          <input
            value={draft.name}
            onChange={(event) => updateDraft("name", event.target.value)}
            placeholder="Title"
            className="h-11 w-full rounded-md border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#3f76ff]"
          />

          <textarea
            value={draft.description}
            onChange={(event) =>
              updateDraft("description", event.target.value)
            }
            placeholder="Description"
            rows={5}
            className="w-full resize-none rounded-md border border-gray-200 px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#3f76ff]"
          />

          <div className="flex flex-wrap items-center gap-2">
            <AccessButton
              active={draft.access === "workspace"}
              icon={<Globe className="h-4 w-4" />}
              label="Workspace"
              onClick={() => updateDraft("access", "workspace")}
            />

            <AccessButton
              active={draft.access === "private"}
              icon={<Lock className="h-4 w-4" />}
              label="Private"
              onClick={() => updateDraft("access", "private")}
            />

            <button
              type="button"
              onClick={() =>
                setShowDisplayOptions((currentValue) => !currentValue)
              }
              className={`flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${
                showDisplayOptions
                  ? "border-[#3f76ff] bg-[#3f76ff]/10 text-[#3f76ff]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Display
            </button>
          </div>

          {showDisplayOptions && (
            <div className="grid gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-3">
              <DisplayOption
                checked={draft.displayOptions.showProject}
                label="Project"
                onClick={() => toggleDisplayOption("showProject")}
              />

              <DisplayOption
                checked={draft.displayOptions.showPriority}
                label="Priority"
                onClick={() => toggleDisplayOption("showPriority")}
              />

              <DisplayOption
                checked={draft.displayOptions.showCreatedDate}
                label="Created date"
                onClick={() => toggleDisplayOption("showCreatedDate")}
              />
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-3">
            <div className="mb-4 flex w-fit rounded-lg bg-gray-100 p-1">
              <QueryModeButton
                active={queryMode === "basic"}
                label="Basic"
                onClick={() => setQueryMode("basic")}
              />

              <QueryModeButton
                active={queryMode === "pql"}
                label="PQL"
                onClick={() => setQueryMode("pql")}
              />
            </div>

            {queryMode === "basic" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <ListFilter className="h-4 w-4" />
                  Basic filters
                </button>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs font-medium text-gray-500">
                    Search
                    <input
                      value={draft.searchQuery}
                      onChange={(event) =>
                        updateDraft("searchQuery", event.target.value)
                      }
                      placeholder="Search work items"
                      className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#3f76ff]"
                    />
                  </label>

                  <label className="text-xs font-medium text-gray-500">
                    State
                    <select
                      value={draft.stateFilter}
                      onChange={(event) =>
                        updateDraft(
                          "stateFilter",
                          event.target.value as IssueStateFilter,
                        )
                      }
                      className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs outline-none focus:border-[#3f76ff]"
                    >
                      <option value="all">All states</option>
                      {ISSUE_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-medium text-gray-500">
                    Priority
                    <select
                      value={draft.priorityFilter}
                      onChange={(event) =>
                        updateDraft(
                          "priorityFilter",
                          event.target.value as IssuePriorityFilter,
                        )
                      }
                      className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs outline-none focus:border-[#3f76ff]"
                    >
                      <option value="all">All priorities</option>
                      {ISSUE_PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  value={pqlQuery}
                  onChange={(event) => setPqlQuery(event.target.value)}
                  placeholder='state = "Backlog" AND priority = "High"'
                  rows={4}
                  className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#3f76ff]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  PQL editor is prepared for future query support.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCreate}
            disabled={!canCreateView}
            className="rounded-md bg-[#3f76ff] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2d63e8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create view
          </button>
        </div>
      </div>
    </div>
  );
};

interface AccessButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const AccessButton = ({
  active,
  icon,
  label,
  onClick,
}: AccessButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-md border px-3 text-sm ${
        active
          ? "border-[#3f76ff] bg-[#3f76ff]/10 text-[#3f76ff]"
          : "border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

interface QueryModeButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

const QueryModeButton = ({
  active,
  label,
  onClick,
}: QueryModeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {label}
    </button>
  );
};

interface DisplayOptionProps {
  checked: boolean;
  label: string;
  onClick: () => void;
}

const DisplayOption = ({
  checked,
  label,
  onClick,
}: DisplayOptionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
    >
      {label}
      {checked && <Check className="h-3.5 w-3.5 text-[#3f76ff]" />}
    </button>
  );
};