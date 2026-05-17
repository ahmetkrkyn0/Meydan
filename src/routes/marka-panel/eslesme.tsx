import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { matchResults } from "@/lib/mock-data";

export const Route = createFileRoute("/marka-panel/eslesme")({
  component: BrandMatchPage,
  head: () => ({ meta: [{ title: "AI Marka Eşleştirme — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

type Result = (typeof matchResults.b1)[number];

function RiskBadge({ score }: { score: number }) {
  const label = score < 10 ? "Düşük" : score < 20 ? "Orta" : "Yüksek";
  const tone = score < 10 ? "chip-emerald" : score < 20 ? "chip" : "chip-coral";
  return <span className={`chip ${tone}`}>{label} risk</span>;
}

function MatchCard({ m, expanded, onToggle }: { m: Result; expanded: boolean; onToggle: () => void }) {
  return (
    <motion.article
      variants={fadeUp}
      className="soft-card overflow-hidden rounded-3xl"
      layout
    >
      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-[200px_1fr_200px] md:p-6">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
          <img
            src={m.athleteImg}
            alt={m.athleteName}
            className="h-20 w-20 rounded-2xl object-cover object-top md:h-44 md:w-44"
          />
          <div>
            <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">
              {m.athleteName}
            </p>
            <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)]">{m.sport}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-[color:var(--app-ink-mute)]">
              <MapPin className="h-3 w-3" strokeWidth={1.9} />
              {m.athleteSlug === "mete-gazoz" ? "İstanbul"
                : m.athleteSlug === "buse-naz-cakiroglu" ? "İzmit" : "Bursa"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl font-bold tracking-tight text-sky">
              {m.fitScore}%
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              uyum skoru
            </span>
          </div>

          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="h-3 w-3" strokeWidth={2.2} /> Neden uygun?
            </p>
            {expanded ? (
              <ul className="space-y-1.5">
                {m.reasoning.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="line-clamp-2 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                {m.reasoning.join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:grid-cols-1 md:gap-3">
          <div className="rounded-xl bg-[color:var(--app-line-soft)] p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2} /> Risk
            </div>
            <p className="mt-1 font-display text-lg font-bold text-[color:var(--app-ink)]">
              {m.riskScore < 10 ? "Düşük" : "Orta"}
            </p>
            <p className="text-[10px] text-[color:var(--app-ink-mute)]">skor {m.riskScore}/100</p>
          </div>
          <div className="rounded-xl bg-[color:var(--app-line-soft)] p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              <TrendingUp className="h-3 w-3" strokeWidth={2} /> Tahmini ROI
            </div>
            <p className="mt-1 font-display text-lg font-bold text-[color:var(--app-ink)]">
              {m.estROI}
            </p>
          </div>
          <div className="rounded-xl bg-[color:var(--app-line-soft)] p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              <Sparkles className="h-3 w-3" strokeWidth={2} /> Büyüme
            </div>
            <p className="mt-1 font-display text-lg font-bold text-[color:var(--app-ink)]">
              {m.growth}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--app-line-soft)] px-5 py-3 md:px-6">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
          {expanded ? "Daralt" : "Detay"}
        </button>
        <div className="flex gap-2">
          <button className="btn-ghost-light rounded-xl px-3.5 py-2 text-xs font-semibold">
            Profili gör
          </button>
          <Link
            to="/marka-panel/teklif/$slug"
            params={{ slug: m.athleteSlug }}
            className="btn-primary-light inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"
          >
            Teklif Gönder <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function BrandMatchPage() {
  const list = matchResults.b1;
  const [openId, setOpenId] = useState<string>(list[0].athleteSlug);

  return (
    <AppShell role="brand" userName="Karaca" userCity="Pazarlama">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-10"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Marka paneli · AI eşleştirme
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            AI <span className="italic text-sky">Marka Eşleştirme</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Karaca brief'ine göre 3 sporcu önerildi. Skorlar şu an oluştu.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="chip chip-sky">Ev & Yaşam</span>
            <span className="chip">₺ 250K bütçe</span>
            <span className="chip chip-violet">Aile</span>
            <span className="chip chip-violet">Türkiye</span>
            <span className="chip chip-violet">Tasarım</span>
            <span className="chip">25-45 yaş</span>
          </div>
        </motion.header>

        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          {list.map((m) => (
            <MatchCard
              key={m.athleteSlug}
              m={m}
              expanded={openId === m.athleteSlug}
              onToggle={() =>
                setOpenId(openId === m.athleteSlug ? "" : m.athleteSlug)
              }
            />
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="soft-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <p className="text-sm text-[color:var(--app-ink-soft)]">
            Brief'i tazelersen yeni skor 30 saniyede hazır olur.
          </p>
          <Link
            to="/marka-panel/profil-olustur"
            className="btn-ghost-light inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"
          >
            Brief'i düzenle <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
