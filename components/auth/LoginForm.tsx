"use client";

import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Button, Input } from "@/components/ui";
import { dashboardQuery, doctorsQuery, keys, patientsQuery } from "@/hooks/queries";
import { api, getErrorMessage } from "@/lib/api";
import { EMAIL_PATTERN } from "@/lib/constants";
import type { User } from "@/lib/types";

type FormValues = { email: string; password: string };

/** Data each landing page needs first, keyed by path (must match the page's own query). */
const PREFETCH_BY_PATH: Record<string, (qc: QueryClient) => Promise<void>> = {
  "/": (qc) => qc.prefetchQuery(dashboardQuery(12)),
  "/doctors": (qc) => qc.prefetchQuery(doctorsQuery({})),
  "/patients": (qc) => qc.prefetchQuery(patientsQuery({})),
};

/** Only allow same-site relative redirects (prevents open-redirect via ?next=). */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [navigating, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const { data } = await api.post<{ user: User }>("/auth/login", values);
      qc.setQueryData(keys.me, data.user);

      const target = safeNext(searchParams.get("next"));
      // Start fetching the destination's data NOW, in parallel with loading the
      // page itself, instead of waiting for the page to mount and then fetch.
      const prefetch = PREFETCH_BY_PATH[target];
      if (prefetch) void prefetch(qc);

      // A transition keeps "Signing in…" on screen until the next page is ready.
      startTransition(() => router.replace(target));
    } catch (error) {
      setFormError(getErrorMessage(error, "Sign in failed"));
    }
  }

  const busy = isSubmitting || navigating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="username"
        autoFocus
        required
        placeholder="admin@doctortracker.dev"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
        })}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          className="pr-10"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-2 top-[30px] rounded p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" aria-hidden /> : <EyeIcon className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>

      <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        Demo account: <span className="font-mono">admin@doctortracker.dev</span> /{" "}
        <span className="font-mono">Admin@12345</span>
      </p>
    </form>
  );
}
