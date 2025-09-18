"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CommandPalette } from "@/components/layout/command-palette";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ServiceWorkerProvider>
          {children}
          <CommandPalette />
          <Toaster richColors position="top-right" closeButton />
          <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
        </ServiceWorkerProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
