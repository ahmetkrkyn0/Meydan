import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Eye,
  Send,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  X,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { createCheer, getCheerSummary, listProfiles, type CheerSummary } from "@/lib/api";
import { findProfileBySlug } from "@/lib/api-mappers";
import { useSession } from "@/lib/session";
import {
  liveMatches,
  recentCheers,
  cheerTemplates,
  tribuneNames,
  tribuneMessages,
  type Cheer,
} from "@/lib/mock-data";

export const Route = createFileRoute("/canli/$id")({
  component: LiveMatchPage,
  head: () => ({ meta: [{ title: "Dijital Tribün — Meydan" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const reactions = ["👏", "🔥", "💪", "🇹🇷", "✨", "🙏"];

type Float = { id: number; emoji: string; x: number };

/* ── Tribün ses üreteci — tekrar etmeyen, çeşitli akış ── */
function pickRandom<T>(arr: T[], exclude: Set<string>, key: (x: T) => string): T {
  const available = arr.filter((x) => !exclude.has(key(x)));
  const pool = available.length > 0 ? available : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomTribuneCheer(recent: { from: string; message: string }[]): Omit<Cheer, "id"> {
  const recentNames = new Set(recent.slice(0, 6).map((r) => r.from));
  const recentMsgs = new Set(recent.slice(0, 8).map((r) => r.message));
  const from = pickRandom(tribuneNames, recentNames, (n) => n);
  const message = pickRandom(tribuneMessages, recentMsgs, (m) => m);
  // Bazen zaman damgası "az önce" / "1 dk" çeşitliliği — çoğunlukla "şimdi"
  const dice = Math.random();
  const time = dice < 0.75 ? "şimdi" : dice < 0.92 ? "az önce" : "1 dk";
  return { from, message, time };
}

/* ── Bayrak emojisinden ülke adı ── */
const FLAG_TO_COUNTRY: Record<string, string> = {
  "🇹🇷": "Türkiye",
  "🇬🇷": "Yunanistan",
  "🇫🇷": "Fransa",
  "🇰🇷": "G. Kore",
  "🇵🇹": "Portekiz",
  "🇧🇪": "Belçika",
  "🇺🇸": "ABD",
  "🇪🇸": "İspanya",
  "🇵🇱": "Polonya",
  "🇺🇦": "Ukrayna",
  "🇰🇿": "Kazakistan",
  "🇧🇫": "Burkina Faso",
  "🇮🇹": "İtalya",
  "🇩🇪": "Almanya",
  "🇬🇧": "İngiltere",
  "🇧🇷": "Brezilya",
  "🇯🇵": "Japonya",
};
function countryFromFlag(flag: string): string {
  return FLAG_TO_COUNTRY[flag] ?? flag;
}

/* ── Branş bazlı canlı skor tickerı ── */
type LiveScore = { score?: string; setScore?: string };

function tennisTick(prev: LiveScore): LiveScore {
  // setScore "5-3" oyun; score "1-0" set
  const [g1, g2] = (prev.setScore ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  const [s1, s2] = (prev.score ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  const sideWins = Math.random() < 0.55 ? 0 : 1; // sporcuya hafif avantaj
  let ng1 = g1, ng2 = g2, ns1 = s1, ns2 = s2;
  if (sideWins === 0) ng1 += 1; else ng2 += 1;
  // Set kapandı mı?
  if (ng1 >= 6 && ng1 - ng2 >= 2) { ns1 += 1; ng1 = 0; ng2 = 0; }
  else if (ng2 >= 6 && ng2 - ng1 >= 2) { ns2 += 1; ng1 = 0; ng2 = 0; }
  return { score: `${ns1}-${ns2}`, setScore: `${ng1}-${ng2}` };
}

function archeryTick(prev: LiveScore): LiveScore {
  const [s1, s2] = (prev.score ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  const home = Math.random() < 0.6;
  return {
    score: `${home ? s1 + 1 : s1}-${home ? s2 : s2 + 1}`,
    setScore: prev.setScore,
  };
}

function billiardsTick(prev: LiveScore): LiveScore {
  const [s1, s2] = (prev.score ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  const add = Math.random() < 0.55 ? Math.floor(Math.random() * 4) + 1 : 0;
  const otherAdd = Math.random() < 0.4 ? Math.floor(Math.random() * 3) : 0;
  return {
    score: `${s1 + add}-${s2 + otherAdd}`,
    setScore: prev.setScore,
  };
}

function athleticsTick(_prev: LiveScore): LiveScore {
  // Necati — üç adım atlama, 17.10 - 17.85 m arası
  const meters = (17.1 + Math.random() * 0.75).toFixed(2);
  const attempts = (_prev.setScore ?? "1/6").split("/");
  const cur = Math.min(parseInt(attempts[0] || "1", 10) + 1, 6);
  return { score: `${meters}m`, setScore: `${cur}/6` };
}

function boxingTick(prev: LiveScore): LiveScore {
  const [r1, r2] = (prev.score ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  const add = Math.random() < 0.5;
  return {
    score: `${add ? r1 + 1 : r1}-${add ? r2 : r2 + 1}`,
    setScore: prev.setScore,
  };
}

function defaultTick(prev: LiveScore): LiveScore {
  const [s1, s2] = (prev.score ?? "0-0").split("-").map((n) => parseInt(n, 10) || 0);
  return {
    score: Math.random() < 0.5 ? `${s1 + 1}-${s2}` : `${s1}-${s2 + 1}`,
    setScore: prev.setScore,
  };
}

function tickForSport(sport: string, prev: LiveScore): LiveScore {
  switch (sport) {
    case "Tenis":    return tennisTick(prev);
    case "Okçuluk":  return archeryTick(prev);
    case "Bilardo":  return billiardsTick(prev);
    case "Atletizm": return athleticsTick(prev);
    case "Boks":     return boxingTick(prev);
    default:         return defaultTick(prev);
  }
}

function intervalForSport(sport: string): number {
  switch (sport) {
    case "Tenis":    return 12000;
    case "Boks":     return 18000;
    case "Okçuluk":  return 10000;
    case "Atletizm": return 15000;
    case "Bilardo":  return 8000;
    default:         return 12000;
  }
}

type FeedItem = Cheer & {
  mine?: boolean;
  aiCleared?: boolean;
};

type ComposerStatus =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "sent" }
  | { kind: "blocked" }
  | { kind: "offline" }
  | { kind: "error"; message: string };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function LiveMatchPage() {
  const { id } = Route.useParams();
  const match = liveMatches.find((m) => m.id === id) ?? liveMatches[0];
  const session = useSession();

  // Sporcu UUID — backend'den eşleştir
  const profilesQuery = useQuery({
    queryKey: ["profiles", "sporcu"],
    queryFn: () => listProfiles({ role: "sporcu" }),
    retry: 1,
  });
  const athleteProfile = useMemo(
    () =>
      findProfileBySlug(match.athleteSlug, profilesQuery.data?.profiles),
    [match.athleteSlug, profilesQuery.data?.profiles],
  );

  const matchDate = useMemo(() => todayISO(), []);
  const backendReady = Boolean(athleteProfile?.id && session.profile?.id);

  // Cheer post mutation — gerçek API, gerçek Gemini
  const cheerMutation = useMutation({
    mutationFn: (message: string) => {
      if (!athleteProfile?.id) throw new Error("athlete-missing");
      if (!session.profile?.id) throw new Error("not-logged-in");
      return createCheer({
        athlete_id: athleteProfile.id,
        fan_id: session.profile.id,
        message,
        match_date: matchDate,
      });
    },
  });

  // Summary lazy fetch
  const summaryMutation = useMutation({
    mutationFn: async () => {
      if (!athleteProfile?.id) throw new Error("athlete-missing");
      return getCheerSummary(athleteProfile.id, matchDate);
    },
  });

  /* ── UI state ── */
  const [floats, setFloats] = useState<Float[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>(() =>
    // recentCheers en yeni başta; biz kronolojik (eski → yeni) istiyoruz, ters çevir
    [...recentCheers].reverse().map((c) => ({ ...c, aiCleared: true })),
  );
  const [viewers, setViewers] = useState(match.viewers);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(0);
  const [status, setStatus] = useState<ComposerStatus>({ kind: "idle" });
  const [blockedNotice, setBlockedNotice] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const lastClearedIdRef = useRef<string | null>(null);
  const feedScrollRef = useRef<HTMLUListElement | null>(null);

  /* ── Live score state (canlı maçlarda branşa göre tick) ── */
  const [liveScore, setLiveScore] = useState<LiveScore>({
    score: match.score,
    setScore: match.setScore,
  });
  const [scoreFlash, setScoreFlash] = useState(0);
  // Momentum 50 = eşit. Başlangıçta sporcuya hafif avantaj (52-58 arası).
  const [liveMomentum, setLiveMomentum] = useState(() => 52 + Math.floor(Math.random() * 7));
  const isLive = match.status === "live";

  /* ── Tickers ── */
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(0, v + Math.floor(Math.random() * 7) - 2));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Tribün chat akışı — rastgele isim + mesaj, tekrar etmeyen
  useEffect(() => {
    let stopped = false;
    function schedule() {
      if (stopped) return;
      const delay = 3000 + Math.random() * 4000; // 3-7 sn
      setTimeout(() => {
        if (stopped) return;
        setFeed((f) => {
          // En son 8 mesaja bakıp tekrarı engelle
          const recent = f.slice(-8).map((x) => ({ from: x.from, message: x.message }));
          const next = randomTribuneCheer(recent);
          const appended = [
            ...f,
            { id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...next, aiCleared: true },
          ];
          // Son 14'ü tut
          return appended.slice(-14);
        });
        schedule();
      }, delay);
    }
    schedule();
    return () => { stopped = true; };
  }, []);

  // Chat dibe scroll — her yeni mesaj geldiğinde
  useEffect(() => {
    const el = feedScrollRef.current;
    if (!el) return;
    // Yumuşak kayma
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [feed.length]);

  // Canlı skor tickerı — sadece "live" maçlarda
  useEffect(() => {
    if (!isLive) return;
    const iv = intervalForSport(match.sport);
    const t = setInterval(() => {
      setLiveScore((prev) => tickForSport(match.sport, prev));
      setScoreFlash((k) => k + 1);
      // Momentum gerçekçi salınım: ±3 puan, 35-65 aralığına klempli (eşite doğru çekme bias'ı)
      setLiveMomentum((m) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3..+3
        // Hafif "mean-reversion": 50'den uzaklaştıkça geri çekme şansı artar
        const pullToCenter = (50 - m) * 0.08;
        const next = m + delta + pullToCenter;
        return Math.round(Math.max(35, Math.min(65, next)));
      });
    }, iv);
    return () => clearInterval(t);
  }, [isLive, match.sport]);

  /* ── Reaction burst ── */
  function fireReaction(emoji: string) {
    const id = Date.now() + Math.random();
    const x = 18 + Math.random() * 64;
    setFloats((f) => [...f, { id, emoji, x }]);
    setTimeout(() => {
      setFloats((f) => f.filter((x) => x.id !== id));
    }, 2400);
  }

  /* ── Send cheer — gerçek Gemini moderation ── */
  async function sendCheer(text: string) {
    const message = text.trim();
    if (!message) return;
    if (status.kind === "checking") return;

    // Backend yoksa: offline mode, mesajı feed'e ekle ama AI rozeti yok
    if (!backendReady) {
      const item: FeedItem = {
        id: `local-${Date.now()}`,
        from: "Sen",
        message,
        time: "şimdi",
        mine: true,
        aiCleared: false,
      };
      setFeed((f) => [...f, item].slice(-14));
      setDraft("");
      setSent((s) => s + 1);
      setStatus({ kind: "offline" });
      setTimeout(() => setStatus({ kind: "idle" }), 2000);
      return;
    }

    setStatus({ kind: "checking" });
    setBlockedNotice(null);

    try {
      const res = await cheerMutation.mutateAsync(message);
      if (res.is_toxic) {
        // BLOCKED — feed'e ekleme, input shake, uyarı
        setStatus({ kind: "blocked" });
        setBlockedNotice(
          "Bu mesaj küfür veya hakaret içeriyor. Tribünde temiz kalalım — sporcuya ulaşmadı.",
        );
        setShakeKey((k) => k + 1);
        // Input değeri korunur — kullanıcı düzeltsin
      } else {
        // CLEARED — feed'e ekle, AI rozeti parlat
        const item: FeedItem = {
          id: `mine-${Date.now()}`,
          from: "Sen",
          message,
          time: "şimdi",
          mine: true,
          aiCleared: true,
        };
        setFeed((f) => [...f, item].slice(-14));
        lastClearedIdRef.current = item.id;
        setTimeout(() => {
          if (lastClearedIdRef.current === item.id) {
            lastClearedIdRef.current = null;
          }
        }, 2000);
        setDraft("");
        setSent((s) => s + 1);
        setStatus({ kind: "sent" });
        setTimeout(() => setStatus({ kind: "idle" }), 1800);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      setStatus({ kind: "error", message: msg });
      setTimeout(() => setStatus({ kind: "idle" }), 3000);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendCheer(draft);
  }

  function handleTemplate(template: string) {
    if (status.kind === "checking") return;
    void sendCheer(template);
  }

  /* ── Summary ── */
  const [showSummary, setShowSummary] = useState(false);
  async function openSummary() {
    if (!athleteProfile?.id) return;
    setShowSummary(true);
    if (!summaryMutation.data && !summaryMutation.isPending) {
      summaryMutation.mutate();
    }
  }

  return (
    <AppShell role="fan" hideSearch>
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      >
        {/* ── Back ── */}
        <motion.div variants={fadeUp}>
          <Link
            to="/canli"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] transition-colors hover:text-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Canlı maçlar
          </Link>
        </motion.div>

        {/* ── Compact top strip ── */}
        <motion.header
          variants={fadeUp}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3 sm:px-5"
        >
          <div className="flex items-center gap-3">
            <img
              src={match.athleteImg}
              alt=""
              className="h-11 w-11 rounded-2xl object-cover object-top ring-2 ring-white"
            />
            <div>
              <p className="font-display text-base font-bold leading-tight text-[color:var(--app-ink)] sm:text-lg">
                {match.athleteName}
                <span className="mx-2 text-[color:var(--app-ink-mute)]">vs</span>
                {match.opponent} <span>{match.opponentFlag}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--app-ink-mute)]">
                {match.emoji} {match.sport} ·{" "}
                {isLive
                  ? "Canlı"
                  : match.status === "soon"
                  ? `Başlama: ${match.startsAt}`
                  : "Bitti"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {liveScore.score && (
              <div className="text-right">
                <motion.p
                  key={`top-${scoreFlash}`}
                  initial={isLive ? { scale: 1.18, color: "oklch(0.65 0.20 18)" } : false}
                  animate={{ scale: 1, color: "oklch(0.22 0.05 258)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="font-mono text-2xl font-bold leading-none tabular-nums"
                >
                  {liveScore.score}
                </motion.p>
                {liveScore.setScore && (
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                    Set {liveScore.setScore}
                  </p>
                )}
              </div>
            )}
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-coral">
                <LivePulse />
                Canlı
              </span>
            )}
          </div>
        </motion.header>

        <motion.section
          variants={fadeUp}
          className={`grid gap-6 ${
            isLive ? "lg:grid-cols-[1.5fr_1fr]" : "mx-auto w-full max-w-3xl"
          }`}
        >
          {/* ─── LEFT — broadcast stage ─── */}
          <div className="flex flex-col gap-4">
            <div className="soft-card-strong relative aspect-video overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-aurora-light opacity-85" />
              <div className="absolute inset-0 grid-dots-warm opacity-50" />
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-coral/12 blur-3xl" />

              <div className="absolute inset-0 flex flex-col items-center justify-between gap-3 px-6 py-6">
                {/* Üst — iki sporcu karşılıklı + VS */}
                <div className="flex w-full max-w-md items-center justify-between gap-3">
                  {/* Bizim sporcu */}
                  <FighterCard
                    name={match.athleteName}
                    flag="🇹🇷"
                    country="Türkiye"
                    imgSrc={match.athleteImg}
                    side="home"
                  />

                  {/* VS */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-display text-2xl font-black italic tracking-tight text-[color:var(--app-ink-mute)]">
                      VS
                    </span>
                    <span className="h-px w-8 bg-[color:var(--app-line)]" />
                  </div>

                  {/* Rakip */}
                  <FighterCard
                    name={match.opponent}
                    flag={match.opponentFlag}
                    country={countryFromFlag(match.opponentFlag)}
                    imgSrc={null}
                    side="away"
                  />
                </div>

                {/* Orta — büyük skor */}
                <div className="flex flex-col items-center gap-2">
                  {liveScore.score ? (
                    <>
                      <motion.p
                        key={`big-${scoreFlash}`}
                        initial={isLive ? { scale: 1.22 } : false}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="font-mono text-5xl font-bold tabular-nums leading-none text-[color:var(--app-ink)] sm:text-6xl"
                      >
                        {liveScore.score}
                      </motion.p>
                      {liveScore.setScore && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                          Set {liveScore.setScore}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] ring-1 ring-[color:var(--app-line)]">
                      Maç başlamak üzere · {match.startsAt}
                    </p>
                  )}
                </div>

                {/* Alt — iki kutuplu momentum */}
                {isLive && (
                  <BipolarMomentum
                    value={liveMomentum}
                    leftName={match.athleteName.split(" ")[0]}
                    rightName={match.opponent.split(" ")[0]}
                  />
                )}
              </div>

              <AnimatePresence>
                {floats.map((f) => (
                  <motion.span
                    key={f.id}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: -260,
                      scale: 1.2,
                      rotate: (Math.random() - 0.5) * 30,
                    }}
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

            {/* Reaction row — sadece canlı maçta */}
            {isLive && (
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
            )}

            {/* Maç bitti bilgi şeridi — yayın altında, özetten önce */}
            {match.status === "ended" && (
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--app-line-soft)] text-[color:var(--app-ink-soft)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                  <span className="font-semibold text-[color:var(--app-ink)]">Maç bitti — tribün kapandı.</span>{" "}
                  Aşağıda AI'ın hazırladığı tezahürat özetini görebilirsin.
                </p>
              </div>
            )}

            {/* ── Maç sonu özet — sadece biten maçlarda görünür ── */}
            {match.status === "ended" ? (
              <SummaryCard
                show={showSummary}
                onOpen={openSummary}
                loading={summaryMutation.isPending}
                error={summaryMutation.error}
                data={summaryMutation.data}
                athleteName={match.athleteName}
                backendReady={Boolean(athleteProfile?.id)}
              />
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[color:var(--app-line)] bg-white/50 px-4 py-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--app-line-soft)] text-[color:var(--app-ink-mute)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11px] leading-relaxed text-[color:var(--app-ink-soft)]">
                  <span className="font-semibold text-[color:var(--app-ink)]">Maç sonu özeti</span> — Gemini, tribünden gelen tüm temiz mesajları maç bittiğinde {match.athleteName} için özetleyecek.
                </p>
              </div>
            )}
          </div>

          {/* ─── RIGHT — single tribune panel (sadece canlı maçta) ─── */}
          {isLive && (
          <aside className="sticky top-20 flex max-h-[calc(100vh-7rem)] flex-col self-start overflow-hidden rounded-3xl border border-[color:var(--app-line)] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--app-line-soft)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-violet" strokeWidth={1.9} />
                <p className="font-display text-base font-bold leading-none tabular-nums text-[color:var(--app-ink)]">
                  {viewers.toLocaleString("tr-TR")}
                </p>
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  tribünde
                </span>
              </div>
              <AIShieldBadge ready={backendReady} />
            </div>

            {/* Blocked alert (sticky between header and feed) */}
            <AnimatePresence>
              {blockedNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden border-b border-coral/20 bg-coral/8"
                >
                  <div className="flex items-start gap-2.5 px-4 py-2.5">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    <p className="flex-1 text-[11px] leading-relaxed text-[color:var(--app-ink)]">
                      <span className="font-bold text-coral">AI engelledi.</span>{" "}
                      {blockedNotice}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBlockedNotice(null)}
                      className="shrink-0 rounded-full p-1 text-coral/70 transition-colors hover:bg-coral/10 hover:text-coral"
                      aria-label="Kapat"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed */}
            <div className="flex min-h-0 flex-1 flex-col px-4 pt-3">
              <div className="flex items-center justify-between pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Tribünden son sesler
                </p>
                <Sparkles className="h-3.5 w-3.5 text-violet" />
              </div>
              <ul
                ref={feedScrollRef}
                aria-live="polite"
                className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pb-3 pr-1 scroll-smooth"
              >
                <AnimatePresence initial={false}>
                  {feed.map((c) => (
                    <FeedRow
                      key={c.id}
                      item={c}
                      highlight={lastClearedIdRef.current === c.id}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* Composer */}
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
                    disabled={status.kind === "checking"}
                    onClick={() => handleTemplate(t)}
                    className="rounded-full border border-[color:var(--app-line)] bg-white px-2.5 py-1 text-[10px] font-medium text-[color:var(--app-ink-soft)] transition-all hover:border-violet/30 hover:bg-violet/8 hover:text-violet disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <motion.form
                key={shakeKey}
                animate={
                  status.kind === "blocked"
                    ? { x: [0, -6, 6, -4, 4, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="mt-2 flex items-stretch gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value.slice(0, 140));
                    if (status.kind === "blocked") setStatus({ kind: "idle" });
                  }}
                  placeholder="Kendi sözlerinle…"
                  disabled={status.kind === "checking"}
                  className={`min-w-0 flex-1 rounded-xl border bg-white px-3 py-2 text-xs text-[color:var(--app-ink)] placeholder:text-[color:var(--app-ink-mute)] transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 ${
                    status.kind === "blocked"
                      ? "border-coral/60 focus:border-coral focus:ring-coral/20"
                      : "border-[color:var(--app-line)] focus:border-violet/40 focus:ring-violet/15"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || status.kind === "checking"}
                  className="btn-primary-light inline-flex shrink-0 items-center justify-center rounded-xl px-3 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gönder"
                >
                  {status.kind === "checking" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </motion.form>

              {/* Microstatus row */}
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[9px]">
                <ComposerStatusLine status={status} backendReady={backendReady} />
                <span className="tabular-nums text-[color:var(--app-ink-mute)]">
                  {draft.length}/140
                </span>
              </div>
            </div>
          </aside>
          )}
        </motion.section>
      </motion.div>
    </AppShell>
  );
}

/* ────────────────────────── tiny components ────────────────────────── */

/* Yayın sahnesinde karşılıklı duran sporcu kartı */
function FighterCard({
  name,
  flag,
  country,
  imgSrc,
  side,
}: {
  name: string;
  flag: string;
  country?: string;
  imgSrc: string | null;
  side: "home" | "away";
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const align = side === "home" ? "items-start text-left" : "items-end text-right";
  const flagOrder = side === "home" ? "flex-row" : "flex-row-reverse";

  return (
    <div className={`flex flex-1 flex-col gap-2 ${align}`}>
      <div className="relative">
        <div
          className={`absolute -inset-2 rounded-full blur-md ${
            side === "home" ? "bg-violet/20" : "bg-coral/15"
          }`}
        />
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="relative h-20 w-20 rounded-full object-cover object-top shadow-lg ring-4 ring-white sm:h-24 sm:w-24"
          />
        ) : (
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--app-line-soft)] to-white shadow-lg ring-4 ring-white sm:h-24 sm:w-24">
            <span className="font-display text-2xl font-bold text-[color:var(--app-ink-soft)]">
              {initials}
            </span>
          </div>
        )}
        {/* Büyük bayrak rozeti — avatarın altında, beyaz daire içinde */}
        <span
          className={`absolute -bottom-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-md ring-2 ring-white ${
            side === "home" ? "right-0 translate-x-1/3" : "left-0 -translate-x-1/3"
          }`}
          title={country ?? flag}
        >
          {flag}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 pt-1">
        <p className="font-display text-sm font-bold leading-tight text-[color:var(--app-ink)] sm:text-base">
          {name}
        </p>
        {country && (
          <div className={`flex items-center gap-1 ${flagOrder}`}>
            <span className="text-sm leading-none">{flag}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
              {country}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* İki kutuplu momentum — orta nokta = eşit. Sağ/sola dolar. */
function BipolarMomentum({
  value,
  leftName,
  rightName,
}: {
  value: number; // 0-100, 50 = eşit
  leftName: string;
  rightName: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  // Eşitten ne kadar uzak? 0..50
  const distance = Math.abs(clamped - 50);
  const lead = clamped > 50 ? "left" : clamped < 50 ? "right" : null;

  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
        <span
          className={`transition-colors ${
            lead === "left" ? "text-violet" : "text-[color:var(--app-ink-mute)]"
          }`}
        >
          {leftName}
        </span>
        <span className="text-[9px] tracking-[0.22em] text-[color:var(--app-ink-mute)]">
          Momentum
        </span>
        <span
          className={`transition-colors ${
            lead === "right" ? "text-coral" : "text-[color:var(--app-ink-mute)]"
          }`}
        >
          {rightName}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-[color:var(--app-line-soft)]">
        {/* Orta çizgi */}
        <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[color:var(--app-line)]" />
        {/* Sol veya sağ doluluk */}
        {lead === "left" && (
          <motion.span
            animate={{ width: `${distance}%` }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute right-1/2 top-0 bottom-0 rounded-l-full bg-gradient-to-l from-violet to-violet/60"
          />
        )}
        {lead === "right" && (
          <motion.span
            animate={{ width: `${distance}%` }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute left-1/2 top-0 bottom-0 rounded-r-full bg-gradient-to-r from-coral to-coral/60"
          />
        )}
      </div>
      <p className="text-center text-[10px] text-[color:var(--app-ink-mute)]">
        {lead === "left"
          ? `${leftName} lehine`
          : lead === "right"
          ? `${rightName} lehine`
          : "Eşit"}
      </p>
    </div>
  );
}

function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
    </span>
  );
}

function AIShieldBadge({ ready }: { ready: boolean }) {
  if (!ready) {
    return (
      <span
        title="AI bağlı değil — mesajlar denetlenmiyor."
        className="inline-flex items-center gap-1 rounded-full border border-[color:var(--app-line)] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[color:var(--app-ink-mute)]"
      >
        <Shield className="h-2.5 w-2.5" /> AI off
      </span>
    );
  }
  return (
    <span
      title="Mesajların Gemini AI tarafından küfür/hakarete karşı kontrol edilir."
      className="inline-flex items-center gap-1 rounded-full border border-violet/25 bg-violet/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet"
    >
      <Zap className="h-2.5 w-2.5" /> AI Korumalı
    </span>
  );
}

function ComposerStatusLine({
  status,
  backendReady,
}: {
  status: ComposerStatus;
  backendReady: boolean;
}) {
  if (status.kind === "checking") {
    return (
      <span className="inline-flex items-center gap-1 text-violet">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        <span className="font-semibold">AI mesajını kontrol ediyor…</span>
      </span>
    );
  }
  if (status.kind === "sent") {
    return (
      <span className="inline-flex items-center gap-1 text-[color:oklch(0.45_0.16_152)]">
        <ShieldCheck className="h-2.5 w-2.5" />
        <span className="font-semibold">AI onayladı · gönderildi</span>
      </span>
    );
  }
  if (status.kind === "blocked") {
    return (
      <span className="inline-flex items-center gap-1 text-coral">
        <ShieldAlert className="h-2.5 w-2.5" />
        <span className="font-semibold">AI engelledi — mesajı düzelt</span>
      </span>
    );
  }
  if (status.kind === "offline") {
    return (
      <span className="text-[color:var(--app-ink-mute)]">
        Çevrimdışı · mesaj yerel feed'e eklendi
      </span>
    );
  }
  if (status.kind === "error") {
    return (
      <span className="text-coral">Hata: {status.message}</span>
    );
  }
  return (
    <span className="text-[color:var(--app-ink-mute)]">
      {backendReady
        ? "Sporcuya yalnızca temiz mesajlar ulaşır."
        : "Mesaj göndermek için giriş gerekli."}
    </span>
  );
}

/* Avatar palette — kullanıcı adından deterministik renk */
const AVATAR_PALETTE = [
  { bg: "oklch(0.72 0.16 222 / 0.18)", fg: "oklch(0.40 0.16 222)" }, // sky
  { bg: "oklch(0.60 0.22 252 / 0.18)", fg: "oklch(0.45 0.22 252)" }, // violet
  { bg: "oklch(0.65 0.20 18 / 0.18)",  fg: "oklch(0.45 0.18 18)"  }, // coral
  { bg: "oklch(0.70 0.16 152 / 0.18)", fg: "oklch(0.38 0.14 152)" }, // emerald
  { bg: "oklch(0.78 0.14 78 / 0.22)",  fg: "oklch(0.42 0.14 78)"  }, // amber
  { bg: "oklch(0.68 0.18 320 / 0.18)", fg: "oklch(0.45 0.20 320)" }, // pink
  { bg: "oklch(0.66 0.14 196 / 0.20)", fg: "oklch(0.40 0.14 196)" }, // teal
];

function paletteFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function FeedRow({
  item,
  highlight,
}: {
  item: FeedItem;
  highlight: boolean;
}) {
  const palette = item.mine
    ? { bg: "transparent", fg: "white" }
    : paletteFor(item.from);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: item.mine
          ? "0 0 0 1px oklch(0.60 0.22 252 / 0.25), 0 8px 24px -12px oklch(0.60 0.22 252 / 0.35)"
          : "0 0 0 0 transparent",
      }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`flex items-start gap-2.5 rounded-2xl px-2.5 py-2 ${
        item.mine
          ? "bg-gradient-to-br from-violet/12 via-violet/6 to-coral/8"
          : "bg-gradient-to-br from-white to-[color:oklch(0.22_0.05_258/0.04)] ring-1 ring-[color:var(--app-line-soft)]"
      }`}
    >
      <span
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={
          item.mine
            ? { background: "linear-gradient(135deg, oklch(0.60 0.22 252), oklch(0.65 0.20 18))", color: "white" }
            : { background: palette.bg, color: palette.fg }
        }
      >
        {item.from[0]?.toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] leading-snug text-[color:var(--app-ink)]">
          <span className="font-semibold">{item.from}</span>{" "}
          <span className="text-[color:var(--app-ink-soft)]">
            {item.message}
          </span>
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className="text-[9px] text-[color:var(--app-ink-mute)]">
            {item.time}
          </p>
          {item.aiCleared && (
            <AnimatePresence>
              {highlight ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-0.5 rounded-full bg-[color:oklch(0.70_0.16_152/0.15)] px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-[color:oklch(0.40_0.14_152)]"
                >
                  <CheckCircle2 className="h-2 w-2" />
                  AI onayladı
                </motion.span>
              ) : (
                <span
                  title="Gemini AI tarafından temiz olarak onaylandı"
                  className="inline-flex h-2.5 w-2.5 items-center justify-center text-[color:oklch(0.55_0.14_152)]"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                </span>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ────────────────────────── summary card ────────────────────────── */

function SummaryCard({
  show,
  onOpen,
  loading,
  error,
  data,
  athleteName,
  backendReady,
}: {
  show: boolean;
  onOpen: () => void;
  loading: boolean;
  error: unknown;
  data?: CheerSummary;
  athleteName: string;
  backendReady: boolean;
}) {
  if (!show) {
    return (
      <button
        type="button"
        onClick={onOpen}
        disabled={!backendReady}
        className="group flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--app-line)] bg-white px-4 py-3.5 text-left transition-all hover:border-violet/30 hover:bg-violet/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-coral text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-[color:var(--app-ink)]">
              Maç sonu özetini gör
            </p>
            <p className="mt-0.5 text-[11px] text-[color:var(--app-ink-soft)]">
              Gemini, tribünden gelen temiz mesajları {athleteName} için özetler.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-violet transition-transform group-hover:translate-x-0.5">
          Özetle →
        </span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-violet/20 bg-white p-5"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-coral/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-coral text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            Gemini AI · Maç özeti
          </p>
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-2.5 text-sm text-[color:var(--app-ink-soft)]">
            <Loader2 className="h-4 w-4 animate-spin text-violet" />
            <span>Tribünden gelen sesler özetleniyor…</span>
          </div>
        )}

        {error != null && !loading && (
          <p className="mt-3 rounded-lg bg-coral/8 px-3 py-2 text-xs text-coral">
            Özet alınamadı: {error instanceof Error ? error.message : "Hata"}
          </p>
        )}

        {data && !loading && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-violet/25 bg-violet/8 px-2.5 py-1 text-[10px] font-bold text-violet">
                {data.safe_count} temiz mesaj
              </span>
              {data.total > data.safe_count && (
                <span className="inline-flex items-center gap-1 rounded-full border border-coral/25 bg-coral/8 px-2.5 py-1 text-[10px] font-bold text-coral">
                  {data.total - data.safe_count} engellendi
                </span>
              )}
            </div>

            {data.summary ? (
              <blockquote className="rounded-xl border-l-2 border-violet bg-[color:oklch(0.22_0.05_258/0.03)] px-4 py-3 font-display text-base leading-relaxed text-[color:var(--app-ink)]">
                {data.summary}
              </blockquote>
            ) : (
              <p className="text-sm text-[color:var(--app-ink-soft)]">
                Henüz özetlenecek temiz mesaj yok.
              </p>
            )}

            {data.top_messages.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                  Öne çıkan sesler
                </p>
                <ul className="mt-2 space-y-1.5">
                  {data.top_messages.map((m, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-[color:oklch(0.22_0.05_258/0.04)] px-3 py-1.5 text-xs text-[color:var(--app-ink-soft)]"
                    >
                      "{m}"
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[10px] text-[color:var(--app-ink-mute)]">
              Bu özet {athleteName}'ye iletilecek.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
