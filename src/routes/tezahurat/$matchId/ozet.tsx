import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Quote, X, Send } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athletes, pastMatchById } from "@/lib/mock-data";

export const Route = createFileRoute("/tezahurat/$matchId/ozet")({
  component: PostMatchSummaryPage,
  head: ({ params }) => ({
    meta: [{ title: `${pastMatchById(params.matchId).title} — Tezahürat Özeti | Meydan` }],
  }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function PostMatchSummaryPage() {
  const { matchId } = Route.useParams();
  const match = pastMatchById(matchId);
  const athlete =
    athletes.find((a) => a.slug === match.athleteSlug) ?? athletes[0];

  const featured = match.featuredCheers;
  const themes = match.themes;

  const [people, setPeople] = useState(0);
  const [msgs, setMsgs] = useState(0);
  const targetPeople = match.totalPeople;
  const targetMsgs = match.totalCheers;

  const [modalOpen, setModalOpen] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setPeople(0);
    setMsgs(0);
    let raf: number;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPeople(Math.round(targetPeople * eased));
      setMsgs(Math.round(targetMsgs * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetPeople, targetMsgs]);

  return (
    <AppShell role="athlete" userName={athlete.name} userCity={athlete.city}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-3xl flex-col gap-10"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/sporcu-panel"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Panelim
          </Link>
        </motion.div>

        <motion.header variants={fadeUp} className="flex flex-col gap-3">
          <span className="chip chip-violet w-fit">
            <Sparkles className="h-3 w-3" /> Maç sonu özeti · {match.date} · {match.city}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            {match.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            Skor <span className="font-semibold text-[color:var(--app-ink)]">{match.score}</span>.
            Tribün sessizdi ama dolu. İşte sana bırakılanlar.
          </p>
        </motion.header>

        <motion.section
          variants={fadeUp}
          className="soft-card-strong relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-aurora-light opacity-70" />
          <div className="relative grid items-center gap-6 p-6 sm:grid-cols-3 sm:p-8">
            <div className="sm:col-span-2">
              <div className="flex items-baseline gap-3">
                <p className="font-display text-6xl font-bold leading-none text-[color:var(--app-ink)] sm:text-7xl">
                  {people.toLocaleString("tr-TR")}
                </p>
                <p className="text-base font-semibold text-[color:var(--app-ink-soft)]">kişi</p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--app-ink-soft)]">
                <span className="h-px flex-1 bg-[color:var(--app-line)]" />
                <span>
                  <span className="font-mono text-[color:var(--app-ink)]">
                    {msgs.toLocaleString("tr-TR")}
                  </span>{" "}
                  mesaj bıraktı
                </span>
                <span className="h-px flex-1 bg-[color:var(--app-line)]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 sm:col-span-1">
              <img
                src={athlete.img}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover object-top ring-2 ring-white"
              />
              <div className="text-right">
                <p className="font-display font-bold text-[color:var(--app-ink)]">{athlete.name}</p>
                <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                  {match.result === "W" ? "Galip" : "Mağlup"} · {match.score}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
            <Sparkles className="h-3.5 w-3.5 text-violet" /> Meydan AI özeti
          </div>
          <div className="rounded-3xl border border-[color:var(--app-line)] bg-white p-5 sm:p-6">
            <Quote className="h-5 w-5 text-violet/40" />
            <p className="mt-3 text-base leading-relaxed text-[color:var(--app-ink-soft)]">
              {match.aiSummary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[color:var(--app-line-soft)] pt-4">
              <span className="text-[11px] font-semibold text-[color:var(--app-ink-mute)]">
                Öne çıkan temalar:
              </span>
              {themes.slice(0, 3).map((t, i) => (
                <span
                  key={t.word}
                  className={`chip ${
                    i === 0 ? "chip-violet" : i === 1 ? "chip-sky" : "chip-emerald"
                  }`}
                >
                  {t.word}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">
            Öne çıkan 5 mesaj
          </h2>
          <ul className="flex flex-col gap-2.5">
            {featured.map((c, idx) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.06, duration: 0.45 }}
                className="flex items-start gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white p-4"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet/10 text-sm font-bold text-violet">
                  {c.from[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-[color:var(--app-ink)]">{c.from}</p>
                    <p className="text-[10px] text-[color:var(--app-ink-mute)]">{c.time}</p>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                    "{c.message}"
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold text-[color:var(--app-ink)]">
            Sözlerin haritası
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-3xl border border-[color:var(--app-line)] bg-white p-6">
            {themes.map((t, i) => {
              // Rank: 0 = en güçlü, sona doğru zayıflar
              const tier =
                i === 0 ? 0 :
                i === 1 ? 1 :
                i <= 3 ? 2 :
                i <= 5 ? 3 :
                4;

              const cls =
                tier === 0 ? "text-[2.25rem] leading-[1] font-extrabold text-violet"          // hero
              : tier === 1 ? "text-[1.75rem] leading-[1] font-bold text-[color:oklch(0.45_0.22_252)]" // strong
              : tier === 2 ? "text-[1.375rem] leading-[1.1] font-bold text-[color:oklch(0.55_0.18_252)]" // medium
              : tier === 3 ? "text-base font-semibold text-[color:oklch(0.42_0.05_258)]"      // small ink
              :              "text-sm font-medium text-[color:var(--app-ink-mute)]";          // tiny mute

              return (
                <motion.span
                  key={t.word}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.04 }}
                  className={`font-display tracking-tight ${cls}`}
                  title={`%${t.weight}`}
                >
                  {t.word}
                </motion.span>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          className="flex flex-col items-start gap-3 rounded-3xl border border-[color:var(--app-line)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
              Cevap vermek ister misin?
            </p>
            <p className="mt-0.5 text-[12px] text-[color:var(--app-ink-soft)]">
              Tribüne tek bir teşekkür mesajı bırak. Hepsi okur.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Teşekkür mesajı yayınla
            <Send className="h-4 w-4" />
          </button>
        </motion.section>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[color:oklch(0.22_0.05_258/0.40)] p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink)]"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="font-display text-lg font-bold text-[color:var(--app-ink)]">
                Tribüne mesajın
              </p>
              <p className="mt-1 text-[12px] text-[color:var(--app-ink-soft)]">
                Bugün burada olan {targetPeople} kişi okuyacak.
              </p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value.slice(0, 280))}
                rows={4}
                placeholder="Bugün burada olduğunuz için..."
                className="mt-3 w-full resize-none rounded-2xl border border-[color:var(--app-line)] bg-white p-3 text-sm focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="font-mono text-[11px] text-[color:var(--app-ink-mute)]">
                  {reply.length}/280
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={!reply.trim()}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    reply.trim()
                      ? "btn-primary-light"
                      : "cursor-not-allowed bg-[color:var(--app-line)] text-[color:var(--app-ink-mute)]"
                  }`}
                >
                  Yayınla <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
