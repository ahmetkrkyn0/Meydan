import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Info,
  MapPin,
  RefreshCw,
  UserCircle2,
  Wifi,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { matchNeedById, UnauthorizedError, type TalentMatchResult } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar_/$id/eslesme")({
  component: NeedMatchPage,
  head: () => ({ meta: [{ title: "Önerilen Taraftarlar — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

function NeedMatchPage() {
  const { id } = Route.useParams();
  const session = useSession();

  const matchQuery = useQuery({
    queryKey: ["needs", id, "matches"],
    queryFn: () => matchNeedById(id),
    enabled: session.hydrated && session.isAuthenticated,
    retry: 1,
  });

  const hydrated = session.hydrated;
  const need = matchQuery.data?.need ?? null;
  const matches = (matchQuery.data?.matches ?? []).slice().sort(
    (a, b) => (b.similarity ?? 0) - (a.similarity ?? 0),
  );

  const isLocal = need?.availability === "local";

  return (
    <AppShell role="athlete">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-20"
      >
        {/* Breadcrumb */}
        <motion.nav variants={fadeUp} className="flex items-center gap-2 text-xs">
          <Link
            to="/sporcu-panel/ihtiyaclar"
            className="inline-flex items-center gap-1.5 text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            İhtiyaçlarım
          </Link>
        </motion.nav>

        {/* Hero — sade başlık + tek aksiyon */}
        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700">
            Önerilen taraftarlar
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            {matches.length === 0 ? (
              <>Şu an uygun bir taraftar yok.</>
            ) : matches.length === 1 ? (
              <>
                Sana uygun <span className="text-emerald-700">1 taraftar</span> bulduk.
              </>
            ) : (
              <>
                Sana uygun <span className="text-emerald-700">{matches.length} taraftar</span>{" "}
                bulduk.
              </>
            )}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            {matches.length === 0
              ? "Yeni taraftarlar yetenek profili oluşturdukça liste güncellenir."
              : "Sadece yüksek uyumlu kişiler listede. İletişime geçebilirsin."}
          </p>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => matchQuery.refetch()}
              disabled={matchQuery.isFetching}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--app-line)] bg-white px-4 py-2 text-xs font-semibold text-[color:var(--app-ink)] transition-all hover:bg-[color:var(--app-line-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${matchQuery.isFetching ? "animate-spin" : ""}`}
              />
              {matchQuery.isFetching ? "Yenileniyor" : "Yenile"}
            </button>
          </div>
        </motion.header>

        {/* Need özet kartı */}
        <motion.section variants={fadeUp}>
          {need ? (
            <article className="relative overflow-hidden rounded-2xl border border-[color:var(--app-line-soft)] bg-white p-6">
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
              <h2 className="mt-3 font-display text-xl font-bold leading-tight text-[color:var(--app-ink)]">
                {need.title}
              </h2>
              {need.description && (
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                  {need.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[color:var(--app-ink-mute)]">
                {need.talent_needed && (
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3 w-3" />
                    {need.talent_needed}
                  </span>
                )}
                {need.deadline && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    Son tarih: {need.deadline}
                  </span>
                )}
                {need.availability && (
                  <span className="inline-flex items-center gap-1.5">
                    {isLocal ? (
                      <MapPin className="h-3 w-3" />
                    ) : (
                      <Wifi className="h-3 w-3" />
                    )}
                    {isLocal ? "Yerel" : "Online"} uygun
                  </span>
                )}
              </div>
            </article>
          ) : !hydrated || session.isLoading || matchQuery.isLoading ? (
            <NeedSkeleton />
          ) : !session.isAuthenticated ? (
            <AuthGate />
          ) : matchQuery.isError ? (
            matchQuery.error instanceof UnauthorizedError ? (
              <AuthGate />
            ) : (
              <ErrorCard
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
        </motion.section>

        {/* Match list */}
        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {hydrated && (matchQuery.isLoading || matchQuery.isFetching) && !matches.length ? (
              <MatchSkeleton key="loading" />
            ) : matches.length > 0 ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {matches.map((m, i) => (
                  <MatchCard key={m.id} match={m} index={i} />
                ))}
              </motion.div>
            ) : need && hydrated && !matchQuery.isError ? (
              <EmptyCard key="empty" isLocal={isLocal} />
            ) : null}
          </AnimatePresence>
        </motion.section>

        {/* Nasıl seçildi — sade 3 bullet */}
        <motion.section variants={fadeUp}>
          <div className="rounded-2xl border border-dashed border-[color:var(--app-line)] bg-white/60 p-5">
            <div className="flex items-center gap-2 text-emerald-700">
              <Info className="h-3.5 w-3.5" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Nasıl seçildi
              </p>
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--app-ink-soft)]">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                Yetenek tarifi ihtiyacınla doğrudan örtüşüyor.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {isLocal
                  ? "Aynı şehirden kişi — yerel iş birliği mümkün."
                  : "Online uygunluk — şehir farketmez."}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                Sadece yüksek uyumlu (%80+) profiller listede.
              </li>
            </ul>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Match kartı — tek sütun, sade
// ─────────────────────────────────────────────────────────────────────
function MatchCard({ match, index }: { match: TalentMatchResult; index: number }) {
  const pct =
    typeof match.similarity === "number"
      ? Math.max(0, Math.min(100, Math.round(match.similarity * 100)))
      : null;

  const initials = match.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  // Yetenek özetinden ilk anahtar bilgileri çıkar
  const offered = (match.offered_talent ?? "").trim();
  const summary = offered.length > 110 ? offered.slice(0, 107) + "…" : offered;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: EASE }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-[color:var(--app-line-soft)] bg-white p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-bold text-emerald-700">
          {initials || <UserCircle2 className="h-5 w-5" />}
        </span>

        {/* İsim + konum + skor */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold text-[color:var(--app-ink)]">
                {match.full_name}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[color:var(--app-ink-soft)]">
                <MapPin className="h-3 w-3" />
                {match.city ?? "Şehir belirtilmemiş"}
              </p>
            </div>
            {pct !== null && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                %{pct} uyum
              </span>
            )}
          </div>

          {/* Yetenek özeti */}
          {summary && (
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
              {summary}
            </p>
          )}

          {/* Aksiyon */}
          <div className="mt-4 flex items-center gap-2">
            <a
              href="/sohbet"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--app-ink)] px-4 py-1.5 text-xs font-bold text-white transition-transform hover:opacity-90 hover:scale-105"
            >
              İletişime geç
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// State views
// ─────────────────────────────────────────────────────────────────────
function MatchSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-2xl border border-[color:var(--app-line-soft)] bg-white p-5"
        >
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-[color:var(--app-line-soft)]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            <div className="mt-3 h-2.5 w-full animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            <div className="h-2.5 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NeedSkeleton() {
  return (
    <div className="rounded-2xl border border-[color:var(--app-line-soft)] bg-white p-6">
      <div className="flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
      </div>
      <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      </div>
    </div>
  );
}

function EmptyCard({ isLocal }: { isLocal: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-[color:var(--app-line)] bg-white/50 p-8 text-center"
    >
      <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
        Henüz uygun bir taraftar yok.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
        {isLocal
          ? "Şehrinde yetenek profili olan taraftar arttıkça liste dolacak."
          : "Daha fazla taraftar yetenek profili oluşturdukça liste güncellenir."}
      </p>
    </motion.div>
  );
}

function NotFoundCard() {
  return (
    <div className="rounded-2xl border border-coral/30 bg-coral/5 p-5">
      <p className="text-sm font-semibold text-[color:var(--app-ink)]">
        İhtiyaç bulunamadı.
      </p>
      <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
        Listeye dönüp yeniden seç veya sayfayı yenile.
      </p>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-coral/30 bg-coral/5 p-5">
      <div>
        <p className="text-sm font-semibold text-[color:var(--app-ink)]">Yüklenemedi</p>
        <p className="mt-1 max-w-md text-xs text-[color:var(--app-ink-soft)]">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-1.5 text-xs font-bold text-white hover:bg-coral/90"
      >
        <RefreshCw className="h-3 w-3" />
        Tekrar dene
      </button>
    </div>
  );
}

function AuthGate() {
  return (
    <div className="rounded-2xl border border-amber-300/40 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-[color:var(--app-ink)]">Giriş gerekli</p>
      <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
        Önerileri görmek için sporcu hesabınla giriş yapmalısın.
      </p>
      <a
        href="/giris"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--app-ink)] px-4 py-1.5 text-xs font-bold text-white hover:opacity-90"
      >
        Giriş yap
      </a>
    </div>
  );
}
