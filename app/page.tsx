import type { ComponentType, SVGProps } from "react";
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChartPieIcon,
  ClockIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader } from "@/components/ui";
import { doctors, patients } from "@/lib/mock-data";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const stats: { label: string; value: string; change: string; icon: Icon; tone: string }[] = [
  { label: "Total doctors", value: String(doctors.length), change: "+2 this month", icon: UserGroupIcon, tone: "bg-blue-50 text-blue-600" },
  { label: "Total patients", value: String(patients.length), change: "+12% vs last month", icon: UsersIcon, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Appointments today", value: "18", change: "5 remaining", icon: CalendarDaysIcon, tone: "bg-amber-50 text-amber-600" },
  { label: "Avg. wait time", value: "14 min", change: "−3 min vs last week", icon: ClockIcon, tone: "bg-slate-100 text-slate-600" },
];

const charts: { title: string; description: string; icon: Icon; wide?: boolean }[] = [
  { title: "Patients per doctor", description: "Bar chart", icon: ChartBarIcon },
  { title: "Appointment status", description: "Pie chart: completed, scheduled, cancelled", icon: ChartPieIcon },
  { title: "New registrations over time", description: "Line chart: last 12 months", icon: PresentationChartLineIcon, wide: true },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Overview of doctors, patients and appointments.</p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key statistics
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, change, icon: Icon, tone }) => (
            <li key={label}>
              <Card>
                <CardBody className="flex items-center gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-slate-600">{label}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{change}</p>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="charts-heading" className="space-y-4">
        <h2 id="charts-heading">Analytics</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {charts.map(({ title, description, icon: Icon, wide }) => (
            <Card key={title} className={wide ? "lg:col-span-2" : undefined}>
              <CardHeader>
                <h3 className="text-base">{title}</h3>
              </CardHeader>
              <CardBody>
                <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                  <Icon className="h-10 w-10" aria-hidden />
                  <p className="text-sm">{description} (placeholder)</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
