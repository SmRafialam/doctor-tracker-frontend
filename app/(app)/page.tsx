import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Overview of your doctors, patients and care trends.</p>
      </div>
      <DashboardView />
    </div>
  );
}
