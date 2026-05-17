import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Eye, Radio, Sparkles, Activity, Zap, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { liveMatches, type Match } from "@/lib/mock-data";

export const Route = createFileRoute("/canli/")({
  component: CanliListPage,
  head: () => ({ meta: [{ title: "Canlı Maçlar — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function CanliListPage() {
  const [dataReady] = useState(true); // gerçek API bağlandığında useQuery.isLoading ile değiştir
  const matches = liveMatches.filter((m) => m.status === "live");
  const ended = liveMatches.filter((m) => m.status === "ended");
  const featured = matches[0];
  const rest = matches.slice(1);

  if (!dataReady) {
    return (
      <AppShell role="fan">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-[380px] rounded-3xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        {/* ── COMPACT HEADER ── */}
        <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-coral/25 bg-coral/8 px-2.5 py-1">
              <LivePulse />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-coral">
                {matches.length} maç canlı
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              Canlı <span className="italic text-violet">maçlar</span>
            </h1>
          </div>
        </motion.header>

        {/* ── FEATURED MATCH ── */}
        {featured && (
          <motion.section variants={fadeUp}>
            <SectionHeading
              eyebrow="Öne çıkan"
              title="En çok izlenen tribün"
              right={
                <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-[color:var(--app-ink-soft)] sm:inline-flex">
                  <Activity className="h-3.5 w-3.5 text-coral" /> {featured.viewers.toLocaleString("tr-TR")} kişi izliyor
                </span>
              }
            />
            <FeaturedCard match={featured} />
          </motion.section>
        )}

        {/* ── REST GRID ── */}
        {rest.length > 0 && (
          <motion.section variants={fadeUp} className="flex flex-col gap-4">
            <SectionHeading
              eyebrow="Diğer canlılar"
              title="Tribünü doldur"
              right={
                <span className="hidden text-[11px] font-semibold text-[color:var(--app-ink-soft)] sm:inline">
                  {rest.length} maç daha
                </span>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {rest.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </motion.section>
        )}

        {matches.length === 0 && (
          <motion.div variants={fadeUp} className="soft-card rounded-3xl p-12 text-center">
            <p className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Şu an canlı maç yok.
            </p>
            <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
              Sporcular tribüne çıktığında burada görünecek.
            </p>
          </motion.div>
        )}

        {/* ── BİTEN MAÇLAR — özet hazır ── */}
        {ended.length > 0 && (
          <motion.section variants={fadeUp} className="flex flex-col gap-4 pt-4">
            <SectionHeading
              eyebrow="Maç sonu"
              title="Biten maçlar"
              right={
                <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-[color:var(--app-ink-soft)] sm:inline-flex">
                  <Sparkles className="h-3.5 w-3.5 text-violet" /> AI özetleri hazır
                </span>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ended.map((m) => (
                <EndedCard key={m.id} match={m} />
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </AppShell>
  );
}

/* ─────────────────────────── helpers ─────────────────────────── */

function LivePulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 pb-1">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

/* ─────────────────────────── cards ─────────────────────────── */

function FeaturedCard({ match }: { match: Match }) {
  const [viewers, setViewers] = useState(match.viewers);
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 7) - 2);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative overflow-hidden rounded-[24px] border border-[color:var(--app-line)] bg-white"
    >
      {/* aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet/8 via-white to-coral/8" />
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet/12 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <div className="absolute inset-0 grid-dots-warm opacity-30" />

      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        {/* LEFT — athlete portrait */}
        <div className="relative">
          <div className="absolute inset-x-6 inset-y-3 rounded-3xl bg-gradient-to-br from-violet/20 to-coral/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_20px_60px_-20px_oklch(0.22_0.05_258/0.30)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <img
              src={match.athleteImg}
              alt={match.athleteName}
              className="h-72 w-full object-cover object-top sm:h-80"
            />
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              <LivePulse /> Canlı
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[color:var(--app-ink)] backdrop-blur">
                {match.emoji} {match.sport}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                <Eye className="h-3 w-3" />
                {viewers.toLocaleString("tr-TR")}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — match details */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
              {match.emoji} {match.sport} · Şimdi
            </p>
            <h3 className="mt-2 flex items-center gap-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              {match.athleteName} 
              {match.athleteFlag && <img src={`https://flagcdn.com/w40/${match.athleteFlag}.png`} alt={match.athleteFlag} className="inline-block h-[0.7em] w-auto rounded-sm object-cover shadow-sm" />}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-base text-[color:var(--app-ink-soft)]">
              vs <span className="font-semibold text-[color:var(--app-ink)]">{match.opponent}</span>
              <img src={`https://flagcdn.com/w20/${match.opponentFlag}.png`} alt={match.opponentFlag} className="inline-block h-3 w-4 rounded-[2px] object-cover opacity-90" />
            </p>
          </div>

          {/* score block */}
          {match.score && (
            <div className="flex items-center gap-6 rounded-2xl border border-[color:var(--app-line)] bg-white/70 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Skor
                </p>
                <p className="mt-0.5 font-mono text-4xl font-bold leading-none text-[color:var(--app-ink)]">
                  {match.score}
                </p>
              </div>
              {match.setScore && (
                <>
                  <div className="h-10 w-px bg-[color:var(--app-line)]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                      Set
                    </p>
                    <p className="mt-0.5 font-mono text-2xl font-bold leading-none text-[color:var(--app-ink-soft)]">
                      {match.setScore}
                    </p>
                  </div>
                </>
              )}
              <div className="ml-auto flex flex-col items-end">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Momentum
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[color:var(--app-line)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${match.momentum}%` }}
                      transition={{ duration: 1.2, ease: EASE }}
                      className="h-full rounded-full bg-gradient-to-r from-violet to-coral"
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[color:var(--app-ink)]">
                    {match.momentum}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* meta + cta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--app-line)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[color:var(--app-ink-soft)]">
                <Sparkles className="h-3.5 w-3.5 text-coral" />
                {match.cheers.toLocaleString("tr-TR")} tezahürat
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/25 bg-violet/8 px-3 py-1.5 text-[11px] font-semibold text-violet">
                <Zap className="h-3.5 w-3.5" />
                AI Korumalı
              </span>
            </div>

            <Link
              to="/canli/$id"
              params={{ id: match.id }}
              className="group/cta inline-flex items-center gap-2 rounded-full bg-[color:var(--app-ink)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_oklch(0.22_0.05_258/0.4)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.22_0.05_258/0.5)]"
            >
              <Radio className="h-4 w-4" />
              Tribüne katıl
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MatchCard({ match }: { match: Match }) {
  const [viewers, setViewers] = useState(match.viewers);
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 5) - 1);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative overflow-hidden rounded-3xl border border-[color:var(--app-line)] bg-white p-5 shadow-[0_4px_16px_-8px_oklch(0.22_0.05_258/0.10)] transition-all hover:border-violet/30 hover:shadow-[0_16px_40px_-16px_oklch(0.60_0.22_252/0.25)]"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-coral/6 blur-2xl transition-opacity group-hover:opacity-100 opacity-50" />

      <div className="relative flex items-start gap-4">
        {/* athlete avatar with live ring */}
        <div className="relative shrink-0">
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-coral via-violet to-sky opacity-80" />
          <img
            src={match.athleteImg}
            alt={match.athleteName}
            className="relative h-16 w-16 rounded-2xl object-cover object-top ring-2 ring-white"
          />
          <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ring-2 ring-white">
            <span className="h-1 w-1 animate-pulse rounded-full bg-white" /> LIVE
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-display text-base font-bold leading-tight text-[color:var(--app-ink)]">
                {match.athleteName} 
                {match.athleteFlag && <img src={`https://flagcdn.com/w20/${match.athleteFlag}.png`} alt={match.athleteFlag} className="inline-block h-[0.8em] w-auto rounded-[2px] object-cover shadow-sm" />}
              </p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-[color:var(--app-ink-soft)]">
                vs <span className="font-semibold">{match.opponent}</span>
                <img src={`https://flagcdn.com/w20/${match.opponentFlag}.png`} alt={match.opponentFlag} className="inline-block h-2.5 w-3.5 rounded-[2px] object-cover opacity-80" />
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[color:var(--app-line-soft)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--app-ink-soft)]">
              {match.emoji} {match.sport}
            </span>
          </div>

          {match.score && (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-[color:var(--app-line-soft)] px-3 py-2">
              <div>
                <p className="font-mono text-xl font-bold leading-none text-[color:var(--app-ink)]">
                  {match.score}
                </p>
                {match.setScore && (
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    Set {match.setScore}
                  </p>
                )}
              </div>
              <div className="ml-auto flex flex-1 flex-col items-end gap-1">
                <span className="font-mono text-[10px] font-bold text-[color:var(--app-ink-soft)]">
                  {match.momentum}% momentum
                </span>
                <div className="h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-white">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${match.momentum}%` }}
                    transition={{ duration: 1, ease: EASE }}
                    className="h-full rounded-full bg-gradient-to-r from-violet to-coral"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-[color:var(--app-line-soft)] pt-3">
        <div className="flex items-center gap-3 text-[11px] text-[color:var(--app-ink-soft)]">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Eye className="h-3 w-3" />
            {viewers.toLocaleString("tr-TR")}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Sparkles className="h-3 w-3 text-coral" />
            {match.cheers.toLocaleString("tr-TR")}
          </span>
        </div>

        <Link
          to="/canli/$id"
          params={{ id: match.id }}
          className="inline-flex items-center gap-1 rounded-full bg-[color:var(--app-ink)] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-violet"
        >
          <Radio className="h-3 w-3" />
          Katıl
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────── ended card ─────────────────────────── */

function EndedCard({ match }: { match: Match }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl border border-[color:var(--app-line)] bg-white/70 p-4 transition-all hover:border-violet/25 hover:bg-white"
    >
      <div className="flex items-start gap-3">
        <img
          src={match.athleteImg}
          alt={match.athleteName}
          className="h-12 w-12 shrink-0 rounded-xl object-cover object-top opacity-90 grayscale-[15%]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--app-line-soft)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--app-ink-soft)]">
              <CheckCircle2 className="h-2.5 w-2.5" /> Bitti
            </span>
            <span className="text-[10px] text-[color:var(--app-ink-mute)]">
              {match.emoji} {match.sport}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-2 truncate text-[13px] font-semibold leading-tight text-[color:var(--app-ink)]">
            {match.athleteName} 
            {match.athleteFlag && <img src={`https://flagcdn.com/w20/${match.athleteFlag}.png`} alt={match.athleteFlag} className="inline-block h-[0.8em] w-auto rounded-[2px] object-cover opacity-90" />}
          </p>
          <p className="flex items-center gap-1 truncate text-[11px] text-[color:var(--app-ink-soft)]">
            vs {match.opponent} 
            <img src={`https://flagcdn.com/w20/${match.opponentFlag}.png`} alt={match.opponentFlag} className="inline-block h-2 w-3 rounded-[2px] object-cover opacity-80" />
          </p>
        </div>
        {match.score && (
          <div className="shrink-0 text-right">
            <p className="font-mono text-base font-bold leading-none text-[color:var(--app-ink)]">
              {match.score}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Final
            </p>
          </div>
        )}
      </div>

      <Link
        to="/canli/$id"
        params={{ id: match.id }}
        className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-violet/20 bg-gradient-to-r from-violet/8 to-coral/8 px-3 py-2 text-[11px] font-semibold text-violet transition-all hover:border-violet/40 hover:from-violet/15 hover:to-coral/12"
      >
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI maç özetini gör
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.article>
  );
}
