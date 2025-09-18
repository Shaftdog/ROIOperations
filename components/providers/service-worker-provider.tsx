"use client";

import { ReactNode, useEffect } from "react";

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((error) => {
          console.error("Service worker registration failed", error);
        });
    }
  }, []);

  return <>{children}</>;
}
