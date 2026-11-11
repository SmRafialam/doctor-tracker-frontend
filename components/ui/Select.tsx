import type { ComponentProps } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/cn";

type SelectProps = ComponentProps<"select"> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export default function Select({
  label,
  error,
  options,
  placeholder,
  id,
  name,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? name;
  const errorId = `${selectId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
        {label}
        {props.required && (
          <span className="text-red-600" aria-hidden>
            {" *"}
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm text-slate-900",
            "focus:outline-none focus:ring-2 disabled:bg-slate-100",
            error
              ? "border-red-500 focus:ring-red-500/40"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/40",
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
