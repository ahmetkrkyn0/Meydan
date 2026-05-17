import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  Heart,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athletes, badges } from "@/lib/mock-data";
import { listDonationsBySupporter, listProfiles, type BackendDonation } from "@/lib/api";
import { profileToAthlete } from "@/lib/api-mappers";
import { useActiveFan } from "@/lib/active-athlete";

export const Route = createFileRoute("/desteklerim")({
  component: SupportsPage,
  head: () => ({ meta: [{ title: "Desteklediklerim — Meydan" }] }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type Tab = "active" | "done" | "cancelled";

const SUPPORTS = [
  { slug: athletes[0].slug, monthly: 250, months: 5, trend: "+87%", status: "active" as const },
  { slug: athletes[1].slug, monthly: 100, months: 3, trend: "+42%", status: "active" as const },
  { slug: athletes[2].slug, monthly: 50,  months: 8, trend: "+18%", status: "active" as const },
  { slug: athletes[3].slug, monthly: 200, months: 2, trend: "+12%", status: "done" as const },
];

type SupportRow = {
  slug: string;
  monthly: number;
  months: number;
  trend: string;
  status: "active" | "done" | "cancelled";
};

function SupportsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const activeFan = useActiveFan();

  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });

  const donationsQuery = useQuery({
    queryKey: ["donations", "supporter", activeFan.profile?.id],
    queryFn: () => listDonationsBySupporter(activeFan.profile!.id),
    enabled: Boolean(activeFan.profile?.id),
    retry: 1,
  });

  // Backend bağışlarını sporcu bazında grupla.
  const backendSupports: SupportRow[] = useMemo(() => {
    const donations = donationsQuery.data?.donations ?? [];
    const profiles = profilesQuery.data?.profiles ?? [];
    if (!donations.length) return [];

    const byAthlete = new Map<string, BackendDonation[]>();
    for (const d of donations) {
      const arr = byAthlete.get(d.athlete_profile_id) ?? [];
      arr.push(d);
      byAthlete.set(d.athlete_profile_id, arr);
    }

    const rows: SupportRow[] = [];
    byAthlete.forEach((rowDonations, athleteId) => {
      const profile = profiles.find((p) => p.id === athleteId);
      if (!profile) return;
      const athlete = profileToAthlete(profile, 0);
      const monthly = Math.max(...rowDonations.map((d) => d.amount));
      const months = rowDonations.length;
      rows.push({
        slug: athlete.slug,
        monthly,
        months,
        trend: "+0%",
        status: "active",
      });
    });
    return rows;
  }, [donationsQuery.data, profilesQuery.data]);

  const hasBackend = backendSupports.length > 0;
  const supports = hasBackend ? backendSupports : SUPPORTS;

  const supportBadges = badges.filter((b) => b.earned).slice(0, 3);

  const filtered = supports.filter((s) =>
    tab === "active" ? s.status === "active" : tab === "done" ? s.status === "done" : false
  );

  const total = supports
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.monthly * s.months, 0);
  const activeCount = supports.filter((s) => s.status === "active").length;

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <motion.header variants={fade} initial="hidden" animate="show" custom={0} className="flex flex-col gap-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">
            Tribün hesabı
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Desteklediklerim
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Her ay yanlarında oldukların. Tek tıkla yönet, istediğinde iptal et.
          </p>
        </motion.header>

        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
          className="soft-card-strong grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl px-6 py-5 sm:grid-cols-4 sm:gap-x-10"
        >
          <Stat label="Toplam katkı" value={`₺${total.toLocaleString("tr-TR")}`} tone="violet" />
          <Stat label="Sporcu" value={String(activeCount)} tone="sky" />
          <Stat label="Aktif süre" value="5 ay" tone="coral" />
          <Stat label="Bu ayki büyüme" value="+12%" tone="emerald" />
        </motion.section>

        <motion.div variants={fade} initial="hidden" animate="show" custom={2} className="flex items-center gap-1 self-start rounded-full border border-[color:var(--app-line-soft)] bg-white/70 p-1.5">
          {([
            { id: "active",    label: "Aktif" },
            { id: "done",      label: "Tamamlanan" },
            { id: "cancelled", label: "İptal" },
          ] as { id: Tab; label: string }[]).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-white" : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="supports-tab"
                    className="absolute inset-0 rounded-full bg-[color:var(--app-ink)]"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.section variants={fade} initial="hidden" animate="show" custom={3}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-6 py-16 text-center">
              <Heart className="h-6 w-6 text-[color:var(--app-ink-mute)]" />
              <p className="text-sm text-[color:var(--app-ink-soft)]">Bu sekmede henüz bir destek yok.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((s) => {
                const profiles = profilesQuery.data?.profiles ?? [];
                const backendProfile = profiles.find((p) => {
                  const athlete = profileToAthlete(p, 0);
                  return athlete.slug === s.slug;
                });
                const a = backendProfile
                  ? profileToAthlete(backendProfile, 0)
                  : athletes.find((x) => x.slug === s.slug);
                if (!a) return null;
                return (
                  <div
                    key={s.slug}
                    className="soft-card relative flex items-center gap-4 rounded-2xl p-4 sm:p-5"
                  >
                    <img
                      src={a.img}
                      alt={a.name}
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover object-top"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{a.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-[color:var(--app-ink-soft)]">
                        {a.sportEmoji} {a.sport} · {a.city}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
                        ₺{s.monthly}
                        <span className="ml-0.5 text-xs font-medium text-[color:var(--app-ink-soft)]">/ay</span>
                      </p>
                      <p className="text-[10px] text-[color:var(--app-ink-mute)]">{s.months} ay aktif</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <TrendingUp className="h-3 w-3" />
                      {s.trend}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === s.slug ? null : s.slug)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                        aria-label="Seçenekler"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openMenu === s.slug && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-2xl border border-[color:var(--app-line)] bg-white p-1 shadow-lg">
                          <Link
                            to="/sporcu/$slug"
                            params={{ slug: a.slug }}
                            className="block rounded-lg px-3 py-2 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                          >
                            Detay
                          </Link>
                          <Link
                            to="/destekle/$slug"
                            params={{ slug: a.slug }}
                            className="block rounded-lg px-3 py-2 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                          >
                            Düzenle
                          </Link>
                          <button className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-coral hover:bg-coral/10">
                            İptal et
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={4}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">Rozetlerim</h2>
            <Link to="/rozetlerim" className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet">
              Tüm rozetler <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {supportBadges.map((b) => (
              <div key={b.id} className="soft-card flex items-center gap-3 rounded-2xl p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet/12 text-2xl">
                  {b.emoji}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{b.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[color:var(--app-ink-soft)]">{b.description}</p>
                </div>
                <Award className="ml-auto h-4 w-4 text-[color:var(--app-ink-mute)]" />
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "violet" | "sky" | "coral" | "emerald" }) {
  const toneClass =
    tone === "violet" ? "text-violet"
    : tone === "sky" ? "text-sky"
    : tone === "coral" ? "text-coral"
    : "text-emerald-700";
  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold leading-none ${toneClass}`}>{value}</p>
    </div>
  );
}
