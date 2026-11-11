"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  // One client per browser session (created lazily so it isn't shared across server requests).
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // treat data as fresh for 30s: instant back/forward navigation
            refetchOnWindowFocus: false,
            retry: (count, error) => {
              // Never retry client errors (401/404/validation); retry network/5xx once.
              const status = error instanceof AxiosError ? error.response?.status : undefined;
              return status !== undefined && status < 500 ? false : count < 1;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  );
}
