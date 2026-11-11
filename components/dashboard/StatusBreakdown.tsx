import { STATUS_LABEL } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { Bucket, PatientStatus } from "@/lib/types";
import { chart } from "./chartTheme";

const ORDER: PatientStatus[] = ["active", "critical", "recovered"];

/**
 * Part-to-whole for three states: one segmented bar plus a labelled legend
 * (a donut would make the close values hard to compare).
 */
export default function StatusBreakdown({ data }: { data: Bucket[] }) {
  const counts = new Map(data.map((d) => [d.name, d.value]));
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const rows = ORDER.map((status) => ({ status, value: counts.get(status) ?? 0 }));

  return (
    <div className="space-y-5">
      <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label="Patient status distribution">
        {rows.map(({ status, value }) =>
          value > 0 ? (
            <div
              key={status}
              title={`${STATUS_LABEL[status]}: ${value}`}
              style={{ width: `${(value / total) * 100}%`, background: chart.status[status] }}
              className="first:rounded-l-full last:rounded-r-full"
            />
          ) : null,
        )}
      </div>
      <ul className="space-y-3">
        {rows.map(({ status, value }) => (
          <li key={status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: chart.status[status] }} aria-hidden />
              {STATUS_LABEL[status]}
            </span>
            <span className="tabular-nums">
              <span className="font-semibold text-slate-900">{formatNumber(value)}</span>
              <span className="ml-2 text-slate-500">{Math.round((value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
