"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { AssistantConsole } from "@/components/assistant-console";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { JobsProvider } from "@/components/jobs/job-store";
import { PipelineProvider } from "@/components/pipeline/pipeline-provider";
import { ApplyProvider } from "@/components/apply/apply-provider";
import { ExploreProvider } from "@/components/explore/explore-provider";
import { FirstScoreView } from "@/components/explore/first-score-view";
import { WorkerPills } from "@/components/jobs/worker-pills";
import { UsageMeter } from "@/components/usage-meter";
import { NAV_ITEMS, isActivePath } from "@/lib/nav-items";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <JobsProvider>
      <PipelineProvider>
      <ApplyProvider>
      <ExploreProvider>
      <MobileNav />
      <div className="flex min-h-screen bg-background text-foreground">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface/50 backdrop-blur-md p-5 md:flex">
          {/* JobScout Logo Branding */}
          <Link href="/" className="mb-8 flex items-center gap-3 px-1 py-2 group">
            <div className="relative flex items-center justify-center rounded-xl p-1 bg-surface-hover/80 border border-border group-hover:border-accent/40 transition-colors">
              <Image
                src="/jobscout-logo.png"
                alt="JobScout Logo"
                width={150}
                height={36}
                className="h-7 w-auto object-contain dark:invert-0 brightness-110"
                priority
              />
            </div>
          </Link>

          {/* Search Quick Status Badge */}
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>JobScout Active</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">50+ portals monitored 24/7</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon, chip }) => {
              const active = isActivePath(href, pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-brand text-brand-foreground shadow-sm shadow-brand/20"
                      : "text-muted hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-brand-foreground" : "text-muted")} />
                  <span>{label}</span>
                  {chip && (
                    <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-text">
                      {chip}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <WorkerPills />

          <div className="mt-auto space-y-4 pt-6 border-t border-border/60">
            <UsageMeter />
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                <ShieldCheck className="size-3.5 text-accent" />
                <span>JobScout AI v1.25</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </aside>
        
        <main className="flex-1 overflow-x-hidden relative">
          {children}
        </main>
        
        <AssistantConsole />
        <FirstScoreView />
      </div>
      </ExploreProvider>
      </ApplyProvider>
      </PipelineProvider>
    </JobsProvider>
  );
}
