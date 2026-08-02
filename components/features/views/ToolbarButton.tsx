import type { ReactNode } from "react";

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export const ToolbarButton = ({
  icon,
  label,
  onClick,
  active = false,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium ${
        active
          ? "border-[#3f76ff] bg-[#3f76ff]/10 text-[#3f76ff]"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};