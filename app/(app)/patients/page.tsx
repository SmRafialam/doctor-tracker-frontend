import type { Metadata } from "next";
import { Suspense } from "react";
import PatientsManager from "@/components/patients/PatientsManager";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Patients</h1>
        <p className="mt-1 text-sm text-slate-600">Search, filter and manage every patient across all doctors.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PatientsManager />
      </Suspense>
    </div>
  );
}
