"use client";

import { useId, useState, type ReactNode } from "react";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/cn";

const control =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={control}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateFilter({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        type="date"
        value={value ?? ""}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={control}
      />
    </label>
  );
}

export function FilterPanel({
  search,
  children,
  activeCount,
  onClear,
  className,
}: {
  /** Always-visible search box. */
  search: ReactNode;
  /** Filter controls; collapsed behind a toggle on small screens. */
  children: ReactNode;
  activeCount: number;
  onClear: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">{search}</div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-600 px-1.5 text-xs text-white">{activeCount}</span>
          )}
        </button>
      </div>
      <div
        id={panelId}
        className={cn(
          "mt-3 grid-cols-1 gap-3 sm:grid-cols-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]",
          open ? "grid" : "hidden",
        )}
      >
        {children}
      </div>
      {activeCount > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            {activeCount} filter{activeCount === 1 ? "" : "s"} applied
          </p>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded text-sm font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
