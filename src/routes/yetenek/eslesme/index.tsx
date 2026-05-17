import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Filter,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { talentMatches, needs } from "@/lib/mock-data";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg from "@/assets/athlete-lina.jpg";

export const Route = createFileRoute("/yetenek/eslesme/")({
  component: MatchListPage,
  head: () => ({ meta: [{ title: "AI Eşleştirme — Yetenek Bağışı | Meydan" }] }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type Filt = "city" | "active" | "urgent" | null;

const EXTRA_MATCHES = [
  {
    id: "tm3",
    needId: "n5",
    athleteName: "Buse Naz Çakıroğlu",
    athleteImg: linaImg,
    talentName: "Selen Y.",
    talentCity: "İzmit",
    talentType: "İngilizce öğretmeni",
    matchScore: 78,
    reasoning: "Aynı şehirde, antrenör kampı için günlük tercüme desteği verebilir. Boks terminolojisine de hâkim.",
  },
  {
    id: "tm4",
    needId: "n2",
    athleteName: "Zeynep Sönmez",
    athleteImg: keremImg,
    talentName: "Mehmet K.",
    talentCity: "Ankara",
    talentType: "Fizyoterapist",
    matchScore: 84,
    reasoning: "Tenisçilerle 6 yıl çalışmış, hafta sonu müsait, Ankara dışında seyahat de yapabiliyor.",
  },
];

function MatchListPage() {
  const [filt, setFilt] = useState<Filt>(null);
  const [modal, setModal] = useState<string | null>(null);

  const all = [
    ...talentMatches.map((m) => ({ ...m })),
    ...EXTRA_MATCHES.map((m) => ({ ...m })),
  ];

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          <Link to="/yetenek" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet">
            ← Yetenek Bağışı
          </Link>
        </motion.div>

        <motion.header variants={fade} initial="hidden" animate="show" custom={1} className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
            <Sparkles className="h-3 w-3" /> AI Eşleştirme
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Yeteneğine göre <span className="italic text-emerald-700">en iyi {all.length}</span> eşleşme.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Eşleşmeler şehir, müsaitlik ve geçmiş deneyime göre hesaplanır.
          </p>
        </motion.header>

        <motion.section variants={fade} initial="hidden" animate="show" custom={2} className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
            <Filter className="h-3 w-3" /> Filtre
          </span>
          {[
            { id: "city" as const,   label: "Şehrim" },
            { id: "active" as const, label: "Aktif" },
            { id: "urgent" as const, label: "Acil" },
          ].map((f) => {
            const active = filt === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilt(active ? null : f.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "border-emerald-600/40 bg-emerald-500/12 text-emerald-700"
                    : "border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </motion.section>

        <motion.div variants={fade} initial="hidden" animate="show" custom={3} className="grid gap-5 md:grid-cols-2">
          {all.map((m, i) => {
            const need = needs.find((n) => n.id === m.needId);
            return (
              <MatchCard
                key={m.id}
                match={m}
                need={need}
                onContact={() => setModal(m.id)}
                index={i}
              />
            );
          })}
        </motion.div>
      </div>

      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-[color:var(--app-ink)]/30 backdrop-blur-sm sm:items-center"
          onClick={() => setModal(null)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="soft-card-strong w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
              İletişim isteği
            </p>
            <p className="mt-2 font-display text-xl font-bold text-[color:var(--app-ink)]">
              Mesajın iletildi
            </p>
            <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
              Sporcunun ekibi 48 saat içinde geri döner. Bildirim üzerinden takip edebilirsin.
            </p>
            <button
              onClick={() => setModal(null)}
              className="btn-primary-light mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
            >
              Tamam
            </button>
          </motion.div>
        </motion.div>
      )}
    </AppShell>
  );
}

function MatchCard({
  match,
  need,
  onContact,
  index,
}: {
  match: {
    id: string;
    athleteName: string;
    athleteImg: string;
    talentType: string;
    talentCity: string;
    matchScore: number;
    reasoning: string;
  };
  need?: { title?: string; deadline?: string; city?: string };
  onContact: () => void;
  index: number;
}) {
  const pct = match.matchScore;
  const circumference = 2 * Math.PI * 28;
  const dash = (pct / 100) * circumference;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="soft-card-strong relative flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Header: athlete (sol) + score circle (sağ) */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={match.athleteImg}
            alt={match.athleteName}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover object-top"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{match.athleteName}</p>
            <p className="mt-0.5 truncate text-[11px] text-[color:var(--app-ink-soft)]">
              {need?.title ?? match.talentType}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[color:var(--app-ink-mute)]">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.talentCity}</span>
              {need?.deadline && (
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {need.deadline}</span>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 70 70" className="h-full w-full -rotate-90">
            <circle cx="35" cy="35" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-[color:var(--app-line)]" />
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
              transition={{ duration: 1.1, delay: 0.5 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-base font-bold leading-none text-emerald-700">%{pct}</p>
            <p className="mt-0.5 text-[8px] font-mono uppercase tracking-wider text-[color:var(--app-ink-mute)]">uyum</p>
          </div>
        </div>
      </div>

      {/* Reasoning + chips */}
      <div className="flex flex-1 flex-col gap-3 border-t border-[color:var(--app-line-soft)] px-5 py-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700">
          Neden eşleşti?
        </p>
        <p className="text-sm leading-relaxed text-[color:var(--app-ink)]">
          {match.reasoning}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <span className="chip chip-emerald">{match.talentType}</span>
          <span className="chip">{match.talentCity}</span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 border-t border-[color:var(--app-line-soft)] bg-white/40 px-5 py-3">
        <Link
          to="/yetenek/eslesme/$id"
          params={{ id: match.id }}
          className="btn-ghost-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
        >
          Detay <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={onContact}
          className="btn-primary-light inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          İletişime Geç
        </button>
      </div>
    </motion.article>
  );
}
