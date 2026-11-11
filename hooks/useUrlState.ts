"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type Updates = Record<string, string | number | undefined | null>;

/**
 * Filters, search, sort and page live in the URL rather than component
 * state: views are shareable and bookmarkable, survive a refresh, and the
 * back button undoes a filter change.
 *
 * `prefix` namespaces the keys, so two lists on one page don't collide.
 */
export function useUrlState(prefix = "") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = useMemo(() => {
    const out: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith(prefix)) out[key.slice(prefix.length)] = value;
    });
    return out;
  }, [searchParams, prefix]);

  const setParams = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "") next.delete(prefix + key);
        else next.set(prefix + key, String(value));
      }
      // Changing any filter jumps back to page 1.
      if (!("page" in updates)) next.delete(prefix + "page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname, prefix],
  );

  const clear = useCallback(
    (keep: string[] = []) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const key of [...next.keys()]) {
        if (key.startsWith(prefix) && !keep.includes(key.slice(prefix.length))) next.delete(key);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname, prefix],
  );

  return { params, setParams, clear };
}
