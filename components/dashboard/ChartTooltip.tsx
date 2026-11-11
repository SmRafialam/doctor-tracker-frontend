import { chart } from "./chartTheme";

type Props = {
  active?: boolean;
  label?: string | number;
  payload?: { value?: number | string }[];
  formatLabel?: (label: string) => string;
  unit: string;
};

/** Value leads (strong), label follows; keyed with a short line in the series color. */
export default function ChartTooltip({ active, payload, label, formatLabel, unit }: Props) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="text-xs text-slate-500">{formatLabel ? formatLabel(String(label)) : label}</p>
      <p className="mt-0.5 flex items-center gap-2">
        <span className="inline-block h-0.5 w-3 rounded" style={{ background: chart.series }} aria-hidden />
        <span className="font-semibold tabular-nums text-slate-900">{value}</span>
        <span className="text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
