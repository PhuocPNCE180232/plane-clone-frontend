import type { ReactNode } from "react";
import { Download, Search } from "lucide-react";

export type AnalyticsTableRow = {
  id: string;
  cells: ReactNode[];
};

interface AnalyticsDataTableProps {
  columns: string[];
  rows: AnalyticsTableRow[];
  emptyLabel: string;
  showToolbar?: boolean;
}

export const AnalyticsDataTable = ({
  columns,
  rows,
  emptyLabel,
  showToolbar = true,
}: AnalyticsDataTableProps) => {
  return (
    <div>
      {showToolbar && <AnalyticsTableToolbar />}

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
          <p className="text-xs text-gray-400">{emptyLabel}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-180 border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-100"
                >
                  {row.cells.map((cell, index) => (
                    <td
                      key={`${row.id}-${index}`}
                      className="px-3 py-2 text-gray-600"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AnalyticsTableToolbar = () => {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex h-8 w-64 items-center gap-2 rounded-md border border-gray-200 px-2">
        <Search className="h-3.5 w-3.5 text-gray-400" />

        <input
          placeholder="Search"
          className="h-full w-full border-none bg-transparent text-xs outline-none placeholder:text-gray-400"
        />
      </div>

      <button
        type="button"
        className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        <Download className="h-3.5 w-3.5" />
        Export as csv
      </button>
    </div>
  );
};