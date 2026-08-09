"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, CircleHelp, Sparkles, ArrowRight, Zap, Target, CheckCircle2, Search, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Application, InboxJob } from "@/lib/career-ops";
import type { DiscoveredOffer } from "@/lib/explore";
import { DiscoveryCard } from "@/components/explore/discovery-card";
import { FollowUpCard, type FollowUp } from "@/components/home/follow-up-card";
import { DecisionCard } from "@/components/home/decision-card";
import { QuickEvaluate } from "@/components/quick-evaluate";

export function TodayDashboard({
  applications,
  inbox,
  inBetween,
}: {
  applications: Application[];
  inbox: InboxJob[];
  inBetween: boolean;
}) {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [overdue, setOverdue] = useState(0);
  const [fresh, setFresh] = useState<DiscoveredOffer[]>([]);
  const router = useRouter();
  const dateLabel = useMemo(() => new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }), []);

  const refetch = useCallback(() => {
    fetch("/api/followups")
      .then((r) => r.json())
      .then((d) => {
        setFollowups(Array.isArray(d.entries) ? d.entries : []);
        setOverdue(d.metadata?.overdue ?? d.entries?.length ?? 0);
      })
      .catch(() => {});
    fetch("/api/whats-new")
      .then((r) => r.json())
      .then((d) => setFresh(Array.isArray(d.offers) ? d.offers : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refetch();
    const onDone = () => {
      router.refresh();
      refetch();
    };
    window.addEventListener("co-job-done", onDone);
    return () => window.removeEventListener("co-job-done", onDone);
  }, [refetch, router]);

  const awaiting = useMemo(
    () => applications.filter((a) => /^evaluat/i.test(a.status)).slice(0, 6),
    [applications],
  );

  const newThisWeek = fresh.length;
  const allClear = newThisWeek === 0 && overdue === 0 && awaiting.length === 0;
  const inboxUrls = useMemo(() => new Set(inbox.map((j) => j.url)), [inbox]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 max-sm:pb-24 space-y-8 animate-fade-in-up">
      {/* Hero Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-surface-hover/60 p-8 md:p-10 shadow-xl shadow-black/5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-brand/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-brand-text">
                <Zap className="size-3.5" /> JobScout Engine Active
              </span>
              <span className="text-xs text-muted font-mono">// {dateLabel}</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {allClear ? (
                <>All caught up for today.</>
              ) : (
                <>
                  {newThisWeek > 0 && (
                    <>
                      <span className="gradient-text font-black">{newThisWeek}</span> new matches
                    </>
                  )}
                  {newThisWeek > 0 && overdue > 0 && <span className="text-muted"> · </span>}
                  {overdue > 0 && (
                    <>
                      <span className="text-amber-500 font-black">{overdue}</span> follow-ups due
                    </>
                  )}
                </>
              )}
            </h1>

            <p className="mt-3 max-w-2xl text-base text-muted">
              JobScout scans 50+ portals (LinkedIn, Indeed, ZipRecruiter) in real-time to match, evaluate, and tailor ATS resumes for top opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 transition-all hover:bg-brand-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="size-4" /> Find New Roles
            </Link>
            <Link
              href="/pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-surface-hover hover:border-brand/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <SlidersHorizontal className="size-4" /> Open Pipeline
            </Link>
          </div>
        </div>

        {inBetween && <div className="mt-6 pt-6 border-t border-border/50"><QuickEvaluate /></div>}
      </section>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Active Portals" value="50+" subtext="Monitored in real-time" icon={Search} color="text-accent" />
        <MetricCard label="Fresh Matches" value={String(newThisWeek)} subtext="Past 24 hours" icon={Sparkles} color="text-emerald-500" />
        <MetricCard label="Follow-ups" value={String(overdue)} subtext="Pending action" icon={Bell} color="text-amber-500" />
        <MetricCard label="Applications" value={String(applications.length)} subtext="In pipeline" icon={Target} color="text-indigo-500" />
      </div>

      {/* Follow-ups Section */}
      {followups.length > 0 && (
        <Section icon={Bell} title="Follow-ups due" hint="Keep application momentum strong">
          <div className="grid gap-3">
            {followups.map((f) => (
              <FollowUpCard key={`${f.num}-${f.company}`} followup={f} onLogged={() => setOverdue((n) => Math.max(0, n - 1))} />
            ))}
          </div>
        </Section>
      )}

      {/* Decisions Section */}
      {awaiting.length > 0 && (
        <Section icon={CircleHelp} title="Awaiting Decision" hint="Scored roles ready for application">
          <div className="grid gap-4 sm:grid-cols-2">
            {awaiting.map((a) => (
              <DecisionCard key={a.n} app={a} />
            ))}
          </div>
        </Section>
      )}

      {/* Fresh Matches Section */}
      {fresh.length > 0 && (
        <Section icon={Sparkles} title="Fresh Matches" hint="Scrape discovery · 0 tokens">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fresh.slice(0, 6).map((o) => (
              <DiscoveryCard key={o.url} offer={o} inPipeline={inboxUrls.has(o.url)} />
            ))}
          </div>
          {fresh.length > 6 && (
            <div className="mt-4 text-center">
              <Link href="/explore?view=fresh" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                View all {fresh.length} fresh jobs <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </Section>
      )}

      {allClear && (
        <div className="rounded-3xl border border-border bg-surface/50 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">You are all caught up!</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            JobScout is continuously monitoring top job portals in the background. Run a <Link href="/explore" className="text-accent font-semibold hover:underline">live scan</Link> anytime.
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtext, icon: Icon, color }: { label: string; value: string; subtext: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
        <Icon className={cn("size-4", color)} />
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-[11px] font-medium text-faint">{subtext}</div>
    </div>
  );
}

function Section({ icon: Icon, title, hint, children }: { icon: React.ComponentType<{ className?: string }>; title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon className="size-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
        </div>
        <span className="text-xs text-muted">{hint}</span>
      </div>
      {children}
    </section>
  );
}
