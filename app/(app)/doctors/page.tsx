import type { Metadata } from "next";
import { Suspense } from "react";
import DoctorsView from "@/components/doctors/DoctorsView";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  // DoctorsView reads the URL (filters/page), so it renders behind Suspense;
  // the skeleton is part of the instantly-served static shell.
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <DoctorsView />
    </Suspense>
  );
}
