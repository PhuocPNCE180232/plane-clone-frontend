import type { ReactNode } from "react";

interface ViewModeButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export const ViewModeButton = ({
  active,
  icon,
  label,
  onClick,
}: ViewModeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
        active
          ? "bg-white text-[#3f76ff] shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};