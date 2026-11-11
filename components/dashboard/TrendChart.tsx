"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonth, formatMonthLong } from "@/lib/format";
import ChartTooltip from "./ChartTooltip";
import { chart, tickStyle } from "./chartTheme";

/** New patient registrations per month: a single series on a single axis. */
export default function TrendChart({ data }: { data: { month: string; patients: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chart.series} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chart.series} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chart.grid} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={tickStyle}
          tickLine={false}
          axisLine={{ stroke: chart.axis }}
          minTickGap={16}
        />
        <YAxis allowDecimals={false} tick={tickStyle} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          cursor={{ stroke: chart.axis, strokeWidth: 1 }}
          content={<ChartTooltip unit="new patients" formatLabel={formatMonthLong} />}
        />
        <Area
          type="monotone"
          dataKey="patients"
          stroke={chart.series}
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 5, stroke: chart.surface, strokeWidth: 2, fill: chart.series }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
