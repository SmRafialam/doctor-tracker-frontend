import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

// Works with react-hook-form's register(): React 19 passes `ref` as a normal prop.
export default function Input({ label, error, hint, id, name, className, ...props }: InputProps) {
  const inputId = id ?? name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
        {props.required && (
          <span className="text-red-600" aria-hidden>
            {" *"}
          </span>
        )}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-10 rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 disabled:bg-slate-100",
          error
            ? "border-red-500 focus:ring-red-500/40"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/40",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
