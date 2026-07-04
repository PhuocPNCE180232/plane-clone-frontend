import { UserCircle, ArrowRight } from "lucide-react";

export const YourWorkEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <UserCircle className="h-7 w-7 text-gray-400" />
      </div>

      {/* Heading */}
      <h2 className="mb-1 text-sm font-semibold text-gray-700">
        No assigned work
      </h2>

      {/* Description */}
      <p className="mb-6 max-w-xs text-xs leading-relaxed text-gray-400">
        Work items assigned to you will appear here.
      </p>

      {/* CTA — visual only, no onClick */}
      <button
        className="
          flex items-center gap-1.5
          rounded-md bg-[#3f76ff]
          px-4 py-2
          text-xs font-medium text-white
          hover:bg-[#2d63e8]
          transition-colors
        "
      >
        <ArrowRight className="h-3.5 w-3.5" />
        View all work items
      </button>
    </div>
  );
};
