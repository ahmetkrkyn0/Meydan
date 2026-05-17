import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Award, Calendar, MapPin, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athletes, events, sports } from "@/lib/mock-data";

export const Route = createFileRoute("/kesfet/brans/$id")({
  component: BranchPage,
  head: () => ({ meta: [{ title: "Branş — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function BranchPage() {
  const { id } = useParams({ from: "/kesfet/brans/$id" });
  const sport = sports.find((s) => s.id === id) ?? sports[0];

  const sportAthletes = athletes.filter((a) =>
    a.sport.toLocaleLowerCase("tr-TR").includes(sport.name.toLocaleLowerCase("tr-TR")),
  );
  const sportEvents = events.filter((e) =>
    e.sport.toLocaleLowerCase("tr-TR").includes(sport.name.toLocaleLowerCase("tr-TR")),
  );

  return (
    <AppShell role="fan">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-5xl flex-col gap-14"
      >
        {/* ─── Hero ─── */}
        <motion.header variants={fadeUp} className="relative overflow-hidden rounded-3xl">
          <div className="bg-aurora-light absolute inset-0 opacity-80" />
          <div className="relative flex flex-col gap-6 p-8 sm:p-12">
            <div className="flex items-center gap-2">
              <Link
                to="/kesfet"
                className="text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
              >
                Keşfet
              </Link>
              <span className="text-[color:var(--app-ink-mute)]">/</span>
              <span className="text-xs font-semibold text-[color:var(--app-ink)]">Branşlar</span>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              <motion.span
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="text-7xl leading-none sm:text-8xl"
                aria-hidden
              >
                {sport.emoji}
              </motion.span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Branş</p>
                <h1 className="font-display mt-2 text-4xl font-bold leading-[1] tracking-tight text-[color:var(--app-ink)] sm:text-6xl">
                  {sport.name}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
                  {sport.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-[color:var(--app-ink)]">
                  <Users className="h-4 w-4 text-violet" />
                  <span className="font-display text-lg font-bold">{sport.athleteCount}</span>
                  <span className="text-[color:var(--app-ink-soft)]">sporcu aktif</span>
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ─── Featured athletes ─── */}
        <motion.section variants={fadeUp}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
              Öne çıkan sporcular
            </h2>
            <Link
              to="/kesfet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
            >
              Hepsi <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {sportAthletes.length === 0 ? (
            <p className="rounded-2xl border border-[color:var(--app-line)] bg-white/60 p-6 text-sm text-[color:var(--app-ink-soft)]">
              Bu branşta henüz Meydan'a katılmış sporcu yok. İlk sen olabilir misin?
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sportAthletes.map((a) => (
                <Link
                  key={a.slug}
                  to="/sporcu/$slug"
                  params={{ slug: a.slug }}
                  className="soft-card group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <img
                    src={a.img}
                    alt={a.name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[color:var(--app-ink)]">{a.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[color:var(--app-ink-soft)]">
                      {a.city} · TR #{a.rank.national}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-violet">
                      {a.followers.toLocaleString("tr-TR")} takipçi
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* ─── Upcoming events ─── */}
        <motion.section variants={fadeUp}>
          <h2 className="font-display mb-5 text-2xl font-bold text-[color:var(--app-ink)]">
            Yaklaşan maçlar
          </h2>

          {sportEvents.length === 0 ? (
            <p className="rounded-2xl border border-[color:var(--app-line)] bg-white/60 p-6 text-sm text-[color:var(--app-ink-soft)]">
              {sport.name} branşında yakında etkinlik planlanmadı. Yeni duyurulara dikkat.
            </p>
          ) : (
            <ul className="space-y-3">
              {sportEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    to="/sehrimde"
                    className="soft-card group flex items-center gap-4 rounded-2xl p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-violet/10 py-2 text-violet">
                      <span className="font-display text-lg font-bold leading-none">{e.day}</span>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">{e.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[color:var(--app-ink)]">{e.title}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[color:var(--app-ink-soft)]">
                        <MapPin className="h-3 w-3" /> {e.city}, {e.district} · {e.time}
                      </p>
                    </div>
                    <span className={`chip ${e.free ? "chip-emerald" : "chip-violet"}`}>
                      {e.free ? "Ücretsiz" : "Biletli"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        {/* ─── Try this sport CTA ─── */}
        <motion.section variants={fadeUp}>
          <article className="soft-card-strong relative overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-sky/12 blur-3xl" />

            <div className="relative grid items-center gap-6 p-8 sm:grid-cols-[auto_1fr_auto] sm:p-10">
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-6xl shadow-sm"
                aria-hidden
              >
                {sport.emoji}
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">
                  Bu sporu denemek istersen
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold leading-tight text-[color:var(--app-ink)] sm:text-3xl">
                  Önce izle, sonra dene.
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                  Şehrindeki kulüpler ve başlangıç atölyeleriyle eşleştirelim. İlk Adım rozetin seni bekliyor.
                </p>
              </div>
              <Link
                to="/kesfet/mod"
                className="btn-primary-light inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
              >
                <Award className="h-4 w-4" />
                İlk adım rozetim aktif
              </Link>
            </div>
          </article>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[color:var(--app-ink-mute)]">
            <Sparkles className="h-3 w-3 text-violet" />
            <Calendar className="h-3 w-3" /> Önerilen başlangıç: önümüzdeki 14 gün içinde
          </p>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
