import { Boxes } from "lucide-react";
import { mockModules } from "@/mocks/db";
import { ModuleCard } from "./ModuleCard";

export const ModuleGrid = () => {
  if (mockModules.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center shadow-sm">
        <Boxes className="mb-3 h-10 w-10 text-gray-200" />
        <p className="text-sm font-medium text-gray-500">No Modules Yet</p>
        <p className="mt-1 max-w-xs text-xs text-gray-400">
          Create your first module to group and organise related issues together.
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Section label — identical style to "All Projects" / "Active Cycles" */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        All Modules
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
};
