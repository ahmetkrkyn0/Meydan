import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft, ArrowUpRight, Calendar, Clock, Eye, Heart, MessageSquare,
  MoreHorizontal, MousePointerClick, Pause, Pencil, Target, TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { campaignById } from "@/lib/mock-data";

export const Route = createFileRoute("/marka-panel/kampanyalar/$id")({
  component: CampaignDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `${campaignById(params.id).title} — Kampanya | Meydan` }],
  }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const STATUS_LABEL = { active: "Aktif", ended: "Tamamlandı", draft: "Taslak" } as const;
const STATUS_CHIP = { active: "chip-violet", ended: "chip", draft: "chip-sky" } as const;

function CampaignDetailPage() {
  const { id } = Route.useParams();
  const c = campaignById(id);
  const spentPct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
  const accentColor =
    c.accent === "coral" ? "oklch(0.65 0.20 18)" :
    c.accent === "violet" ? "oklch(0.60 0.22 252)" :
                            "oklch(0.72 0.16 222)";

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        {/* Back link */}
        <motion.div variants={fadeUp}>
          <Link
            to="/marka-panel/kampanyalar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kampanyalar
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header variants={fadeUp} className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`chip ${STATUS_CHIP[c.status]}`}>{STATUS_LABEL[c.status]}</span>
              <span className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                {c.sport}
              </span>
            </div>
            <h1 className="font-display mt-2 text-3xl font-bold leading-tight tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              {c.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--app-ink-soft)]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {c.startDate} → {c.endDate}
              </span>
              {c.status === "active" && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {c.daysLeft} gün kaldı
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-ghost-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold">
              <Pencil className="h-3.5 w-3.5" /> Düzenle
            </button>
            {c.status === "active" && (
              <button className="btn-ghost-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold">
                <Pause className="h-3.5 w-3.5" /> Duraklat
              </button>
            )}
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </motion.header>

        {/* Athlete + Performance hero */}
        <motion.section
          variants={fadeUp}
          className="soft-card-strong relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-aurora-light opacity-60" />
          <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_1.4fr] md:p-8">
            {/* Athlete */}
            <div className="flex items-center gap-4">
              <img
                src={c.athleteImg}
                alt={c.athleteName}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover object-top ring-4 ring-white"
              />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Sporcu
                </p>
                <p className="mt-1 font-display text-xl font-bold text-[color:var(--app-ink)]">
                  {c.athleteName}
                </p>
                <p className="text-sm text-[color:var(--app-ink-soft)]">{c.sport}</p>
                <Link
                  to="/sporcu/$slug"
                  params={{ slug: c.athleteSlug }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline underline-offset-4"
                >
                  Profili gör <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Performance sparkline */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Performans trendi
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" /> Yükseliş
                </span>
              </div>
              <BigSparkline points={c.spark} color={accentColor} />
            </div>
          </div>
        </motion.section>

        {/* Metrics — 4 kpi */}
        <motion.section variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi icon={Eye}                label="İzlenme"   value={c.metrics.reach >= 1000 ? `${(c.metrics.reach / 1000).toFixed(0)}K` : `${c.metrics.reach}`} />
          <Kpi icon={Heart}              label="Etkileşim" value={`+${c.metrics.engagement}%`} />
          <Kpi icon={MousePointerClick}  label="Tıklama"   value={c.metrics.clicks >= 1000 ? `${(c.metrics.clicks / 1000).toFixed(1)}K` : `${c.metrics.clicks}`} />
          <Kpi icon={Target}             label="ROI"       value={`${c.metrics.roi}x`} accent />
        </motion.section>

        {/* Budget + brief grid */}
        <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          {/* Brief */}
          <div className="soft-card rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Brief
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--app-ink)]">
              {c.description}
            </p>

            <div className="mt-4 border-t border-[color:var(--app-line-soft)] pt-4">
              <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Beklenen içerik
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.deliverables.map((d) => (
                  <span key={d} className="chip chip-sky">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="soft-card flex flex-col gap-3 rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Bütçe kullanımı
            </p>
            <p className="font-display text-3xl font-bold leading-none text-[color:var(--app-ink)]">
              ₺ {c.spent.toLocaleString("tr-TR")}
              <span className="ml-2 text-base font-medium text-[color:var(--app-ink-soft)]">
                / ₺ {c.budget.toLocaleString("tr-TR")}
              </span>
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${spentPct}%` }}
                transition={{ duration: 1.1, ease: EASE }}
                className="h-full rounded-full bg-gradient-to-r from-sky to-violet"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--app-ink-soft)]">
              <span>%{spentPct} kullanıldı</span>
              <span className="font-mono">₺ {(c.budget - c.spent).toLocaleString("tr-TR")} kaldı</span>
            </div>

            <div className="mt-2 border-t border-[color:var(--app-line-soft)] pt-3">
              <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Süreç
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="font-display text-xl font-bold text-[color:var(--app-ink)]">{c.daysLeft}</p>
                <p className="text-[11px] text-[color:var(--app-ink-soft)]">gün kaldı · {c.endDate}'a kadar</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Timeline + Actions */}
        <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Timeline */}
          <div className="soft-card rounded-2xl p-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Kampanya zaman çizelgesi
              </p>
              <span className="text-[11px] text-[color:var(--app-ink-mute)]">{c.timeline.length} olay</span>
            </div>
            <ul className="mt-4 space-y-3">
              {c.timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      t.type === "milestone" ? "bg-violet/15 text-violet" :
                      t.type === "report"    ? "bg-sky/15 text-sky" :
                                                "bg-coral/15 text-coral"
                    }`}>
                      {t.type === "milestone" ? <Target className="h-3.5 w-3.5" /> :
                       t.type === "report"    ? <TrendingUp className="h-3.5 w-3.5" /> :
                                                <MessageSquare className="h-3.5 w-3.5" />}
                    </span>
                    {i < c.timeline.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-[color:var(--app-line)]" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-semibold text-[color:var(--app-ink)]">{t.title}</p>
                    <p className="mt-0.5 text-[11px] text-[color:var(--app-ink-mute)]">{t.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick actions / messages */}
          <div className="flex flex-col gap-3">
            <div className="soft-card rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Sporcuyla iletişim
              </p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--app-ink)]">
                Son mesaj: 2 gün önce
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--app-ink-soft)]">
                "Reels'ler için çekim planı onayına gönderildi."
              </p>
              <Link
                to="/mesajlar"
                className="btn-ghost-light mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Mesajlara git
              </Link>
            </div>

            <div className="soft-card rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Rapor
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                Ara dönem performans raporunu indir veya paylaş.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                  PDF
                </button>
                <button className="btn-primary-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold">
                  Paylaş <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="soft-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
          {label}
        </p>
        <Icon className={`h-4 w-4 ${accent ? "text-violet" : "text-[color:var(--app-ink-mute)]"}`} strokeWidth={1.8} />
      </div>
      <p className={`font-display mt-2 text-3xl font-bold leading-none ${accent ? "text-violet" : "text-[color:var(--app-ink)]"}`}>
        {value}
      </p>
    </div>
  );
}

function BigSparkline({ points, color }: { points: number[]; color: string }) {
  if (!points.length) {
    return (
      <div className="mt-3 flex h-20 items-center justify-center rounded-xl bg-[color:var(--app-line-soft)] text-[11px] text-[color:var(--app-ink-mute)]">
        Veri yok
      </div>
    );
  }
  const w = 360;
  const h = 70;
  const pad = 4;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const pts = points
    .map((v, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `M${pad},${h} L${pts.split(" ").join(" L")} L${w - pad},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-16 w-full">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-grad)" />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}
