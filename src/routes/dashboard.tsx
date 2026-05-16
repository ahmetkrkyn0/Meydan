import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  ArrowRight,
  Home,
  Compass,
  MapPin,
  Radio,
  Users,
  Heart,
  User,
  ChevronDown,
  Star,
  Shield,
} from "lucide-react";
import adaImg from "@/assets/athlete-ada.jpg";
import keremImg from "@/assets/athlete-kerem.jpg";
import linaImg from "@/assets/athlete-lina.jpg";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Ana Sayfa — Meydan" }],
  }),
});

/* ── data ── */
const featuredAthletes = [
  { name: "Eray Şamdan", branch: "Atletizm", img: adaImg },
  { name: "Zeynep Güneş", branch: "Voleybol", img: keremImg },
  { name: "Mete Gazoz", branch: "Okçuluk", img: linaImg },
];

const todayMatches = [
  { time: "17:00", home: "Fenerbahçe", away: "Beşiktaş Dynavit", sport: "🏐", status: "Canlı", live: true },
  { time: "19:30", home: "Galatasaray", away: "Beşiktaş", sport: "⚽", status: "Yakında", live: false },
  { time: "20:00", home: "Anadolu Efes", away: "Pınar Karşıyaka", sport: "🏀", status: "Yakında", live: false },
];

const events = [
  { day: "25", month: "MAY", title: "İstanbul Yarı Maratonu", tags: "Koşu • İstanbul" },
  { day: "28", month: "MAY", title: "Okçuluk Başlangıç Atölyesi", tags: "Okçuluk • İstanbul" },
  { day: "01", month: "HAZ", title: "Ankara Basketbol Turnuvası", tags: "Basketbol • Ankara" },
];

const supported = [
  { name: "Eray Şamdan", branch: "Atletizm", pct: 74, img: adaImg },
  { name: "Zeynep Güneş", branch: "Voleybol", pct: 58, img: keremImg },
  { name: "Mete Gazoz", branch: "Okçuluk", pct: 81, img: linaImg },
];

const navItems = [
  { icon: Home,    label: "Ana Sayfa",         active: true },
  { icon: Compass, label: "Keşfet",             active: false },
  { icon: MapPin,  label: "Şehrimde Ne Var?",  active: false },
  { icon: Radio,   label: "Canlı Maçlar",      active: false },
  { icon: Users,   label: "Sporcular",          active: false },
  { icon: Heart,   label: "Desteklerim",        active: false },
  { icon: User,    label: "Profilim",           active: false },
];

/* ── stagger helpers ── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.975_0.012_228)] font-sans">

      {/* ════ SIDEBAR ════ */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-56 shrink-0 flex-col border-r border-[oklch(0.22_0.055_240/0.08)] bg-white"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.52_0.22_252)] text-white shadow-md shadow-[oklch(0.52_0.22_252/0.35)]">
            <span className="font-display text-base font-bold leading-none">M</span>
          </div>
          <span className="font-display text-xl font-bold text-[oklch(0.22_0.055_240)]">Meydan</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                item.active
                  ? "bg-[oklch(0.52_0.22_252/0.10)] text-[oklch(0.52_0.22_252)]"
                  : "text-[oklch(0.40_0.04_240)] hover:bg-[oklch(0.22_0.055_240/0.05)] hover:text-[oklch(0.22_0.055_240)]"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${item.active ? "text-[oklch(0.52_0.22_252)]" : "text-[oklch(0.55_0.04_240)]"}`} strokeWidth={item.active ? 2.2 : 1.8} />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* ════ MAIN ════ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex h-16 shrink-0 items-center gap-4 border-b border-[oklch(0.22_0.055_240/0.08)] bg-white px-6"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.55_0.04_240)]" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Sporcu, branş veya etkinlik ara"
              className="w-full rounded-xl border border-[oklch(0.22_0.055_240/0.10)] bg-[oklch(0.975_0.012_228)] py-2 pl-9 pr-4 text-sm text-[oklch(0.22_0.055_240)] placeholder:text-[oklch(0.55_0.04_240)] focus:border-[oklch(0.52_0.22_252/0.40)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.52_0.22_252/0.15)]"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[oklch(0.22_0.055_240/0.10)] bg-[oklch(0.975_0.012_228)] text-[oklch(0.40_0.04_240)] transition-colors hover:border-[oklch(0.52_0.22_252/0.25)] hover:text-[oklch(0.52_0.22_252)]">
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.52_0.22_252)]" />
            </button>

            {/* User */}
            <button className="flex items-center gap-2.5 rounded-xl border border-[oklch(0.22_0.055_240/0.10)] bg-[oklch(0.975_0.012_228)] px-2.5 py-1.5 transition-colors hover:border-[oklch(0.52_0.22_252/0.25)]">
              <img src={adaImg} alt="Mehmet" className="h-7 w-7 rounded-lg object-cover object-top" />
              <div className="text-left">
                <p className="text-xs font-semibold leading-none text-[oklch(0.22_0.055_240)]">Mehmet Kaya</p>
                <p className="mt-0.5 text-[10px] leading-none text-[oklch(0.55_0.04_240)]">İstanbul</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[oklch(0.55_0.04_240)]" />
            </button>
          </div>
        </motion.header>

        {/* ── CONTENT SCROLL ── */}
        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="font-display text-2xl font-bold text-[oklch(0.22_0.055_240)]">
              Hoş geldin, Mehmet! 👋
            </h1>
            <p className="mt-1 text-sm text-[oklch(0.50_0.05_238)]">Bugün sporda neler oluyor, hemen göz at.</p>
          </motion.div>

          {/* ── 3-COL GRID ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5 lg:grid-cols-[1fr_1fr_320px]"
          >

            {/* ── COL 1 ── */}
            <div className="space-y-5">

              {/* Öne Çıkan Sporcular */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[oklch(0.22_0.055_240)]">Öne Çıkan Sporcular</h2>
                  <button className="flex items-center gap-1 text-xs font-medium text-[oklch(0.52_0.22_252)] hover:underline">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {featuredAthletes.map((a) => (
                    <div key={a.name} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                        <img src={a.img} alt={a.name} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-[oklch(0.22_0.055_240)] leading-tight">{a.name}</p>
                      <p className="text-[10px] text-[oklch(0.55_0.04_240)]">{a.branch}</p>
                      <button className="mt-2 w-full rounded-lg border border-[oklch(0.22_0.055_240/0.14)] py-1 text-[11px] font-medium text-[oklch(0.22_0.055_240)] transition-colors hover:border-[oklch(0.52_0.22_252/0.40)] hover:text-[oklch(0.52_0.22_252)]">
                        Profili Gör
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Desteklediğin Sporcular */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[oklch(0.22_0.055_240)]">Desteklediğin Sporcular</h2>
                  <button className="flex items-center gap-1 text-xs font-medium text-[oklch(0.52_0.22_252)]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3.5">
                  {supported.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <img src={s.img} alt={s.name} className="h-9 w-9 rounded-full object-cover object-top ring-2 ring-white" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[oklch(0.22_0.055_240)] truncate">{s.name}</p>
                          <span className="text-xs font-bold text-[oklch(0.52_0.22_252)]">%{s.pct}</span>
                        </div>
                        <p className="text-[10px] text-[oklch(0.55_0.04_240)]">{s.branch}</p>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[oklch(0.22_0.055_240/0.08)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full bg-[oklch(0.52_0.22_252)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── COL 2 ── */}
            <div className="space-y-5">

              {/* Bugünün Maçları */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[oklch(0.22_0.055_240)]">Bugünün Maçları</h2>
                  <button className="flex items-center gap-1 text-xs font-medium text-[oklch(0.52_0.22_252)]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {todayMatches.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3 rounded-xl border border-[oklch(0.22_0.055_240/0.07)] bg-[oklch(0.975_0.012_228)] px-3.5 py-3"
                    >
                      <span className="w-10 text-xs font-semibold tabular-nums text-[oklch(0.50_0.05_238)]">{m.time}</span>
                      <span className="text-lg">{m.sport}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[oklch(0.22_0.055_240)] truncate">{m.home}</p>
                        <p className="text-[10px] text-[oklch(0.55_0.04_240)] truncate">{m.away}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        m.live
                          ? "bg-[oklch(0.60_0.20_16/0.12)] text-[oklch(0.55_0.22_16)]"
                          : "bg-[oklch(0.22_0.055_240/0.07)] text-[oklch(0.50_0.05_238)]"
                      }`}>
                        {m.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Keşfet Modu card */}
              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.92_0.025_240)] via-[oklch(0.95_0.018_232)] to-[oklch(0.97_0.012_225)] p-5 shadow-sm"
              >
                {/* decorative archery target */}
                <div className="pointer-events-none absolute -right-4 -bottom-4 text-[100px] select-none opacity-70">🎯</div>

                <h2 className="text-sm font-bold text-[oklch(0.22_0.055_240)]">Keşfet Modu</h2>
                <p className="mt-1.5 max-w-[180px] text-xs leading-relaxed text-[oklch(0.45_0.05_240)]">
                  Yeni sporları keşfet, etkinliklere katıl ve kendini geliştir.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[oklch(0.52_0.22_252)] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[oklch(0.52_0.22_252/0.30)]"
                >
                  Keşfetmeye Başla <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { icon: "👥", val: "12", label: "Takip ettiğin sporcu" },
                  { icon: "📅", val: "5",  label: "Bu hafta etkinlik"   },
                  { icon: "❤️", val: "21.300 ₺", label: "Toplam destek" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-4 shadow-sm text-center"
                  >
                    <div className="mb-2 flex justify-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.975_0.012_228)] text-lg">{s.icon}</span>
                    </div>
                    <p className="font-display text-lg font-bold leading-none text-[oklch(0.22_0.055_240)]">{s.val}</p>
                    <p className="mt-1 text-[10px] leading-tight text-[oklch(0.55_0.04_240)]">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── COL 3 ── */}
            <div className="space-y-5">

              {/* Yakındaki Etkinlikler */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[oklch(0.22_0.055_240)]">Yakındaki Etkinlikler</h2>
                  <button className="flex items-center gap-1 text-xs font-medium text-[oklch(0.52_0.22_252)]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {events.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[oklch(0.52_0.22_252/0.09)] py-2 text-center">
                        <span className="font-display text-sm font-bold leading-none text-[oklch(0.52_0.22_252)]">{e.day}</span>
                        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[oklch(0.52_0.22_252/0.70)]">{e.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[oklch(0.22_0.055_240)] group-hover:text-[oklch(0.52_0.22_252)] transition-colors leading-tight">{e.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[oklch(0.55_0.04_240)]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {e.tags}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* İlk Adım Rozeti */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-[oklch(0.22_0.055_240)]">İlk Adım Rozeti</h2>
                    <p className="mt-1 text-[11px] text-[oklch(0.55_0.04_240)]">3 / 5 görev tamamlandı</p>

                    {/* progress bar */}
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[oklch(0.22_0.055_240/0.08)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-[oklch(0.52_0.22_252)] to-[oklch(0.68_0.17_220)]"
                      />
                    </div>

                    <p className="mt-3 text-[11px] leading-relaxed text-[oklch(0.50_0.05_238)]">
                      Devam et, spor yolculuğunu bir adım daha ileri taşı!
                    </p>
                  </div>

                  {/* Badge icon */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.52_0.22_252)] to-[oklch(0.44_0.20_258)] shadow-lg shadow-[oklch(0.52_0.22_252/0.35)]"
                  >
                    <Shield className="h-6 w-6 text-white" />
                    <Star className="absolute h-3 w-3 text-yellow-300" style={{ marginTop: -16, marginLeft: 16 }} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick actions */}
              <motion.div variants={fadeUp} className="rounded-2xl border border-[oklch(0.22_0.055_240/0.08)] bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-[oklch(0.22_0.055_240)]">Hızlı Eylemler</h2>
                <div className="space-y-2">
                  {[
                    { icon: "🏆", label: "Sporcu Keşfet" },
                    { icon: "💰", label: "Destek Ver" },
                    { icon: "📍", label: "Yakındaki Maçlar" },
                  ].map((a) => (
                    <motion.button
                      key={a.label}
                      whileHover={{ x: 3 }}
                      className="flex w-full items-center gap-3 rounded-xl border border-[oklch(0.22_0.055_240/0.08)] px-3 py-2.5 text-left text-xs font-medium text-[oklch(0.40_0.04_240)] transition-colors hover:border-[oklch(0.52_0.22_252/0.25)] hover:bg-[oklch(0.52_0.22_252/0.05)] hover:text-[oklch(0.52_0.22_252)]"
                    >
                      <span className="text-base">{a.icon}</span>
                      {a.label}
                      <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-50" />
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
