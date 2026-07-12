"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [mswReady, setMswReady] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  useEffect(() => {
    async function enableMocking() {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
      }
      setMswReady(true);
    }
    enableMocking();
  }, []);

  if (!mswReady && process.env.NODE_ENV === "development") {
    return null; // Ensure MSW is ready before rendering components that fetch data
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}