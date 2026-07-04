import { CycleHeader } from "./CycleHeader";
import { CycleList } from "./CycleList";
import { ChevronRight } from "lucide-react";

export const CyclePage = () => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="hover:text-gray-900 cursor-pointer transition-colors">Plane Clone</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Cycles</span>
      </div>

      <CycleHeader />
      <CycleList />
    </>
  );
};
