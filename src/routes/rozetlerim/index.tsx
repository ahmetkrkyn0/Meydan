import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { ArrowUpRight, Award, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { badges, type Badge } from "@/lib/mock-data";

export const Route = createFileRoute("/rozetlerim/")({
  component: RozetlerimPage,
  head: () => ({ meta: [{ title: "Rozetlerim — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

function RozetlerimPage() {
  const earned = useMemo(() => badges.filter((b) => b.earned), []);
  const locked = useMemo(() => badges.filter((b) => !b.earned), []);
  const featured = badges.find((b) => b.id === "bd1") ?? badges[0];
  const total = badges.length;

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Yolculuk</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
            Rozetlerim
          </h1>
          <p className="text-sm text-[color:var(--app-ink-soft)]">
            Meydan'da attığın her adım için bir rozet.
          </p>
        </motion.header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-3 text-sm"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[color:var(--app-ink)] shadow-sm ring-1 ring-[color:var(--app-line)]">
            <Award className="h-4 w-4 text-violet" strokeWidth={2} />
            <span className="font-semibold">{earned.length}/{total}</span>
            <span className="text-[color:var(--app-ink-mute)]">rozet</span>
          </span>
          <span className="text-[color:var(--app-ink-mute)]">·</span>
          <span className="inline-flex items-center gap-2">
            <span className="chip chip-violet">Tribün Lideri</span>
            <span className="text-[color:var(--app-ink-soft)]">Level 3</span>
          </span>
          <span className="text-[color:var(--app-ink-mute)]">·</span>
          <span className="text-[color:var(--app-ink-soft)]">
            Sonraki rozete <span className="font-semibold text-[color:var(--app-ink)]">%60</span>
          </span>
          <div className="ml-auto hidden h-1.5 w-40 overflow-hidden rounded-full bg-[color:var(--app-line-soft)] sm:block">
            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-violet to-sky" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Link
            to="/rozetlerim/ilk-adim"
            className="soft-card-strong group relative flex flex-col gap-6 overflow-hidden rounded-3xl p-7 sm:flex-row sm:items-center sm:gap-8"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-violet/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky/10 blur-3xl" />

            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet/15 to-sky/10 ring-1 ring-violet/25">
              <span className="text-5xl">{featured.emoji}</span>
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet text-white shadow-md">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </div>

            <div className="relative min-w-0 flex-1">
              <span className="chip chip-violet">Bu haftanın rozeti</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
                {featured.name} Rozeti
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                Hiç denemediğin bir spor seninle tanışıyor. Bu hafta eskrim için 5 küçük görev seni bekliyor.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[color:var(--app-ink-mute)]">2/5 görev tamam</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                  <div className="h-full w-2/5 rounded-full bg-violet" />
                </div>
                <span className="text-[color:var(--app-ink-mute)]">·</span>
                <span className="text-[color:var(--app-ink-soft)]">Eskrim · 3 gün kaldı</span>
              </div>
            </div>

            <div className="relative">
              <span className="btn-primary-light inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold">
                Devam et
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </Link>
        </motion.div>

        <section className="flex flex-col gap-5">
          <header className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-tight text-[color:var(--app-ink)]">
              Kazanılanlar
            </h2>
            <span className="text-xs text-[color:var(--app-ink-mute)]">{earned.length} rozet</span>
          </header>

          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {earned.map((b) => (
              <BadgeCard key={b.id} badge={b} earnedView />
            ))}
          </motion.ul>
        </section>

        <section className="flex flex-col gap-5">
          <header className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-tight text-[color:var(--app-ink)]">
              Hedefler
            </h2>
            <span className="text-xs text-[color:var(--app-ink-mute)]">{locked.length} rozet</span>
          </header>

          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {locked.map((b) => (
              <BadgeCard key={b.id} badge={b} earnedView={false} />
            ))}
          </motion.ul>
        </section>
      </div>
    </AppShell>
  );
}

function BadgeCard({ badge, earnedView }: { badge: Badge; earnedView: boolean }) {
  return (
    <motion.li variants={fadeUp}>
      <div
        className={`relative flex h-full flex-col items-center gap-3 rounded-3xl p-6 text-center transition-all ${
          earnedView
            ? "soft-card-strong"
            : "border border-dashed border-[color:var(--app-line)] bg-white/50"
        }`}
      >
        {earnedView && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.2} />
            kazanıldı
          </span>
        )}

        <div
          className={`relative flex h-20 w-20 items-center justify-center rounded-3xl ${
            earnedView
              ? "bg-gradient-to-br from-violet/12 to-sky/10 ring-1 ring-violet/20"
              : "bg-[color:var(--app-line-soft)]"
          }`}
        >
          <span className={`text-4xl ${earnedView ? "" : "opacity-30 grayscale"}`}>{badge.emoji}</span>
          {!earnedView && (
            <span className="absolute -right-1.5 -bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[color:var(--app-ink)] text-white">
              <Lock className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          )}
        </div>

        <div>
          <p className={`font-display text-base font-bold ${earnedView ? "text-[color:var(--app-ink)]" : "text-[color:var(--app-ink-soft)]"}`}>
            {badge.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
            {earnedView ? badge.description : `Bu rozet için: ${badge.description.toLowerCase()}`}
          </p>
          {earnedView && badge.earnedDate && (
            <p className="mt-2 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              kazanıldı {badge.earnedDate}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
}
