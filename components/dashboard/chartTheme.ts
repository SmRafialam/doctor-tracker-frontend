/** Chart tokens. One series per chart → one categorical color; chrome stays recessive. */
export const chart = {
  series: "#2a78d6",
  seriesHover: "#1c5cab",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  tick: "#6b6a65",
  surface: "#ffffff",
  // Reserved status colors; they only ever encode patient status.
  status: {
    active: "#2a78d6",
    critical: "#d03b3b",
    recovered: "#0ca30c",
  } as Record<string, string>,
};

export const tickStyle = { fontSize: 12, fill: chart.tick };
