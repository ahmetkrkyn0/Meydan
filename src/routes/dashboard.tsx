import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Bell, Search, Home, Compass, MapPin, Radio, Users, Heart, User, ChevronDown,
  ArrowRight, ArrowUpRight, Zap, Trophy, TrendingUp, Calendar, Star, Shield,
  Flame, Activity, Clock, Eye, Sparkles, Play, BarChart3, Target, Award,
  ChevronRight, Plus, MoreHorizontal,
} from "lucide-react";
import adaImg        from "@/assets/athlete-ada.jpg";
import keremImg      from "@/assets/athlete-kerem.jpg";
import linaImg       from "@/assets/athlete-lina.jpg";
import mertImg       from "@/assets/athlete-mert.jpg";
import archeryPng    from "@/assets/sport-archery-nobg.png";
import basketballPng from "@/assets/sport-basketball-nobg.png";
import billiardsPng  from "@/assets/sport-billiards-nobg.png";
import tennisPng     from "@/assets/sport-tennis-nobg.png";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Ana Sahne — Meydan" }] }),
});

/* ── animated counter ── */
function useCounter(to: number, duration = 1.4, delay = 0.3) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const c = animate(0, to, {
        duration, ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setVal(Math.round(v)),
      });
      return () => c.stop();
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [to, duration, delay]);
  return val;
}

/* ── data ── */
const navItems = [
  { icon: Home,    label: "Ana Sahne",         active: true,  badge: null },
  { icon: Compass, label: "Keşfet",            active: false, badge: null },
  { icon: Radio,   label: "Canlı Maçlar",      active: false, badge: "3"  },
  { icon: Users,   label: "Sporcularım",       active: false, badge: "12" },
  { icon: MapPin,  label: "Şehrimde",          active: false, badge: null },
  { icon: Heart,   label: "Desteklerim",       active: false, badge: null },
  { icon: BarChart3, label: "İstatistikler",   active: false, badge: null },
];

const liveAthletes = [
  { name: "Mete Gazoz",   sport: "Okçuluk",    img: archeryPng,    accent: "violet", rank: "#3 EU",   eta: "14:30", supporters: 2103, growth: "+12%" },
  { name: "Yusuf Dikeç",  sport: "Basketbol",  img: basketballPng, accent: "sky",    rank: "#1 TR",   eta: "19:00", supporters: 1840, growth: "+8%"  },
  { name: "Süreyya Demir",sport: "Bilardo",    img: billiardsPng,  accent: "coral",  rank: "#7 World",eta: "21:15", supporters: 932,  growth: "+24%" },
  { name: "Zeynep Sönmez",sport: "Tenis",      img: tennisPng,     accent: "violet", rank: "#5 EU",   eta: "Yarın", supporters: 1567, growth: "+15%" },
];

const todayMatches = [
  { time: "17:00", home: "Fenerbahçe Opet",   away: "VakıfBank",         sport: "🏐", status: "Canlı",  live: true,  score: "2 - 1", momentum: 72 },
  { time: "19:30", home: "Galatasaray Daikin",away: "Eczacıbaşı Dynavit",sport: "🏐", status: "Yakında", live: false, score: null,    momentum: 0  },
  { time: "20:00", home: "Anadolu Efes",      away: "Pınar Karşıyaka",   sport: "🏀", status: "Yakında", live: false, score: null,    momentum: 0  },
  { time: "21:30", home: "Beşiktaş",          away: "Türk Telekom",      sport: "🏀", status: "Yakında", live: false, score: null,    momentum: 0  },
];

const events = [
  { day: "25", month: "MAY", title: "İstanbul Yarı Maratonu",     loc: "İstanbul",  sport: "🏃", hot: true,  cap: "%87 dolu" },
  { day: "28", month: "MAY", title: "Okçuluk Başlangıç Atölyesi", loc: "İstanbul",  sport: "🏹", hot: false, cap: "%34 dolu" },
  { day: "01", month: "HAZ", title: "Ankara Basketbol Turnuvası",  loc: "Ankara",    sport: "🏀", hot: false, cap: "%52 dolu" },
  { day: "07", month: "HAZ", title: "Sahil Yelken Kupası",          loc: "Bodrum",    sport: "⛵", hot: true,  cap: "%91 dolu" },
];

const supported = [
  { name: "Mete Gazoz",    sport: "Okçuluk",   pct: 81, img: adaImg,   amount: "₺ 4.200", trend: "+12%" },
  { name: "Zeynep Sönmez", sport: "Tenis",     pct: 64, img: keremImg, amount: "₺ 2.800", trend: "+8%"  },
  { name: "Süreyya Demir", sport: "Bilardo",   pct: 47, img: linaImg,  amount: "₺ 1.500", trend: "+24%" },
  { name: "Yusuf Dikeç",   sport: "Basketbol", pct: 35, img: mertImg,  amount: "₺   900", trend: "+5%"  },
];

const activityFeed = [
  { time: "şimdi",     msg: "Mete Gazoz finallere kaldı 🎯",          type: "milestone" },
  { time: "12 dk",     msg: "Zeynep Sönmez 1. seti kazandı 🎾",        type: "live"      },
  { time: "1 sa",      msg: "İstanbul Maratonu kayıtları açıldı",       type: "event"     },
  { time: "3 sa",      msg: "Yusuf Dikeç'e ₺200 destek gönderildi",     type: "support"   },
  { time: "5 sa",      msg: "Yeni rozet kazandın: İlk Destekçi 🏅",     type: "badge"     },
];

const trendingSports = ["Okçuluk", "Voleybol", "Tenis", "Atletizm", "Eskrim", "Bilardo", "Yelken", "Tekvando"];

const accentMap = {
  violet: { bg: "bg-violet/15", text: "text-violet", border: "border-violet/30", glow: "oklch(0.60 0.22 252 / 0.35)" },
  sky:    { bg: "bg-sky/15",    text: "text-sky",    border: "border-sky/30",    glow: "oklch(0.72 0.16 222 / 0.35)" },
  coral:  { bg: "bg-coral/15",  text: "text-coral",  border: "border-coral/30",  glow: "oklch(0.65 0.20 18 / 0.35)"  },
};

/* ── motion variants ── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══════════════════════════════════════════════════════════ */
function DashboardPage() {
  const followCount   = useCounter(12, 1.2, 0.4);
  const liveCount     = useCounter(3,  0.8, 0.5);
  const supportTotal  = useCounter(9400, 1.6, 0.4);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax: featured athlete drifts as you scroll the page
  const { scrollY } = useScroll();
  const athleteY = useTransform(scrollY, [0, 400], [0, -60]);
  const athleteScale = useTransform(scrollY, [0, 400], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 300, 500], [1, 0.6, 0]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Global ambient layers behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-dots opacity-50" />
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet/8 blur-[160px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-sky/6 blur-[150px]" />
        <div className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo/8 blur-[140px]" />
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex w-64 shrink-0 flex-col border-r border-foreground/8 bg-ink/80 backdrop-blur-xl"
      >
        {/* Logo block */}
        <div className="flex items-center gap-3 px-6 py-5">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.22 252), oklch(0.72 0.16 222))",
              boxShadow: "0 10px 28px oklch(0.60 0.22 252 / 0.40)",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
            <span className="relative font-display text-xl font-bold text-white">M</span>
          </motion.div>
          <div>
            <p className="font-display text-xl font-bold leading-none">Meydan</p>
            <div className="mt-1 flex items-center gap-1.5">
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
              <span className="text-[10px] font-medium text-emerald-400">{liveCount} canlı maç</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
              whileHover={{ x: 4 }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                item.active
                  ? "bg-violet/12 text-foreground"
                  : "text-foreground/55 hover:bg-foreground/5 hover:text-foreground"
              }`}
              style={item.active ? { boxShadow: "inset 0 0 0 1px oklch(0.60 0.22 252 / 0.25)" } : {}}
            >
              {item.active && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute left-0 h-6 w-0.5 rounded-r-full bg-violet"
                />
              )}
              <item.icon className={`h-4 w-4 shrink-0 ${item.active ? "text-violet" : ""}`} strokeWidth={item.active ? 2.4 : 1.7} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                  item.badge === "3" ? "bg-red-500/90 text-white" : "bg-foreground/10 text-foreground/70"
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Pro upgrade card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative m-3 overflow-hidden rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, oklch(0.60 0.22 252 / 0.18), oklch(0.72 0.16 222 / 0.12))",
            border: "1px solid oklch(0.60 0.22 252 / 0.25)",
          }}
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet/30 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet" />
              <p className="font-display text-sm font-bold">Meydan Pro</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/70">
              Sınırsız canlı yayın, gelişmiş istatistikler.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full rounded-lg bg-violet py-2 text-xs font-bold text-white shadow-lg shadow-violet/30"
            >
              Yükselt — ₺49/ay
            </motion.button>
          </div>
        </motion.div>

        {/* User card */}
        <div className="m-3 mt-0 flex items-center gap-3 rounded-xl border border-foreground/8 bg-foreground/5 p-2.5">
          <div className="relative">
            <img src={adaImg} alt="" className="h-9 w-9 rounded-xl object-cover object-top" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">Mehmet Kaya</p>
            <p className="text-[10px] text-foreground/55">Pro üye · İstanbul</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-foreground/40" />
        </div>
      </motion.aside>

      {/* ═══ MAIN COLUMN ═══ */}
      <div className="relative flex flex-1 flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex h-16 shrink-0 items-center gap-4 border-b border-foreground/8 bg-background/60 px-6 backdrop-blur-xl"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Sporcu, branş, etkinlik veya şehir ara…"
              className="w-full rounded-xl border border-foreground/10 bg-foreground/5 py-2.5 pl-10 pr-16 text-sm text-foreground placeholder:text-foreground/40 transition-all focus:border-violet/40 focus:bg-foreground/8 focus:outline-none focus:ring-2 focus:ring-violet/20"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 text-[10px] text-foreground/50">⌘K</kbd>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2.5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 text-foreground/60 transition-colors hover:text-foreground">
              <Activity className="h-4 w-4" strokeWidth={1.8} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 text-foreground/60 transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <motion.span animate={{ scale: [1,1.3,1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet" />
            </motion.button>
            <div className="h-6 w-px bg-foreground/10" />
            <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2.5 rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-1.5">
              <img src={adaImg} alt="" className="h-7 w-7 rounded-lg object-cover object-top" />
              <div className="text-left">
                <p className="text-xs font-semibold leading-none">Mehmet Kaya</p>
                <p className="mt-0.5 text-[10px] leading-none text-foreground/55">İstanbul</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-foreground/50" />
            </motion.button>
          </div>
        </motion.header>

        {/* ── Scroll body ── */}
        <main className="relative flex-1 overflow-y-auto">

          {/* ════ HERO BANNER — Featured live athlete with parallax ════ */}
          <motion.section
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative isolate overflow-hidden border-b border-foreground/8"
            style={{ minHeight: 440 }}
          >
            {/* Aurora background */}
            <div className="absolute inset-0 -z-20 bg-aurora opacity-90" />
            <div className="absolute inset-0 -z-10 light-rays opacity-40" />

            {/* Parallax athlete cutout — RIGHT side */}
            <motion.div
              style={{ y: athleteY, scale: athleteScale, opacity: heroOpacity }}
              className="pointer-events-none absolute bottom-0 right-0 z-0 h-full w-[40%] hidden md:block"
            >
              <div className="absolute -right-12 -bottom-8 h-[110%] w-full">
                <img
                  src={archeryPng}
                  alt=""
                  className="h-full w-full object-contain object-bottom-right"
                  style={{ filter: "drop-shadow(0 30px 60px oklch(0.60 0.22 252 / 0.30))" }}
                />
              </div>
              {/* Soft glow under athlete */}
              <div className="absolute right-12 bottom-0 h-32 w-[70%] rounded-full bg-violet/30 blur-3xl" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-8 pt-14 pb-12">

              {/* Top welcome strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/25 bg-violet/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-violet backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
                    Şu an meydanda
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                    Cumartesi · 17 Mayıs
                  </span>
                </div>
                <motion.button
                  whileHover={{ x: 3 }}
                  className="hidden items-center gap-1.5 text-xs font-semibold text-foreground/60 hover:text-foreground sm:inline-flex"
                >
                  Haftalık özet <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.button>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display mt-6 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Hoş geldin Mehmet,
                <br />
                <span className="text-gradient-violet italic">Mete</span> birazdan sahnede.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-5 max-w-md text-base leading-relaxed text-foreground/65"
              >
                Avrupa Okçuluk Şampiyonası finali Budapeşte'de 14:30'da başlıyor. Sessiz tezahüratını şimdiden gönder.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-bold text-primary-foreground transition-shadow hover:shadow-2xl"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                  Canlı İzle
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/8 px-5 py-3 text-sm font-medium text-foreground/85 backdrop-blur-md transition-all hover:border-foreground/35 hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                  Mete'nin profili
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium text-foreground/65 backdrop-blur-md transition-all hover:border-foreground/25 hover:text-foreground"
                >
                  <Zap className="h-4 w-4" />
                  Destek ver
                </motion.button>
              </motion.div>

              {/* Stat strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-foreground/10 pt-6"
              >
                {[
                  { label: "Takip ettiğin",   value: followCount,  suffix: "",   icon: Users },
                  { label: "Bugün canlı",     value: liveCount,    suffix: "",   icon: Radio, accent: "text-emerald-400" },
                  { label: "Bu ay destek",     value: supportTotal, suffix: " ₺", icon: TrendingUp },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5">
                      <s.icon className={`h-4 w-4 ${s.accent || "text-foreground/70"}`} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="font-display text-2xl font-bold leading-none">
                        {s.value.toLocaleString("tr-TR")}{s.suffix}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/55">{s.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* ════ LIVE ATHLETES — Horizontal scroll showcase ════ */}
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="px-8 pt-14 pb-2"
          >
            <motion.div variants={fadeUp} className="mx-auto max-w-7xl">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">— Senin meydanın</p>
                  <h2 className="font-display mt-2 text-3xl font-bold sm:text-4xl">Sahnedeki sporcuların</h2>
                </div>
                <motion.button whileHover={{ x: 3 }} className="hidden items-center gap-1.5 text-sm font-semibold text-foreground/60 hover:text-foreground sm:inline-flex">
                  Tümü <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>

            <div className="mx-auto max-w-7xl overflow-x-auto pb-4">
              <div className="flex gap-5 min-w-max">
                {liveAthletes.map((a, i) => {
                  const acc = accentMap[a.accent as keyof typeof accentMap];
                  return (
                    <motion.div
                      key={a.name}
                      variants={fadeUp}
                      whileHover={{ y: -6 }}
                      className="group relative w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/[0.04] backdrop-blur-sm transition-all duration-500 hover:border-foreground/15"
                      style={{ boxShadow: `0 0 0 1px ${acc.glow.replace("0.35", "0.0")}` }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 20px 50px -12px ${acc.glow}`)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 1px transparent`)}
                    >
                      {/* Photo zone with cutout */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-foreground/[0.03] to-transparent">
                        {/* Background glow */}
                        <div className={`absolute inset-0 ${acc.bg} opacity-30 blur-2xl`} />
                        {/* Athlete cutout */}
                        <motion.img
                          src={a.img}
                          alt={a.name}
                          className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-110"
                          style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.3))" }}
                        />
                        {/* Rank pill */}
                        <div className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border ${acc.border} bg-background/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${acc.text} backdrop-blur-md`}>
                          <Trophy className="h-3 w-3" />
                          {a.rank}
                        </div>
                        {/* Growth pill */}
                        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-400 backdrop-blur-md">
                          <TrendingUp className="h-3 w-3" />
                          {a.growth}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-lg font-bold leading-tight">{a.name}</p>
                            <p className="text-xs text-foreground/55">{a.sport}</p>
                          </div>
                          <motion.div whileHover={{ scale: 1.15, rotate: -10 }} className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 group-hover:bg-violet group-hover:text-white transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                          </motion.div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-foreground/8 pt-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-foreground/50">Maç</p>
                            <p className="font-display text-sm font-bold">{a.eta}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-foreground/50">Destekçi</p>
                            <p className="font-display text-sm font-bold">{a.supporters.toLocaleString("tr-TR")}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* ════ MAIN GRID ════ */}
          <section className="px-8 py-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.5fr_1fr]"
            >

              {/* ── LEFT column: Live matches + Supported athletes ── */}
              <div className="space-y-6">

                {/* Live Matches */}
                <motion.div variants={fadeUp} className="rounded-3xl border border-foreground/8 bg-foreground/[0.03] p-6 backdrop-blur-sm">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">Maçlar</p>
                      <h3 className="font-display mt-2 text-2xl font-bold">Bugün sahada</h3>
                    </div>
                    <motion.button whileHover={{ x: 3 }} className="text-xs font-semibold text-foreground/60 hover:text-foreground">
                      Tümü →
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {todayMatches.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ x: 4, backgroundColor: "oklch(0.95 0.008 240 / 0.05)" }}
                        className={`relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-3.5 transition-all cursor-pointer ${
                          m.live
                            ? "border border-violet/25 bg-violet/8"
                            : "border border-foreground/8 bg-foreground/[0.03]"
                        }`}
                      >
                        {/* Time block */}
                        <div className="w-14 shrink-0">
                          <p className={`font-display text-sm font-bold tabular-nums ${m.live ? "text-violet" : "text-foreground/55"}`}>
                            {m.time}
                          </p>
                          <p className="text-[10px] text-foreground/45">{m.live ? "CANLI" : ""}</p>
                        </div>

                        {/* Sport icon */}
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-background/40 text-xl">
                          {m.sport}
                        </span>

                        {/* Teams */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{m.home}</p>
                          <p className="text-xs text-foreground/55 truncate">vs. {m.away}</p>
                        </div>

                        {/* Momentum bar for live */}
                        {m.live && (
                          <div className="hidden w-32 sm:block">
                            <div className="mb-1 flex items-center justify-between text-[10px] text-foreground/55">
                              <span>Momentum</span>
                              <span className="font-semibold text-violet">%{m.momentum}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${m.momentum}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-violet via-sky to-emerald-400"
                              />
                            </div>
                          </div>
                        )}

                        {/* Status / score */}
                        <div className="shrink-0 text-right">
                          {m.live ? (
                            <>
                              <p className="font-display text-base font-bold">{m.score}</p>
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white">
                                <span className="h-1 w-1 animate-ping rounded-full bg-white" />
                                LIVE
                              </span>
                            </>
                          ) : (
                            <span className="rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1 text-[10px] font-semibold text-foreground/65">
                              {m.status}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Supported athletes — large detailed list */}
                <motion.div variants={fadeUp} className="rounded-3xl border border-foreground/8 bg-foreground/[0.03] p-6 backdrop-blur-sm">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky">Desteklerim</p>
                      <h3 className="font-display mt-2 text-2xl font-bold">Yolculukları beraberce.</h3>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/12 bg-foreground/5 transition-colors hover:bg-foreground/10">
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {supported.map((s, i) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ x: 3 }}
                        className="group flex items-center gap-4 rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-3.5 transition-all hover:border-foreground/15 cursor-pointer"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img src={s.img} alt="" className="h-12 w-12 rounded-xl object-cover object-top" />
                          <div className="absolute -bottom-1 -right-1 flex h-5 items-center gap-0.5 rounded-full border border-background bg-emerald-500 px-1.5 text-[9px] font-bold text-white">
                            {s.trend}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{s.name}</p>
                              <p className="text-[11px] text-foreground/55">{s.sport}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-display text-sm font-bold text-violet">{s.amount}</p>
                              <p className="text-[10px] text-foreground/50">bu ay</p>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/8">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${s.pct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-foreground/70 w-9 text-right">%{s.pct}</span>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ── RIGHT column: Events + Activity + Trending ── */}
              <div className="space-y-6">

                {/* Achievement / Pro stats card */}
                <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-violet/25 p-6"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.60 0.22 252 / 0.15), oklch(0.50 0.22 262 / 0.10), transparent)",
                  }}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet/30 blur-3xl" />

                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">Rozetin</p>
                      <h3 className="font-display mt-2 text-xl font-bold">Tribün Lideri</h3>
                      <p className="mt-1 text-xs text-foreground/65">5 görevden 3'ü tamam</p>
                    </div>

                    <motion.div
                      animate={{ rotate: [0, 6, -6, 0], y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative shrink-0"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl"
                        style={{
                          background: "linear-gradient(135deg, oklch(0.60 0.22 252), oklch(0.50 0.22 262))",
                          boxShadow: "0 12px 32px oklch(0.60 0.22 252 / 0.50)",
                        }}
                      >
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400"
                      >
                        <Star className="h-3.5 w-3.5 text-white fill-white" />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-violet via-indigo-soft to-sky"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      { label: "İlk sporcunu takip et",       done: true  },
                      { label: "Canlı maç izle",              done: true  },
                      { label: "İlk desteğini ver",            done: true  },
                      { label: "5 farklı branş keşfet",         done: false },
                      { label: "Bir etkinliğe katıl",           done: false },
                    ].map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.06 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          t.done ? "bg-emerald-500 text-white" : "border border-foreground/25"
                        }`}>
                          {t.done && "✓"}
                        </div>
                        <p className={`text-xs ${t.done ? "text-foreground/45 line-through" : "text-foreground/85"}`}>{t.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Activity feed */}
                <motion.div variants={fadeUp} className="rounded-3xl border border-foreground/8 bg-foreground/[0.03] p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-sky" />
                      <h3 className="font-display text-lg font-bold">Akış</h3>
                    </div>
                    <button className="text-[10px] uppercase tracking-wider text-foreground/50 hover:text-foreground">
                      Hepsi
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activityFeed.map((a, i) => {
                      const typeStyle = {
                        milestone: { color: "text-violet",  dot: "bg-violet"  },
                        live:      { color: "text-red-400", dot: "bg-red-500" },
                        event:     { color: "text-sky",     dot: "bg-sky"     },
                        support:   { color: "text-emerald-400", dot: "bg-emerald-500" },
                        badge:     { color: "text-amber-400", dot: "bg-amber-500" },
                      }[a.type as keyof typeof typeStyle];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="flex gap-3"
                        >
                          <div className="relative flex flex-col items-center">
                            <div className={`h-2 w-2 shrink-0 rounded-full ${typeStyle.dot}`}>
                              {a.type === "live" && (
                                <motion.div
                                  animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className={`h-2 w-2 rounded-full ${typeStyle.dot}`}
                                />
                              )}
                            </div>
                            {i < activityFeed.length - 1 && (
                              <div className="w-px flex-1 bg-foreground/10 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-xs leading-snug text-foreground/85">{a.msg}</p>
                            <p className="mt-0.5 text-[10px] text-foreground/45">{a.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Upcoming events */}
                <motion.div variants={fadeUp} className="rounded-3xl border border-foreground/8 bg-foreground/[0.03] p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">Yaklaşan</p>
                      <h3 className="font-display mt-1.5 text-lg font-bold">Etkinlikler</h3>
                    </div>
                    <motion.button whileHover={{ x: 3 }} className="text-xs font-semibold text-foreground/60 hover:text-foreground">
                      Tümü →
                    </motion.button>
                  </div>
                  <div className="space-y-2.5">
                    {events.map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ x: 3 }}
                        className="group flex items-center gap-3 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-3 cursor-pointer transition-all hover:border-foreground/14"
                      >
                        <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-violet/20 bg-violet/10 py-2">
                          <span className="font-display text-base font-bold leading-none text-violet">{e.day}</span>
                          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-violet/65">{e.month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold leading-tight">{e.title}</p>
                            {e.hot && <span className="shrink-0 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400">HOT</span>}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground/55">
                            <span>{e.sport}</span>
                            <span>·</span>
                            <span>{e.loc}</span>
                            <span>·</span>
                            <span className="text-violet">{e.cap}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Trending sports cloud */}
                <motion.div variants={fadeUp} className="rounded-3xl border border-foreground/8 bg-foreground/[0.03] p-6 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-coral" />
                    <h3 className="font-display text-lg font-bold">Trend branşlar</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSports.map((tag, i) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.07, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        className="rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-all hover:border-violet/35 hover:bg-violet/10 hover:text-violet"
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ════ DISCOVER MODE BANNER ════ */}
          <section className="px-8 pb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-foreground/10"
              style={{
                background: "linear-gradient(135deg, oklch(0.18 0.05 260) 0%, oklch(0.14 0.04 258) 50%, oklch(0.16 0.05 262) 100%)",
              }}
            >
              {/* Aurora overlays */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet/25 blur-3xl" />
                <div className="absolute -right-10 -bottom-20 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
              </div>

              {/* Tennis cutout — right side decoration */}
              <div className="pointer-events-none absolute bottom-0 right-0 h-full w-[35%] hidden md:block">
                <img
                  src={tennisPng}
                  alt=""
                  className="h-full w-full object-contain object-bottom-right opacity-90"
                  style={{ filter: "drop-shadow(0 20px 40px oklch(0.60 0.22 252 / 0.30))" }}
                />
              </div>

              <div className="relative z-10 grid gap-8 p-10 lg:grid-cols-2 lg:p-14">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-violet backdrop-blur-sm">
                    <Compass className="h-3 w-3" />
                    Keşfet Modu
                  </div>
                  <h3 className="font-display mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                    Daha izlemediğin <em className="text-gradient-violet not-italic">35 branş</em> seni bekliyor.
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/65">
                    Akrobatik kayak'tan oryantiringe — yapay zekâ destekli keşfet algoritması sana yeni sahneler açıyor.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-7 inline-flex items-center gap-3 rounded-full bg-violet py-2.5 pl-2.5 pr-6 text-sm font-bold text-white shadow-2xl shadow-violet/40"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    Keşfetmeye Başla
                  </motion.button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: "240+", l: "Sporcu" },
                    { v: "7+",   l: "Branş" },
                    { v: "12K",  l: "Tribün" },
                    { v: "₺840K",l: "Destek" },
                    { v: "94%",  l: "Memnuniyet" },
                    { v: "24/7", l: "Canlı" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.l}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-3.5 backdrop-blur-sm"
                    >
                      <p className="font-display text-2xl font-bold">{s.v}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/55">{s.l}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

        </main>
      </div>
    </div>
  );
}
