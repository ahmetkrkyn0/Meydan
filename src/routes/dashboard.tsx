import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Sparkles,
  Trophy,
  HeartHandshake,
  Calendar,
  MapPin,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Users,
  Flame,
  Compass,
} from "lucide-react";
import { Navbar } from "@/components/meydan/Navbar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Ana Sahne — Meydan" },
      {
        name: "description",
        content:
          "Takip ettiğin sporcular, yaklaşan etkinlikler, canlı maçlar ve sana özel keşif önerileri tek meydanda.",
      },
      { property: "og:title", content: "Ana Sahne — Meydan" },
      {
        property: "og:description",
        content: "Sessiz tezahürat, mikro sponsorluk ve günlük sporcu hikâyeleri.",
      },
    ],
  }),
});

const followed = [
  { name: "Ada Yıldız", branch: "Okçuluk", city: "İzmir", live: false, accent: "var(--violet)" },
  { name: "Kerem Demir", branch: "Eskrim", city: "Ankara", live: true, accent: "var(--coral)" },
  { name: "Lina Aksoy", branch: "Atletizm", city: "İstanbul", live: false, accent: "var(--sky)" },
  { name: "Mert Uçar", branch: "Yelken", city: "Bodrum", live: false, accent: "var(--indigo-soft)" },
];

const upcoming = [
  {
    date: "03 Haz",
    time: "10:30",
    title: "Akdeniz Açık — Okçuluk Finali",
    city: "Mersin",
    athlete: "Ada Yıldız",
  },
  {
    date: "05 Haz",
    time: "19:00",
    title: "Türkiye Eskrim Kupası — Yarı Final",
    city: "Ankara",
    athlete: "Kerem Demir",
  },
  {
    date: "11 Haz",
    time: "16:45",
    title: "Balkan Atletizm — 1500m",
    city: "Sofya",
    athlete: "Lina Aksoy",
  },
];

const live = [
  {
    sport: "Eskrim",
    title: "Kerem Demir vs. M. Petrov",
    score: "12 — 9",
    round: "Tour de 16 · 2. tur",
    momentum: 78,
  },
  {
    sport: "Yüzme",
    title: "200m Karışık — Final",
    score: "Şu an: Sıra 3",
    round: "Heat 2 · 120m",
    momentum: 54,
  },
];

const discover = [
  { name: "Naz Erol", branch: "Kaya Tırmanışı", reason: "İzmir + 'Disiplin' değerleriyle uyumlu" },
  { name: "Onur Çelik", branch: "Tekvando", reason: "Takip ettiğin Ada Yıldız ile aynı kulüp" },
  { name: "Ezgi Kara", branch: "Yelken", reason: "Bu hafta öne çıkanlar" },
];

function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora">
      <Navbar />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[55%] light-rays opacity-40" />
        <div className="absolute inset-0 grid-dots opacity-[0.06]" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
        {/* Hero greeting */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong ring-glow relative overflow-hidden rounded-3xl p-6 sm:p-9"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--violet), transparent 70%)" }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-[var(--violet)]" />
                Bugün meydanda
              </p>
              <h1 className="font-display text-3xl leading-[1.1] sm:text-5xl">
                <span className="text-gradient">Merhaba, Selin.</span>{" "}
                <span className="text-gradient-violet">2 sporcun bugün sahnede.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Ada Yıldız 10:30'da, Kerem Demir 19:00'da. Sessiz tezahürat mesajını şimdiden hazırla.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors hover:bg-foreground/10">
                <Search className="h-4 w-4" /> Keşfet
              </button>
              <button className="relative glass inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-foreground/10">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--coral)]" />
              </button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Users, k: "Takip", v: "12 sporcu" },
              { icon: HeartHandshake, k: "Bu ay destek", v: "₺ 420" },
              { icon: Flame, k: "Tezahürat", v: "38 mesaj" },
              { icon: TrendingUp, k: "Etki skoru", v: "+24%" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] p-4"
              >
                <s.icon className="mb-2 h-4 w-4 text-[var(--violet)]" />
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                <p className="font-display text-lg">{s.v}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Canlı */}
          <Card title="Şu An Canlı" icon={Radio} accent="var(--coral)">
            <div className="space-y-3">
              {live.map((m) => (
                <div
                  key={m.title}
                  className="group rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] p-4 transition-colors hover:border-[var(--coral)]/60"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--coral)]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--coral)] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                      </span>
                      Canlı · {m.sport}
                    </span>
                    <span className="text-xs text-muted-foreground">{m.round}</span>
                  </div>
                  <p className="font-display text-base">{m.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.score}</p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.momentum}%` }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--sky)] via-[var(--violet)] to-[var(--coral)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Takip edilen sporcular */}
          <Card title="Sporcularım" icon={Trophy} accent="var(--violet)">
            <div className="space-y-2.5">
              {followed.map((a) => (
                <Link
                  key={a.name}
                  to="/sporcu"
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] p-3 transition-colors hover:border-foreground/30 hover:bg-foreground/5"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm"
                    style={{
                      background: `color-mix(in oklab, ${a.accent} 22%, transparent)`,
                      color: "var(--foreground)",
                      border: `1px solid color-mix(in oklab, ${a.accent} 50%, transparent)`,
                    }}
                  >
                    {a.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.branch} · {a.city}
                    </p>
                  </div>
                  {a.live ? (
                    <span className="text-[10px] uppercase tracking-wider text-[var(--coral)]">
                      ● Canlı
                    </span>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </Link>
              ))}
            </div>
          </Card>

          {/* Yaklaşan etkinlikler */}
          <Card title="Yaklaşan" icon={Calendar} accent="var(--sky)">
            <div className="space-y-3">
              {upcoming.map((e) => (
                <div
                  key={e.title}
                  className="rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-[var(--sky)]/40 bg-[color-mix(in_oklab,var(--sky)_15%,transparent)] text-center">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {e.date.split(" ")[1]}
                      </span>
                      <span className="font-display text-base leading-none">
                        {e.date.split(" ")[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">{e.title}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {e.city} · {e.time}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{e.athlete}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Keşfet + Sessiz tezahürat CTA */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card title="Sana Önerilen" icon={Compass} accent="var(--indigo-soft)">
            <div className="grid gap-3 sm:grid-cols-3">
              {discover.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] p-4 transition-colors hover:border-[var(--violet)]/60"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
                    style={{
                      background: "radial-gradient(circle, var(--violet), transparent 70%)",
                    }}
                  />
                  <p className="font-display text-base">{d.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{d.branch}</p>
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-[var(--violet)]">AI · </span>
                    {d.reason}
                  </p>
                  <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline">
                    Profili gör <ArrowUpRight className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="glass-strong relative overflow-hidden rounded-3xl p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at bottom right, color-mix(in oklab, var(--coral) 40%, transparent), transparent 60%)",
              }}
            />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                Sessiz Tezahürat
              </p>
              <h3 className="mt-4 font-display text-2xl leading-tight">
                Bugün <span className="text-gradient-violet">Ada</span> için bir cümle bırak.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Maç anında AI özetiyle sporcuya ulaşır. Ses değil, niyet.
              </p>
              <Link
                to="/sporcu"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-transform hover:scale-[1.02]"
              >
                Mesaj yaz
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: typeof Trophy;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-base">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: `color-mix(in oklab, ${accent} 18%, transparent)`,
              border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
            }}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          {title}
        </h2>
        <button className="text-xs text-muted-foreground hover:text-foreground">Tümü</button>
      </div>
      {children}
    </motion.section>
  );
}
