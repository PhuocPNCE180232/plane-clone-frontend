import type { Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";

import type { DisplayOptions } from "./types";

interface DisplayPanelProps {
  displayOptions: DisplayOptions;
  setDisplayOptions: Dispatch<SetStateAction<DisplayOptions>>;
}

export const DisplayPanel = ({
  displayOptions,
  setDisplayOptions,
}: DisplayPanelProps) => {
  const toggleOption = (key: keyof DisplayOptions) => {
    setDisplayOptions((currentOptions) => ({
      ...currentOptions,
      [key]: !currentOptions[key],
    }));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="mb-3 text-xs font-semibold text-gray-700">Display</p>

      <div className="space-y-2">
        <DisplayOption
          checked={displayOptions.showProject}
          label="Project"
          onClick={() => toggleOption("showProject")}
        />

        <DisplayOption
          checked={displayOptions.showPriority}
          label="Priority"
          onClick={() => toggleOption("showPriority")}
        />

        <DisplayOption
          checked={displayOptions.showCreatedDate}
          label="Created date"
          onClick={() => toggleOption("showCreatedDate")}
        />
      </div>
    </div>
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
      className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
    >
      {label}
      {checked && <Check className="h-3.5 w-3.5 text-[#3f76ff]" />}
    </button>
  );
};