import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useMemo } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  RefreshCw,
  Sparkles,
  UserCircle2,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNeeds, matchNeedById } from "@/lib/api";
import { useActiveAthlete } from "@/lib/active-athlete";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar/$id/eslesme")({
  component: NeedMatchPage,
  head: () => ({ meta: [{ title: "AI Yetenek Eşleşmesi — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function NeedMatchPage() {
  const { id } = Route.useParams();
  const session = useSession();
  const activeAthlete = useActiveAthlete();

  // Need detayını listeden bul.
  const needsQuery = useQuery({
    queryKey: ["needs", activeAthlete.profile?.id],
    queryFn: () => listNeeds(activeAthlete.profile!.id),
    enabled: Boolean(activeAthlete.profile?.id),
    retry: 1,
  });

  const need = useMemo(
    () => needsQuery.data?.needs?.find((n) => n.id === id) ?? null,
    [needsQuery.data, id],
  );

  const matchQuery = useQuery({
    queryKey: ["needs", id, "matches"],
    queryFn: () => matchNeedById(id),
    enabled: session.isAuthenticated && Boolean(need),
    retry: 1,
  });

  const matches = matchQuery.data?.matches ?? [];

  return (
    <AppShell role="athlete">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-16"
      >
        {/* ─── Back ─── */}
        <motion.div variants={fadeUp}>
          <Link
            to="/sporcu-panel/ihtiyaclar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> İhtiyaçlarım
          </Link>
        </motion.div>

        {/* ─── Hero ─── */}
        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700">
            <Sparkles className="h-3 w-3" /> AI Eşleşme
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            İhtiyacın için <span className="italic text-emerald-700">en uygun</span> taraftarlar
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Gemini embedding'i ile{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">need</span> ve{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">offered_talent</span>{" "}
            arasında semantik benzerlik kuruluyor. En yakın 3 taraftarı görüyorsun.
          </p>
        </motion.header>

        {/* ─── Need card (özet) ─── */}
        {need ? (
          <motion.section
            variants={fadeUp}
            className="soft-card-strong relative overflow-hidden rounded-3xl p-6"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-3">
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
              <h2 className="font-display text-2xl font-bold leading-snug text-[color:var(--app-ink)]">
                {need.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                {need.description || "Açıklama yok."}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[color:var(--app-ink-mute)]">
                {need.talent_needed && (
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3 w-3" /> {need.talent_needed}
                  </span>
                )}
                {need.deadline && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Son: {need.deadline}
                  </span>
                )}
              </div>
            </div>
          </motion.section>
        ) : needsQuery.isLoading ? (
          <SkeletonBlock />
        ) : (
          <NotFoundBlock />
        )}

        {/* ─── Matches ─── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              AI önerileri
            </h2>
            <button
              type="button"
              onClick={() => matchQuery.refetch()}
              disabled={matchQuery.isFetching}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--app-line)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:border-emerald-500/30 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3 w-3 ${matchQuery.isFetching ? "animate-spin" : ""}`}
              />
              Yeniden hesapla
            </button>
          </div>

          {matchQuery.isLoading && <MatchSkeletons />}

          {matchQuery.isError && (
            <div className="rounded-2xl border border-coral/30 bg-coral/5 px-5 py-4 text-sm text-coral">
              {matchQuery.error instanceof Error
                ? matchQuery.error.message
                : "Eşleşme hesaplanamadı."}
            </div>
          )}

          {!matchQuery.isLoading && !matchQuery.isError && matches.length === 0 && (
            <EmptyMatchesBlock />
          )}

          <AnimatePresence>
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((m, i) => (
                <MatchCard
                  key={m.id}
                  index={i}
                  fullName={m.full_name}
                  city={m.city ?? null}
                  offeredTalent={m.offered_talent ?? null}
                  similarity={m.similarity}
                />
              ))}
            </div>
          </AnimatePresence>
        </motion.section>

        {/* ─── Bilgi notu ─── */}
        <motion.section variants={fadeUp} className="rounded-3xl border border-[color:var(--app-line-soft)] bg-white/60 p-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
            Nasıl çalışıyor?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
            Bu sayfa <span className="font-semibold text-[color:var(--app-ink)]">/needs/{id}/matches</span>{" "}
            endpoint'ini çağırır. Backend, ihtiyacın için kayıtlı{" "}
            <span className="font-semibold text-[color:var(--app-ink)]">embedding</span>'i kullanarak
            taraftarların kayıtlı yetenek embedding'leri arasında pgvector benzerlik araması yapar.
            En yüksek skorlu 3 taraftar listelenir. Henüz iletişim akışı yok — bu fazda sadece
            kim olduklarını ve neden eşleştiklerini gösteriyoruz.
          </p>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

function MatchCard({
  index,
  fullName,
  city,
  offeredTalent,
  similarity,
}: {
  index: number;
  fullName: string;
  city: string | null;
  offeredTalent: string | null;
  similarity?: number;
}) {
  const pct =
    typeof similarity === "number"
      ? Math.max(0, Math.min(100, Math.round(similarity * 100)))
      : null;
  const circumference = 2 * Math.PI * 28;
  const dash = pct !== null ? (pct / 100) * circumference : 0;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.07, duration: 0.5, ease: EASE }}
      className="soft-card-strong relative flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 font-display text-base font-bold text-emerald-700">
            {initials || <UserCircle2 className="h-6 w-6" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">
              {fullName}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-[color:var(--app-ink-soft)]">
              <MapPin className="h-3 w-3" /> {city ?? "Şehir belirtilmemiş"}
            </p>
          </div>
        </div>

        {pct !== null && (
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 70 70" className="h-full w-full -rotate-90">
              <circle
                cx="35"
                cy="35"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-[color:var(--app-line)]"
              />
              <motion.circle
                cx="35"
                cy="35"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-emerald-600"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${dash} ${circumference}` }}
                transition={{ duration: 1.1, delay: 0.3 + index * 0.07, ease: EASE }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-base font-bold leading-none text-emerald-700">
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
      <div className="flex flex-1 flex-col gap-3 border-t border-[color:var(--app-line-soft)] px-5 py-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700">
          Sunduğu yetenek
        </p>
        <p className="text-sm leading-relaxed text-[color:var(--app-ink)]">
          {offeredTalent || "Profil notu bulunamadı."}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-[color:var(--app-line-soft)] bg-white/40 px-5 py-3">
        <button
          type="button"
          className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold opacity-60"
          disabled
          title="Mesajlaşma akışı henüz eklenmedi"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          İletişime Geç
          <span className="ml-1 rounded-full bg-[color:var(--app-line-soft)] px-1.5 py-px text-[9px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            yakında
          </span>
        </button>
      </div>
    </motion.article>
  );
}

function MatchSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="soft-card flex flex-col gap-3 rounded-3xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 animate-pulse rounded-2xl bg-[color:var(--app-line-soft)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
            </div>
            <div className="h-12 w-12 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
          </div>
          <div className="h-2.5 w-3/4 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
          <div className="h-2.5 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        </div>
      ))}
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="soft-card rounded-3xl p-6">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-3 w-full animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      </div>
    </div>
  );
}

function NotFoundBlock() {
  return (
    <div className="rounded-3xl border border-coral/30 bg-coral/5 px-6 py-5 text-sm text-coral">
      İhtiyaç bulunamadı. Listeye dönüp yeniden seç.
    </div>
  );
}

function EmptyMatchesBlock() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-6 py-12 text-center">
      <Sparkles className="h-5 w-5 text-[color:var(--app-ink-mute)]" />
      <p className="max-w-sm text-sm text-[color:var(--app-ink-soft)]">
        Henüz eşleşme yok. Taraftarlar yeteneklerini kaydettiğinde burada görüneceksin.
        Birkaç dakika sonra "Yeniden hesapla" deneyebilirsin.
      </p>
    </div>
  );
}
