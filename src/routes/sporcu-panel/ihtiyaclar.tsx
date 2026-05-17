import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Coins,
  MapPin,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { ActiveAthletePicker } from "@/components/meydan/ActiveAthletePicker";
import { type Need } from "@/lib/mock-data";
import { listNeeds } from "@/lib/api";
import { backendNeedsToNeeds } from "@/lib/api-mappers";
import { useActiveAthlete } from "@/lib/active-athlete";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar")({
  component: NeedsPage,
  head: () => ({ meta: [{ title: "İhtiyaçlarım — Sporcu Paneli" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

type Tab = "all" | "active" | "completed";

function NeedsPage() {
  const activeAthlete = useActiveAthlete();
  const activeProfile = activeAthlete.profile;
  const needsQuery = useQuery({
    queryKey: ["needs", activeProfile?.id],
    queryFn: () => listNeeds(activeProfile!.id),
    enabled: Boolean(activeProfile?.id),
    retry: 1,
  });

  const [tab, setTab] = useState<Tab>("all");

  const myNeeds: Need[] = useMemo(() => {
    if (!activeAthlete.athlete || !needsQuery.data) return [];
    return backendNeedsToNeeds(needsQuery.data.needs, activeAthlete.athlete);
  }, [activeAthlete.athlete, needsQuery.data]);

  const me = activeAthlete.athlete;

  const list = useMemo(() => {
    if (tab === "all") return myNeeds;
    if (tab === "active") return myNeeds.filter((n) => n.urgent);
    return myNeeds.filter((n) => !n.urgent);
  }, [myNeeds, tab]);

  // ─── Stats ───
  const totalCollected = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.collectedAmount ?? 0), 0);
  const totalTarget = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.targetAmount ?? 0), 0);
  const moneyNeeds = myNeeds.filter((n) => n.type === "money").length;
  const talentNeeds = myNeeds.filter((n) => n.type === "talent").length;
  const urgentCount = myNeeds.filter((n) => n.urgent).length;
  const overallPct =
    totalTarget > 0 ? Math.min(100, Math.round((totalCollected / totalTarget) * 100)) : 0;

  const counts = {
    all: myNeeds.length,
    active: myNeeds.filter((n) => n.urgent).length,
    completed: myNeeds.filter((n) => !n.urgent).length,
  };

  // ─── Empty (no profile) ───
  if (!me) {
    return (
      <AppShell role="athlete">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 py-16">
          <ActiveAthletePicker state={activeAthlete} />
          <p className="text-sm text-[color:var(--app-ink-soft)]">
            Sporcu paneli için aktif bir sporcu profili gerekli. Backend'de en az bir
            <span className="font-semibold"> role=sporcu</span> kaydı oluştuktan sonra
            yukarıdaki seçici dolacak.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="athlete" userName={me.name} userCity={me.city}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-16"
      >
        <ActiveAthletePicker state={activeAthlete} />

        {/* ─── HERO ─── */}
        <motion.header
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem]"
        >
          <div className="absolute inset-0 bg-aurora-light opacity-95" />
          <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-coral/15 blur-3xl" />

          <div className="relative grid gap-6 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-violet">
                <Target className="h-3 w-3" /> Sporcu Paneli · İhtiyaçlarım
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
                Topluluğa neye
                <br />
                <span className="italic text-violet">ihtiyacın olduğunu</span> söyle.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
                Para ya da yetenek — açık olduğunda yardım daha hızlı geliyor. Her ihtiyaç
                için <span className="font-semibold text-[color:var(--app-ink)]">AI Eşleşme</span>{" "}
                ile sana uygun taraftarları görebilirsin.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link
                  to="/sporcu-panel/ihtiyac-olustur"
                  className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Yeni İhtiyaç Ekle
                </Link>
                <Link
                  to="/sporcu-panel"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--app-line)] bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--app-ink-soft)] backdrop-blur transition-colors hover:text-[color:var(--app-ink)]"
                >
                  ← Panele dön
                </Link>
              </div>
            </div>

            {/* Quick stats panel (sağ) */}
            <div className="relative grid grid-cols-2 gap-3 rounded-3xl border border-[color:var(--app-line-soft)] bg-white/80 p-5 backdrop-blur-xl">
              <QuickStat
                icon={Target}
                label="Aktif kart"
                value={myNeeds.length.toString()}
                tone="violet"
              />
              <QuickStat
                icon={AlertCircle}
                label="Acil"
                value={urgentCount.toString()}
                tone="coral"
              />
              <QuickStat
                icon={Coins}
                label="Para"
                value={moneyNeeds.toString()}
                tone="violet"
              />
              <QuickStat
                icon={Wrench}
                label="Yetenek"
                value={talentNeeds.toString()}
                tone="emerald"
              />
            </div>
          </div>
        </motion.header>

        {/* ─── Progress (sadece para ihtiyaçları varsa) ─── */}
        {moneyNeeds > 0 && (
          <motion.section
            variants={fadeUp}
            className="soft-card-strong relative overflow-hidden rounded-3xl p-6 sm:p-7"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/10 blur-3xl" />
            <div className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  Toplam destek ilerlemesi
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-4xl font-bold tabular-nums text-[color:var(--app-ink)] sm:text-5xl">
                    ₺{totalCollected.toLocaleString("tr-TR")}
                  </p>
                  <p className="font-mono text-sm text-[color:var(--app-ink-mute)]">
                    / ₺{totalTarget.toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallPct}%` }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet via-sky to-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-violet/10 px-5 py-4 text-violet">
                <TrendingUp className="h-4 w-4" />
                <div>
                  <p className="font-display text-2xl font-bold leading-none tabular-nums">
                    %{overallPct}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    tamamlandı
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ─── Toolbar (Filter tabs + Add) ─── */}
        <motion.section variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--app-line)] bg-white p-1">
            {(["all", "active", "completed"] as Tab[]).map((t) => {
              const active = tab === t;
              const label = t === "all" ? "Hepsi" : t === "active" ? "Acil" : "Diğer";
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "text-white"
                      : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="needs-tab-pill"
                      className="absolute inset-0 rounded-full bg-[color:var(--app-ink)]"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                  <span
                    className={`relative text-[10px] tabular-nums ${
                      active ? "text-white/70" : "text-[color:var(--app-ink-mute)]"
                    }`}
                  >
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            to="/sporcu-panel/ihtiyac-olustur"
            className="btn-primary-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Yeni İhtiyaç
          </Link>
        </motion.section>

        {/* ─── List ─── */}
        <AnimatePresence mode="wait">
          {needsQuery.isLoading ? (
            <motion.section key="loading" variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <NeedSkeleton key={i} />
              ))}
            </motion.section>
          ) : list.length === 0 ? (
            <motion.section key="empty" variants={fadeUp}>
              <EmptyState
                hasAny={myNeeds.length > 0}
                tab={tab}
                onClearFilter={() => setTab("all")}
              />
            </motion.section>
          ) : (
            <motion.section
              key="list"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid gap-5 sm:grid-cols-2"
            >
              {list.map((n, i) => (
                <NeedCard key={n.id} need={n} index={i} />
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────

function QuickStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  tone: "violet" | "coral" | "emerald";
}) {
  const cls =
    tone === "coral"
      ? "bg-coral/12 text-coral"
      : tone === "emerald"
        ? "bg-emerald-500/12 text-emerald-700"
        : "bg-violet/12 text-violet";
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${cls}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-display text-xl font-bold leading-none text-[color:var(--app-ink)]">
          {value}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
          {label}
        </p>
      </div>
    </div>
  );
}

function NeedCard({ need, index }: { need: Need; index: number }) {
  const isMoney = need.type === "money";
  const pct =
    isMoney && need.targetAmount
      ? Math.min(100, Math.round(((need.collectedAmount ?? 0) / need.targetAmount) * 100))
      : 0;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="soft-card-strong group relative flex flex-col overflow-hidden rounded-[1.75rem]"
    >
      {/* Tone glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${
          isMoney ? "bg-violet/15" : "bg-emerald-500/15"
        }`}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3 px-6 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={isMoney ? "chip chip-violet" : "chip chip-emerald"}>
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
        <span className="font-mono text-[10px] tabular-nums text-[color:var(--app-ink-mute)]">
          № {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Title + description */}
      <div className="relative flex flex-col gap-2 px-6 pt-4">
        <h3 className="font-display text-xl font-bold leading-snug text-[color:var(--app-ink)]">
          {need.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
          {need.description}
        </p>
      </div>

      {/* Body (progress veya talent) */}
      <div className="relative flex-1 px-6 pt-5">
        {isMoney && need.targetAmount ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-2xl font-bold tabular-nums text-[color:var(--app-ink)]">
                ₺{(need.collectedAmount ?? 0).toLocaleString("tr-TR")}
                <span className="ml-1 font-mono text-xs font-normal text-[color:var(--app-ink-mute)]">
                  / ₺{need.targetAmount.toLocaleString("tr-TR")}
                </span>
              </p>
              <span className="font-mono text-xs font-bold text-violet">%{pct}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: EASE }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet to-sky"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-500/8 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Aranan
            </p>
            <p className="mt-1 font-display text-lg font-bold leading-tight text-[color:var(--app-ink)]">
              {need.talentNeeded ?? need.title}
            </p>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="relative mt-5 flex items-center gap-4 px-6 text-[11px] text-[color:var(--app-ink-mute)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3" /> {need.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3 w-3" /> Son: {need.deadline}
        </span>
      </div>

      {/* Footer action: AI Eşleşme */}
      <div className="relative mt-5 border-t border-[color:var(--app-line-soft)] bg-white/40 px-6 py-3.5">
        <Link
          to="/sporcu-panel/ihtiyaclar/$id/eslesme"
          params={{ id: need.id }}
          className="group/btn flex w-full items-center justify-between gap-2 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          <span className="inline-flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            AI ile Eşleşme Bul
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}

function NeedSkeleton() {
  return (
    <div className="soft-card flex flex-col gap-3 rounded-[1.75rem] p-6">
      <div className="flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
      </div>
      <div className="h-5 w-2/3 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      <div className="space-y-1.5">
        <div className="h-3 w-full animate-pulse rounded bg-[color:var(--app-line-soft)]" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-[color:var(--app-line-soft)]" />
      </div>
      <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-[color:var(--app-line-soft)]" />
    </div>
  );
}

function EmptyState({
  hasAny,
  tab,
  onClearFilter,
}: {
  hasAny: boolean;
  tab: Tab;
  onClearFilter: () => void;
}) {
  if (!hasAny) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-violet/30 bg-violet/5 px-6 py-16 text-center">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet/20" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Henüz ihtiyaç oluşturmadın
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
              İlk ihtiyacını ekle. Topluluğa açıkça söylediğinde AI seni uygun taraftarlarla
              eşleştirir.
            </p>
          </div>
          <Link
            to="/sporcu-panel/ihtiyac-olustur"
            className="btn-primary-light mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            İlk İhtiyacımı Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-6 py-14 text-center">
      <Users className="h-5 w-5 text-[color:var(--app-ink-mute)]" />
      <p className="max-w-sm text-sm text-[color:var(--app-ink-soft)]">
        Bu sekmede ihtiyaç yok ({tab === "active" ? "Acil" : "Diğer"}).
      </p>
      <button
        onClick={onClearFilter}
        className="text-xs font-semibold text-violet underline-offset-4 hover:underline"
      >
        Tüm ihtiyaçları göster
      </button>
    </div>
  );
}
