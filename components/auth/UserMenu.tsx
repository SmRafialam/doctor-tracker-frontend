"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useMe } from "@/hooks/queries";
import { api } from "@/lib/api";

export default function UserMenu() {
  const { data: user } = useMe();
  const qc = useQueryClient();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await api.post("/auth/logout");
      qc.clear(); // drop every cached response that belonged to this session
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setPending(false);
    }
  }

  const initials = user?.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700" aria-hidden>
            {initials}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={logout}
        disabled={pending}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
      >
        <ArrowRightStartOnRectangleIcon className="h-5 w-5" aria-hidden />
        <span>{pending ? "Signing out…" : "Sign out"}</span>
      </button>
    </div>
  );
}
