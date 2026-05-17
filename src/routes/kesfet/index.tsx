import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { Flame, MapPin, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listProfiles } from "@/lib/api";
import { profilesToAthletes } from "@/lib/api-mappers";
import { sports, type Athlete } from "@/lib/mock-data";

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

const CITIES = ["Tüm Türkiye", "İstanbul", "Ankara", "İzmir", "Bursa", "İzmit", "Eskişehir"];

function trendValue(a: Athlete) {
  const n = parseFloat(a.trend.replace("%", "").replace("+", ""));
  return Number.isFinite(n) ? n : 0;
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
    () => [...athleteList].sort((a, b) => trendValue(b) - trendValue(a)).slice(0, 5),
    [athleteList],
  );

  const activeFilters: string[] = [];
  if (activeSport) activeFilters.push(activeSport);
  if (city !== "Tüm Türkiye") activeFilters.push(city);
  if (onlyRising) activeFilters.push("Yeni yükselen");

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* ─── Hero ─── */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Keşfet</p>
          <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
            Türkiye'nin <span className="italic text-violet">sahnesi.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Olimpik branşlardan unutulmuş ustalıklara. Hikâyesini anlatacak bir sporcu bul.
          </p>
        </motion.header>

        {/* ─── Filter bar ─── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-16 z-10 -mx-2 rounded-3xl bg-white/75 px-2 py-3 backdrop-blur-xl sm:mx-0 sm:px-4 sm:py-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSport(null)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeSport === null
                  ? "bg-[color:var(--app-ink)] text-white"
                  : "chip"
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

            <div className="ml-auto flex items-center gap-1.5 text-xs text-[color:var(--app-ink-mute)]">
              <Search className="h-3.5 w-3.5" />
              <span className="font-mono">{filtered.length} sporcu</span>
            </div>
          </div>

          {(profilesQuery.isLoading || profilesQuery.isError) && (
            <p className="mt-3 text-[11px] text-[color:var(--app-ink-mute)]">
              {profilesQuery.isLoading
                ? "Sporcular backend'den yükleniyor..."
                : "Backend'e ulaşılamadı; demo verisi gösteriliyor."}
            </p>
          )}

          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">Filtre:</span>
              {activeFilters.map((f) => (
                <span key={f} className="chip chip-violet">
                  {f}
                </span>
              ))}
            </div>
          )}
        </motion.section>

        {/* ─── Athlete grid ─── */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          aria-labelledby="kesfet-grid"
        >
          <h2 id="kesfet-grid" className="sr-only">Sporcular</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((a) => (
              <AthleteCard key={a.slug} a={a} />
            ))}
          </div>
        </motion.section>

        {/* ─── Rising rail ─── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral">Trend</p>
              <h2 className="font-display mt-1 text-2xl font-bold text-[color:var(--app-ink)]">
                Yeni yükselen sporcular
              </h2>
            </div>
            <Sparkles className="h-5 w-5 text-coral" />
          </div>

          <div className="-mx-2 overflow-x-auto pb-2">
            <div className="flex gap-4 px-2 min-w-max">
              {rising.map((a) => (
                <Link
                  key={a.slug}
                  to="/sporcu/$slug"
                  params={{ slug: a.slug }}
                  className="soft-card group w-[220px] shrink-0 rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={a.img}
                      alt={a.name}
                      className="h-14 w-14 rounded-2xl object-cover object-top"
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
      </div>
    </AppShell>
  );
}

function AthleteCard({ a }: { a: Athlete }) {
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
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-[color:var(--app-ink)] backdrop-blur">
            {a.sportEmoji} {a.sport}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-1.5 py-0.5 text-[10px] font-bold text-coral backdrop-blur">
            <TrendingUp className="h-3 w-3" /> {a.trend}
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 p-3">
        <div>
          <p className="font-display text-sm font-bold leading-tight text-[color:var(--app-ink)] truncate">{a.name}</p>
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
