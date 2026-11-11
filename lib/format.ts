import { format, parseISO } from "date-fns";

export const formatDate = (iso: string) => format(parseISO(iso), "d MMM yyyy");
export const formatMonth = (iso: string) => format(parseISO(iso), "MMM yy");
export const formatMonthLong = (iso: string) => format(parseISO(iso), "MMMM yyyy");
export const formatNumber = (n: number) => new Intl.NumberFormat("en").format(n);

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
