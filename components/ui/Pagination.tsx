"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PAGE_SIZES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { PageMeta } from "@/lib/types";

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 20 */
function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p]));
}

type Props = {
  meta: PageMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  noun: string;
};

export default function Pagination({ meta, onPageChange, onLimitChange, noun }: Props) {
  const { page, limit, total, totalPages } = meta;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      aria-label={`${noun} pagination`}
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <p aria-live="polite">
          Showing <span className="font-medium text-slate-900">{from}–{to}</span> of{" "}
          <span className="font-medium text-slate-900">{total}</span>
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Rows per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={cn(btn, "text-slate-600 hover:bg-slate-100")}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden />
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                btn,
                p === page ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100",
                // On phones show only the current page between the arrows.
                p !== page && "hidden sm:inline-flex",
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className={cn(btn, "text-slate-600 hover:bg-slate-100")}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
