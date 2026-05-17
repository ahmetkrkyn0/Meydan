import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { animate, motion, useInView, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Compass,
  MapPin,
  MessageCircle,
  Play,
  Radio,
  Sparkles,
  Trophy,
  Users,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { listFollowedAthletes, listNearbyEvents, listProfiles } from "@/lib/api";
import { backendEventsToEvents, profilesToAthletes, profileToAthlete } from "@/lib/api-mappers";
import { useActiveFan } from "@/lib/active-athlete";
import { useSession } from "@/lib/session";
import { badges, liveMatches } from "@/lib/mock-data";
import heroAthlete from "@/assets/athlete-gures-erkek.png";
import spotlightAthlete from "@/assets/athlete-voleybol-kadin.png";

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

function formatTodayTR() {
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1] as const,
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("tr-TR")),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{display}</span>;
}

function DashboardPage() {
  const session = useSession();
  const activeFan = useActiveFan();
  const firstName = session.profile?.full_name?.split(" ")[0] ?? "Misafir";
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
  const followsQuery = useQuery({
    queryKey: ["follows", activeFan.profile?.id],
    queryFn: () => listFollowedAthletes(activeFan.profile!.id),
    enabled: Boolean(activeFan.profile?.id),
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

  // Sadece backend'den gelen veriler — mock fallback yok.
  const followed = useMemo(() => {
    const followedProfiles = followsQuery.data?.athletes ?? [];
    if (followedProfiles.length) {
      return followedProfiles.map((p, i) => profileToAthlete(p, i)).slice(0, 4);
    }
    // Taraftar henüz kimseyi takip etmiyorsa: backend'deki ilk sporcuları
    // "öneri" olarak göster.
    return athleteList.slice(0, 4);
  }, [followsQuery.data, athleteList]);

  const followsAreReal = Boolean(followsQuery.data?.athletes?.length);
  const upcoming = eventList.slice(0, 3);
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
        {/* ─── Cinematic hero ─── */}
        <motion.header
          variants={fadeUp}
          className="relative -mx-5 -mt-6 overflow-hidden sm:-mx-[calc(50vw-50%)] sm:-mt-8 lg:-mx-[calc(50vw-8rem-50%)]"
        >
          <div className="relative h-[480px] sm:h-[560px]">
            {/* Background portrait */}
            <img
              src={heroAthlete}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Gradient veils — merkezi stage paleti + seam softener */}
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

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  {formatTodayTR()}
                </p>
                <span className="h-px w-12 bg-[color:var(--app-line)]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">
                  Ana Sahne
                </p>
              </div>

              <div className="max-w-2xl">
                <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-[color:var(--app-ink)] sm:text-7xl">
                  Hoş geldin{" "}
                  <span className="italic text-gradient-to-r bg-gradient-to-r from-violet to-sky bg-clip-text text-transparent">
                    {firstName}
                  </span>
                  <span className="text-violet">.</span>
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-[color:var(--app-ink-soft)] sm:text-lg">
                  Bugün takip ettiğin <span className="font-bold text-[color:var(--app-ink)]">2 sporcun</span> sahnede.
                  İlk düdük az kaldı — tribün hazır mı?
                </p>

                {/* Live ticker pill */}
                <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-coral/30 bg-white/80 px-4 py-2 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-coral">
                    Şu an canlı
                  </span>
                  <span className="text-xs text-[color:var(--app-ink-soft)]">
                    Zeynep · Tenis · Set 2
                  </span>
                  <span className="text-[color:var(--app-ink-mute)]">·</span>
                  <span className="text-xs text-[color:var(--app-ink-soft)]">
                    Seda Yılmaz · Boks · R3
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="hidden flex-col gap-1 sm:flex">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                    Bugünkü tribün
                  </p>
                  <p className="font-display text-3xl font-bold text-[color:var(--app-ink)] tabular-nums">
                    <CountUp to={3420} />
                  </p>
                  <p className="text-[11px] text-[color:var(--app-ink-soft)]">
                    izleyici · <CountUp to={860} duration={1.4} /> tezahürat
                  </p>
                </div>

                <Link
                  to="/canli"
                  className="btn-primary-light inline-flex items-center gap-2 rounded-full py-3 pl-3 pr-5 text-xs font-bold shadow-lg shadow-violet/20"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25">
                    <Play className="h-3.5 w-3.5 fill-white text-white" />
                  </span>
                  Tribüne katıl
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ─── Dark spotlight: Sessiz Tezahürat ─── */}
        <motion.section variants={fadeUp} className="-mx-5 -mt-14 sm:-mx-[calc(50vw-50%)] lg:-mx-[calc(50vw-8rem-50%)]">
          <div className="relative overflow-hidden">
            <img
              src={spotlightAthlete}
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
                  <Volume2 className="h-3 w-3 text-coral" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                    Sessiz Tezahürat
                  </span>
                </div>
                <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Mert şu an yelken yarışında.
                  <span className="block text-white/60">4 kişi ona mesaj yazdı.</span>
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                  Telefonu yanında değil ama dümene tuttuğu her an, senin sözünü taşıyor.
                  Maç bitiminde hepsini okuyacak.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <Link
                  to="/sporcu/$slug"
                  params={{ slug: "mert-ucar" }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[color:var(--app-ink)] transition hover:bg-white/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Mesaj yaz
                </Link>
                <Link
                  to="/sporcu/$slug"
                  params={{ slug: "mert-ucar" }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Profili gör <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Asymmetric editorial: featured + side ─── */}
        <motion.section variants={fadeUp} aria-labelledby="bugun-mac">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">01</span>
              <h2 id="bugun-mac" className="font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
                Bugünün öne çıkan maçları
              </h2>
            </div>
            <Link
              to="/canli"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Tüm canlı <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            {/* Featured (big) */}
            {featuredPair[0] && (() => {
              const m = featuredPair[0];
              return (
                <motion.article
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden rounded-3xl"
                >
                  <img
                    src={m.athleteImg}
                    alt={m.athleteName}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--app-ink)] via-[color:var(--app-ink)]/70 to-[color:var(--app-ink)]/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--app-ink)]/60 via-transparent to-transparent" />

                  <div className="relative flex min-h-[380px] flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 backdrop-blur">
                        <Radio className="h-3 w-3 text-coral" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-coral">
                          Canlı · Featured
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80 backdrop-blur">
                        <Users className="h-3 w-3" />
                        {m.viewers.toLocaleString("tr-TR")}
                      </span>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                        {m.emoji} {m.sport} · Set {m.setScore}
                      </p>
                      <h3 className="mt-2 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
                        {m.athleteName}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        vs. {m.opponent} {m.opponentFlag}
                      </p>

                      {/* Score + momentum bar */}
                      <div className="mt-6 flex items-end justify-between gap-6">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">Skor</p>
                          <p className="font-display text-5xl font-bold leading-none text-white">
                            {m.score}
                          </p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-baseline justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">Momentum</span>
                            <span className="font-mono text-xs font-bold text-white">%{m.momentum}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.momentum}%` }}
                              transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                              className="h-full rounded-full bg-gradient-to-r from-coral via-violet to-sky"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2">
                        <Link
                          to="/canli/$id"
                          params={{ id: m.id }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-bold text-[color:var(--app-ink)] transition hover:bg-white/90 sm:flex-none sm:px-6"
                        >
                          <Play className="h-3 w-3 fill-[color:var(--app-ink)]" />
                          Tribüne katıl
                        </Link>
                        <Link
                          to="/sporcu/$slug"
                          params={{ slug: m.athleteSlug }}
                          className="inline-flex items-center gap-1 rounded-full border border-white/20 px-4 py-3 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                        >
                          Profili <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })()}

            {/* Side (narrow vertical) */}
            {featuredPair[1] && (() => {
              const m = featuredPair[1];
              return (
                <motion.article
                  whileHover={{ y: -3 }}
                  className="soft-card-strong relative overflow-hidden rounded-3xl"
                >
                  <div className="relative flex h-full flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={m.athleteImg}
                        alt={m.athleteName}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral backdrop-blur">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
                        Canlı
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                          {m.emoji} {m.sport} · {m.setScore}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold leading-tight text-[color:var(--app-ink)]">
                          {m.athleteName}
                        </h3>
                        <p className="mt-0.5 text-xs text-[color:var(--app-ink-soft)]">
                          vs. {m.opponent} {m.opponentFlag}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <p className="font-display text-3xl font-bold tracking-tight text-violet">
                          {m.score}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--app-ink-mute)]">
                          <Users className="h-3 w-3" />
                          {m.viewers.toLocaleString("tr-TR")}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center gap-2">
                        <Link
                          to="/canli/$id"
                          params={{ id: m.id }}
                          className="btn-primary-light inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-[11px] font-bold"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          Katıl
                        </Link>
                        <Link
                          to="/sporcu/$slug"
                          params={{ slug: m.athleteSlug }}
                          className="btn-ghost-light inline-flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold"
                        >
                          Profil <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })()}
          </div>
        </motion.section>

        {/* ─── Portrait towers: followed athletes ─── */}
        <motion.section variants={fadeUp} aria-labelledby="senin-sporcular">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">02</span>
              <h2 id="senin-sporcular" className="font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
                {followsAreReal ? "Senin sporcuların" : "Önerilen sporcular"}
              </h2>
            </div>
            <Link
              to="/kesfet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Daha fazla keşfet <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {!followsAreReal && (
            <p className="mb-4 text-[11px] text-[color:var(--app-ink-mute)]">
              {activeFan.profile
                ? "Henüz hiç sporcu takip etmedin. Sporcu sayfasından 'Takip Et' diyebilirsin."
                : "Takip listeni görmek için backend'de bir taraftar profili gerekli (auth eklenmeden geçici)."}
            </p>
          )}

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {followed.slice(0, 3).map((a, i) => (
              <Link
                key={a.slug}
                to="/sporcu/$slug"
                params={{ slug: a.slug }}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl"
              >
                <img
                  src={a.img}
                  alt={a.name}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                {/* Tri-layer gradient veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--app-ink)] via-[color:var(--app-ink)]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet/30 via-transparent to-coral/20 mix-blend-overlay opacity-60" />

                {/* Index number top-left */}
                <span className="absolute left-4 top-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
                  0{i + 1}
                </span>

                {/* Live ping */}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
                  Takipte
                </span>

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                    {a.sportEmoji} {a.sport}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-tight text-white">
                    {a.name}
                  </p>
                  {a.nextEvent && (
                    <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-white/80">
                      <Calendar className="h-3 w-3" /> {a.nextEvent.date}
                    </p>
                  )}
                  <div className="mt-3 flex translate-y-1 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Profili gör <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}

            {/* "+N more" tile */}
            <Link
              to="/kesfet"
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl border border-dashed border-[color:var(--app-line)] bg-gradient-to-br from-violet/5 via-white to-sky/5 p-5 transition-all hover:border-violet/40 hover:shadow-lg"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-violet">
                +
              </span>
              <div>
                <p className="font-display text-3xl font-bold leading-none text-[color:var(--app-ink)]">
                  +{Math.max(followed.length - 3, 12)}
                </p>
                <p className="mt-2 text-xs font-semibold text-[color:var(--app-ink-soft)]">
                  sporcu daha
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet">
                  Keşfet <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* ─── Timeline: upcoming events ─── */}
        <motion.section variants={fadeUp} aria-labelledby="yakinda-etkinlik">
          <div className="mb-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-bold text-[color:var(--app-ink-mute)]">03</span>
              <h2 id="yakinda-etkinlik" className="font-display text-2xl font-bold tracking-tight text-[color:var(--app-ink)]">
                Yakında etkinlikler
              </h2>
            </div>
            <Link
              to="/sehrimde"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Şehrimde <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="relative pl-6 sm:pl-8">
            {/* Spine */}
            <div className="absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-violet/40 via-[color:var(--app-line)] to-transparent sm:left-3" />

            <div className="flex flex-col gap-5">
              {upcoming.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="relative"
                >
                  {/* Dot */}
                  <span className="absolute -left-[18px] top-4 flex h-3 w-3 sm:-left-[26px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet/40" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-violet shadow-md shadow-violet/30" />
                  </span>

                  <article className="soft-card group flex items-center gap-5 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-2xl bg-gradient-to-br from-violet/15 to-violet/5 py-2.5 text-violet">
                      <span className="font-display text-2xl font-bold leading-none">{e.day}</span>
                      <span className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider">{e.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-bold leading-snug text-[color:var(--app-ink)]">{e.title}</p>
                      <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-[color:var(--app-ink-soft)]">
                        <MapPin className="h-3 w-3" /> {e.city}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--app-ink-mute)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet" />
                  </article>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Dark block: Keşfet modu ─── */}
        <motion.section variants={fadeUp} className="-mx-5 sm:-mx-8">
          <Link to="/kesfet/mod" className="block">
            <article className="group relative overflow-hidden bg-[color:var(--app-ink)] sm:rounded-3xl">
              {/* Aurora glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

              {/* Grid texture */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
                    <Compass className="h-3 w-3 text-violet" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                      Keşfet Modu · 04
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
                    Bu hafta hiç{" "}
                    <span className="italic text-violet">izlemediğin</span> bir
                    branş öneriyoruz.
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                    Algoritma sana göre seçti — ama sürpriz olsun diye sahnesi
                    açılana kadar adını söylemiyor.
                  </p>

                  <div className="mt-6 flex items-center gap-6">
                    <div>
                      <p className="font-display text-2xl font-bold text-white tabular-nums">
                        <CountUp to={42} />
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">branş havuzda</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <p className="font-display text-2xl font-bold text-white tabular-nums">
                        <CountUp to={1280} />
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">taraftar bu hafta denedi</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[color:var(--app-ink)] transition-transform group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/70">
                    Aç
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </motion.section>
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
