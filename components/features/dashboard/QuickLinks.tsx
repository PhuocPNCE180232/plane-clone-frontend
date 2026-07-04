import { Link2 } from "lucide-react";

export const QuickLinks = () => {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Quick Links
        </h2>

        <button className="text-xs font-medium text-[#3f76ff] hover:text-[#2d63e8] transition-colors">
          + Add quick link
        </button>
      </div>

      <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-center shadow-sm">
        <Link2 className="mb-2 h-7 w-7 text-gray-300" />
        <p className="max-w-xs text-xs text-gray-400">
          Keep important references, resources or docs handy for your work.
        </p>
      </div>
    </section>
  );
};