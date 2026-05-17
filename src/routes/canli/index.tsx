import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { Eye, Radio, Sparkles } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { liveMatches, type Match } from "@/lib/mock-data";

export const Route = createFileRoute("/canli/")({
  component: CanliListPage,
  head: () => ({ meta: [{ title: "Canlı Maçlar — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

type Tab = "live" | "soon" | "ended";

function CanliListPage() {
  const [tab, setTab] = useState<Tab>("live");

  const counts = useMemo(
    () => ({
      live: liveMatches.filter((m) => m.status === "live").length,
      soon: liveMatches.filter((m) => m.status === "soon").length,
      ended: liveMatches.filter((m) => m.status === "ended").length,
    }),
    [],
  );

  const visible = liveMatches.filter((m) => m.status === tab);

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Dijital Tribün
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Canlı <span className="italic text-violet">maçlar</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Şimdi sahada olan sporcular için tribün dolu olsun. Sessiz tezahüratın bile bir anlamı var.
          </p>
        </motion.header>

        <motion.nav variants={fadeUp} className="flex items-center gap-1 self-start rounded-full border border-[color:var(--app-line)] bg-white p-1">
          {([
            ["live", `Canlı (${counts.live})`],
            ["soon", `Yakında (${counts.soon})`],
            ["ended", `Bitti (${counts.ended})`],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                tab === k
                  ? "text-white"
                  : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
              }`}
            >
              {tab === k && (
                <motion.span
                  layoutId="canli-tab"
                  className="absolute inset-0 rounded-full bg-[color:var(--app-ink)]"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className="relative">{l}</span>
            </button>
          ))}
        </motion.nav>

        {visible.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="soft-card rounded-3xl p-10 text-center"
          >
            <p className="text-sm text-[color:var(--app-ink-soft)]">
              Bu sekmede şu an gösterilecek maç yok. Birazdan tekrar bak.
            </p>
          </motion.div>
        ) : tab === "live" ? (
          <>
            <motion.section
              variants={fadeUp}
              className="grid gap-4 md:grid-cols-3"
            >
              {visible.slice(0, 3).map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </motion.section>

            {visible.length > 3 && (
              <motion.section
                variants={fadeUp}
                className="grid gap-4 sm:grid-cols-2"
              >
                {visible.slice(3, 5).map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </motion.section>
            )}

            {visible.length > 5 && (
              <motion.section
                variants={fadeUp}
                className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
              >
                {visible.slice(5).map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </motion.section>
            )}
          </>
        ) : (
          <motion.section
            variants={fadeUp}
            className="grid gap-4 sm:grid-cols-2"
          >
            {visible.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </motion.section>
        )}
      </motion.div>
    </AppShell>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isSoon = match.status === "soon";

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-3xl border bg-white p-5 transition-all ${
        isLive
          ? "border-coral/30 shadow-[0_12px_36px_-16px_oklch(0.65_0.20_18_/_0.45)]"
          : "border-[color:var(--app-line)] hover:border-violet/30"
      }`}
    >
      {isLive && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,oklch(0.65_0.20_18/0.08),transparent_60%)]" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isLive
                ? "bg-coral/15 text-coral"
                : isSoon
                ? "chip-sky"
                : "chip"
            }`}
          >
            {isLive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />}
            {isLive ? "Canlı" : isSoon ? `Yakında · ${match.startsAt}` : "Bitti"}
          </span>
          <span className="text-[11px] text-[color:var(--app-ink-mute)]">
            {match.emoji} {match.sport}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <img
            src={match.athleteImg}
            alt={match.athleteName}
            className="h-12 w-12 shrink-0 rounded-2xl object-cover object-top ring-2 ring-white"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold leading-tight text-[color:var(--app-ink)]">
              {match.athleteName}
            </p>
            <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">
              vs <span className="font-semibold">{match.opponent}</span>{" "}
              <span className="ml-0.5">{match.opponentFlag}</span>
            </p>
          </div>
          {match.score && (
            <div className="shrink-0 text-right">
              <p className="font-mono text-lg font-bold leading-none text-[color:var(--app-ink)]">
                {match.score}
              </p>
              {match.setScore && (
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  {match.setScore}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--app-line-soft)] pt-3">
          <div className="flex items-center gap-2.5 text-[11px] text-[color:var(--app-ink-soft)]">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {match.viewers.toLocaleString("tr-TR")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {match.cheers}
            </span>
          </div>

          <Link
            to="/canli/$id"
            params={{ id: match.id }}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
              isLive
                ? "btn-primary-light"
                : "bg-[color:var(--app-ink)] text-white hover:opacity-90"
            }`}
          >
            <Radio className="h-3 w-3" />
            Tribüne katıl
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
