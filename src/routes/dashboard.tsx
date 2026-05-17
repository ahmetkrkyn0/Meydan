import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Compass,
  MapPin,
  Play,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listNearbyEvents, listProfiles } from "@/lib/api";
import { backendEventsToEvents, profilesToAthletes } from "@/lib/api-mappers";
import {
  athletes,
  badges,
  events,
  liveMatches,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Ana Sahne — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const followedSlugs = ["mete-gazoz", "zeynep-sonmez", "sureyya-demir", "yusuf-dikec"];

function formatTodayTR() {
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function DashboardPage() {
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const eventsQuery = useQuery({
    queryKey: ["events", "nearby", "dashboard"],
    queryFn: () => listNearbyEvents(),
    retry: 1,
  });
  const athleteList = useMemo(
    () => profilesToAthletes(profilesQuery.data?.profiles),
    [profilesQuery.data?.profiles],
  );
  const eventList = useMemo(
    () => backendEventsToEvents(eventsQuery.data?.events),
    [eventsQuery.data?.events],
  );
  const featuredPair = liveMatches.slice(0, 2);
  const followed = profilesQuery.data?.profiles?.length
    ? athleteList.slice(0, 4)
    : athletes.filter((a) => followedSlugs.includes(a.slug)).slice(0, 4);
  const upcoming = eventsQuery.data?.events?.length ? eventList.slice(0, 3) : events.slice(0, 3);
  const earnedCount = badges.filter((b) => b.earned).length;
  const totalBadges = badges.length;
  const badgePct = Math.round((earnedCount / totalBadges) * 100);

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-14"
      >
        {/* ─── Welcome strip ─── */}
        <motion.header variants={fadeUp} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            {formatTodayTR()}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            Hoş geldin <span className="italic text-violet">Mehmet</span>.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Bugün takip ettiğin 2 sporcunun maçı var. Sahne biraz sonra senin.
          </p>
        </motion.header>

        {/* ─── Featured live matches (2-up) ─── */}
        <motion.section variants={fadeUp} aria-labelledby="bugun-mac">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="bugun-mac" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Bugünün öne çıkan maçları
            </h2>
            <Link
              to="/canli"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Tüm canlı <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredPair.map((m) => {
              const isLive = m.status === "live";
              return (
                <motion.article
                  key={m.id}
                  whileHover={{ y: -3 }}
                  className="soft-card-strong relative overflow-hidden rounded-3xl transition-shadow hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-aurora-light opacity-60" />
                  <div className="relative flex flex-col gap-5 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
                            Canlı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--app-line-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--app-ink-soft)]">
                            {m.startsAt}
                          </span>
                        )}
                        <span className="text-[11px] text-[color:var(--app-ink-mute)]">
                          {m.emoji} {m.sport}
                          {isLive && m.setScore && <> · Set {m.setScore}</>}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-mute)]">
                        <Users className="h-3 w-3" />
                        {m.viewers.toLocaleString("tr-TR")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <img
                        src={m.athleteImg}
                        alt={m.athleteName}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-display truncate text-lg font-bold leading-tight text-[color:var(--app-ink)]">
                          {m.athleteName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[color:var(--app-ink-soft)]">
                          vs. {m.opponent} {m.opponentFlag}
                        </p>
                      </div>
                      {m.score && (
                        <p className="font-display shrink-0 text-2xl font-bold tracking-tight text-violet">
                          {m.score}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/canli/$id"
                        params={{ id: m.id }}
                        className="btn-primary-light inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2 pl-2 pr-4 text-xs font-bold"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
                          <Play className="h-3 w-3 fill-white text-white" />
                        </span>
                        Tribüne katıl
                      </Link>
                      <Link
                        to="/sporcu/$slug"
                        params={{ slug: m.athleteSlug }}
                        className="btn-ghost-light inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold"
                      >
                        Profili <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ─── Followed athletes ─── */}
        <motion.section variants={fadeUp} aria-labelledby="senin-sporcular">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="senin-sporcular" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Senin sporcuların
            </h2>
            <Link
              to="/kesfet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Daha fazla keşfet <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {followed.map((a) => (
              <Link
                key={a.slug}
                to="/sporcu/$slug"
                params={{ slug: a.slug }}
                className="soft-card group flex items-center gap-3 rounded-2xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover object-top"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{a.name}</p>
                  <p className="truncate text-[11px] text-[color:var(--app-ink-soft)]">
                    {a.sportEmoji} {a.sport}
                  </p>
                  {a.nextEvent && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-violet">
                      <Calendar className="h-3 w-3" /> {a.nextEvent.date}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[color:var(--app-ink-mute)] transition-transform group-hover:translate-x-0.5 group-hover:text-violet" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ─── Upcoming events ─── */}
        <motion.section variants={fadeUp} aria-labelledby="yakinda-etkinlik">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="yakinda-etkinlik" className="font-display text-xl font-bold text-[color:var(--app-ink)]">
              Yakında etkinlikler
            </h2>
            <Link
              to="/sehrimde"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Şehrimde <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {upcoming.map((e) => (
              <motion.article
                key={e.id}
                whileHover={{ y: -3 }}
                className="soft-card flex items-start gap-4 rounded-2xl p-4"
              >
                <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-violet/10 py-2 text-violet">
                  <span className="font-display text-lg font-bold leading-none">{e.day}</span>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">{e.month}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-snug text-[color:var(--app-ink)]">{e.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[color:var(--app-ink-soft)]">
                    <MapPin className="h-3 w-3" /> {e.city}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ─── Discover invitation ─── */}
        <motion.section variants={fadeUp}>
          <Link to="/kesfet/mod" className="block">
            <article className="soft-card-strong group relative overflow-hidden rounded-3xl px-6 py-5 sm:px-8 sm:py-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/15 blur-3xl" />
              <div className="relative flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet/12 text-violet">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">Keşfet modu</p>
                  <p className="mt-1 font-display text-lg font-bold text-[color:var(--app-ink)]">
                    Bu hafta yeni bir spor dene
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
                    Sana hiç izlemediğin bir branş öneriyoruz. Sürpriz olsun.
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[color:var(--app-ink-soft)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet" />
              </div>
            </article>
          </Link>
        </motion.section>

        {/* ─── Badge progress strip ─── */}
        <motion.section variants={fadeUp}>
          <Link to="/rozetlerim" className="block">
            <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--app-line-soft)] bg-white/60 px-5 py-4 transition-colors hover:bg-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/12 text-coral">
                <Trophy className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-[color:var(--app-ink)]">İlk Adım rozet yolculuğun</p>
                  <p className="font-mono text-xs font-bold text-[color:var(--app-ink-soft)]">
                    {earnedCount}/{totalBadges}
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--app-line)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${badgePct}%` }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
                  />
                </div>
              </div>
              <Sparkles className="h-4 w-4 shrink-0 text-[color:var(--app-ink-mute)]" />
            </div>
          </Link>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
