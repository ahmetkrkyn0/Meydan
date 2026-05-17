import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { createCheer, listProfiles } from "@/lib/api";
import { findProfileBySlug } from "@/lib/api-mappers";
import { useSession } from "@/lib/session";
import { liveMatches, recentCheers, cheerTemplates, type Cheer } from "@/lib/mock-data";

export const Route = createFileRoute("/canli/$id")({
  component: LiveMatchPage,
  head: () => ({ meta: [{ title: "Dijital Tribün — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const reactions = ["👏", "🔥", "💪", "🇹🇷", "✨", "🙏"];

type Float = { id: number; emoji: string; x: number };

const mockIncoming: Omit<Cheer, "id">[] = [
  { from: "Deniz", message: "Sakin kal", time: "şimdi" },
  { from: "Aslı", message: "Türkiye seninle 🇹🇷", time: "şimdi" },
  { from: "Kerem", message: "Bir nefes daha", time: "şimdi" },
  { from: "Buse", message: "Seninleyim", time: "şimdi" },
];

function LiveMatchPage() {
  const { id } = Route.useParams();
  const match = liveMatches.find((m) => m.id === id) ?? liveMatches[0];
  const session = useSession();
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const athleteProfile = useMemo(
    () => findProfileBySlug(match.athleteSlug, profilesQuery.data?.profiles),
    [match.athleteSlug, profilesQuery.data?.profiles],
  );
  const createCheerMutation = useMutation({
    mutationFn: (message: string) => {
      if (!athleteProfile?.id) {
        throw new Error("Backend'de bu mac icin sporcu profili bulunamadi.");
      }
      if (!session.profile?.id) {
        throw new Error("Tezahürat için giriş yapman gerekli.");
      }
      return createCheer({
        athlete_id: athleteProfile.id,
        fan_id: session.profile.id,
        message,
        match_date: new Date().toISOString().slice(0, 10),
      });
    },
  });

  const [present, setPresent] = useState(true);
  const [floats, setFloats] = useState<Float[]>([]);
  const [feed, setFeed] = useState<Cheer[]>(recentCheers);
  const [viewers, setViewers] = useState(match.viewers);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 5) - 1);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      const tmpl = mockIncoming[i % mockIncoming.length];
      i++;
      setFeed((f) => [
        { id: `c-${Date.now()}`, from: tmpl.from, message: tmpl.message, time: "şimdi" },
        ...f,
      ].slice(0, 12));
    }, 4500);
    return () => clearInterval(t);
  }, []);

  function fireReaction(emoji: string) {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    setFloats((f) => [...f, { id, emoji, x }]);
    setTimeout(() => {
      setFloats((f) => f.filter((x) => x.id !== id));
    }, 2400);
  }

  function sendCheer(text: string) {
    const message = text.trim();
    if (!message) return;
    setFeed((f) => [
      { id: `c-${Date.now()}`, from: "Sen", message, time: "şimdi" },
      ...f,
    ].slice(0, 12));
    if (athleteProfile?.id && session.profile?.id) {
      createCheerMutation.mutate(message);
    }
    setDraft("");
    setSent((s) => s + 1);
  }

  const backendReady = Boolean(athleteProfile?.id);
  const backendStatusMessage = profilesQuery.isLoading
    ? "Sporcu profili yükleniyor..."
    : profilesQuery.isError
      ? "Backend'e ulaşılamadı; tezahürat backend'e iletilmiyor."
      : !backendReady
        ? `Bu sporcu (${match.athleteName}) backend'de bulunamadı; tezahürat backend'e iletilmiyor.`
        : !session.profile?.id
          ? "Tezahüratın backend'e gönderilmesi için giriş yap."
          : null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendCheer(draft);
  }

  const isLive = match.status === "live";

  return (
    <AppShell role="fan" hideSearch>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/canli"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Canlı maçlar
          </Link>
        </motion.div>

        <motion.header
          variants={fadeUp}
          className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[color:var(--app-line)] bg-white px-4 py-3 sm:px-5"
        >
          <div className="flex items-center gap-3">
            <img
              src={match.athleteImg}
              alt=""
              className="h-12 w-12 rounded-2xl object-cover object-top"
            />
            <div>
              <p className="font-display text-lg font-bold leading-tight text-[color:var(--app-ink)]">
                {match.athleteName}
                <span className="mx-2 text-[color:var(--app-ink-mute)]">vs</span>
                {match.opponent} {match.opponentFlag}
              </p>
              <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                {match.emoji} {match.sport} ·{" "}
                {isLive ? "Canlı" : match.status === "soon" ? `Başlama: ${match.startsAt}` : "Bitti"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {match.score && (
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-[color:var(--app-ink)]">
                  {match.score}
                </p>
                {match.setScore && (
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    Set {match.setScore}
                  </p>
                )}
              </div>
            )}
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-coral">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
                Canlı
              </span>
            )}
          </div>
        </motion.header>

        <motion.section variants={fadeUp} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* ─── SOL: Watch area + emoji row inline ─── */}
          <div className="flex flex-col gap-4">
            <div className="soft-card-strong relative aspect-video overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-aurora-light opacity-80" />
              <div className="absolute inset-0 grid-dots-warm opacity-50" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-3 animate-pulse rounded-full bg-violet/20" />
                  <img
                    src={match.athleteImg}
                    alt=""
                    className="relative h-28 w-28 rounded-full object-cover object-top ring-4 ring-white shadow-xl"
                  />
                </div>

                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-[color:var(--app-ink)]">
                    {match.athleteName}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
                    vs {match.opponent} {match.opponentFlag}
                  </p>
                </div>

                {match.score ? (
                  <div className="flex items-center gap-6">
                    <p className="font-mono text-5xl font-bold text-[color:var(--app-ink)]">
                      {match.score}
                    </p>
                    {match.setScore && (
                      <div className="text-left">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                          Set
                        </p>
                        <p className="font-mono text-xl font-bold text-[color:var(--app-ink-soft)]">
                          {match.setScore}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] ring-1 ring-[color:var(--app-line)]">
                    Maç başlamak üzere · {match.startsAt}
                  </p>
                )}

                <p className="mt-2 max-w-sm text-center text-[11px] text-[color:var(--app-ink-mute)]">
                  Yayın güvenlik nedeniyle simüle edildi. Tribün gerçek.
                </p>
              </div>

              <AnimatePresence>
                {floats.map((f) => (
                  <motion.span
                    key={f.id}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -260, scale: 1.2, rotate: (Math.random() - 0.5) * 30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.4, ease: "easeOut" }}
                    style={{ left: `${f.x}%` }}
                    className="pointer-events-none absolute bottom-8 text-3xl"
                  >
                    {f.emoji}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Reaksiyon row — inline under watch area, not a separate panel */}
            <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-2.5">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                Reaksiyon
              </span>
              <div className="flex flex-1 items-center justify-around gap-1">
                {reactions.map((r) => (
                  <motion.button
                    key={r}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.18, y: -2 }}
                    onClick={() => fireReaction(r)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition-colors hover:bg-violet/8"
                  >
                    {r}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── SAĞ: Single panel — tribün + feed + composer ─── */}
          <aside className="sticky top-20 flex max-h-[calc(100vh-7rem)] flex-col self-start overflow-hidden rounded-3xl border border-[color:var(--app-line)] bg-white">
            {/* Tribün count header */}
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--app-line-soft)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-violet" strokeWidth={1.9} />
                <p className="font-display text-base font-bold leading-none text-[color:var(--app-ink)]">
                  {viewers.toLocaleString("tr-TR")}
                </p>
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  tribünde
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-[10px] font-semibold text-[color:var(--app-ink-soft)]">
                  Sporcum bilsin
                </span>
                <span
                  onClick={() => setPresent((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    present ? "bg-violet" : "bg-[color:var(--app-line)]"
                  }`}
                >
                  <motion.span
                    layout
                    className="absolute h-4 w-4 rounded-full bg-white shadow"
                    style={{ left: present ? 18 : 2 }}
                  />
                </span>
              </label>
            </div>

            {/* Feed — son sesler */}
            <div className="flex min-h-0 flex-1 flex-col px-4 pt-3">
              <div className="flex items-center justify-between pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Tribünden son sesler
                </p>
                <Sparkles className="h-3.5 w-3.5 text-violet" />
              </div>
              <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pb-3 pr-1">
                <AnimatePresence initial={false}>
                  {feed.map((c) => (
                    <motion.li
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="flex items-start gap-2.5 rounded-xl bg-[color:oklch(0.22_0.05_258/0.03)] px-2.5 py-1.5"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 text-[10px] font-bold text-violet">
                        {c.from[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[color:var(--app-ink)]">
                          <span className="font-semibold">{c.from}</span>{" "}
                          <span className="text-[color:var(--app-ink-soft)]">{c.message}</span>
                        </p>
                        <p className="text-[9px] text-[color:var(--app-ink-mute)]">{c.time}</p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* Composer — chat input at bottom */}
            <div className="shrink-0 border-t border-[color:var(--app-line-soft)] bg-[color:oklch(0.985_0.005_90)] px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Sessiz tezahürat
                </p>
                {sent > 0 && (
                  <span className="text-[10px] font-semibold text-violet">
                    {sent} gönderildi
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {cheerTemplates.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => sendCheer(t)}
                    className="rounded-full border border-[color:var(--app-line)] bg-white px-2.5 py-1 text-[10px] font-medium text-[color:var(--app-ink-soft)] transition-all hover:border-violet/30 hover:bg-violet/8 hover:text-violet"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-2 flex items-stretch gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 140))}
                  placeholder="Kendi sözlerinle…"
                  className="min-w-0 flex-1 rounded-xl border border-[color:var(--app-line)] bg-white px-3 py-2 text-xs text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/15"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="btn-primary-light inline-flex shrink-0 items-center justify-center rounded-xl px-3 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gönder"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-1.5 flex items-center justify-between text-[9px] text-[color:var(--app-ink-mute)]">
                <span>Sporcu maç bittikten sonra özetini görür.</span>
                <span className="tabular-nums">{draft.length}/140</span>
              </p>
              {backendStatusMessage && (
                <p className="mt-1.5 rounded-lg bg-coral/8 px-2 py-1 text-[9px] leading-relaxed text-coral">
                  {backendStatusMessage}
                </p>
              )}
            </div>
          </aside>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
