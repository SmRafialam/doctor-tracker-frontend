"use client";

import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { dashboardQuery, doctorsQuery, patientsQuery } from "@/hooks/queries";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Dashboard", icon: HomeIcon, load: (qc: QueryClient) => qc.prefetchQuery(dashboardQuery(12)) },
  { href: "/doctors", label: "Doctors", icon: UserGroupIcon, load: (qc: QueryClient) => qc.prefetchQuery(doctorsQuery({})) },
  { href: "/patients", label: "Patients", icon: UsersIcon, load: (qc: QueryClient) => qc.prefetchQuery(patientsQuery({})) },
];

export default function NavLinks() {
  const pathname = usePathname();
  const qc = useQueryClient();

  return links.map(({ href, label, icon: Icon, load }) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    // Next.js already prefetches the page code; this also starts loading the
    // page's DATA on hover/focus/touch, ~100–300ms before the click lands.
    // prefetchQuery is a no-op while the cached data is still fresh.
    const prefetch = () => void load(qc);
    return (
      <Link
        key={href}
        href={href}
        onMouseEnter={prefetch}
        onFocus={prefetch}
        onTouchStart={prefetch}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          active
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {label}
      </Link>
    );
  });
}
