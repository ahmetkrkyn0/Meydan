import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import {
  MapPin,
  Users,
  Sparkles,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNearbyEvents } from "@/lib/api";
import { backendEventToEvent as backendEventToEventLocal } from "@/lib/api-mappers";
import { events, sports, type Event } from "@/lib/mock-data";

export const Route = createFileRoute("/sehrimde")({
  component: SehrimdePage,
  head: () => ({ meta: [{ title: "Şehrimde Ne Var? — Meydan" }] }),
});

const ALL_CITIES = "Tüm şehirler";
const cities = [ALL_CITIES, "İstanbul", "Ankara", "İzmir", "Bursa", "Eskişehir", "Bodrum"];

type Range = "all" | "week" | "month";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

function SehrimdePage() {
  const [city, setCity] = useState<string>(ALL_CITIES);
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [range, setRange] = useState<Range>("all");
  const [activeId, setActiveId] = useState<string | null>(events[0]?.id ?? null);
  const cityParam = city === ALL_CITIES ? null : city;
  const rangeParam = range === "all" ? null : range;
  const eventsQuery = useQuery({
    queryKey: ["events", "nearby", cityParam, sportFilter, freeOnly, rangeParam],
    queryFn: () =>
      listNearbyEvents({
        city: cityParam,
        branch: sportFilter,
        is_free: freeOnly ? true : null,
        range: rangeParam,
      }),
    retry: 1,
  });

  // Backend response geldi mi? İçi boş bile olsa "geldi" sayılır — mock fallback'e
  // düşmek sadece backend gerçekten hata verdiğinde olmalı, "şehirde etkinlik yok"
  // durumunda değil.
  const backendResponded = !eventsQuery.isLoading && !eventsQuery.isError;
  const backendEvents = eventsQuery.data?.events ?? [];

  const eventList = useMemo(() => {
    if (backendResponded) {
      return backendEvents.length
        ? backendEvents.map((event, index) => backendEventToEventLocal(event, index))
        : [];
    }
    return events;
  }, [backendResponded, backendEvents]);

  // Backend cevabı geldiyse filtreleme zaten serverda yapıldı, client filtre yok.
  // Backend hata verirse mock fallback üzerinde client filtre uygula.
  const filtered = useMemo(() => {
    if (backendResponded) return eventList;
    return eventList.filter((e) => {
      if (cityParam && e.city !== cityParam) return false;
      if (sportFilter && e.sport !== sportFilter) return false;
      if (freeOnly && !e.free) return false;
      return true;
    });
  }, [cityParam, eventList, backendResponded, sportFilter, freeOnly]);

  const sportsInCity = useMemo(() => {
    const source = backendResponded || !cityParam
      ? eventList
      : eventList.filter((e) => e.city === cityParam);
    const set = new Set(source.map((e) => e.sport));
    return Array.from(set);
  }, [cityParam, eventList, backendResponded]);

  const active = filtered.find((e) => e.id === activeId) ?? filtered[0];

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Şehrimde Ne Var?
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            {range === "week" ? "Bu hafta" : range === "month" ? "Bu ay" : "Yaklaşan etkinlikler"}{" "}
            <span className="italic text-violet">
              {city === ALL_CITIES ? "Türkiye'de" : `${city}'da`}
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Yakınında olan tek bir maç bile tribünün başlangıcıdır. {filtered.length} etkinlik bulundu.
          </p>

          {(eventsQuery.isLoading || eventsQuery.isError) && (
            <p className="text-xs text-[color:var(--app-ink-mute)]">
              {eventsQuery.isLoading
                ? "Yaklaşan etkinlikler backend'den yükleniyor..."
                : "Backend'e ulaşılamadı; demo etkinlikleri gösteriliyor."}
            </p>
          )}
          {backendResponded && backendEvents.length === 0 && (
            <p className="text-xs text-[color:var(--app-ink-mute)]">
              {city === ALL_CITIES ? "Türkiye genelinde " : `${city} için `}
              {range === "week" ? "bu hafta " : range === "month" ? "bu ay " : ""}
              {sportFilter ? `${sportFilter} branşında ` : ""}
              henüz etkinlik yok.
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {cities.map((c) => {
              const on = c === city;
              return (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`chip transition-all ${on ? "chip-violet" : ""}`}
                >
                  <MapPin className="h-3 w-3" /> {c}
                </button>
              );
            })}
          </div>
        </motion.header>

        <motion.section variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            <Filter className="h-3.5 w-3.5" /> Filtrele
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSportFilter(null)}
              className={`chip ${sportFilter === null ? "chip-violet" : ""}`}
            >
              Tümü
            </button>
            {sportsInCity.map((s) => {
              const def = sports.find((x) => x.name === s);
              const on = sportFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setSportFilter(on ? null : s)}
                  className={`chip ${on ? "chip-violet" : ""}`}
                >
                  <span>{def?.emoji ?? "🏷️"}</span> {s}
                </button>
              );
            })}

            <span className="mx-2 h-4 w-px bg-[color:var(--app-line)]" />

            <button
              onClick={() => setFreeOnly((v) => !v)}
              className={`chip ${freeOnly ? "chip-emerald" : ""}`}
            >
              {freeOnly ? "✓" : "○"} Ücretsiz
            </button>

            <span className="mx-2 h-4 w-px bg-[color:var(--app-line)]" />

            <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--app-line)] bg-white p-0.5">
              {([
                ["all", "Hepsi"],
                ["week", "Bu hafta"],
                ["month", "Bu ay"],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setRange(k)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    range === k
                      ? "bg-[color:var(--app-ink)] text-white"
                      : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="soft-card-strong relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-aurora-light opacity-60" />
            <div className="relative flex h-full flex-col p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Türkiye haritası · Mock
                </p>
                <span className="chip">
                  <Sparkles className="h-3 w-3" /> {filtered.length} pin
                </span>
              </div>

              <div className="relative aspect-[5/4] w-full rounded-2xl border border-[color:var(--app-line)] bg-white/60">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <radialGradient id="land" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="oklch(0.92 0.04 90)" />
                      <stop offset="100%" stopColor="oklch(0.86 0.05 78)" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M5,55 C8,48 14,42 22,40 C30,38 38,36 46,36 C54,36 60,32 66,30 C72,28 80,28 86,32 C92,36 95,42 95,50 C95,58 92,66 86,70 C80,74 72,76 64,76 C56,76 48,78 42,80 C36,82 28,82 22,78 C16,74 10,68 7,62 C5,60 4,58 5,55 Z"
                    fill="url(#land)"
                    stroke="oklch(0.22 0.05 258 / 0.18)"
                    strokeWidth="0.4"
                  />
                  <circle cx="60" cy="38" r="0.6" fill="oklch(0.22 0.05 258 / 0.4)" />
                  <text x="62" y="36" fontSize="2.4" fill="oklch(0.42 0.04 258)" fontFamily="Inter">
                    İstanbul
                  </text>
                  <circle cx="56" cy="50" r="0.6" fill="oklch(0.22 0.05 258 / 0.4)" />
                  <text x="58" y="49" fontSize="2.4" fill="oklch(0.42 0.04 258)" fontFamily="Inter">
                    Ankara
                  </text>
                  <circle cx="44" cy="60" r="0.6" fill="oklch(0.22 0.05 258 / 0.4)" />
                  <text x="33" y="63" fontSize="2.4" fill="oklch(0.42 0.04 258)" fontFamily="Inter">
                    İzmir
                  </text>
                </svg>

                {filtered.map((e) => {
                  const on = active?.id === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setActiveId(e.id)}
                      onMouseEnter={() => setActiveId(e.id)}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${e.coords.x}%`, top: `${e.coords.y}%` }}
                      aria-label={e.title}
                    >
                      {on && (
                        <motion.span
                          layoutId="map-halo"
                          className="absolute -inset-3 rounded-full bg-violet/25"
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        />
                      )}
                      <span
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full border text-[13px] shadow-sm transition-transform group-hover:scale-110 ${
                          on
                            ? "border-violet bg-white scale-110"
                            : "border-[color:var(--app-line)] bg-white"
                        }`}
                      >
                        {e.emoji}
                      </span>
                      {on && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-md bg-[color:var(--app-ink)] px-2 py-0.5 text-[10px] font-semibold text-white"
                        >
                          {e.city}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>

              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-3 py-2.5"
                >
                  <span className="text-2xl">{active.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                      {active.title}
                    </p>
                    <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                      {active.city} · {active.district} · {active.day} {active.month}
                    </p>
                  </div>
                  <Link
                    to="/etkinlik/$id"
                    params={{ id: active.id }}
                    className="rounded-full bg-[color:var(--app-ink)] px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    Aç
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex max-h-[640px] flex-col gap-3 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filtered.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  active={active?.id === e.id}
                  onHover={() => setActiveId(e.id)}
                />
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="soft-card rounded-3xl p-8 text-center">
                <p className="text-sm text-[color:var(--app-ink-soft)]">
                  Bu filtrelerle eşleşen etkinlik yok. Filtrelerden birini kaldırmayı dene.
                </p>
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

function EventRow({
  event,
  active,
  onHover,
}: {
  event: Event;
  active: boolean;
  onHover: () => void;
}) {
  const pct = Math.round((event.attending / event.cap) * 100);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={onHover}
      className={`group relative flex items-stretch gap-4 rounded-2xl border bg-white p-3 transition-all sm:p-4 ${
        active
          ? "border-violet/40 shadow-[0_8px_24px_-12px_oklch(0.60_0.22_252_/_0.35)]"
          : "border-[color:var(--app-line)] hover:border-[color:var(--app-line)]/80"
      }`}
    >
      <div className="flex w-16 flex-col items-center justify-center rounded-xl bg-[color:oklch(0.22_0.05_258/0.04)] py-2">
        <p className="font-display text-2xl font-bold leading-none text-[color:var(--app-ink)]">
          {event.day}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
          {event.month}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="text-xl leading-none">{event.emoji}</span>
          <div className="min-w-0 flex-1">
            <Link
              to="/etkinlik/$id"
              params={{ id: event.id }}
              className="block font-display text-base font-bold leading-tight text-[color:var(--app-ink)] hover:text-violet"
            >
              {event.title}
            </Link>
            <p className="mt-0.5 truncate text-[11px] text-[color:var(--app-ink-mute)]">
              {event.city} · {event.district} · {event.time}
              {event.free ? " · Ücretsiz" : ""}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
              <div
                className="h-full rounded-full bg-violet"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-[color:var(--app-ink-mute)]">
              <Users className="mr-1 inline h-3 w-3" />
              {event.attending}/{event.cap}
            </p>
          </div>

          <Link
            to="/etkinlik/$id"
            params={{ id: event.id }}
            className="btn-ghost-light shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all hover:border-violet/30 hover:text-violet"
          >
            İncele
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
