"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExclamationCircleIcon, UserGroupIcon, UsersIcon, ScaleIcon } from "@heroicons/react/24/outline";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { ErrorState, Skeleton } from "@/components/ui";
import { useDashboard } from "@/hooks/queries";
import { getErrorMessage } from "@/lib/api";
import { STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { formatMonthLong, formatNumber, percentChange } from "@/lib/format";
import type { PatientStatus } from "@/lib/types";
import ChartCard from "./ChartCard";
import StatTile from "./StatTile";
import StatusBreakdown from "./StatusBreakdown";

// Recharts is ~100kB: load it lazily, client-only, so the tiles render first.
const chartFallback = () => <Skeleton className="h-64 w-full" />;
const TrendChart = dynamic(() => import("./TrendChart"), { ssr: false, loading: chartFallback });
const RankedBarChart = dynamic(() => import("./RankedBarChart"), { ssr: false, loading: chartFallback });

const RANGES = [3, 6, 12] as const;

function RangeToggle({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Time range" className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
      {RANGES.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={value === m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            value === m ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {m}M
        </button>
      ))}
    </div>
  );
}

function Delta({ current, previous }: { current: number; previous: number }) {
  const pct = percentChange(current, previous);
  if (pct === null) return <span>{current} this month</span>;
  const up = pct >= 0;
  const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("inline-flex items-center font-medium", up ? "text-green-700" : "text-slate-600")}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {up ? "+" : ""}
        {pct}%
      </span>
      <span>{current} new, vs same period last month</span>
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export default function DashboardView() {
  const [months, setMonths] = useState<number>(12);
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard(months);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  const { totals } = data;
  const periodTotal = data.trend.reduce((s, t) => s + t.patients, 0);
  const doctorsInPeriod = data.trend.reduce((s, t) => s + t.doctors, 0);

  return (
    <div className="space-y-6">
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Key figures
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Total doctors"
            value={formatNumber(totals.doctors)}
            icon={UserGroupIcon}
            iconClass="bg-blue-50 text-blue-600"
            footnote={`${totals.doctorsThisMonth} joined this month`}
          />
          <StatTile
            label="Total patients"
            value={formatNumber(totals.patients)}
            icon={UsersIcon}
            iconClass="bg-emerald-50 text-emerald-600"
            footnote={<Delta current={totals.patientsThisMonth} previous={totals.patientsLastMonth} />}
          />
          <StatTile
            label="Avg. patients per doctor"
            value={String(totals.avgPatientsPerDoctor)}
            icon={ScaleIcon}
            iconClass="bg-violet-50 text-violet-600"
            footnote={
              totals.doctorsWithoutPatients > 0
                ? `${totals.doctorsWithoutPatients} doctor${totals.doctorsWithoutPatients === 1 ? "" : "s"} without patients`
                : "Every doctor has patients"
            }
          />
          <StatTile
            label="Critical patients"
            value={formatNumber(totals.criticalPatients)}
            icon={ExclamationCircleIcon}
            iconClass="bg-red-50 text-red-600"
            footnote={`${totals.patients ? Math.round((totals.criticalPatients / totals.patients) * 100) : 0}% of all patients`}
          />
        </div>
      </section>

      <div className={cn("space-y-6 transition-opacity", isFetching && "opacity-70")}>
        <ChartCard
          title="Patient registrations"
          description={`${formatNumber(periodTotal)} new patients and ${doctorsInPeriod} new doctors in the last ${months} months · ${formatMonthLong(data.trend[data.trend.length - 1].month)} is month to date`}
          action={<RangeToggle value={months} onChange={setMonths} />}
          table={{
            columns: ["Month", "New patients"],
            rows: data.trend.map((t) => [formatMonthLong(t.month), t.patients]),
          }}
        >
          <TrendChart data={data.trend} />
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          <ChartCard
            className="lg:col-span-3"
            title="Patients per doctor"
            description="Top 10 doctors by patient load. Select a bar to open the doctor."
            table={{
              columns: ["Doctor", "Patients"],
              rows: data.patientsPerDoctor.map((d) => [`${d.name} (${d.specialization})`, d.count]),
            }}
          >
            <RankedBarChart
              unit="patients"
              data={data.patientsPerDoctor.map((d) => ({ id: d.id, name: d.name, value: d.count }))}
              onSelect={(row) => row.id && router.push(`/doctors/${row.id}`)}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-2"
            title="Patient status"
            description="Current state of all patients"
            table={{
              columns: ["Status", "Patients"],
              rows: data.byStatus.map((s) => [STATUS_LABEL[s.name as PatientStatus] ?? s.name, s.value]),
            }}
          >
            <StatusBreakdown data={data.byStatus} />
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <ChartCard
            title="Most common conditions"
            description="Top 8 diagnoses across all patients"
            table={{ columns: ["Condition", "Patients"], rows: data.byCondition.map((c) => [c.name, c.value]) }}
          >
            <RankedBarChart unit="patients" data={data.byCondition} />
          </ChartCard>
          <ChartCard
            title="Doctors by specialization"
            description="How your medical staff is distributed"
            table={{ columns: ["Specialization", "Doctors"], rows: data.bySpecialization.map((s) => [s.name, s.value]) }}
          >
            <RankedBarChart unit="doctors" data={data.bySpecialization} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
