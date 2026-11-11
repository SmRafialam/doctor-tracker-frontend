import type { Metadata } from "next";
import { Suspense } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <HeartIcon className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-xl font-semibold">Doctor Tracker</span>
        </div>
        <div className="max-w-md space-y-4">
          <p className="text-3xl font-semibold leading-tight">
            Every doctor, every patient, and the numbers behind their care, in one place.
          </p>
          <p className="text-blue-100">
            Manage your medical staff, track patient outcomes and spot trends before they become problems.
          </p>
        </div>
        <p className="text-sm text-blue-200">Secure admin portal</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden />
      </section>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 lg:hidden">
              <HeartIcon className="h-6 w-6 text-white" aria-hidden />
            </span>
            <h1>Sign in</h1>
            <p className="text-sm text-slate-600">Use your administrator account to continue.</p>
          </div>
          {/* LoginForm reads ?next= via useSearchParams, so it sits behind Suspense. */}
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
