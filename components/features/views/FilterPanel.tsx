import {
  ISSUE_PRIORITIES,
  ISSUE_STATES,
} from "./views.helpers";

import type {
  IssuePriorityFilter,
  IssueStateFilter,
} from "./types";

interface FilterPanelProps {
  stateFilter: IssueStateFilter;
  priorityFilter: IssuePriorityFilter;
  setStateFilter: (value: IssueStateFilter) => void;
  setPriorityFilter: (value: IssuePriorityFilter) => void;
  onClear: () => void;
}

export const FilterPanel = ({
  stateFilter,
  priorityFilter,
  setStateFilter,
  setPriorityFilter,
  onClear,
}: FilterPanelProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Filters</p>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-[#3f76ff]"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-medium text-gray-500">
          State
          <select
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as IssueStateFilter)
            }
            className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-xs outline-none"
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
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as IssuePriorityFilter)
            }
            className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-xs outline-none"
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
  );
};