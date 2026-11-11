import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card, CardBody, CardHeader } from "@/components/ui";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Data-table view of the chart for screen readers and exact values. */
  table?: { columns: [string, string]; rows: [string, string | number][] };
  className?: string;
};

export default function ChartCard({ title, description, action, children, table, className }: Props) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="items-start">
        <div>
          <h3 className="text-base">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </CardHeader>
      <CardBody>
        {children}
        {table && table.rows.length > 0 && (
          <details className="group mt-4 text-sm">
            <summary className="cursor-pointer select-none rounded text-xs font-medium text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              View as table
            </summary>
            <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">{table.columns[0]}</th>
                    <th className="px-3 py-2 text-right font-medium">{table.columns[1]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.rows.map(([label, value]) => (
                    <tr key={label}>
                      <td className="px-3 py-1.5 text-slate-700">{label}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-slate-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </CardBody>
    </Card>
  );
}
