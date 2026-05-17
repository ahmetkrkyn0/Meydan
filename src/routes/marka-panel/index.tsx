import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  PencilLine,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { campaigns, matchResults } from "@/lib/mock-data";

export const Route = createFileRoute("/marka-panel/")({
  component: BrandPanelHome,
  head: () => ({ meta: [{ title: "Marka Paneli — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Sparkline({ points, color = "var(--sky)" }: { points: number[]; color?: string }) {
  const w = 140;
  const h = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(1, max - min);
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / span) * (h - 4) - 2}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandPanelHome() {
  const proposals = matchResults.b1;

  const stats = [
    {
      label: "Bütçe kullanılan",
      value: "₺ 80K",
      sub: "/ ₺ 250K toplam",
      tone: "sky",
      icon: Wallet,
      progress: 32,
    },
    {
      label: "Aktif kampanya",
      value: "2",
      sub: "yaz koleksiyonu serisi",
      tone: "indigo",
      icon: Sparkles,
    },
    {
      label: "Önerilen sporcu",
      value: "12",
      sub: "AI eşleştirme",
      tone: "violet",
      icon: Plus,
    },
    {
      label: "Kampanya performansı",
      value: "+34%",
      sub: "etkileşim, son 30 gün",
      tone: "coral",
      icon: TrendingUp,
    },
  ];

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-12"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Marka paneli · Karaca
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Hoş geldin <span className="italic text-sky">Karaca</span>.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Bu hafta 3 yeni eşleşme önerin var. Yaz koleksiyonu kampanyası 28 gün
            daha çalışıyor — sayılar fena değil.
          </p>
        </motion.header>

        <motion.section variants={fadeUp} aria-labelledby="stat-row">
          <h2 id="stat-row" className="sr-only">Hızlı özet</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="soft-card relative overflow-hidden rounded-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    {s.label}
                  </p>
                  <s.icon className="h-4 w-4 text-[color:var(--app-ink-mute)]" strokeWidth={1.7} />
                </div>
                <p className="mt-3 font-display text-3xl font-bold tracking-tight text-[color:var(--app-ink)]">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">{s.sub}</p>
                {typeof s.progress === "number" && (
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                    <div
                      className="h-full rounded-full bg-sky"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} aria-labelledby="eslesmeler">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h2 id="eslesmeler" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                Bekleyen eşleşme önerileri
              </h2>
              <p className="mt-1 text-xs text-[color:var(--app-ink-mute)]">
                AI brief'ine göre uyum skoru hesaplandı
              </p>
            </div>
            <Link
              to="/marka-panel/eslesme"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-sky"
            >
              Tümünü gör <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {proposals.map((p) => (
              <div
                key={p.athleteSlug}
                className="soft-card group flex flex-col gap-3 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.athleteImg}
                    alt={p.athleteName}
                    className="h-12 w-12 rounded-xl object-cover object-top"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                      {p.athleteName}
                    </p>
                    <p className="text-[11px] text-[color:var(--app-ink-mute)]">{p.sport}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-sky">{p.fitScore}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                      uyum
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-[color:var(--app-ink-soft)]">
                  {p.reasoning[0]}
                </p>
                <Link
                  to="/marka-panel/eslesme"
                  className="btn-ghost-light inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-px"
                >
                  İncele <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} aria-labelledby="kampanyalar">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="kampanyalar" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Aktif kampanyalar
            </h2>
            <span className="chip chip-sky">{campaigns.filter((c) => c.status === "active").length} aktif</span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {campaigns
              .filter((c) => c.status === "active")
              .map((c) => (
                <article key={c.id} className="soft-card flex flex-col gap-4 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                        Kampanya
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-[color:var(--app-ink)]">
                        {c.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[color:var(--app-ink-soft)]">
                        <span className="chip">{c.daysLeft} gün kaldı</span>
                        <span>·</span>
                        <span>₺ {(c.budget / 1000).toFixed(0)}K bütçe</span>
                        <span>·</span>
                        <span>{c.deliverables.join(" + ")}</span>
                      </div>
                    </div>
                    <Sparkline
                      points={c.spark}
                      color={c.accent === "coral" ? "var(--coral)" : c.accent === "violet" ? "var(--violet)" : "var(--sky)"}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                      <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
                        {c.metrics.reach >= 1000 ? `${(c.metrics.reach / 1000).toFixed(0)}K` : c.metrics.reach}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">izlenme</p>
                    </div>
                    <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                      <p className="font-display text-base font-bold text-[color:var(--app-ink)]">+{c.metrics.engagement}%</p>
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">etkileşim</p>
                    </div>
                    <div className="rounded-xl bg-[color:var(--app-line-soft)] py-2">
                      <p className="font-display text-base font-bold text-[color:var(--app-ink)]">{c.metrics.roi}x</p>
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">ROI</p>
                    </div>
                  </div>

                  <Link
                    to="/marka-panel/kampanyalar/$id"
                    params={{ id: c.id }}
                    className="btn-ghost-light inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  >
                    İncele <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} aria-labelledby="hizli">
          <h2 id="hizli" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
            Hızlı aksiyon
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/marka-panel/profil-olustur"
              className="soft-card group flex items-center justify-between gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/12 text-sky">
                  <PencilLine className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-[color:var(--app-ink)]">
                    Yeni brief oluştur
                  </p>
                  <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)]">
                    AI değer ve hedef kitle uyumu çalıştırır
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[color:var(--app-ink-mute)] transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-sky" />
            </Link>

            <Link
              to="/marka-panel/profil-olustur"
              className="soft-card group flex items-center justify-between gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet/12 text-violet">
                  <Sparkles className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-[color:var(--app-ink)]">
                    Profili güncelle
                  </p>
                  <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)]">
                    Değer, bütçe ve hedef kitleyi tazele
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[color:var(--app-ink-mute)] transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-violet" />
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
