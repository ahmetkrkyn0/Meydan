import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Plus, TrendingUp, Eye, Heart, Calendar, ArrowRight, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { campaigns, type CampaignStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/marka-panel/kampanyalar/")({
  component: CampaignsPage,
  head: () => ({ meta: [{ title: "Kampanyalar — Marka Paneli" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

type Status = CampaignStatus;

function CampaignsPage() {
  const [tab, setTab] = useState<"all" | Status>("all");

  const list = tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab);
  const counts = {
    all: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    ended: campaigns.filter((c) => c.status === "ended").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
  };

  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalReach = campaigns.reduce((s, c) => s + c.metrics.reach, 0);
  const avgEng =
    campaigns.filter((c) => c.status !== "draft").reduce((s, c) => s + c.metrics.engagement, 0) /
    Math.max(1, campaigns.filter((c) => c.status !== "draft").length);

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-7"
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky">Kampanyalar</p>
            <h1 className="font-display mt-1.5 text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              Aktif işbirlikleri ve sonuçları.
            </h1>
            <p className="mt-2 max-w-md text-sm text-[color:var(--app-ink-soft)]">
              Her kampanya bir sporcu hikâyesi. Performans canlı, raporlar şeffaf.
            </p>
          </div>
          <Link
            to="/marka-panel/eslesme"
            className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Yeni Kampanya
          </Link>
        </motion.header>

        {/* Stat strip */}
        <motion.section variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Aktif kampanya" value={String(counts.active)} accent="violet" />
          <Stat label="Toplam harcanan" value={`₺ ${totalSpent.toLocaleString("tr-TR")}`} accent="sky" />
          <Stat label="Toplam erişim" value={`${(totalReach / 1000).toFixed(0)}K`} accent="sky" />
          <Stat label="Ort. etkileşim" value={`%${avgEng.toFixed(1)}`} accent="violet" />
        </motion.section>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-1.5 self-start rounded-full border border-[color:var(--app-line)] bg-white p-1"
        >
          {([
            { id: "all", label: "Tümü" },
            { id: "active", label: "Aktif" },
            { id: "ended", label: "Tamamlanan" },
            { id: "draft", label: "Taslak" },
          ] as { id: "all" | Status; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.id ? "text-white" : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="camp-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-[color:var(--app-ink)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {t.label}
              <span className={`tabular-nums text-[10px] ${tab === t.id ? "opacity-80" : "opacity-60"}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Campaign list */}
        <motion.section variants={fadeUp} className="flex flex-col gap-3">
          {list.map((c) => {
            const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
            return (
              <motion.article
                key={c.id}
                variants={fadeUp}
                className="grid items-center gap-4 rounded-3xl border border-[color:var(--app-line)] bg-white p-5 md:grid-cols-[1.6fr_1fr_1.2fr_auto]"
              >
                {/* Athlete + title */}
                <div className="flex items-start gap-3">
                  <img
                    src={c.athleteImg}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-2xl object-cover object-top"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusPill status={c.status} />
                      <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                        {c.sport}
                      </span>
                    </div>
                    <h3 className="font-display mt-1 text-base font-bold leading-tight text-[color:var(--app-ink)] truncate">
                      {c.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)] truncate">{c.athleteName}</p>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Bütçe</p>
                  <p className="font-display mt-0.5 text-sm font-bold text-[color:var(--app-ink)] tabular-nums">
                    ₺ {c.spent.toLocaleString("tr-TR")}
                    <span className="ml-1 text-xs font-medium text-[color:var(--app-ink-mute)]">
                      / ₺ {c.budget.toLocaleString("tr-TR")}
                    </span>
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: EASE }}
                      className="h-full rounded-full bg-gradient-to-r from-sky to-violet"
                    />
                  </div>
                </div>

                {/* Metrics inline */}
                <div className="flex items-center gap-4 text-xs text-[color:var(--app-ink-soft)]">
                  <Metric icon={Eye} label="Erişim" value={c.metrics.reach >= 1000 ? `${(c.metrics.reach / 1000).toFixed(0)}K` : "—"} />
                  <Metric icon={Heart} label="Etkileşim" value={c.metrics.engagement ? `%${c.metrics.engagement}` : "—"} />
                  <Sparkline data={c.spark} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/marka-panel/kampanyalar/$id"
                    params={{ id: c.id }}
                    className="btn-ghost-light inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  >
                    Detay <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--app-ink-mute)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Date range bottom row */}
                <div className="col-span-full flex items-center justify-between border-t border-[color:var(--app-line-soft)] pt-3 text-[11px] text-[color:var(--app-ink-mute)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> {c.startDate} → {c.endDate}
                  </span>
                  <Link
                    to="/sporcu/$slug"
                    params={{ slug: c.athleteSlug }}
                    className="hover:text-violet"
                  >
                    Sporcu profili →
                  </Link>
                </div>
              </motion.article>
            );
          })}

          {list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white px-6 py-12 text-center">
              <p className="text-sm text-[color:var(--app-ink-soft)]">Bu sekmede kampanya yok.</p>
            </div>
          )}
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: "violet" | "sky" }) {
  const cls = accent === "violet" ? "text-violet" : "text-sky";
  return (
    <div className="rounded-2xl border border-[color:var(--app-line)] bg-white p-3.5">
      <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">{label}</p>
      <p className={`font-display mt-1 text-xl font-bold ${cls}`}>{value}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="font-display mt-0.5 text-sm font-bold text-[color:var(--app-ink)]">{value}</p>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return <div className="h-7 w-20 rounded-md bg-[color:var(--app-line-soft)]" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 80;
      const y = 24 - ((v - min) / range) * 22;
      return `${x},${y}`;
    })
    .join(" ");
  const trendUp = data[data.length - 1] >= data[0];

  return (
    <div className="inline-flex flex-col items-center">
      <svg viewBox="0 0 80 28" className="h-7 w-20">
        <polyline
          fill="none"
          stroke={trendUp ? "oklch(0.60 0.22 252)" : "oklch(0.65 0.20 18)"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      <span className={`mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-semibold ${trendUp ? "text-violet" : "text-coral"}`}>
        <TrendingUp className={`h-2.5 w-2.5 ${trendUp ? "" : "rotate-180"}`} />
        Trend
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    active: { label: "Aktif",    cls: "chip-violet" },
    ended:  { label: "Bitti",    cls: "chip" },
    draft:  { label: "Taslak",   cls: "chip-sky" },
  };
  const m = map[status];
  return <span className={`chip ${m.cls}`}>{m.label}</span>;
}
