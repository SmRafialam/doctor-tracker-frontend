import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<"textarea"> & { label: string; error?: string };

export default function Textarea({ label, error, id, name, className, ...props }: Props) {
  const fieldId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          "rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
          error ? "border-red-500 focus:ring-red-500/40" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/40",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
