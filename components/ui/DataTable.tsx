"use client";

import { memo, type ReactNode } from "react";
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/cn";
import Skeleton from "./Skeleton";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Server-side sort field; makes the header clickable. */
  sortField?: string;
  className?: string;
  align?: "left" | "right";
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  /** Card layout used below the `md` breakpoint instead of a cramped table. */
  renderMobileCard: (row: T) => ReactNode;
  isLoading: boolean;
  /** True while a new page/filter loads over stale data. */
  isFetching?: boolean;
  sort?: string;
  onSortChange?: (sort: string) => void;
  empty: ReactNode;
  caption: string;
};

function SortIcon({ dir }: { dir: "asc" | "desc" | null }) {
  const Icon = dir === "asc" ? ChevronUpIcon : dir === "desc" ? ChevronDownIcon : ChevronUpDownIcon;
  return <Icon className={cn("h-4 w-4", dir ? "text-blue-600" : "text-slate-400")} aria-hidden />;
}

function DataTableInner<T>({
  columns,
  rows,
  getRowId,
  renderMobileCard,
  isLoading,
  isFetching,
  sort,
  onSortChange,
  empty,
  caption,
}: Props<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4" aria-busy="true" aria-label="Loading">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) return <>{empty}</>;

  const sortDir = (field?: string) =>
    !field || !sort ? null : sort === field ? "asc" : sort === `-${field}` ? "desc" : null;

  return (
    <div className={cn("transition-opacity", isFetching && "opacity-60")} aria-busy={isFetching}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => {
                const dir = sortDir(col.sortField);
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                    className={cn("px-4 py-3", col.align === "right" && "text-right", col.className)}
                  >
                    {col.sortField && onSortChange ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(dir === "asc" ? `-${col.sortField}` : col.sortField!)}
                        className="inline-flex items-center gap-1 rounded uppercase hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        {col.header}
                        <SortIcon dir={dir} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={getRowId(row)} className="transition-colors hover:bg-slate-50/70">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 align-middle", col.align === "right" && "text-right", col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={getRowId(row)}>{renderMobileCard(row)}</li>
        ))}
      </ul>
    </div>
  );
}

// memo + generic: re-render only when rows/columns/sort actually change.
const DataTable = memo(DataTableInner) as typeof DataTableInner;
export default DataTable;
