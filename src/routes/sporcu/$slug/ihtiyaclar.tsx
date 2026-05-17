import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Heart,
  Wrench,
  Coins,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug, needs, type Need } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu/$slug/ihtiyaclar")({
  component: AthleteNeedsPage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} — İhtiyaçları | Meydan` }],
  }),
});

type Tab = "all" | "money" | "talent";

function formatTL(n: number): string {
  if (n >= 1000) return "₺" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "B";
  return "₺" + n.toLocaleString("tr-TR");
}

function NeedCard({ need, index }: { need: Need; index: number }) {
  const isMoney = need.type === "money";
  const pct = isMoney && need.targetAmount
    ? Math.min(100, Math.round(((need.collectedAmount ?? 0) / need.targetAmount) * 100))
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="soft-card-strong group relative flex flex-col gap-5 rounded-3xl p-6"
    >
      {/* head row */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={isMoney ? "chip chip-violet" : "chip chip-sky"}>
            {isMoney ? (
              <>
                <Coins className="h-3 w-3" /> Para
              </>
            ) : (
              <>
                <Wrench className="h-3 w-3" /> Yetenek
              </>
            )}
          </span>
          <span className="chip">{need.category}</span>
          {need.urgent && (
            <span className="chip chip-coral">
              <AlertCircle className="h-3 w-3" /> Acil
            </span>
          )}
        </div>
      </header>

      {/* title + desc */}
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold leading-snug text-[color:var(--app-ink)]">
          {need.title}
        </h3>
        <p className="text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
          {need.description}
        </p>
      </div>

      {/* money progress */}
      {isMoney && need.targetAmount && (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xl font-bold tabular-nums text-[color:var(--app-ink)]">
              {formatTL(need.collectedAmount ?? 0)}
              <span className="ml-1 text-xs font-normal text-[color:var(--app-ink-mute)]">
                / {formatTL(need.targetAmount)}
              </span>
            </span>
            <span className="text-xs font-semibold text-violet">%{pct}</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet to-sky"
            />
          </div>
        </div>
      )}

      {/* talent type */}
      {!isMoney && need.talentNeeded && (
        <div className="rounded-2xl bg-sky/8 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            Aranan
          </p>
          <p className="mt-1 font-display text-base font-semibold text-[color:var(--app-ink)]">
            {need.talentNeeded}
          </p>
        </div>
      )}

      {/* meta */}
      <div className="flex items-center gap-4 text-[11px] text-[color:var(--app-ink-mute)]">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" strokeWidth={1.8} /> {need.city}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={1.8} /> {need.deadline}
        </span>
      </div>

      {/* action */}
      <Link
        to="/dashboard"
        className={`group/btn inline-flex items-center justify-between rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
          isMoney ? "btn-primary-light" : "btn-ghost-light hover:border-sky/30"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          {isMoney ? (
            <>
              <Heart className="h-4 w-4" fill="currentColor" /> Destekle
            </>
          ) : (
            <>
              <Wrench className="h-4 w-4" /> Ben yardım edebilirim
            </>
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
      </Link>
    </motion.article>
  );
}

function AthleteNeedsPage() {
  const { slug } = Route.useParams();
  const a = athleteBySlug(slug);
  const [tab, setTab] = useState<Tab>("all");

  let athleteNeeds = needs.filter((n) => n.athleteSlug === slug);
  const isFallback = athleteNeeds.length === 0;
  if (isFallback) {
    athleteNeeds = needs.slice(0, 3).map((n, i) => ({
      ...n,
      id: `fallback-${i}`,
      athleteSlug: slug,
      athleteName: a.name,
      athleteImg: a.img,
      city: a.city,
    }));
  }

  const filtered = athleteNeeds.filter((n) =>
    tab === "all" ? true : n.type === tab,
  );

  const counts = {
    all: athleteNeeds.length,
    money: athleteNeeds.filter((n) => n.type === "money").length,
    talent: athleteNeeds.filter((n) => n.type === "talent").length,
  };

  return (
    <AppShell role="fan">
      <div className="mx-auto max-w-5xl pb-24">
        <Link
          to="/sporcu/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-2 text-xs font-medium text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{a.name} kartına dön</span>
        </Link>

        {/* Heading */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid gap-6 sm:grid-cols-[1.5fr_1fr] sm:items-end"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">
              İhtiyaçlar
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
              {a.name} — ihtiyaçları
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-[color:var(--app-ink-soft)]">
              Para ile destek olabileceğin gibi, yeteneğinle de destek olabilirsin.
              Hangisi sana yakınsa.
            </p>
          </div>

          {isFallback && (
            <p className="text-[11px] italic text-[color:var(--app-ink-mute)] sm:text-right">
              Bu sporcudan henüz açık talep yok — benzer ihtiyaçları gösteriyoruz.
            </p>
          )}
        </motion.header>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex items-center gap-1.5"
        >
          {([
            ["all", "Hepsi"],
            ["money", "Para"],
            ["talent", "Yetenek"],
          ] as const).map(([key, label]) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-[color:var(--app-ink)] text-white"
                    : "text-[color:var(--app-ink-soft)] hover:bg-white"
                }`}
              >
                {label}
                <span
                  className={`text-[10px] tabular-nums ${
                    active ? "text-white/70" : "text-[color:var(--app-ink-mute)]"
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {filtered.map((n, i) => (
            <NeedCard key={n.id} need={n} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-[color:var(--app-ink-mute)]">
              Bu filtre için açık ihtiyaç yok.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
