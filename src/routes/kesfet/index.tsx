import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { animate, motion, useInView, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Compass,
  Flame,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { listProfiles } from "@/lib/api";
import { profilesToAthletes } from "@/lib/api-mappers";
import { sports, type Athlete } from "@/lib/mock-data";
import { CITY_OPTIONS } from "@/lib/form-options";
import heroImg from "@/assets/athlete-eskrim-kadin.png";
import spotlightImg from "@/assets/athlete-tenis-kadin.png";

export const Route = createFileRoute("/kesfet/")({
  component: KesfetPage,
  head: () => ({ meta: [{ title: "Keşfet — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const CITIES = ["Tüm Türkiye", ...CITY_OPTIONS] as const;

function trendValue(a: Athlete) {
  const n = parseFloat(a.trend.replace("%", "").replace("+", ""));
  return Number.isFinite(n) ? n : 0;
}

function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("tr-TR")),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{display}</span>;
}

function KesfetPage() {
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Tüm Türkiye");
  const [onlyRising, setOnlyRising] = useState(false);
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });

  const athleteList = useMemo(
    () => profilesToAthletes(profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles],
  );

  const filtered = useMemo(() => {
    return athleteList.filter((a) => {
      if (activeSport && a.sport !== activeSport) return false;
      if (city !== "Tüm Türkiye" && a.city !== city) return false;
      if (onlyRising && trendValue(a) < 15) return false;
      return true;
    });
  }, [activeSport, athleteList, city, onlyRising]);

  const rising = useMemo(
    () => [...athleteList].sort((a, b) => trendValue(b) - trendValue(a)).slice(0, 6),
    [athleteList],
  );

  const featured = rising[0];

  const totalCities = useMemo(
    () => new Set(athleteList.map((a) => a.city)).size,
    [athleteList],
  );
  const totalFollowers = useMemo(
    () => athleteList.reduce((s, a) => s + (a.followers ?? 0), 0),
    [athleteList],
  );

  const activeFilters: string[] = [];
  if (activeSport) activeFilters.push(activeSport);
  if (city !== "Tüm Türkiye") activeFilters.push(city);
  if (onlyRising) activeFilters.push("Yeni yükselen");

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-14"
      >
        {/* ─── Cinematic hero ─── */}
        <motion.header
          variants={fadeUp}
          className="stage-bleed relative -mt-6 overflow-hidden sm:-mt-8"
        >
          <div className="relative h-[460px] sm:h-[540px]">
            <img
              src={heroImg}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="stage-veil-light absolute inset-0" />
            <div className="stage-merge-down absolute inset-x-0 bottom-0 h-32" />
            <div className="stage-merge-glow absolute inset-x-0 bottom-0 h-40" />
            <div className="stage-veil-tint absolute inset-0" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 backdrop-blur-[6px]"
              style={{
                maskImage: "linear-gradient(to top, black, transparent)",
                WebkitMaskImage: "linear-gradient(to top, black, transparent)",
              }}
            />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  Sahne — 01
                </p>
                <span className="h-px w-12 bg-[color:var(--app-line)]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">
                  Keşfet
                </p>
              </div>

              <div className="max-w-2xl">
                <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-[color:var(--app-ink)] sm:text-7xl">
                  Türkiye'nin{" "}
                  <span className="italic bg-gradient-to-r from-violet to-sky bg-clip-text text-transparent">
                    sahnesi
                  </span>
                  <span className="text-violet">.</span>
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-[color:var(--app-ink-soft)] sm:text-lg">
                  Olimpik branşlardan unutulmuş ustalıklara —
                  hikâyesini anlatacak <span className="font-bold text-[color:var(--app-ink)]">{athleteList.length} sporcu</span> sahnede.
                </p>

                <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-violet/25 bg-white/80 px-4 py-2 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-violet" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet">
                    Bugün öne çıkan
                  </span>
                  {sports.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSport(s.name)}
                      className="text-xs text-[color:var(--app-ink-soft)] hover:text-violet"
                    >
                      {s.emoji} {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden grid-cols-4 gap-6 sm:grid">
                <Stat label="Sporcu" value={athleteList.length} />
                <Stat label="Branş" value={sports.length} />
                <Stat label="Şehir" value={totalCities} />
                <Stat label="Toplam takipçi" value={totalFollowers} compact />
              </div>
            </div>
          </div>
        </motion.header>

        {/* ─── Spotlight: Sahnedeki ─── */}
        {featured && (
          <motion.section variants={fadeUp} className="stage-bleed -mt-14">
            <div className="relative overflow-hidden">
              <img
                src={spotlightImg}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
              />
              <div className="stage-dark-veil absolute inset-0" />
              <div className="stage-dark-glow absolute inset-0" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-16 backdrop-blur-[6px]"
                style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />

              <div className="relative grid gap-6 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12">
                <div className="max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
                    <Flame className="h-3 w-3 text-coral" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                      Sahnedeki · {featured.trend}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {featured.name}
                    <span className="block text-white/60">
                      {featured.sportEmoji} {featured.sport} · {featured.city}
                    </span>
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                    Bu hafta tribünü en hızlı büyüyen sporcu. Hikâyesi sahnenin tam ortasında.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                  <Link
                    to="/sporcu/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[color:var(--app-ink)] transition hover:bg-white/90"
                  >
                    Sahneye git <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/sporcu/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Profili gör
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ─── Filter bar (desktop) ─── */}
        <motion.section
          variants={fadeUp}
          className="sticky top-16 z-10 hidden rounded-3xl border border-[color:var(--app-line)] bg-white/85 px-4 py-4 shadow-sm backdrop-blur-xl md:block"
        >
          <FiltersHeader count={filtered.length} />
          <FiltersBody
            activeSport={activeSport}
            setActiveSport={setActiveSport}
            city={city}
            setCity={setCity}
            onlyRising={onlyRising}
            setOnlyRising={setOnlyRising}
            activeFilters={activeFilters}
          />
          {(profilesQuery.isLoading || profilesQuery.isError) && (
            <p className="mt-3 text-[11px] text-[color:var(--app-ink-mute)]">
              {profilesQuery.isLoading
                ? "Sporcular backend'den yükleniyor..."
                : "Backend'e ulaşılamadı; demo verisi gösteriliyor."}
            </p>
          )}
        </motion.section>

        {/* ─── Filter trigger (mobile) ─── */}
        <motion.section
          variants={fadeUp}
          className="sticky top-16 z-10 flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl md:hidden"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">02</span>
            <span className="font-display text-sm font-bold text-[color:var(--app-ink)]">Filtrele</span>
            <span className="font-mono text-[11px] tabular-nums text-[color:var(--app-ink-mute)]">
              · {filtered.length}
            </span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--app-ink)] px-3.5 py-1.5 text-xs font-bold text-white">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {activeFilters.length > 0 ? `${activeFilters.length} filtre` : "Aç"}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl border-[color:var(--app-line)] bg-[color:var(--app-bg)]">
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                  Filtrele
                </SheetTitle>
                <SheetDescription className="text-xs text-[color:var(--app-ink-soft)]">
                  Branş, şehir ve trend filtrelerini buradan seç.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <FiltersBody
                  activeSport={activeSport}
                  setActiveSport={setActiveSport}
                  city={city}
                  setCity={setCity}
                  onlyRising={onlyRising}
                  setOnlyRising={setOnlyRising}
                  activeFilters={activeFilters}
                />
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-[color:var(--app-line-soft)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSport(null);
                    setCity("Tüm Türkiye");
                    setOnlyRising(false);
                  }}
                  className="rounded-full border border-[color:var(--app-line)] px-4 py-2 text-xs font-semibold text-[color:var(--app-ink-soft)]"
                >
                  Sıfırla
                </button>
                <SheetClose asChild>
                  <button className="ml-auto rounded-full bg-[color:var(--app-ink)] px-5 py-2 text-xs font-bold text-white">
                    {filtered.length} sporcu göster
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </motion.section>

        {/* ─── Athlete grid ─── */}
        <motion.section
          variants={fadeUp}
          aria-labelledby="kesfet-grid"
          className="stage-bleed px-5 sm:px-8"
        >
          <div className="mb-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">03</span>
              <h2 id="kesfet-grid" className="font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
                Sahnedeki sporcular
              </h2>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-[color:var(--app-ink-mute)]">
              {filtered.length} / {athleteList.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white/60 px-6 py-16 text-center">
              <Compass className="mx-auto h-8 w-8 text-[color:var(--app-ink-mute)]" />
              <p className="mt-3 font-display text-lg font-bold text-[color:var(--app-ink)]">
                Bu filtreyle eşleşen sporcu yok.
              </p>
              <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
                Branşı veya şehri değiştir, sahne daha geniş.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((a, i) => (
                <AthleteCard key={a.slug} a={a} index={i} />
              ))}
            </div>
          )}
        </motion.section>

        {/* ─── Rising rail ─── */}
        <motion.section variants={fadeUp} className="stage-bleed px-5 sm:px-8">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">04</span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral">Trend</p>
                <h2 className="font-display mt-0.5 text-2xl font-bold text-[color:var(--app-ink)]">
                  Yeni yükselenler
                </h2>
              </div>
            </div>
            <Link
              to="/kesfet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-coral"
            >
              Tümü <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="-mx-2 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4 px-2">
              {rising.map((a, i) => (
                <Link
                  key={a.slug}
                  to="/sporcu/$slug"
                  params={{ slug: a.slug }}
                  className="soft-card group relative w-[240px] shrink-0 rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute right-3 top-3 font-mono text-[10px] font-bold text-[color:var(--app-ink-mute)]">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={a.img}
                      alt={a.name}
                      className="h-14 w-14 rounded-2xl object-cover object-top ring-2 ring-white"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{a.name}</p>
                      <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">
                        {a.sportEmoji} {a.sport}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-coral/12 px-2 py-0.5 text-[10px] font-bold text-coral">
                      <TrendingUp className="h-3 w-3" />
                      {a.trend}
                    </span>
                    <span className="text-[10px] text-[color:var(--app-ink-mute)]">{a.city}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

function Stat({ label, value, compact }: { label: string; value: number; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
        {label}
      </p>
      <p className="font-display text-2xl font-bold text-[color:var(--app-ink)] tabular-nums sm:text-3xl">
        {compact && value >= 1000 ? (
          <>
            <CountUp to={Math.round(value / 100) / 10} duration={1.4} />K
          </>
        ) : (
          <CountUp to={value} />
        )}
      </p>
    </div>
  );
}

function AthleteCard({ a, index }: { a: Athlete; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="soft-card group relative flex flex-col overflow-hidden rounded-3xl transition-shadow hover:shadow-lg"
    >
      <Link to="/sporcu/$slug" params={{ slug: a.slug }} className="block">
        <div className="relative aspect-square overflow-hidden bg-violet/8">
          <img
            src={a.img}
            alt={a.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-[color:var(--app-ink)] backdrop-blur">
            {a.sportEmoji} {a.sport}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-1.5 py-0.5 text-[10px] font-bold text-coral backdrop-blur">
            <TrendingUp className="h-3 w-3" /> {a.trend}
          </span>
          <span className="absolute bottom-2 left-2 font-mono text-[10px] font-bold text-white/80">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 p-3">
        <div>
          <p className="font-display truncate text-sm font-bold leading-tight text-[color:var(--app-ink)]">
            {a.name}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-soft)]">
            <MapPin className="h-3 w-3" /> {a.city}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-soft)]">
            <Users className="h-3 w-3" />
            <span className="font-semibold text-[color:var(--app-ink)]">
              {a.followers >= 1000 ? `${(a.followers / 1000).toFixed(1)}K` : a.followers}
            </span>
          </span>
          <button className="rounded-full bg-violet/12 px-2.5 py-0.5 text-[10px] font-bold text-violet transition-colors hover:bg-violet hover:text-white">
            Takip et
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function FiltersHeader({ count }: { count: number }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">02</span>
        <h2 className="font-display text-lg font-bold tracking-tight text-[color:var(--app-ink)]">
          Filtrele
        </h2>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--app-ink-mute)]">
        <Search className="h-3.5 w-3.5" />
        <span className="font-mono tabular-nums">{count} sporcu</span>
      </span>
    </div>
  );
}

type FiltersBodyProps = {
  activeSport: string | null;
  setActiveSport: (v: string | null) => void;
  city: string;
  setCity: (v: string) => void;
  onlyRising: boolean;
  setOnlyRising: (updater: (v: boolean) => boolean) => void;
  activeFilters: string[];
};

function FiltersBody({
  activeSport,
  setActiveSport,
  city,
  setCity,
  onlyRising,
  setOnlyRising,
  activeFilters,
}: FiltersBodyProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSport(null)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeSport === null ? "bg-[color:var(--app-ink)] text-white" : "chip"
          }`}
        >
          Tümü
        </button>
        {sports.map((s) => {
          const active = activeSport === s.name;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSport(active ? null : s.name)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                active ? "bg-[color:var(--app-ink)] text-white" : "chip"
              }`}
            >
              <span className="mr-1">{s.emoji}</span> {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[color:var(--app-line-soft)] pt-3">
        <label className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[color:var(--app-ink-soft)]" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-[color:var(--app-line)] bg-white px-2.5 py-1.5 text-xs font-medium text-[color:var(--app-ink)] focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setOnlyRising((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            onlyRising
              ? "bg-coral/15 text-coral"
              : "border border-[color:var(--app-line)] text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          Yeni yükselen
        </button>

        {activeFilters.length > 0 && (
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              Filtre:
            </span>
            {activeFilters.map((f) => (
              <span key={f} className="chip chip-violet">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
