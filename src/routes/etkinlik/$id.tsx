import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Users,
  Share2,
  CalendarPlus,
  Radio,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Navigation,
  Ticket,
  Flame,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { getEvent } from "@/lib/api";
import { backendEventToEvent } from "@/lib/api-mappers";
import { events, athletes, getSportImage, type Event } from "@/lib/mock-data";

export const Route = createFileRoute("/etkinlik/$id")({
  component: EventDetailPage,
  head: () => ({ meta: [{ title: "Etkinlik — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   "Gideceğim" — localStorage tabanlı RSVP store
   Backend yok; sayfa yenilense de durum kalır.
   Aynı tarayıcıdaki başka sekmeler `storage` event'i ile
   senkron olur.
   ───────────────────────────────────────────── */

export const GOING_STORAGE_KEY = "meydan:going-events:v1";

export function readGoingSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(GOING_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function writeGoingSet(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GOING_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // quota / private mode — sessizce yut
  }
}

function useGoingEvent(eventId: string): {
  going: boolean;
  toggle: () => void;
} {
  const [going, setGoing] = useState(false);

  // Mount + cross-tab sync
  useEffect(() => {
    setGoing(readGoingSet().has(eventId));
    const onStorage = (e: StorageEvent) => {
      if (e.key === GOING_STORAGE_KEY) {
        setGoing(readGoingSet().has(eventId));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [eventId]);

  const toggle = useCallback(() => {
    const set = readGoingSet();
    if (set.has(eventId)) set.delete(eventId);
    else set.add(eventId);
    writeGoingSet(set);
    setGoing(set.has(eventId));
  }, [eventId]);

  return { going, toggle };
}

/* ─────────────────────────────────────────────
   Google Calendar + Maps URL helpers
   ───────────────────────────────────────────── */

// "2026-06-08" + "20:00" → "20260608T200000"
function toGCalDate(date: string, time: string): string {
  const d = (date || "").replaceAll("-", "");
  const t = (time || "00:00").replace(":", "") + "00";
  return `${d}T${t}`;
}

// Etkinliğe 3 saatlik default süre veriyoruz.
function addHoursToTime(time: string, hours: number): string {
  const [hStr, mStr] = (time || "00:00").split(":");
  const h = Number(hStr) || 0;
  const m = Number(mStr) || 0;
  const total = (h + hours) * 60 + m;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

function buildGCalUrl(event: Event): string {
  const start = toGCalDate(event.date, event.time);
  const endTime = addHoursToTime(event.time, 3);
  const end = toGCalDate(event.date, endTime);
  const location = `${event.district}, ${event.city}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: `${event.sport} etkinliği · Meydan üzerinden eklendi.`,
    location,
    ctz: "Europe/Istanbul",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildMapsEmbedUrl(event: Event): string {
  // API key gerektirmeyen public embed formatı
  if (event.latitude != null && event.longitude != null) {
    const q = `${event.latitude},${event.longitude}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
  }
  const q = `${event.district}, ${event.city}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;
}

function buildDirectionsUrl(event: Event): string {
  if (event.latitude != null && event.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
  }
  const q = `${event.district}, ${event.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
}

function EventDetailPage() {
  const { id } = Route.useParams();
  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    retry: 1,
  });
  const fallbackEvent = events.find((e) => e.id === id) ?? events[0];
  const event = eventQuery.data ? backendEventToEvent(eventQuery.data) : fallbackEvent;
  const { going, toggle: toggleGoing } = useGoingEvent(event.id);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const relatedAthletes = athletes
    .filter((a) => a.sport === event.sport)
    .slice(0, 4);
  const filler = athletes
    .filter((a) => !relatedAthletes.includes(a))
    .slice(0, 4 - relatedAthletes.length);
  const showAthletes = [...relatedAthletes, ...filler].slice(0, 4);

  // "Gideceğim" işaretliyse görsel olarak +1 yansıt — kullanıcıya etkisi
  // hemen geri gelsin diye. Backend yok, sadece optimistic UI.
  const displayAttending = Math.min(event.cap, event.attending + (going ? 1 : 0));
  const pct = Math.min(100, Math.round((displayAttending / event.cap) * 100));
  const spotsLeft = Math.max(0, event.cap - displayAttending);
  const isHot = pct >= 80;

  const venueImage = event.image ?? getSportImage(event.sport);

  const gcalUrl = useMemo(() => buildGCalUrl(event), [event]);
  const mapsEmbed = useMemo(() => buildMapsEmbedUrl(event), [event]);
  const directionsUrl = useMemo(() => buildDirectionsUrl(event), [event]);

  return (
    <AppShell role="fan">
      {/* ─────────────────────────────────────────────
          HERO — Tam genişlik sinematik kapak görseli
          ───────────────────────────────────────────── */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative -mx-4 -mt-6 mb-16 sm:-mx-6 lg:-mx-10"
      >
        <div className="relative h-[72vh] min-h-[560px] w-full overflow-hidden rounded-b-[40px]">
          <motion.div
            style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0"
          >
            <img
              src={venueImage}
              alt={event.sport}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Dramatik gradient katmanı */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/90" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-55 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 10% 90%, oklch(0.60 0.22 252 / 0.75), transparent 60%), radial-gradient(ellipse 50% 50% at 95% 10%, oklch(0.72 0.16 222 / 0.55), transparent 60%)",
            }}
          />

          {/* Üst bar */}
          <motion.div
            variants={fadeUp}
            className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-6 sm:px-10"
          >
            <Link
              to="/sehrimde"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Şehrimde
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const url = typeof window !== "undefined" ? window.location.href : "";
                  if (navigator.share) {
                    navigator.share({ title: event.title, url }).catch(() => {});
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).catch(() => {});
                  }
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20"
                aria-label="Paylaş"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20"
                aria-label="Google Takvime ekle"
              >
                <CalendarPlus className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Hero başlık ve meta */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-14 sm:px-10 sm:pb-20">
            <div className="mx-auto max-w-6xl">
              <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl ring-1 ring-white/20">
                  <span className="text-base leading-none">{event.emoji}</span>
                  {event.sport}
                </span>
                {event.free ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-100 backdrop-blur-xl ring-1 ring-emerald-300/40">
                    <Sparkles className="h-3 w-3" />
                    Ücretsiz
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl ring-1 ring-coral/40">
                    <Ticket className="h-3 w-3" />
                    {event.priceTL > 0 ? `${event.priceTL} ₺` : "Bilet gerekli"}
                  </span>
                )}
                {isHot && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400/30 to-coral/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl ring-1 ring-amber-300/40">
                    <Flame className="h-3 w-3" />
                    Son bilet sayılı
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display max-w-4xl text-[clamp(2.25rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-tight text-white drop-shadow-2xl"
              >
                {event.title}
              </motion.h1>

              {/* Akışkan meta — büyük tipografi, ayrım noktaları */}
              <motion.div
                variants={fadeUp}
                className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-white/85"
              >
                <span className="font-display text-2xl font-bold leading-none text-white">
                  {event.day}{" "}
                  <span className="text-base font-medium uppercase tracking-[0.18em] text-white/70">
                    {event.month}
                  </span>
                </span>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-white/40 sm:inline" />
                <span className="inline-flex items-baseline gap-1.5 font-display text-2xl font-bold leading-none text-white">
                  {event.time}
                </span>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-white/40 sm:inline" />
                <span className="text-base font-medium">
                  {event.district},{" "}
                  <span className="text-white/70">{event.city}</span>
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bindirmeli aksiyon şeridi — kutusuz, akışkan */}
        <motion.div
          variants={fadeUp}
          className="relative z-20 mx-auto -mt-12 max-w-5xl px-4 sm:px-6"
        >
          <div className="flex flex-col items-stretch gap-4 rounded-full border border-white/60 bg-white/85 p-2 shadow-[0_24px_60px_-24px_oklch(0.22_0.05_258/0.35)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:pl-6">
            {/* Sol — katılım, ufak ve akışkan */}
            <div className="flex items-center gap-4 px-4 sm:px-0">
              <div className="relative h-12 w-12 shrink-0">
                <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.22 0.05 258 / 0.08)" strokeWidth="3" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 94.2" }}
                    animate={{ strokeDasharray: `${(pct / 100) * 94.2} 94.2` }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="oklch(0.60 0.22 252)" />
                      <stop offset="1" stopColor="oklch(0.72 0.16 222)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-[color:var(--app-ink)]">
                  %{pct}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--app-ink-mute)]">
                  <Users className="mr-1 inline h-3 w-3" /> Katılım
                </p>
                <p className="font-display text-base font-bold leading-tight text-[color:var(--app-ink)]">
                  {displayAttending.toLocaleString("tr-TR")}
                  <span className="text-[color:var(--app-ink-mute)]">
                    /{event.cap.toLocaleString("tr-TR")}
                  </span>
                  {spotsLeft > 0 ? (
                    <span className="ml-2 text-[11px] font-medium text-[color:var(--app-ink-soft)]">
                      · {spotsLeft.toLocaleString("tr-TR")} yer kaldı
                    </span>
                  ) : (
                    <span className="ml-2 text-[11px] font-medium text-coral">· dolu</span>
                  )}
                </p>
              </div>
            </div>

            {/* Sağ — CTA'lar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={toggleGoing}
                aria-pressed={going}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  going
                    ? "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/30"
                    : "btn-primary-light hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {going ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Listemde
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gideceğim
                  </>
                )}
              </button>

              <Link
                to="/canli"
                aria-label="Dijital Tribün"
                className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--app-ink)] text-white transition-all hover:bg-[color:var(--app-ink)]/85 hover:scale-[1.05] active:scale-[0.95]"
              >
                <Radio className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ─────────────────────────────────────────────
          İÇERİK — Akışkan, kutusuz, dergi tarzı
          ───────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto grid w-full max-w-6xl gap-y-16 lg:grid-cols-[1.5fr_1fr] lg:gap-x-14"
      >
        {/* SOL — Hakkında + Sporcular */}
        <div className="flex flex-col gap-14">
          {/* Hakkında */}
          <motion.section variants={fadeUp}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-violet" />
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-violet">
                Etkinlik Hakkında
              </h2>
            </div>
            <p className="font-display text-2xl font-bold leading-tight tracking-tight text-[color:var(--app-ink)] sm:text-3xl">
              {event.title}{" "}
              <span className="text-[color:var(--app-ink-soft)]">
                · {event.district}, {event.city}
              </span>
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)] sm:text-lg">
              {event.description} Bu sene daha fazla katılımcıyı bir araya getiriyor — tribün dolu olsun, sporcuların sırtı sıcak kalsın.
            </p>

            {/* Akışkan stat şeridi — kutu yok, dikey ayraçlı */}
            <dl className="mt-10 flex flex-wrap items-stretch gap-y-6 divide-x divide-[color:var(--app-line)] border-y border-[color:var(--app-line)] py-6">
              <FactCell
                label="Tarih"
                value={event.day}
                hint={event.month}
                accent="violet"
              />
              <FactCell
                label="Saat"
                value={event.time}
                hint="başlangıç"
                accent="sky"
              />
              <FactCell
                label="Branş"
                value={event.emoji}
                hint={event.sport}
                accent="coral"
                emoji
              />
              <FactCell
                label="Kapasite"
                value={event.cap.toLocaleString("tr-TR")}
                hint="kişi"
                accent="emerald"
              />
            </dl>
          </motion.section>

          {/* Sporcular — kutusuz liste */}
          <motion.section variants={fadeUp}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-sky" />
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-sky">
                  Sahne Alacak Sporcular
                </h2>
              </div>
              <Link
                to="/kesfet"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
              >
                Hepsi
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <ul className="divide-y divide-[color:var(--app-line)]">
              {showAthletes.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                >
                  <Link
                    to="/sporcu/$slug"
                    params={{ slug: a.slug }}
                    className="group flex items-center gap-4 py-4 transition-all"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={a.img}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white shadow-md ring-2 ring-white ${
                          a.accent === "violet"
                            ? "bg-violet"
                            : a.accent === "sky"
                            ? "bg-sky"
                            : a.accent === "coral"
                            ? "bg-coral"
                            : "bg-emerald-500"
                        }`}
                      >
                        #{a.rank.national}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg font-bold leading-tight text-[color:var(--app-ink)] transition-colors group-hover:text-violet">
                        {a.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-[color:var(--app-ink-soft)]">
                        <span className="mr-1">{a.sportEmoji}</span>
                        {a.sport}{" "}
                        <span className="text-[color:var(--app-ink-mute)]">· {a.city}</span>
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[color:var(--app-line)] transition-all group-hover:translate-x-1 group-hover:text-violet" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* SAĞ — Gerçek harita + Hızlı bilgi (sticky, kutusuz) */}
        <motion.aside variants={fadeUp} className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-col gap-10">
            {/* Konum bölümü */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-coral" />
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-coral">
                  Konum
                </h2>
              </div>

              <p className="font-display text-2xl font-bold leading-tight text-[color:var(--app-ink)]">
                {event.district}
              </p>
              <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
                {event.city}
                {event.latitude != null && event.longitude != null && (
                  <span className="ml-2 font-mono text-[11px] text-[color:var(--app-ink-mute)]">
                    {event.latitude.toFixed(4)}°N · {event.longitude.toFixed(4)}°E
                  </span>
                )}
              </p>

              {/* Gerçek Google Maps embed — API key gerektirmeyen public format */}
              <div className="relative mt-5 overflow-hidden rounded-3xl border border-[color:var(--app-line)] shadow-[0_18px_40px_-20px_oklch(0.22_0.05_258/0.25)]">
                <iframe
                  title="Etkinlik konumu"
                  src={mapsEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-64 w-full border-0"
                  allowFullScreen
                />
                {/* Üstüne yumuşak gradient — tasarımla harmanlamak için */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/80 to-transparent" />
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--app-ink)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[color:var(--app-ink)]/85"
                >
                  <Navigation className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Yol tarifi al
                </a>
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[color:var(--app-line)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--app-ink)] transition-all hover:border-violet/40 hover:text-violet"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Takvime ekle
                </a>
              </div>
            </div>

            {/* Hızlı ipuçları — kutusuz, sadece dikey çizgi */}
            <div className="relative pl-5">
              <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-violet via-sky to-coral" />
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet">
                  Ön Hazırlık
                </p>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                <li>
                  Etkinlik başlamadan{" "}
                  <span className="font-semibold text-[color:var(--app-ink)]">30 dk önce</span>{" "}
                  alana ulaşmanı öneririz.
                </li>
                <li>
                  Dijital tribün canlı yayını etkinlik saatinde otomatik açılır.
                </li>
                <li>
                  <span className="font-semibold text-[color:var(--app-ink)]">"Gideceğim"</span>{" "}
                  diyenler ilk geldikleri yerde rozet kazanır.
                </li>
              </ul>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AppShell>
  );
}

/* ─────────────────────────────────────────────
   FactCell — kutu yok, sadece dikey ayraç
   ───────────────────────────────────────────── */
function FactCell({
  label,
  value,
  hint,
  accent,
  emoji = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: "violet" | "sky" | "coral" | "emerald";
  emoji?: boolean;
}) {
  const accentColor =
    accent === "violet"
      ? "bg-violet"
      : accent === "sky"
      ? "bg-sky"
      : accent === "coral"
      ? "bg-coral"
      : "bg-emerald-500";

  return (
    <div className="flex min-w-[7rem] flex-1 flex-col justify-center px-5 first:pl-0">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
          {label}
        </p>
      </div>
      <p
        className={`mt-2 font-display font-bold leading-none text-[color:var(--app-ink)] ${
          emoji ? "text-3xl" : "text-2xl"
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs font-medium text-[color:var(--app-ink-soft)]">{hint}</p>
      )}
    </div>
  );
}
