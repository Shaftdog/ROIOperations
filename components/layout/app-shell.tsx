"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, FolderKanban, Menu, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCommandPalette } from "@/lib/store/command-palette";
import { QuickEntryModal } from "@/components/orders/quick-entry-modal";
import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store/app-store";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FolderKanban },
  { name: "Orders", href: "/orders", icon: FolderKanban },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpen } = useCommandPalette();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppStore((state) => state.user) ?? {
    name: "Taylor Appraiser",
    email: "taylor@appraisalco.com",
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-6 py-8 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-semibold text-primary">
            ROI Operations
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="mt-10 space-y-1">
          {navigation.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" aria-hidden />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <QuickEntryModal>
            <Button className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Quick order entry
            </Button>
          </QuickEntryModal>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <Avatar fallback={user.name} />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-1 items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search orders, clients..."
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/60 dark:border-slate-800"
                onFocus={() => setOpen(true)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open command palette">
              <Command className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 space-y-6 bg-slate-50 px-6 py-8 dark:bg-slate-950">{children}</main>
      </div>
    </div>
  );
}
