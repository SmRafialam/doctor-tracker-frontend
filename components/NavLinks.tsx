"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/doctors", label: "Doctors", icon: UserGroupIcon },
  { href: "/patients", label: "Patients", icon: UsersIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return links.map(({ href, label, icon: Icon }) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
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
