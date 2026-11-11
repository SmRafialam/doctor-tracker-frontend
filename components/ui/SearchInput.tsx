import type { ComponentProps } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function SearchInput({
  label,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <div className="relative w-full sm:max-w-md">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        aria-label={label}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        {...props}
      />
    </div>
  );
}
