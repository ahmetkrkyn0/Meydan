import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Bell, Search, Home, Compass, MapPin, Radio,
  Users, Heart, User, ChevronDown, ArrowRight,
  ArrowUpRight, Zap, Trophy, TrendingUp, Calendar,
  Star, Shield, Flame, Activity, Clock, Eye,
} from "lucide-react";
import adaImg   from "@/assets/athlete-ada.jpg";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg  from "@/assets/athlete-lina.jpg";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Ana Sayfa — Meydan" }] }),
});

/* ─── animated counter hook ─── */
function useCounter(to: number, duration = 1.4, delay = 0.3) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(0, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setVal(Math.round(v)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [to, duration, delay]);
  return val;
}

/* ─── data ─── */
const navItems = [
  { icon: Home,    label: "Ana Sayfa",        active: true  },
  { icon: Compass, label: "Keşfet",           active: false },
  { icon: MapPin,  label: "Şehrimde Ne Var?", active: false },
  { icon: Radio,   label: "Canlı Maçlar",     active: false },
  { icon: Users,   label: "Sporcular",        active: false },
  { icon: Heart,   label: "Desteklerim",      active: false },
  { icon: User,    label: "Profilim",         active: false },
];

const featuredAthletes = [
  { name: "Eray Şamdan",  branch: "Atletizm", rank: "#4 TR", img: adaImg,   supporters: 847  },
  { name: "Zeynep Güneş", branch: "Voleybol", rank: "#1 TR", img: keremImg, supporters: 1240 },
  { name: "Mete Gazoz",   branch: "Okçuluk",  rank: "#3 EU", img: linaImg,  supporters: 2103 },
];

const todayMatches = [
  { time: "17:00", home: "Fenerbahçe",  away: "Beşiktaş Dynavit",  sport: "🏐", status: "Canlı",  live: true,  score: "2 - 1" },
  { time: "19:30", home: "Galatasaray", away: "Beşiktaş",           sport: "⚽", status: "Yakında", live: false, score: null    },
  { time: "20:00", home: "Anadolu Efes",away: "Pınar Karşıyaka",    sport: "🏀", status: "Yakında", live: false, score: null    },
];

const events = [
  { day: "25", month: "MAY", title: "İstanbul Yarı Maratonu",       sport: "🏃", tags: "Koşu • İstanbul",    hot: true  },
  { day: "28", month: "MAY", title: "Okçuluk Başlangıç Atölyesi",   sport: "🏹", tags: "Okçuluk • İstanbul", hot: false },
  { day: "01", month: "HAZ", title: "Ankara Basketbol Turnuvası",    sport: "🏀", tags: "Basketbol • Ankara", hot: false },
];

const supported = [
  { name: "Eray Şamdan",  branch: "Atletizm", pct: 74, img: adaImg,   trend: "+5%"  },
  { name: "Zeynep Güneş", branch: "Voleybol", pct: 58, img: keremImg, trend: "+2%"  },
  { name: "Mete Gazoz",   branch: "Okçuluk",  pct: 81, img: linaImg,  trend: "+12%" },
];

const quickActions = [
  { icon: Trophy,    label: "Sporcu Keşfet",     color: "bg-blue-50 text-blue-600"   },
  { icon: Zap,       label: "Destek Ver",         color: "bg-amber-50 text-amber-600" },
  { icon: MapPin,    label: "Yakındaki Maçlar",   color: "bg-green-50 text-green-600" },
  { icon: Flame,     label: "Canlı Takip",        color: "bg-red-50 text-red-600"     },
];

/* ─── colour tokens ─── */
const C = {
  bg:       "oklch(0.972 0.014 230)",
  white:    "#ffffff",
  border:   "oklch(0.22 0.055 240 / 0.09)",
  navy:     "oklch(0.22 0.055 240)",
  muted:    "oklch(0.52 0.04 240)",
  blue:     "oklch(0.52 0.22 252)",
  blueSoft: "oklch(0.52 0.22 252 / 0.10)",
  sky:      "oklch(0.68 0.17 220)",
  red:      "oklch(0.55 0.22 20)",
};

/* ─── animation presets ─── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const up = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const right = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0,   transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ════════════════════════════════════════ */
function DashboardPage() {
  const followCount  = useCounter(12,    1.2, 0.5);
  const eventCount   = useCounter(5,     0.8, 0.6);
  const supportMoney = useCounter(21300, 1.6, 0.4);

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ background: C.bg }}
    >
      {/* ══════ SIDEBAR ══════ */}
      <motion.aside
        initial={{ x: -48, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-60 shrink-0 flex-col overflow-hidden"
        style={{ background: C.white, borderRight: `1px solid ${C.border}` }}
      >
        {/* subtle top gradient accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/60 to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 px-6 py-5">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.sky})`, boxShadow: `0 8px 24px ${C.blue}40` }}
          >
            <span className="font-display text-lg font-bold text-white">M</span>
          </motion.div>
          <div>
            <span className="font-display text-xl font-bold" style={{ color: C.navy }}>Meydan</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-500 font-medium">3 canlı maç</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 space-y-0.5 px-3 pt-2">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              variants={right}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.06 + i * 0.045 }}
              whileHover={{ x: 3 }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                item.active ? "shadow-sm" : ""
              }`}
              style={item.active
                ? { background: `linear-gradient(135deg, ${C.blueSoft}, oklch(0.52 0.22 252 / 0.05))`, color: C.blue, border: `1px solid oklch(0.52 0.22 252 / 0.18)` }
                : { color: C.muted }
              }
            >
              <item.icon
                className="h-4 w-4 shrink-0"
                strokeWidth={item.active ? 2.4 : 1.8}
                style={{ color: item.active ? C.blue : C.muted }}
              />
              {item.label}
              {item.label === "Canlı Maçlar" && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">3</span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sidebar bottom — user mini card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative m-3 rounded-2xl p-3"
          style={{ background: C.bg, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img src={adaImg} className="h-8 w-8 rounded-xl object-cover object-top" alt="avatar" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: C.navy }}>Mehmet Kaya</p>
              <p className="text-[10px]" style={{ color: C.muted }}>Pro üye</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
          </div>
        </motion.div>
      </motion.aside>

      {/* ══════ MAIN ══════ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <motion.header
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex h-16 shrink-0 items-center gap-4 px-6"
          style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.muted }} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Sporcu, branş veya etkinlik ara…"
              className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              style={{
                background: C.bg,
                border: `1.5px solid oklch(0.22 0.055 240 / 0.10)`,
                color: C.navy,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `oklch(0.52 0.22 252 / 0.45)`)}
              onBlur={(e)  => (e.currentTarget.style.borderColor = `oklch(0.22 0.055 240 / 0.10)`)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-[10px]" style={{ color: C.muted, borderColor: C.border }}>⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ background: C.bg, border: `1.5px solid ${C.border}`, color: C.muted }}
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                style={{ background: C.blue }}
              />
            </motion.button>

            {/* Activity */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ background: C.bg, border: `1.5px solid ${C.border}`, color: C.muted }}
            >
              <Activity className="h-4 w-4" strokeWidth={1.8} />
            </motion.button>

            {/* Divider */}
            <div className="h-6 w-px" style={{ background: C.border }} />

            {/* User */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all"
              style={{ background: C.bg, border: `1.5px solid ${C.border}` }}
            >
              <div className="relative">
                <img src={adaImg} alt="Mehmet" className="h-7 w-7 rounded-lg object-cover object-top" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold leading-none" style={{ color: C.navy }}>Mehmet Kaya</p>
                <p className="mt-0.5 text-[10px] leading-none" style={{ color: C.muted }}>İstanbul</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5" style={{ color: C.muted }} />
            </motion.button>
          </div>
        </motion.header>

        {/* ── SCROLLABLE CONTENT ── */}
        <main className="flex-1 overflow-y-auto px-6 py-5">

          {/* Welcome row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mb-5 flex items-end justify-between"
          >
            <div>
              <h1 className="font-display text-2xl font-bold" style={{ color: C.navy }}>
                Hoş geldin, Mehmet! <span className="text-2xl">👋</span>
              </h1>
              <p className="mt-0.5 text-sm" style={{ color: C.muted }}>Bugün sporda neler oluyor, hemen göz at.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2" style={{ background: C.white, border: `1px solid ${C.border}` }}>
              <Clock className="h-3.5 w-3.5" style={{ color: C.muted }} />
              <span className="text-xs font-medium" style={{ color: C.muted }}>Cumartesi, 17 Mayıs 2026</span>
            </div>
          </motion.div>

          {/* ── HERO BANNER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5 relative overflow-hidden rounded-3xl p-6"
            style={{
              background: `linear-gradient(135deg, ${C.blue} 0%, ${C.sky} 100%)`,
              boxShadow: `0 12px 48px ${C.blue}35`,
            }}
          >
            {/* decorative circles */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-4  top-8   h-28 w-28 rounded-full bg-white/8"  />
            <div className="pointer-events-none absolute right-24 -bottom-8 h-36 w-36 rounded-full bg-white/6"  />

            <div className="relative flex items-center justify-between">
              <div className="max-w-lg">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    3 maç canlı şu an
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white/90">
                    Haftanın özeti hazır
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Mete Gazoz bugün final atışında. <br/>
                  <span className="text-white/80">Sahneyi kaçırma.</span>
                </h2>
                <p className="mt-2 text-sm text-white/75 max-w-sm">
                  Avrupa Okçuluk Şampiyonası — Budapeşte, 14:30 yerel saat.
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold shadow-lg transition-all"
                  style={{ color: C.blue }}
                >
                  <Radio className="h-4 w-4" />
                  Canlı İzle
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all"
                >
                  <Eye className="h-4 w-4" />
                  Profil
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── KPI STRIP ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mb-5 grid grid-cols-3 gap-4"
          >
            {[
              { icon: Users,       label: "Takip ettiğin sporcu", val: followCount,  suffix: "",   color: C.blue, bgColor: "from-blue-50 to-indigo-50/60"   },
              { icon: Calendar,    label: "Bu hafta etkinlik",     val: eventCount,   suffix: "",   color: "#059669", bgColor: "from-emerald-50 to-teal-50/60" },
              { icon: TrendingUp,  label: "Toplam destek",         val: supportMoney, suffix: " ₺", color: "#d97706", bgColor: "from-amber-50 to-orange-50/60" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={up}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                className="relative overflow-hidden rounded-2xl p-4 transition-all"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.bgColor} opacity-60`} />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <s.icon className="h-5 w-5" style={{ color: s.color }} strokeWidth={1.8} />
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-30" style={{ color: s.color }} />
                  </div>
                  <p className="font-display text-2xl font-bold leading-none" style={{ color: C.navy }}>
                    {s.val.toLocaleString("tr-TR")}{s.suffix}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium" style={{ color: C.muted }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── MAIN GRID ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid gap-4 lg:grid-cols-[1fr_1fr_300px]"
          >

            {/* ── COL 1 ── */}
            <div className="space-y-4">

              {/* Featured Athletes */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: C.navy }}>Öne Çıkan Sporcular</h2>
                    <p className="text-[11px]" style={{ color: C.muted }}>Bu hafta sahneye çıkanlar</p>
                  </div>
                  <motion.button whileHover={{ x: 2 }} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.blue }}>
                    Tümü <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {featuredAthletes.map((a, i) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "3/4" }}>
                        <img src={a.img} alt={a.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-108" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">{a.rank}</span>
                        </div>
                        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow">
                            <ArrowUpRight className="h-3 w-3" style={{ color: C.blue }} />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] font-bold leading-tight" style={{ color: C.navy }}>{a.name}</p>
                      <p className="text-[10px]" style={{ color: C.muted }}>{a.branch}</p>
                      <p className="text-[10px] font-medium" style={{ color: C.blue }}>{a.supporters.toLocaleString("tr-TR")} destekçi</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all"
                        style={{ border: `1.5px solid oklch(0.52 0.22 252 / 0.22)`, color: C.blue, background: C.blueSoft }}
                      >
                        Profili Gör
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Supported Athletes */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: C.navy }}>Desteklediğin Sporcular</h2>
                  <motion.button whileHover={{ x: 2 }} className="text-xs font-semibold" style={{ color: C.blue }}>
                    Tümü →
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {supported.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <img src={s.img} alt={s.name} className="h-10 w-10 rounded-xl object-cover object-top" style={{ boxShadow: `0 0 0 2px ${C.white}, 0 0 0 3px ${C.border}` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold truncate" style={{ color: C.navy }}>{s.name}</p>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-[10px] font-semibold text-emerald-500">{s.trend}</span>
                            <span className="text-xs font-bold" style={{ color: C.blue }}>%{s.pct}</span>
                          </div>
                        </div>
                        <p className="text-[10px] mb-1.5" style={{ color: C.muted }}>{s.branch}</p>
                        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: `oklch(0.22 0.055 240 / 0.08)` }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.sky})` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── COL 2 ── */}
            <div className="space-y-4">

              {/* Today's Matches */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: C.navy }}>Bugünün Maçları</h2>
                    <p className="text-[11px]" style={{ color: C.muted }}>17 Mayıs 2026</p>
                  </div>
                  <motion.button whileHover={{ x: 2 }} className="text-xs font-semibold" style={{ color: C.blue }}>
                    Tümü →
                  </motion.button>
                </div>
                <div className="space-y-2.5">
                  {todayMatches.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.09 }}
                      whileHover={{ scale: 1.01, x: 2 }}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all"
                      style={{ background: m.live ? `oklch(0.52 0.22 252 / 0.04)` : C.bg, border: `1.5px solid ${m.live ? `oklch(0.52 0.22 252 / 0.18)` : C.border}` }}
                    >
                      <span className="w-10 shrink-0 text-xs font-bold tabular-nums" style={{ color: m.live ? C.blue : C.muted }}>{m.time}</span>
                      <span className="text-xl shrink-0">{m.sport}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: C.navy }}>{m.home}</p>
                        <p className="text-[10px] truncate" style={{ color: C.muted }}>{m.away}</p>
                      </div>
                      {m.live ? (
                        <div className="shrink-0 flex items-center gap-1.5">
                          <span className="font-bold text-xs" style={{ color: C.navy }}>{m.score}</span>
                          <span className="flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white/70" />
                            Canlı
                          </span>
                        </div>
                      ) : (
                        <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}>
                          {m.status}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Discover Mode */}
              <motion.div
                variants={up}
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-2xl p-5 cursor-pointer"
                style={{ background: `linear-gradient(135deg, oklch(0.94 0.025 232), oklch(0.97 0.016 225))`, border: `1.5px solid oklch(0.52 0.22 252 / 0.15)` }}
              >
                <div className="pointer-events-none absolute -right-6 -bottom-6 text-[90px] select-none opacity-80 drop-shadow-xl">🎯</div>
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <Compass className="h-4 w-4" style={{ color: C.blue }} />
                    <h2 className="text-sm font-bold" style={{ color: C.navy }}>Keşfet Modu</h2>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{ color: C.blue }}>YENİ</span>
                  </div>
                  <p className="max-w-[200px] text-xs leading-relaxed" style={{ color: C.muted }}>
                    Yeni sporları keşfet, etkinliklere katıl ve kendini geliştir.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all"
                    style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.sky})`, boxShadow: `0 6px 20px ${C.blue}35` }}
                  >
                    Keşfetmeye Başla <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <h2 className="mb-3.5 text-sm font-bold" style={{ color: C.navy }}>Hızlı Eylemler</h2>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((a, i) => (
                    <motion.button
                      key={a.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex flex-col items-center gap-2 rounded-xl p-3.5 text-xs font-semibold transition-all ${a.color}`}
                      style={{ border: `1px solid currentColor`, borderColor: "transparent" }}
                    >
                      <a.icon className="h-5 w-5" strokeWidth={1.8} />
                      {a.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── COL 3 ── */}
            <div className="space-y-4">

              {/* Upcoming Events */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: C.navy }}>Yakındaki Etkinlikler</h2>
                  <motion.button whileHover={{ x: 2 }} className="text-xs font-semibold" style={{ color: C.blue }}>
                    Tümü →
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {events.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.09 }}
                      whileHover={{ x: 3 }}
                      className="flex gap-3 cursor-pointer group"
                    >
                      <div className="flex w-11 shrink-0 flex-col items-center justify-center rounded-xl py-2 text-center"
                        style={{ background: C.blueSoft, border: `1px solid oklch(0.52 0.22 252 / 0.18)` }}
                      >
                        <span className="font-display text-base font-bold leading-none" style={{ color: C.blue }}>{e.day}</span>
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: `oklch(0.52 0.22 252 / 0.65)` }}>{e.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-[11px] font-bold leading-tight group-hover:text-blue-600 transition-colors" style={{ color: C.navy }}>{e.title}</p>
                          {e.hot && <span className="shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-500">HOT</span>}
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px]" style={{ color: C.muted }}>
                          <span>{e.sport}</span>
                          {e.tags}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievement Badge */}
              <motion.div
                variants={up}
                className="relative overflow-hidden rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <h2 className="text-sm font-bold" style={{ color: C.navy }}>İlk Adım Rozeti</h2>
                    </div>
                    <p className="text-[11px] font-medium" style={{ color: C.muted }}>3 / 5 görev tamamlandı</p>

                    <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: `oklch(0.22 0.055 240 / 0.08)` }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.sky})` }}
                      />
                    </div>
                    <p className="mt-2.5 text-[10px] leading-relaxed" style={{ color: C.muted }}>
                      Devam et, spor yolculuğunu bir adım daha ileri taşı!
                    </p>
                  </div>

                  <motion.div
                    animate={{
                      rotate: [0, 8, -8, 0],
                      y: [0, -4, 0],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    className="relative shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.sky})`, boxShadow: `0 8px 24px ${C.blue}40` }}
                  >
                    <Shield className="h-7 w-7 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow-md"
                    >
                      <Star className="h-3 w-3 text-white fill-white" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* task checklist */}
                <div className="mt-4 space-y-2">
                  {[
                    { label: "İlk sporcunu takip et",    done: true  },
                    { label: "Canlı maç izle",            done: true  },
                    { label: "Destek ver",                done: true  },
                    { label: "Etkinliğe katıl",           done: false },
                    { label: "5 sporcu keşfet",           done: false },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${t.done ? "bg-emerald-400" : "border"}`}
                        style={t.done ? {} : { borderColor: C.border }}>
                        {t.done && "✓"}
                      </div>
                      <p className={`text-[11px] ${t.done ? "line-through" : ""}`} style={{ color: t.done ? C.muted : C.navy }}>{t.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trending */}
              <motion.div
                variants={up}
                className="rounded-2xl p-5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <h2 className="text-sm font-bold" style={{ color: C.navy }}>Trend Branşlar</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Okçuluk 🏹", "Voleybol 🏐", "Atletizm 🏃", "Eskrim ⚔️", "Yelken ⛵", "Tekvando 🥋"].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all"
                      style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.muted }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
