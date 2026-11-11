"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { chart, tickStyle } from "./chartTheme";

type Row = { name: string; value: number; id?: string };

type Props = {
  data: Row[];
  unit: string;
  /** Makes each bar a link target (e.g. jump to that doctor). */
  onSelect?: (row: Row) => void;
};

const truncate = (s: string, n = 18) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Horizontal ranked bars: long category labels stay readable, longest bar on top. */
export default function RankedBarChart({ data, unit, onSelect }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const height = Math.max(160, data.length * 32 + 24);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        barCategoryGap={8}
        onMouseLeave={() => setHover(null)}
      >
        <CartesianGrid horizontal={false} stroke={chart.grid} />
        <XAxis type="number" allowDecimals={false} tick={tickStyle} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={136}
          tick={tickStyle}
          tickLine={false}
          axisLine={{ stroke: chart.axis }}
          tickFormatter={(v: string) => truncate(v)}
        />
        <Tooltip cursor={{ fill: "rgba(11,11,11,0.04)" }} content={<ChartTooltip unit={unit} />} />
        <Bar
          dataKey="value"
          radius={[0, 4, 4, 0]}
          maxBarSize={16}
          isAnimationActive={false}
          cursor={onSelect ? "pointer" : undefined}
          onClick={onSelect ? (_, index) => onSelect(data[index]) : undefined}
          onMouseEnter={(_, index) => setHover(index)}
        >
          {data.map((row, i) => (
            <Cell key={row.id ?? row.name} fill={hover === i ? chart.seriesHover : chart.series} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
