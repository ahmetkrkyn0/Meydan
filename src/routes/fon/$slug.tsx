import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Plane,
  Hotel,
  Ticket,
  Wrench,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { athleteBySlug, needs, supporters } from "@/lib/mock-data";

export const Route = createFileRoute("/fon/$slug")({
  component: FundPage,
  head: ({ params }) => ({
    meta: [{ title: `${athleteBySlug(params.slug).name} topluluk fonu — Meydan` }],
  }),
});

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const PRESETS = [50, 100, 250, 500, 1000];

const BREAKDOWN = [
  { icon: Plane,  label: "Uçak biletleri (2 yön)", amount: 4200 },
  { icon: Hotel,  label: "Otel · 3 gece",          amount: 2800 },
  { icon: Ticket, label: "Yarışma kayıt ücreti",   amount: 1200 },
  { icon: Wrench, label: "Yedek malzeme ve onarım", amount: 1000 },
];

const EXTRA_SUPPORTERS = [
  { id: "x1", name: "Ayşegül K.",  city: "İstanbul" },
  { id: "x2", name: "Burak Y.",    city: "İzmir" },
  { id: "x3", name: "Ela D.",      city: "Bursa" },
  { id: "x4", name: "Mert S.",     city: "İstanbul" },
  { id: "x5", name: "Selin A.",    city: "Ankara" },
  { id: "x6", name: "Hakan T.",    city: "Antalya" },
  { id: "x7", name: "Naz Ç.",      city: "İstanbul" },
  { id: "x8", name: "Onur P.",     city: "Eskişehir" },
];

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString("tr-TR"));
  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, motionValue]);
  return <motion.span>{rounded}</motion.span>;
}

function FundPage() {
  const { slug } = Route.useParams();
  const a = athleteBySlug(slug);

  const fund =
    needs.find((n) => n.athleteSlug === slug && n.type === "money") ??
    needs.find((n) => n.type === "money") ??
    needs[0];

  const collected = fund.collectedAmount ?? 9300;
  const target = fund.targetAmount ?? 14000;
  const pct = Math.min(100, Math.round((collected / target) * 100));

  const [contrib, setContrib] = useState<number>(100);

  return (
    <AppShell role="fan">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
          <Link
            to="/sporcu/$slug"
            params={{ slug: a.slug }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
          >
            ← Sporcuya dön
          </Link>
        </motion.div>

        <motion.header variants={fade} initial="hidden" animate="show" custom={1} className="flex flex-col gap-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">
            Topluluk Fonu · Hedef bazlı
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
            <span className="italic">{a.name}</span> için topluluk fonu
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-ink-soft)]">
            {fund.description}
          </p>
        </motion.header>

        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          custom={2}
          className="soft-card-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet/12 blur-3xl" />
          <div className="relative grid items-end gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                Toplanan / Hedef
              </p>
              <p className="mt-2 font-display text-5xl font-bold leading-none text-[color:var(--app-ink)] sm:text-6xl">
                ₺<AnimatedNumber value={collected} />
              </p>
              <p className="mt-2 text-sm text-[color:var(--app-ink-soft)]">
                hedef <span className="font-bold text-[color:var(--app-ink)]">₺{target.toLocaleString("tr-TR")}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-bold text-violet">%{pct}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[color:var(--app-ink-mute)]">
                tamamlandı
              </p>
            </div>
          </div>

          <div className="relative mt-6 h-3 overflow-hidden rounded-full bg-[color:var(--app-line)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
            />
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--app-ink-soft)]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" /> Açıldı 12 Mayıs
            </span>
            <span className="text-[color:var(--app-ink-mute)]">·</span>
            <span>Hedefin <b className="text-[color:var(--app-ink)]">%{pct}</b>'ine ulaştı</span>
            <span className="text-[color:var(--app-ink-mute)]">·</span>
            <span><b className="text-coral">18 gün</b> kaldı</span>
          </div>
        </motion.section>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-12">
            <motion.section variants={fade} initial="hidden" animate="show" custom={3}>
              <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">Bu para ne için?</h2>
              <p className="mt-1 text-sm text-[color:var(--app-ink-soft)]">
                Her kalem açıkça paylaşılır. Fiş ve makbuzlar fon kapandığında raporlanır.
              </p>
              <ul className="mt-5 divide-y divide-[color:var(--app-line-soft)] rounded-2xl bg-white/70">
                {BREAKDOWN.map((b) => (
                  <li key={b.label} className="flex items-center gap-4 px-5 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
                      <b.icon className="h-4 w-4" />
                    </span>
                    <p className="flex-1 text-sm font-medium text-[color:var(--app-ink)]">{b.label}</p>
                    <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
                      ₺{b.amount.toLocaleString("tr-TR")}
                    </p>
                  </li>
                ))}
                <li className="flex items-center justify-between px-5 py-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-[color:var(--app-ink-mute)]">Toplam hedef</p>
                  <p className="font-display text-lg font-bold text-violet">
                    ₺{BREAKDOWN.reduce((s, x) => s + x.amount, 0).toLocaleString("tr-TR")}
                  </p>
                </li>
              </ul>
            </motion.section>

            <motion.section variants={fade} initial="hidden" animate="show" custom={4}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                  <Users className="mr-2 inline h-4 w-4 text-violet" />
                  Destekçi duvarı
                </h2>
                <span className="text-xs text-[color:var(--app-ink-soft)]">
                  {supporters.length + EXTRA_SUPPORTERS.length} kişi
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {[...supporters, ...EXTRA_SUPPORTERS].map((s, idx) => {
                  const initials = s.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
                  const tones = ["bg-violet/15 text-violet", "bg-sky/15 text-sky", "bg-coral/15 text-coral", "bg-emerald-500/15 text-emerald-700"];
                  const tone = tones[idx % tones.length];
                  return (
                    <div key={s.id} className="group flex items-center gap-2 rounded-full border border-[color:var(--app-line-soft)] bg-white/80 py-1 pl-1 pr-3">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${tone}`}>
                        {initials}
                      </span>
                      <span className="truncate text-xs font-semibold text-[color:var(--app-ink)]">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          <motion.aside variants={fade} initial="hidden" animate="show" custom={5} className="lg:sticky lg:top-24">
            <div className="soft-card-strong rounded-3xl p-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-violet">Sen de katıl</p>
              <p className="mt-2 font-display text-lg font-bold text-[color:var(--app-ink)]">
                Tek seferlik katkı
              </p>
              <p className="mt-1 text-xs text-[color:var(--app-ink-soft)]">
                Hedefe ulaşılmazsa para iade edilir.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {PRESETS.map((p) => {
                  const active = contrib === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setContrib(p)}
                      className={`rounded-xl border bg-white py-2.5 text-sm font-bold transition-all ${
                        active
                          ? "border-violet/40 text-violet ring-2 ring-violet/30"
                          : "border-[color:var(--app-line)] text-[color:var(--app-ink-soft)] hover:border-violet/30"
                      }`}
                    >
                      ₺{p}
                    </button>
                  );
                })}
              </div>

              <button className="btn-primary-light mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
                ₺{contrib} katkıda bulun
              </button>

              <Link
                to="/desteklerim"
                className="mt-3 inline-flex w-full items-center justify-center gap-1 text-[11px] font-semibold text-[color:var(--app-ink-soft)] hover:text-violet"
              >
                Desteklerim sayfası <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </AppShell>
  );
}
