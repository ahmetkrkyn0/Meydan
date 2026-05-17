import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCircle2,
  Wrench,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { matchNeedById, UnauthorizedError, type TalentMatchResult } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar_/$id/eslesme")({
  component: NeedMatchPage,
  head: () => ({ meta: [{ title: "AI Yetenek Eşleşmesi — Meydan" }] }),
});

// ─────────────────────────────────────────────────────────────────────
// Motion presets
// ─────────────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type SortMode = "score" | "city";

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────
function NeedMatchPage() {
  const { id } = Route.useParams();
  const session = useSession();
  const [sort, setSort] = useState<SortMode>("score");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Tek istekte hem need detayını hem matches'ı getir.
  // session.hydrated client mount sonrası true olur; SSR sırasında istek atma.
  const matchQuery = useQuery({
    queryKey: ["needs", id, "matches"],
    queryFn: () => matchNeedById(id),
    enabled: session.hydrated && session.isAuthenticated,
    retry: 1,
  });

  const hydrated = session.hydrated;

  const need = matchQuery.data?.need ?? null;
  const rawMatches = matchQuery.data?.matches ?? [];

  const sortedMatches = useMemo(() => {
    const copy = [...rawMatches];
    if (sort === "score") {
      copy.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
    } else if (sort === "city") {
      copy.sort((a, b) => (a.city ?? "").localeCompare(b.city ?? "", "tr"));
    }
    return copy;
  }, [rawMatches, sort]);

  // Stats
  const stats = useMemo(() => {
    if (!rawMatches.length) return null;
    const scores = rawMatches
      .map((m) => (typeof m.similarity === "number" ? m.similarity : null))
      .filter((s): s is number => s !== null);
    if (!scores.length) return { count: rawMatches.length, top: null, avg: null };
    const top = Math.max(...scores);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { count: rawMatches.length, top, avg };
  }, [rawMatches]);

  return (
    <AppShell role="athlete">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-24"
      >
        {/* ─── Top breadcrumb ─── */}
        <motion.nav variants={fadeUp} className="flex items-center gap-2 text-xs">
          <Link
            to="/sporcu-panel"
            className="font-medium text-[color:var(--app-ink-mute)] transition-colors hover:text-[color:var(--app-ink)]"
          >
            Panel
          </Link>
          <span className="text-[color:var(--app-ink-mute)]">/</span>
          <Link
            to="/sporcu-panel/ihtiyaclar"
            className="font-medium text-[color:var(--app-ink-mute)] transition-colors hover:text-[color:var(--app-ink)]"
          >
            İhtiyaçlarım
          </Link>
          <span className="text-[color:var(--app-ink-mute)]">/</span>
          <span className="font-semibold text-[color:var(--app-ink)]">AI Eşleşme</span>
        </motion.nav>

        {/* ─── HERO ─── */}
        <motion.header
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem]"
        >
          <div className="absolute inset-0 bg-aurora-light opacity-90" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />

          <div className="relative grid gap-8 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <Link
                to="/sporcu-panel/ihtiyaclar"
                className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> İhtiyaçlarıma dön
              </Link>

              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-700">
                <Sparkles className="h-3 w-3" /> AI Yetenek Eşleşmesi
              </p>

              <h1 className="font-display text-4xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
                Senin için <br className="hidden sm:block" />
                <span className="italic text-emerald-700">en uygun</span> taraftarlar
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
                Gemini, ihtiyacının metin embedding'i ile taraftarların yetenek profillerini
                pgvector üzerinde karşılaştırdı. Aşağıda{" "}
                <span className="font-semibold text-[color:var(--app-ink)]">
                  semantik benzerliği en yüksek
                </span>{" "}
                kişiler.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => matchQuery.refetch()}
                  disabled={matchQuery.isFetching}
                  className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${matchQuery.isFetching ? "animate-spin" : ""}`}
                  />
                  {matchQuery.isFetching ? "Yeniden hesaplanıyor..." : "Yeniden Hesapla"}
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[color:var(--app-ink-soft)] backdrop-blur">
                  <Zap className="h-3 w-3" /> pgvector + Gemini
                </span>
              </div>
            </div>

            {/* Stats panel (sağ) */}
            {stats && (
              <div className="relative grid grid-cols-3 gap-4 rounded-2xl border border-[color:var(--app-line-soft)] bg-white/80 p-5 backdrop-blur-xl lg:rounded-3xl lg:p-6">
                <StatCell
                  label="Eşleşme"
                  value={stats.count.toString()}
                  icon={Search}
                  tone="violet"
                />
                <StatCell
                  label="En yüksek"
                  value={stats.top !== null ? `%${Math.round(stats.top * 100)}` : "—"}
                  icon={TrendingUp}
                  tone="emerald"
                  emphasis
                />
                <StatCell
                  label="Ortalama"
                  value={stats.avg !== null ? `%${Math.round(stats.avg * 100)}` : "—"}
                  icon={Target}
                  tone="sky"
                />
              </div>
            )}
          </div>
        </motion.header>

        {/* ─── NEED CARD (sol) + INFO (sağ) ─── */}
        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Need detail */}
          {need ? (
            <article className="soft-card-strong relative overflow-hidden rounded-3xl p-7">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="relative flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-emerald">
                    <Wrench className="h-3 w-3" /> Yetenek
                  </span>
                  {need.category && <span className="chip">{need.category}</span>}
                  {need.is_urgent && (
                    <span className="chip chip-coral">
                      <AlertCircle className="h-3 w-3" /> Acil
                    </span>
                  )}
                </div>

                <h2 className="font-display text-2xl font-bold leading-tight text-[color:var(--app-ink)] sm:text-3xl">
                  {need.title}
                </h2>

                {need.description && (
                  <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                    {need.description}
                  </p>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[color:var(--app-ink-mute)]">
                  {need.talent_needed && (
                    <span className="inline-flex items-center gap-1.5">
                      <Wrench className="h-3 w-3" />
                      <span className="font-semibold text-[color:var(--app-ink-soft)]">
                        {need.talent_needed}
                      </span>
                    </span>
                  )}
                  {need.deadline && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>Son: {need.deadline}</span>
                    </span>
                  )}
                  {need.availability && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {need.availability === "local" ? "Yerel uygun" : "Online uygun"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ) : !hydrated || session.isLoading ? (
            <NeedSkeleton />
          ) : !session.isAuthenticated ? (
            <AuthGateCard />
          ) : matchQuery.isLoading || matchQuery.isFetching ? (
            <NeedSkeleton />
          ) : matchQuery.isError ? (
            matchQuery.error instanceof UnauthorizedError ? (
              <AuthGateCard />
            ) : (
              <NeedErrorCard
                message={
                  matchQuery.error instanceof Error
                    ? matchQuery.error.message
                    : "İhtiyaç yüklenemedi."
                }
                onRetry={() => matchQuery.refetch()}
              />
            )
          ) : (
            <NotFoundCard />
          )}

          {/* Info card */}
          <article className="rounded-3xl border border-[color:var(--app-line-soft)] bg-white/60 p-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <Info className="h-4 w-4" />
              <p className="text-[11px] font-mono uppercase tracking-[0.18em]">
                Nasıl seçildi?
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  Senin <span className="font-semibold text-[color:var(--app-ink)]">ihtiyacının</span>{" "}
                  metni 768-boyutlu embedding'e dönüştürüldü.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                <span>
                  Taraftarların kayıtlı{" "}
                  <span className="font-semibold text-[color:var(--app-ink)]">yetenek embedding</span>'leri ile karşılaştırıldı.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                <span>
                  pgvector benzerlik skoruna göre en yakın 3 profil listelendi.
                </span>
              </li>
            </ul>
          </article>
        </motion.section>

        {/* ─── MATCHES HEADING + SORT ─── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
                AI Önerileri
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
                {sortedMatches.length > 0 ? (
                  <>
                    Sana <span className="italic text-emerald-700">{sortedMatches.length}</span> öneri var
                  </>
                ) : (
                  "Eşleşmeler"
                )}
              </h2>
            </div>

            {/* Sort */}
            {sortedMatches.length > 1 && (
              <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--app-line)] bg-white p-1 text-[11px] font-semibold">
                <span className="pl-2 pr-1 text-[color:var(--app-ink-mute)]">Sırala:</span>
                {(
                  [
                    ["score", "Uyum"],
                    ["city", "Şehir"],
                  ] as const
                ).map(([key, label]) => {
                  const active = sort === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSort(key)}
                      className={`relative rounded-full px-3 py-1.5 transition-colors ${
                        active
                          ? "text-white"
                          : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sort-pill"
                          className="absolute inset-0 rounded-full bg-[color:var(--app-ink)]"
                          transition={{ type: "spring", duration: 0.35 }}
                        />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* States */}
          {(!hydrated || matchQuery.isLoading || matchQuery.isFetching) && (
            <MatchGridSkeleton />
          )}

          {hydrated && matchQuery.isError && !(matchQuery.error instanceof UnauthorizedError) && (
            <ErrorCard
              message={
                matchQuery.error instanceof Error
                  ? matchQuery.error.message
                  : "Eşleşme hesaplanamadı."
              }
              onRetry={() => matchQuery.refetch()}
            />
          )}

          {hydrated &&
            !matchQuery.isLoading &&
            !matchQuery.isFetching &&
            !matchQuery.isError &&
            sortedMatches.length === 0 && <EmptyCard />}

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            {sortedMatches.length > 0 && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {sortedMatches.map((m, i) => (
                  <MatchCard
                    key={m.id}
                    index={i}
                    rank={sort === "score" ? i + 1 : null}
                    match={m}
                    expanded={expanded === m.id}
                    onToggle={() => setExpanded(expanded === m.id ? null : m.id)}
                    needTitle={need?.title ?? ""}
                    needTalent={need?.talent_needed ?? ""}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Footer hint ─── */}
        <motion.div
          variants={fadeUp}
          className="rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-6 py-5 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Sıradaki adım
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Mesajlaşma akışı yakında eklenecek. Şimdilik bu liste, taraftar yetenek havuzunun
            ihtiyacınla nasıl örtüştüğünü gösteriyor.
          </p>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
  icon: Icon,
  tone,
  emphasis = false,
}: {
  label: string;
  value: string;
  icon: typeof Search;
  tone: "violet" | "emerald" | "sky";
  emphasis?: boolean;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/12 text-emerald-700"
      : tone === "sky"
        ? "bg-sky/15 text-[color:var(--sky)]"
        : "bg-violet/12 text-violet";

  return (
    <div className="flex flex-col gap-2">
      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p
        className={`font-display leading-none text-[color:var(--app-ink)] ${
          emphasis ? "text-3xl font-bold" : "text-2xl font-bold"
        }`}
      >
        {value}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
        {label}
      </p>
    </div>
  );
}

function MatchCard({
  index,
  rank,
  match,
  expanded,
  onToggle,
  needTitle,
  needTalent,
}: {
  index: number;
  rank: number | null;
  match: TalentMatchResult;
  expanded: boolean;
  onToggle: () => void;
  needTitle: string;
  needTalent: string;
}) {
  const pct =
    typeof match.similarity === "number"
      ? Math.max(0, Math.min(100, Math.round(match.similarity * 100)))
      : null;

  // Stroke calc
  const circumference = 2 * Math.PI * 30;
  const dash = pct !== null ? (pct / 100) * circumference : 0;

  // Tier — visual emphasis
  const tier: "gold" | "high" | "medium" =
    pct === null ? "medium" : pct >= 80 ? "gold" : pct >= 60 ? "high" : "medium";

  const tierAccent =
    tier === "gold"
      ? "from-amber-300/30 via-emerald-300/20 to-transparent"
      : tier === "high"
        ? "from-emerald-300/25 via-sky-200/20 to-transparent"
        : "from-violet/15 via-transparent to-transparent";

  const initials = match.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  // City + raw talent extraction (basit parse)
  const offered = (match.offered_talent ?? "").trim();
  const offeredSummary =
    offered.length > 120 ? offered.slice(0, 117) + "…" : offered;

  // "Neden eşleşti" — minik kural tabanlı; backend reasoning gelirse onunla değişir.
  const reasonBullets = useMemo(
    () => buildReasonBullets({ offered, needTitle, needTalent, similarity: pct }),
    [offered, needTitle, needTalent, pct],
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.08, duration: 0.55, ease: EASE }}
      whileHover={{ y: -3 }}
      className="soft-card-strong group relative flex flex-col overflow-hidden rounded-[1.75rem]"
    >
      {/* Tier glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${tierAccent} blur-3xl`}
      />

      {/* Rank badge */}
      {rank !== null && (
        <div className="absolute left-5 top-5 z-10">
          <div
            className={`flex h-7 items-center gap-1 rounded-full px-2 text-[10px] font-bold uppercase tracking-wider ${
              tier === "gold"
                ? "bg-gradient-to-r from-amber-200 to-emerald-300 text-emerald-900"
                : "bg-[color:var(--app-ink)] text-white"
            }`}
          >
            {tier === "gold" && <Star className="h-3 w-3 fill-current" />}
            #{rank}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 p-6 pb-5">
        <div className="flex min-w-0 flex-1 items-center gap-3.5 pt-7">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold ${
              tier === "gold"
                ? "bg-emerald-500/15 text-emerald-700 ring-2 ring-emerald-500/30"
                : "bg-emerald-500/12 text-emerald-700"
            }`}
          >
            {initials || <UserCircle2 className="h-6 w-6" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-[color:var(--app-ink)]">
              {match.full_name}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 truncate text-[11px] text-[color:var(--app-ink-soft)]">
              <MapPin className="h-3 w-3" /> {match.city ?? "Şehir belirtilmemiş"}
            </p>
          </div>
        </div>

        {/* Score ring */}
        {pct !== null && (
          <div className="relative h-[72px] w-[72px] shrink-0">
            <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
              <circle
                cx="38"
                cy="38"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-[color:var(--app-line)]"
              />
              <motion.circle
                cx="38"
                cy="38"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={
                  tier === "gold"
                    ? "text-emerald-600"
                    : tier === "high"
                      ? "text-emerald-500"
                      : "text-violet"
                }
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${dash} ${circumference}` }}
                transition={{
                  duration: 1.2,
                  delay: 0.25 + index * 0.08,
                  ease: EASE,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p
                className={`font-display text-lg font-bold leading-none ${
                  tier === "gold"
                    ? "text-emerald-700"
                    : tier === "high"
                      ? "text-emerald-600"
                      : "text-violet"
                }`}
              >
                %{pct}
              </p>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                uyum
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Offered talent body */}
      <div className="relative flex flex-1 flex-col gap-3 border-t border-[color:var(--app-line-soft)] px-6 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
          Sunduğu yetenek profili
        </p>
        <p className="text-sm leading-relaxed text-[color:var(--app-ink)]">
          {offered ? offeredSummary : "Profil notu bulunamadı."}
        </p>
      </div>

      {/* Reasoning (expandable) */}
      <div className="relative border-t border-[color:var(--app-line-soft)] px-6 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 text-left"
          aria-expanded={expanded}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-soft)]">
            <Sparkles className="h-3 w-3 text-emerald-700" /> Neden eşleşti?
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[color:var(--app-ink-mute)] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden"
            >
              <li className="pt-3" />
              {reasonBullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 py-1.5 text-[12px] leading-relaxed text-[color:var(--app-ink-soft)]"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>{b}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative flex items-center gap-2 border-t border-[color:var(--app-line-soft)] bg-white/40 px-5 py-3.5">
        <button
          type="button"
          disabled
          title="Mesajlaşma akışı henüz aktif değil"
          className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold opacity-60"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Mesaj
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
        >
          {expanded ? "Gizle" : "Detay"}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </motion.article>
  );
}

// "Neden eşleşti" için kural tabanlı kısa açıklamalar.
function buildReasonBullets(opts: {
  offered: string;
  needTitle: string;
  needTalent: string;
  similarity: number | null;
}) {
  const bullets: string[] = [];
  const offeredLow = opts.offered.toLocaleLowerCase("tr-TR");
  const needTitleLow = opts.needTitle.toLocaleLowerCase("tr-TR");
  const needTalentLow = opts.needTalent.toLocaleLowerCase("tr-TR");

  // Anahtar kelime örtüşmesi
  const candidates = [...needTitleLow.split(/\s+/), ...needTalentLow.split(/\s+/)]
    .map((w) => w.replace(/[^a-zçğıöşü]/gi, ""))
    .filter((w) => w.length > 3);
  const hit = candidates.find((w) => offeredLow.includes(w));
  if (hit) {
    bullets.push(`Profilinde "${hit}" anahtar kelimesi geçiyor — ihtiyacınla doğrudan örtüşüyor.`);
  }

  // Şehir vurgusu
  if (offeredLow.includes("şehir:") || offeredLow.includes("istanbul") || offeredLow.includes("ankara")) {
    bullets.push("Konum bilgisi profilinde belirtilmiş, yerel iş birliği mümkün.");
  }

  // Müsaitlik
  if (offeredLow.includes("müsaitlik") || offeredLow.includes("hafta sonu") || offeredLow.includes("esnek")) {
    bullets.push("Müsaitlik bilgisi açık belirtilmiş, planlama kolay.");
  }

  // Benzerlik seviyesi
  if (opts.similarity !== null) {
    if (opts.similarity >= 80) {
      bullets.push("Embedding skoru çok yüksek — semantik içerik son derece yakın.");
    } else if (opts.similarity >= 60) {
      bullets.push("Embedding skoru güçlü — kavramsal örtüşme net.");
    } else {
      bullets.push("Embedding skoru orta — fikir benzerliği var, detaylar mesajla netleşebilir.");
    }
  }

  if (bullets.length === 0) {
    bullets.push("Profil metnin ile ihtiyacın embedding uzayında yakın komşu çıkıyor.");
  }
  return bullets;
}

// ─────────────────────────────────────────────────────────────────────
// State views
// ─────────────────────────────────────────────────────────────────────
function MatchGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="soft-card flex flex-col gap-4 rounded-[1.75rem] p-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 animate-pulse rounded-2xl bg-[color:var(--app-line-soft)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            </div>
            <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-2.5 w-3/4 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            <div className="h-2.5 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NeedSkeleton() {
  return (
    <div className="soft-card rounded-3xl p-7">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
        </div>
        <div className="h-7 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-3 w-full animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      </div>
    </div>
  );
}

function NotFoundCard() {
  return (
    <div className="rounded-3xl border border-coral/30 bg-coral/5 px-6 py-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/15 text-coral">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[color:var(--app-ink)]">
            İhtiyaç bulunamadı
          </p>
          <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
            Listeye dönüp yeniden seç veya sayfayı yenile.
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-coral/30 bg-coral/5 px-6 py-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[color:var(--app-ink)]">
            Eşleşme hesaplanamadı
          </p>
          <p className="mt-1 max-w-md text-xs text-[color:var(--app-ink-soft)]">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Tekrar dene
      </button>
    </div>
  );
}

function NeedErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-coral/30 bg-coral/5 p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[color:var(--app-ink)]">
            Yüklenemedi
          </p>
          <p className="mt-1 break-words text-xs text-[color:var(--app-ink-soft)]">
            {message}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-1.5 text-xs font-bold text-white hover:bg-coral/90"
          >
            <RefreshCw className="h-3 w-3" />
            Tekrar dene
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthGateCard() {
  return (
    <div className="rounded-3xl border border-amber-300/40 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-amber-700">
          <Info className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[color:var(--app-ink)]">
            Giriş gerekli
          </p>
          <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
            AI eşleşmesini görmek için sporcu hesabınla giriş yapmalısın.
          </p>
          <a
            href="/giris"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--app-ink)] px-4 py-1.5 text-xs font-bold text-white hover:opacity-90"
          >
            Giriş Yap
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-50/40 px-6 py-14 text-center">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">
            Henüz uygun bir profil yok
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Taraftarlar yeteneklerini kaydettikçe burası dolacak. Birkaç dakika sonra
            <span className="font-semibold text-[color:var(--app-ink)]"> Yeniden Hesapla</span>{" "}
            deneyebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
