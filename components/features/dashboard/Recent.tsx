import { Clock } from "lucide-react";

export const Recent = () => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recent
        </h2>

        <button className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors">
          All
        </button>
      </div>

      <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-center shadow-sm">
        <Clock className="mb-2 h-7 w-7 text-gray-300" />
        <p className="text-xs text-gray-400">No recent activity.</p>
      </div>
    </section>
  );
};