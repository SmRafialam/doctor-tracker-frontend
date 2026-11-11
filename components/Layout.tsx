import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import NavLinks from "./NavLinks";
import UserMenu from "./auth/UserMenu";

function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
          <HeartIcon className="h-5 w-5 text-white" aria-hidden />
        </span>
        <span className="text-lg font-semibold text-slate-900">Doctor Tracker</span>
      </Link>
      <UserMenu />
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto p-2 md:sticky md:top-16 md:flex-col md:p-4">
        <Suspense fallback={null}>
          <NavLinks />
        </Suspense>
      </nav>
    </aside>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
