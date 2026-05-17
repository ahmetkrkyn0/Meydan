import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Sparkles,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { talentMatches, needs } from "@/lib/mock-data";

export const Route = createFileRoute("/yetenek/eslesme/$id")({
  component: MatchDetailPage,
  head: () => ({ meta: [{ title: "Eşleşme Detayı — Meydan" }] }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function MatchDetailPage() {
  const { id } = Route.useParams();
  const [toast, setToast] = useState<boolean>(false);

  const m = talentMatches.find((x) => x.id === id) ?? talentMatches[0];
  const need = needs.find((n) => n.id === m.needId);

  const pct = m.matchScore;
  const circumference = 2 * Math.PI * 60;
  const dash = (pct / 100) * circumference;

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          <Link to="/yetenek/eslesme" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet">
            <ArrowLeft className="h-3.5 w-3.5" /> Tüm eşleşmeler
          </Link>
        </motion.div>

        <motion.header variants={fade} initial="hidden" animate="show" custom={1} className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-700">
            <Sparkles className="h-3 w-3" /> AI Eşleşme · Detay
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Eşleşme Detayı
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            İhtiyaç ve yetenek karşılaştırması. Onayladığında ilk mesaj gönderilir.
          </p>
        </motion.header>

        <motion.section variants={fade} initial="hidden" animate="show" custom={2} className="relative">
          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <article className="soft-card-strong relative overflow-hidden rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet/12 text-violet">
                  <User className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-violet">
                  Sporcunun ihtiyacı
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <img src={m.athleteImg} alt="" className="h-14 w-14 rounded-2xl object-cover object-top" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{m.athleteName}</p>
                  <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">{need?.city ?? m.talentCity}</p>
                </div>
              </div>
              <p className="mt-4 font-display text-lg font-bold leading-snug text-[color:var(--app-ink)]">
                {need?.title ?? m.talentType}
              </p>
              <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
                {need?.description ?? "Sporcunun ekibi bu pozisyon için gönüllü desteği arıyor."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--app-ink-mute)]">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {need?.deadline ?? "10 Haz"}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {need?.city ?? m.talentCity}</span>
                {need?.urgent && <span className="chip chip-coral">Acil</span>}
              </div>
            </article>

            <div className="relative flex items-center justify-center md:py-10">
              <div className="hidden md:block">
                <svg width="80" height="40" viewBox="0 0 80 40" className="text-emerald-600">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    d="M2 20 Q 40 4 78 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path d="M72 16 L 78 20 L 72 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-700">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </span>
            </div>

            <article className="soft-card-strong relative overflow-hidden rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                  <Wrench className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-700">
                  Senin yeteneğin
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/12 font-display text-xl font-bold text-emerald-700">
                  {m.talentName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{m.talentName}</p>
                  <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">{m.talentCity}</p>
                </div>
              </div>
              <p className="mt-4 font-display text-lg font-bold leading-snug text-[color:var(--app-ink)]">
                {m.talentType}
              </p>
              <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
                Profilinde belirttiğin müsaitlik ve şehir bilgisine göre AI bu eşleşmeyi seçti.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="chip chip-emerald">Hafta sonu müsait</span>
                <span className="chip">3 yıl deneyim</span>
              </div>
            </article>
          </div>
        </motion.section>

        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          custom={3}
          className="soft-card-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="grid items-center gap-8 sm:grid-cols-[180px_1fr]">
            <div className="relative mx-auto h-40 w-40 sm:mx-0">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="10" className="text-[color:var(--app-line)]" />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="text-emerald-600"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${dash} ${circumference}` }}
                  transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-5xl font-bold text-emerald-700">%{pct}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--app-ink-mute)]">uyum</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-700">
                Neden bu kadar yüksek?
              </p>
              <p className="mt-2 font-display text-2xl leading-snug text-[color:var(--app-ink)] sm:text-3xl">
                "{m.reasoning}"
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                AI; şehir, müsaitlik, tecrübe ve sporcunun geçmiş gönüllü iş birliklerini karşılaştırarak
                bu puanı hesapladı. Skoru sadece sen ve sporcu ekibi görür.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={4} className="grid gap-3 sm:grid-cols-3">
          <Metric
            label="Şehir uygunluğu"
            value="Tam uyumlu"
            note={`Sen: ${m.talentCity} · Sporcu: ${need?.city ?? m.talentCity}`}
            icon={MapPin}
            tone="emerald"
          />
          <Metric
            label="Süre uyumu"
            value="3 ay esnek"
            note="Haftalık 2-4 saat müsaitlik yeterli"
            icon={Calendar}
            tone="violet"
          />
          <Metric
            label="Geçmiş başarı"
            value="9 / 10"
            note="Önceki gönüllüler memnuniyet ortalaması"
            icon={TrendingUp}
            tone="sky"
          />
        </motion.section>

        <motion.section variants={fade} initial="hidden" animate="show" custom={5} className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-violet/8 to-transparent px-6 py-10 text-center">
          <p className="max-w-md text-sm text-[color:var(--app-ink-soft)]">
            Hazırsan ilk mesajı gönderelim. Numaran paylaşılmaz, mesaj kutusunda devam edersin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setToast(true)}
              className="btn-primary-light inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
            >
              <MessageCircle className="h-4 w-4" />
              İletişime Geç
            </button>
            <Link
              to="/yetenek/eslesme"
              className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              Başka eşleşme göster <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </div>

      {toast && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 sm:bottom-6"
        >
          <div className="soft-card-strong flex items-center gap-3 rounded-full px-5 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-[color:var(--app-ink)]">
              Mesajın {m.athleteName} ekibine iletildi.
            </p>
            <button
              onClick={() => setToast(false)}
              className="text-[10px] font-bold text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink)]"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof MapPin;
  tone: "emerald" | "violet" | "sky";
}) {
  const toneBg =
    tone === "emerald" ? "bg-emerald-500/12 text-emerald-700"
    : tone === "violet" ? "bg-violet/12 text-violet"
    : "bg-sky/12 text-sky";

  return (
    <div className="soft-card flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${toneBg}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
          {label}
        </p>
      </div>
      <p className="font-display text-xl font-bold text-[color:var(--app-ink)]">{value}</p>
      <p className="text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">{note}</p>
    </div>
  );
}
