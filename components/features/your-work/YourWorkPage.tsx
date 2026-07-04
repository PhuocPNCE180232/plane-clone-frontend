import { ChevronRight } from "lucide-react";
import { YourWorkHeader } from "./YourWorkHeader";
import { YourWorkEmptyState } from "./YourWorkEmptyState";

export const YourWorkPage = () => {
  return (
    <>
      {/* Breadcrumb — same pattern as every other page */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Your Work</span>
      </div>

      <YourWorkHeader />
      <YourWorkEmptyState />
    </>
  );
};
