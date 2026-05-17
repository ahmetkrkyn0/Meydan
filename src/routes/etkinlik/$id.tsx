import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Users,
  Share2,
  CalendarPlus,
  Radio,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { events, athletes } from "@/lib/mock-data";

export const Route = createFileRoute("/etkinlik/$id")({
  component: EventDetailPage,
  head: () => ({ meta: [{ title: "Etkinlik — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

function EventDetailPage() {
  const { id } = Route.useParams();
  const event = events.find((e) => e.id === id) ?? events[0];
  const [going, setGoing] = useState(false);

  const relatedAthletes = athletes
    .filter((a) => a.sport === event.sport)
    .slice(0, 4);
  const filler = athletes.filter((a) => !relatedAthletes.includes(a)).slice(0, 4 - relatedAthletes.length);
  const showAthletes = [...relatedAthletes, ...filler].slice(0, 4);

  const pct = Math.min(100, Math.round((event.attending / event.cap) * 100));

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-4xl flex-col gap-10"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/sehrimde"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Şehrimde
          </Link>
        </motion.div>

        <motion.header variants={fadeUp} className="grid items-start gap-6 sm:grid-cols-[auto_1fr]">
          <div className="flex h-28 w-24 flex-col items-center justify-center rounded-2xl border border-[color:var(--app-line)] bg-white">
            <p className="font-display text-4xl font-bold leading-none text-[color:var(--app-ink)]">
              {event.day}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              {event.month}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[color:oklch(0.22_0.05_258/0.04)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--app-ink-soft)]">
              <Clock className="h-2.5 w-2.5" /> {event.time}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <span className="text-sm">{event.emoji}</span> {event.sport}
              </span>
              {event.free ? (
                <span className="chip chip-emerald">Ücretsiz</span>
              ) : (
                <span className="chip chip-coral">Bilet gerekli</span>
              )}
              <span className="chip">
                <MapPin className="h-3 w-3" /> {event.city} · {event.district}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              {event.title}
            </h1>

            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[color:var(--app-ink-soft)]">
                  <Users className="mr-1 inline h-3 w-3" />
                  {event.attending}/{event.cap} kişi gidiyor
                </span>
                <span className="font-mono text-[color:var(--app-ink-mute)]">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
                />
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setGoing((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              going
                ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30"
                : "btn-primary-light"
            }`}
          >
            {going ? <CheckCircle2 className="h-4 w-4" /> : null}
            {going ? "Listemde" : "Gideceğim"}
          </button>

          <Link
            to="/canli"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--app-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Radio className="h-4 w-4" />
            Dijital Tribüne Katıl
          </Link>

          <button className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
            <Share2 className="h-4 w-4" /> Paylaş
          </button>

          <button className="btn-ghost-light inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
            <CalendarPlus className="h-4 w-4" /> Takvime ekle
          </button>
        </motion.section>

        <motion.section variants={fadeUp} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 font-display text-lg font-bold text-[color:var(--app-ink)]">
                Etkinlik hakkında
              </h2>
              <p className="text-base leading-relaxed text-[color:var(--app-ink-soft)]">
                {event.description} {event.title.toLowerCase()} bu sene daha fazla katılımcıyı bir
                araya getiriyor. Tribün dolu olsun, sporcuların sırtı sıcak kalsın.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg font-bold text-[color:var(--app-ink)]">
                Katılan sporcular
              </h2>
              <div className="flex flex-col gap-2">
                {showAthletes.map((a) => (
                  <Link
                    key={a.id}
                    to="/sporcu/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white p-3 transition-all hover:border-violet/30"
                  >
                    <img
                      src={a.img}
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover object-top"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                        {a.sportEmoji} {a.sport} · {a.city}
                      </p>
                    </div>
                    <span className="chip chip-violet">TR #{a.rank.national}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="soft-card-strong overflow-hidden rounded-3xl">
              <div className="border-b border-[color:var(--app-line-soft)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Konum
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--app-ink)]">
                  {event.city}, {event.district}
                </p>
              </div>
              <div className="relative h-44 bg-[color:oklch(0.94_0.018_78)]">
                <div
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet ring-4 ring-violet/25"
                  style={{
                    left: `${50}%`,
                    top: `${50}%`,
                  }}
                />
                <div
                  className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-violet/10"
                  style={{ left: `50%`, top: `50%` }}
                />
                <svg className="h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                  <path
                    d="M0,40 L30,30 L60,42 L100,28"
                    stroke="oklch(0.22 0.05 258 / 0.10)"
                    strokeWidth="0.5"
                    fill="none"
                  />
                  <path
                    d="M0,18 L40,22 L80,14 L100,20"
                    stroke="oklch(0.22 0.05 258 / 0.08)"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </svg>
                <div className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-mono text-[color:var(--app-ink-soft)]">
                  {event.coords.x}°E · {event.coords.y}°N
                </div>
              </div>
              <div className="p-4">
                <button className="btn-ghost-light w-full rounded-xl py-2 text-xs font-semibold">
                  Yol tarifi al
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Detaylar
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[11px] text-[color:var(--app-ink-mute)]">Tarih</dt>
                  <dd className="font-semibold text-[color:var(--app-ink)]">
                    {event.day} {event.month}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[color:var(--app-ink-mute)]">Saat</dt>
                  <dd className="font-semibold text-[color:var(--app-ink)]">{event.time}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[color:var(--app-ink-mute)]">Branş</dt>
                  <dd className="font-semibold text-[color:var(--app-ink)]">
                    {event.emoji} {event.sport}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[color:var(--app-ink-mute)]">Kapasite</dt>
                  <dd className="font-semibold text-[color:var(--app-ink)]">{event.cap}</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
