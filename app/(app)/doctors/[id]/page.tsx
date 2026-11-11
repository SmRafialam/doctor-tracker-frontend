import type { Metadata } from "next";
import { Suspense } from "react";
import DoctorDetail from "@/components/doctors/DoctorDetail";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Doctor" };

export default function DoctorDetailsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <DoctorDetail />
    </Suspense>
  );
}
