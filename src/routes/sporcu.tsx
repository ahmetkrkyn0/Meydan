import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  MapPin,
  Trophy,
  Users,
  HeartHandshake,
  MessageCircle,
  UserPlus,
  Calendar,
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  Quote,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/meydan/Navbar";

const Footer = lazy(() =>
  import("@/components/meydan/Footer").then((m) => ({ default: m.Footer })),
);

export const Route = createFileRoute("/sporcu")({
  component: SporcuPage,
  head: () => ({
    meta: [
      { title: "Ada Yıldız — Sporcu Kartı | Meydan" },
      {
        name: "description",
        content:
          "Ada Yıldız'ın Meydan profili: sıralama, yolculuk, günlük ve destekçi topluluğu. Futbol dışı sporcuların dijital kimliği.",
      },
      { property: "og:title", content: "Ada Yıldız — Sporcu Kartı | Meydan" },
      {
        property: "og:description",
        content: "Türkiye 8. / Dünya 247. — Ada Yıldız'ın hikâyesi Meydan'da.",
      },
    ],
  }),
});

// — Demo data — production'da loader/CMS'den gelecek —
const athlete = {
  name: "Ada Yıldız",
  branch: "Okçuluk · Recurve",
  age: 22,
  city: "İzmir",
  rankTR: 8,
  rankWorld: 247,
  followers: "12.4K",
  supporters: 384,
  values: ["Disiplin", "Eğitim", "Aile"],
  bio: "Sabahın körü ile başlar gün. Yay, nefes ve hedef. Üçü hizalandığında dünya susar.",
};

const recentMatches = [
  { date: "12 May 2026", event: "Avrupa Kupası — Antalya", result: "2.", score: "684 puan", win: true },
  { date: "28 Nis 2026", event: "Türkiye Şampiyonası — Ankara", result: "1.", score: "692 puan", win: true },
  { date: "14 Nis 2026", event: "Dünya Kupası Elemesi — Berlin", result: "9.", score: "671 puan", win: false },
];

const upcoming = {
  date: "03 Haz 2026",
  time: "10:30",
  event: "Akdeniz Açık — Mersin",
  venue: "Mersin Olimpik Tesisleri",
  city: "Mersin",
};

const journey = [
  {
    year: 2009,
    age: 5,
    title: "İlk yay",
    story: "Babamın garajında kendi yaptığı tahta yayla başladım. Hedef kapı, ok ise bir çubuktu.",
  },
  {
    year: 2014,
    age: 10,
    title: "Kulüp günleri",
    story: "İzmir Okçuluk Kulübü'ne yazıldım. İlk antrenörüm Pelin Hoca, hâlâ her maç öncesi arar.",
  },
  {
    year: 2018,
    age: 14,
    title: "İlk Türkiye derecesi",
    story: "Yıldızlar kategorisinde 3. oldum. O madalyayı hâlâ yastığımın altında saklarım.",
  },
  {
    year: 2022,
    age: 18,
    title: "Milli takım",
    story: "A Milli Takım'a seçildim. Avrupa Şampiyonası'nda takımla bronz.",
  },
  {
    year: 2025,
    age: 21,
    title: "Dünya 247.",
    story: "Dünya sıralamasında ilk kez 250'nin içine girdim. Yeni hedef: 100.",
  },
];

const diary = [
  {
    date: "12 May 2026",
    note: "Final atışında rüzgâr sağdan vurdu. Sapmadım. İlk kez nefesimi tutmadım — bıraktım.",
  },
  {
    date: "28 Nis 2026",
    note: "Annem tribündeydi. Son oku attığımda gözlerini kapatmış. Açtığında altın vardı.",
  },
  {
    date: "14 Nis 2026",
    note: "Berlin soğuktu, ellerim tutmadı. Bu da bir ders. Geri dön, daha sert çalış.",
  },
];

function SporcuPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="pt-24">
          <Hero />
          <ValueMap />
          <RecentMatches />
          <UpcomingEvent />
          <Journey />
          <Diary />
          <Social />
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-20 bg-aurora opacity-90" />
      <div className="absolute inset-x-0 top-0 -z-10 h-full light-rays opacity-40" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/40 px-3 py-1 text-xs text-foreground/85 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
          Sporcu Kartı
        </motion.div>

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="glass-strong relative overflow-hidden rounded-3xl">
              <div
                className="aspect-[4/5] w-full bg-gradient-to-br from-violet/40 via-indigo/30 to-sky/20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--violet) 60%, transparent), transparent 55%), radial-gradient(circle at 70% 80%, color-mix(in oklab, var(--sky) 50%, transparent), transparent 55%)",
                }}
              >
                <div className="flex h-full items-end p-8">
                  <div className="font-display text-7xl text-foreground/90">AY</div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Identity */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-violet">{athlete.branch}</p>
            <h1 className="font-display mt-3 text-5xl leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
              {athlete.name.split(" ")[0]}{" "}
              <span className="text-gradient-violet italic">{athlete.name.split(" ")[1]}</span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {athlete.city}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>{athlete.age} yaş</span>
            </div>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {athlete.bio}
            </p>

            {/* Rank cards */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
              <RankCard label="Türkiye" rank={athlete.rankTR} accent="violet" />
              <RankCard label="Dünya" rank={athlete.rankWorld} accent="sky" />
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Badge icon={Users} text={`${athlete.followers} takipçi`} />
              <Badge icon={HeartHandshake} text={`${athlete.supporters} destekçi`} />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2 pl-2 pr-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-indigo text-foreground">
                  <UserPlus className="h-4 w-4" />
                </span>
                Takip et
              </button>
              <button className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-foreground/5">
                <MessageCircle className="h-4 w-4" />
                Mesaj gönder
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RankCard({ label, rank, accent }: { label: string; rank: number; accent: "violet" | "sky" }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl px-5 py-4">
      <div
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${
          accent === "violet" ? "bg-violet/40" : "bg-sky/40"
        }`}
      />
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-display text-3xl text-foreground sm:text-4xl">{rank}.</span>
        <span className="text-xs text-muted-foreground">sıra</span>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-foreground/90">
      <Icon className="h-3.5 w-3.5 text-violet" /> {text}
    </span>
  );
}

/* ============ VALUE MAP ============ */
function ValueMap() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-violet">
              <Sparkles className="h-3.5 w-3.5" /> AI · Değer Haritası
            </p>
            <h2 className="font-display mt-4 text-3xl leading-[1.05] text-foreground sm:text-5xl">
              Bu sporcunun <span className="text-gradient-violet italic">duruşu.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Maç notlarından, röportajlardan ve sahadaki davranışlardan damıtılmış üç değer.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {athlete.values.map((v, i) => (
            <motion.div
              key={v}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-strong group relative overflow-hidden rounded-3xl p-6"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/20 blur-3xl transition-all group-hover:bg-violet/40" />
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/40 to-indigo/10">
                  <span className="font-display text-sm text-foreground">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="font-display text-2xl text-foreground">{v}</span>
              </div>
              <div className="mt-5 h-px w-10 bg-gradient-to-r from-violet to-transparent transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ RECENT MATCHES ============ */
function RecentMatches() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Son üç maç"
          title={
            <>
              Sahadaki <span className="text-gradient-violet italic">son üç hikâye.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-3">
          {recentMatches.map((m, i) => (
            <motion.div
              key={m.date}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass group flex items-center gap-6 rounded-2xl p-5"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl ${
                  m.win
                    ? "bg-gradient-to-br from-violet/40 to-indigo/20 text-foreground"
                    : "bg-foreground/10 text-muted-foreground"
                }`}
              >
                {m.result}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium text-foreground">{m.event}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {m.date} · {m.score}
                </p>
              </div>
              <Trophy
                className={`h-4 w-4 shrink-0 transition-colors ${
                  m.win ? "text-violet" : "text-muted-foreground/40"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ UPCOMING ============ */
function UpcomingEvent() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
        >
          <div className="absolute inset-0 -z-10 bg-aurora opacity-50" />
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="glass flex flex-col items-center justify-center rounded-2xl p-6">
                <Calendar className="mb-3 h-5 w-5 text-violet" />
                <p className="font-display text-3xl text-foreground">
                  {upcoming.date.split(" ")[0]}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {upcoming.date.split(" ")[1]} {upcoming.date.split(" ")[2]}
                </p>
                <p className="mt-2 text-sm text-foreground/90">{upcoming.time}</p>
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-[0.28em] text-sky">Yaklaşan etkinlik</p>
              <h3 className="font-display mt-3 text-3xl leading-tight text-foreground sm:text-4xl">
                {upcoming.event}
              </h3>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {upcoming.venue}, {upcoming.city}
              </p>
            </div>
            <div className="md:col-span-3">
              <button className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95">
                Sessiz Tezahürat
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ JOURNEY (TIMELINE) ============ */
function Journey() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Sporcu Yolculuğu"
          title={
            <>
              Beş yaşındaki bir çocuktan{" "}
              <span className="text-gradient-violet italic">dünya 247.'sine.</span>
            </>
          }
        />

        <div className="relative mt-14">
          {/* Vertical line */}
          <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-violet/60 via-foreground/15 to-transparent sm:left-1/2" />

          <ol className="space-y-10">
            {journey.map((j, i) => (
              <motion.li
                key={j.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.05 * i }}
                className={`relative grid gap-4 sm:grid-cols-2 sm:gap-12 ${
                  i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Dot */}
                <span className="absolute left-4 top-2 -translate-x-1/2 sm:left-1/2">
                  <span className="absolute inset-0 -m-2 rounded-full bg-violet/30 blur-md" />
                  <span className="relative block h-3 w-3 rounded-full bg-gradient-to-br from-violet to-indigo" />
                </span>

                <div className={`pl-10 sm:pl-0 ${i % 2 === 1 ? "sm:text-left" : "sm:text-right"}`}>
                  <p className="font-display text-4xl text-foreground sm:text-5xl">{j.year}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-violet">
                    {j.age} yaşında
                  </p>
                </div>

                <div className="pl-10 sm:pl-0">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-display text-2xl text-foreground">{j.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{j.story}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ============ DIARY ============ */
function Diary() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50%] bg-gradient-to-b from-violet/10 to-transparent blur-2xl" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Sporcu Günlüğü"
          title={
            <>
              Maç bitti, <span className="text-gradient-violet italic">defter açıldı.</span>
            </>
          }
          desc="Her maçtan sonra sporcunun kendi kelimeleriyle bıraktığı kısa notlar."
        />
        <div className="mt-12 space-y-5">
          {diary.map((d, i) => (
            <motion.figure
              key={d.date}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-strong relative overflow-hidden rounded-3xl p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-violet/30" />
              <blockquote className="font-display text-xl leading-snug text-foreground sm:text-2xl">
                "{d.note}"
              </blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {d.date}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SOCIAL ============ */
function Social() {
  const socials = [
    { icon: Instagram, label: "Instagram", handle: "@ada.yildiz" },
    { icon: Youtube, label: "YouTube", handle: "Ada Yıldız" },
    { icon: Twitter, label: "X", handle: "@adayildiz" },
  ];
  return (
    <section className="relative pb-28 pt-12 sm:pb-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-violet">Sosyal</p>
          <h3 className="font-display mt-3 text-2xl text-foreground sm:text-3xl">
            Sahanın dışında da takipte kal.
          </h3>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                className="glass group flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-foreground/5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet/30 to-indigo/10">
                    <s.icon className="h-4 w-4 text-foreground" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.handle}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ shared ============ */
function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="flex flex-wrap items-end justify-between gap-6"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-violet">{eyebrow}</p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl leading-[1.05] text-foreground sm:text-5xl">
          {title}
        </h2>
      </div>
      {desc && <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{desc}</p>}
    </motion.div>
  );
}
