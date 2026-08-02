import { UserCircle } from "lucide-react";

export const YourWorkEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <UserCircle className="h-7 w-7 text-gray-400" />
      </div>

      <h2 className="mb-1 text-sm font-semibold text-gray-700">
        No assigned work
      </h2>

      <p className="max-w-xs text-xs leading-relaxed text-gray-400">
        Work items assigned to you in any workspace will appear here.
      </p>
    </div>
  );
};
