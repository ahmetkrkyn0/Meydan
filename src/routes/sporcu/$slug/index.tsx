import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Heart,
  UserPlus,
  MessageCircle,
  AtSign,
  Hash,
  Video,
  MapPin,
  Calendar,
  Trophy,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  HandHeart,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu/$slug/")({
  component: AthleteProfilePage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} — Sporcu Kartı | Meydan` }],
  }),
});

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "B";
  return n.toLocaleString("tr-TR");
}

function formatCurrency(n: number): string {
  if (n >= 1000) return "₺" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "B";
  return "₺" + n.toLocaleString("tr-TR");
}

function AthleteProfilePage() {
  const { slug } = Route.useParams();
  const a = athleteBySlug(slug);

  const stats = [
    { label: "Takipçi", value: formatNumber(a.followers) },
    { label: "Destekçi", value: formatNumber(a.supporters) },
    { label: "Aylık destek", value: formatCurrency(a.monthlySupport) },
    { label: "Başarı", value: String(a.achievements.length) },
  ];

  return (
    <AppShell role="fan">
      <div className="mx-auto max-w-6xl space-y-12 pb-16">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-aurora-light opacity-95" />
          <div className="absolute -right-12 top-0 h-[520px] w-[520px] rounded-full bg-violet/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[420px] w-[420px] rounded-full bg-sky/12 blur-3xl" />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fade}
              custom={0}
              className="space-y-6"
            >
              <Link
                to="/kesfet"
                className="inline-flex items-center gap-2 text-xs font-medium text-[color:var(--app-ink-soft)] transition-colors hover:text-[color:var(--app-ink)]"
              >
                <span className="text-base leading-none">←</span>
                <span>Keşfet'e dön</span>
              </Link>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[color:var(--app-ink-soft)]">
                  {a.sportEmoji} {a.sport} · {a.city} · {a.age} yaşında
                </p>
                <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
                  {a.name}
                </h1>
                <p className="max-w-lg text-base text-[color:var(--app-ink-soft)]">
                  {a.club}
                </p>
              </div>

              {/* chip row */}
              <div className="flex flex-wrap gap-2">
                {a.alive && (
                  <span className="chip chip-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.18_152)]" />
                    Yaşıyor
                  </span>
                )}
                <span className="chip chip-violet">
                  <Trophy className="h-3 w-3" /> TR #{a.rank.national}
                </span>
                {a.rank.world !== undefined && (
                  <span className="chip chip-sky">Dünya #{a.rank.world}</span>
                )}
                <span className="chip">{a.values.join(" · ")}</span>
              </div>

              {/* social row */}
              <div className="flex items-center gap-3 pt-2">
                {a.socials.instagram && (
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] transition-all hover:border-violet/30 hover:text-violet"
                    aria-label="Instagram"
                  >
                    <AtSign className="h-4 w-4" strokeWidth={1.8} />
                  </a>
                )}
                {a.socials.twitter && (
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] transition-all hover:border-sky/30 hover:text-sky"
                    aria-label="Twitter"
                  >
                    <Hash className="h-4 w-4" strokeWidth={1.8} />
                  </a>
                )}
                {a.socials.youtube && (
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--app-line)] bg-white text-[color:var(--app-ink-soft)] transition-all hover:border-coral/30 hover:text-coral"
                    aria-label="YouTube"
                  >
                    <Video className="h-4 w-4" strokeWidth={1.8} />
                  </a>
                )}
                <span className="text-xs text-[color:var(--app-ink-mute)]">
                  {a.socials.instagram ?? a.socials.twitter ?? a.socials.youtube}
                </span>
              </div>
            </motion.div>

            {/* cutout illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet/25 via-sky/15 to-transparent blur-2xl" />
              <img
                src={a.cutout}
                alt={a.name}
                className="relative h-72 w-auto object-contain drop-shadow-[0_20px_40px_rgba(80,60,150,0.25)] sm:h-96"
              />
            </motion.div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fade}
          custom={1}
          className="grid grid-cols-2 gap-y-6 px-2 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-[color:var(--app-line)] pl-5 first:border-l-0 first:pl-0 sm:border-l-2 sm:first:border-l-2">
              <p className="font-display text-3xl font-bold leading-none text-[color:var(--app-ink)]">
                {s.value}
              </p>
              <p className="mt-1.5 text-xs text-[color:var(--app-ink-mute)]">{s.label}</p>
            </div>
          ))}
        </motion.section>

        {/* ── 2 COLUMN MAIN ── */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* LEFT */}
          <div className="space-y-10">
            {/* Hakkında */}
            <motion.section
              initial="hidden"
              animate="show"
              variants={fade}
              custom={2}
              className="space-y-3"
            >
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                Hakkında
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-[color:var(--app-ink)]">
                {a.bio}
              </p>
            </motion.section>

            {/* Son sonuçlar */}
            <motion.section
              initial="hidden"
              animate="show"
              variants={fade}
              custom={3}
              className="space-y-3"
            >
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)]">
                Son sonuçlar
              </h2>
              <div className="divide-y divide-[color:var(--app-line-soft)]">
                {a.lastResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          r.result === "W"
                            ? "bg-[oklch(0.70_0.16_152/0.15)] text-[oklch(0.40_0.14_152)]"
                            : "bg-coral/12 text-coral"
                        }`}
                      >
                        {r.result}
                      </span>
                      <span className="text-sm font-medium text-[color:var(--app-ink)]">
                        {r.opponent === "—" ? "Final atışı" : r.opponent}
                      </span>
                    </div>
                    <span className="text-sm tabular-nums text-[color:var(--app-ink-soft)]">
                      {r.score}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Next event */}
            {a.nextEvent && (
              <motion.section
                initial="hidden"
                animate="show"
                variants={fade}
                custom={2}
                className="soft-card-strong relative overflow-hidden rounded-3xl p-6"
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet/10 blur-2xl" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="chip chip-violet">
                      <Sparkles className="h-3 w-3" /> Yaklaşan
                    </span>
                    <span className="font-display text-xl font-bold tabular-nums text-violet">
                      {a.nextEvent.date}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold leading-tight text-[color:var(--app-ink)]">
                    {a.nextEvent.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[color:var(--app-ink-soft)]">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} />
                    {a.nextEvent.city}
                  </div>
                  <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet">
                    Hatırlatıcı kur
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </motion.section>
            )}

            {/* Quick links — minimal list, no extra cards */}
            <motion.section
              initial="hidden"
              animate="show"
              variants={fade}
              custom={3}
              className="space-y-1"
            >
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-ink-mute)] pb-2">
                Daha fazla keşfet
              </h2>
              {[
                { to: `/sporcu/${slug}/yolculuk`, label: "Yolculuğu Gör", icon: Trophy, hint: "Hikayesi" },
                { to: `/sporcu/${slug}/gunluk`, label: "Günlük", icon: BookOpen, hint: "Sahadan notlar" },
                { to: `/sporcu/${slug}/ihtiyaclar`, label: "İhtiyaçları", icon: HandHeart, hint: "Nasıl yardım edebilirim?" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet">
                      <l.icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--app-ink)]">{l.label}</p>
                      <p className="text-[11px] text-[color:var(--app-ink-mute)]">{l.hint}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--app-ink-mute)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet" />
                </Link>
              ))}
            </motion.section>
          </div>
        </div>

        {/* ── STICKY ACTION BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 lg:bottom-6"
        >
          <div className="flex items-center gap-2 rounded-full border border-[color:var(--app-line)] bg-white/95 p-1.5 shadow-[0_20px_50px_-12px_rgba(80,60,150,0.25)] backdrop-blur-xl">
            <Link
              to="/dashboard"
              className="btn-primary-light flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Heart className="h-4 w-4" strokeWidth={2} fill="currentColor" />
              Destek Ol
            </Link>
            <button className="hidden h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)] sm:inline-flex">
              <UserPlus className="h-3.5 w-3.5" strokeWidth={2} /> Takip Et
            </button>
            <button className="hidden h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)] sm:inline-flex">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> Mesaj
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--app-ink-soft)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)] sm:hidden">
              <UserPlus className="h-4 w-4" strokeWidth={2} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--app-ink-soft)] transition-colors hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)] sm:hidden">
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
