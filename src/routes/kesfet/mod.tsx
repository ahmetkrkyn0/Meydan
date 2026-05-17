import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Award, Calendar, Check, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/kesfet/mod")({
  component: KesfetModPage,
  head: () => ({ meta: [{ title: "Keşfet Modu — Meydan" }] }),
});

type Suggestion = {
  name: string;
  emoji: string;
  tagline: string;
  paragraphs: string[];
  eventTitle: string;
  eventCity: string;
  eventDate: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    name: "Eskrim",
    emoji: "🤺",
    tagline: "Bu hafta seni Eskrim ile tanıştırıyoruz.",
    paragraphs: [
      "Eskrim üç silahla — flöre, epe ve kılıç — yapılan bir refleks sporu. Tribünden bakanlar için satranç hızında, sporcular için bir saniyenin onda biri.",
      "Türkiye'de henüz dar bir topluluk var; bu yüzden tanıdıkça öğretmen oluyorsun. Gençler kulüplerde 1-2 ay temel duruşu öğreniyor.",
      "Ekipman kulüpten — sana sadece spor kıyafeti ve merak yetiyor.",
    ],
    eventTitle: "Eskişehir Eskrim Showcase",
    eventCity: "Eskişehir",
    eventDate: "30 Haz",
  },
  {
    name: "Okçuluk",
    emoji: "🏹",
    tagline: "Bu hafta seni Okçuluk ile tanıştırıyoruz.",
    paragraphs: [
      "Okçuluk sessizlik ve nefes üzerine kurulu eski bir disiplin. Türkiye'nin geleneksel olimpik olmayan dallarına da hâkim olduğu nadir branşlardan.",
      "Başlangıç dersleri 90 dakika sürer; ekipman kulüpte hazır. Atışlardan önce 10 dakikalık duruş, sonra ilk oklar.",
      "İçeride yapılır, dış mekân da var. Soğukkanlılığı seven herkes için.",
    ],
    eventTitle: "Okçuluk Başlangıç Atölyesi",
    eventCity: "İstanbul",
    eventDate: "28 May",
  },
  {
    name: "Yelken",
    emoji: "⛵",
    tagline: "Bu hafta seni Yelken ile tanıştırıyoruz.",
    paragraphs: [
      "Yelken; rüzgârla pazarlık etmeyi öğrendiğin bir spor. Doğa öğretmen, deniz arena.",
      "Tek başına ya da iki kişilik teknelerle başlanır. İlk dersler limanda — denize çıkmak için sabırlı olmak gerek.",
      "Yüzme bilmek yeter; gerisi rüzgâr ve birkaç ip.",
    ],
    eventTitle: "Bodrum Sahil Yelken Kupası",
    eventCity: "Bodrum",
    eventDate: "07 Haz",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function KesfetModPage() {
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState(false);
  const suggestion = SUGGESTIONS[index];

  const matchingEvent =
    events.find((e) => e.title === suggestion.eventTitle) ?? {
      title: suggestion.eventTitle,
      city: suggestion.eventCity,
      district: "",
      day: suggestion.eventDate.split(" ")[0],
      month: suggestion.eventDate.split(" ")[1] ?? "",
      time: "—",
      free: false,
    };

  const tried = 3;
  const triedGoal = 5;
  const triedPct = Math.round((tried / triedGoal) * 100);

  function tryThisSport() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  function nextSuggestion() {
    setIndex((i) => (i + 1) % SUGGESTIONS.length);
  }

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 pb-10">
        {/* ─── Centered hero suggestion ─── */}
        <AnimatePresence mode="wait">
          <motion.section
            key={suggestion.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative overflow-hidden rounded-3xl bg-aurora-light p-8 text-center sm:p-12"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Keşfet modu</p>

            <motion.div
              key={suggestion.emoji}
              initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-6 text-[88px] leading-none sm:text-[120px]"
              aria-hidden
            >
              {suggestion.emoji}
            </motion.div>

            <h1 className="font-display mx-auto mt-6 max-w-xl text-3xl font-bold leading-[1.1] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
              {suggestion.tagline.split(suggestion.name)[0]}
              <span className="italic text-violet">{suggestion.name}</span>
              {suggestion.tagline.split(suggestion.name)[1]}
            </h1>

            <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 text-left text-[15px] leading-relaxed text-[color:var(--app-ink-soft)] sm:text-base">
              {suggestion.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>

        {/* ─── Nearby event ─── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Yakındaki etkinlik
          </p>
          <div className="soft-card flex items-center gap-4 rounded-2xl p-5">
            <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-violet/10 py-2.5 text-violet">
              <span className="font-display text-xl font-bold leading-none">{matchingEvent.day}</span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">{matchingEvent.month}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[color:var(--app-ink)]">{matchingEvent.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[color:var(--app-ink-soft)]">
                <MapPin className="h-3 w-3" /> {matchingEvent.city}
                {matchingEvent.district ? `, ${matchingEvent.district}` : ""}
                {matchingEvent.time !== "—" ? ` · ${matchingEvent.time}` : ""}
              </p>
            </div>
            <Link
              to="/sehrimde"
              className="btn-ghost-light inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
            >
              Detay <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.section>

        {/* ─── Primary CTA ─── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show" className="flex flex-col items-center gap-3">
          <button
            onClick={tryThisSport}
            className="btn-primary-light inline-flex items-center gap-3 rounded-full py-3.5 pl-3 pr-7 text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
              <Sparkles className="h-4 w-4" />
            </span>
            Bu sporu denemek istiyorum
          </button>
          <p className="text-[11px] text-[color:var(--app-ink-mute)]">
            Bilgi paylaşırız, kulübe seni biz tanıtırız.
          </p>
        </motion.section>

        {/* ─── First-step badge progress ─── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show">
          <div className="soft-card flex items-center gap-4 rounded-2xl p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-coral/12 text-coral">
              <Award className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold text-[color:var(--app-ink)]">İlk Adım rozeti</p>
                <p className="font-mono text-xs font-bold text-[color:var(--app-ink-soft)]">
                  {tried}/{triedGoal}
                </p>
              </div>
              <p className="mt-0.5 text-[11px] text-[color:var(--app-ink-soft)]">
                Denediğin spor sayısı
              </p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--app-line)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${triedPct}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: EASE }}
                  className="h-full rounded-full bg-gradient-to-r from-coral to-violet"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Reroll link ─── */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            onClick={nextSuggestion}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--app-ink-soft)] underline-offset-4 transition-colors hover:text-violet hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Başka bir öneri
          </button>
          <Link
            to="/kesfet"
            className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink-soft)]"
          >
            Veya tüm branşlara dön
          </Link>
        </div>
      </div>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-[color:var(--app-ink)] px-5 py-3 shadow-xl sm:bottom-8"
            role="status"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Harika seçim!</p>
              <p className="text-[11px] text-white/70">{suggestion.name} kulüpleriyle iletişime geçiyoruz.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
