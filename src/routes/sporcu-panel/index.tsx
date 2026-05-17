import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  Eye,
  Heart,
  Mail,
  Mic,
  Plus,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { brandOffers, needs } from "@/lib/mock-data";
import archeryFieldImg from "@/assets/okçulukalan.png";

export const Route = createFileRoute("/sporcu-panel/")({
  component: AthletePanelHome,
  head: () => ({ meta: [{ title: "Sporcu Paneli — Meydan" }] }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function AthletePanelHome() {
  const myNeeds = needs.filter((n) => n.athleteSlug === "mete-gazoz");
  const offers = brandOffers.slice(0, 2);

  const stats = [
    {
      label: "Profil görüntülenmesi",
      value: "4.2K",
      delta: "+18% bu hafta",
      icon: Eye,
      tone: "violet",
    },
    {
      label: "Takipçi",
      value: "12.4K",
      delta: "+124 bu hafta",
      icon: Users,
      tone: "indigo",
    },
    {
      label: "Aktif destekçi",
      value: "89",
      delta: "8 yeni",
      icon: Heart,
      tone: "coral",
    },
    {
      label: "Bekleyen marka teklifi",
      value: "3",
      delta: "1 yeni bugün",
      icon: Mail,
      tone: "sky",
    },
  ];

  const matchRecaps = [
    {
      id: "m1",
      title: "Avrupa Şampiyonası — Yarı Final",
      city: "Budapeşte",
      date: "12 May",
      score: "6-2",
      cheers: 1240,
    },
    {
      id: "m2",
      title: "Dünya Kupası 2. Tur",
      city: "Antalya",
      date: "06 May",
      score: "7-3",
      cheers: 870,
    },
  ];

  return (
    <AppShell role="athlete" userName="Mete Gazoz" userCity="İstanbul">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-16"
      >
        <motion.header
          variants={fadeUp}
          className="relative isolate overflow-hidden rounded-3xl"
        >
          {/* Sport background image — right side, fades left into cream */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <img
              src={archeryFieldImg}
              alt=""
              className="absolute inset-y-0 right-0 h-full w-[78%] object-cover object-center"
            />
            {/* Left-to-right gradient: solid cream → transparent (fade ends earlier so image stays crisp) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.985 0.005 90) 0%, oklch(0.985 0.005 90 / 0.98) 22%, oklch(0.985 0.005 90 / 0.55) 38%, oklch(0.985 0.005 90 / 0.05) 55%, transparent 70%)",
              }}
            />
            {/* Top + bottom soft fades — keep light so image stays visible */}
            <div
              className="absolute inset-x-0 top-0 h-10"
              style={{ background: "linear-gradient(to bottom, oklch(0.985 0.005 90 / 0.35), transparent)" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-10"
              style={{ background: "linear-gradient(to top, oklch(0.985 0.005 90 / 0.35), transparent)" }}
            />
          </div>

          <div className="flex flex-col gap-3 px-6 py-16 sm:px-10 sm:py-20 lg:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
              Sporcu paneli · İstanbul
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--app-ink)] sm:text-5xl">
              Hoş geldin <span className="italic text-violet">Mete</span>.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[color:var(--app-ink-soft)]">
              Bugün 312 yeni mesajın var. 3 yeni marka teklifi bekliyor — biri uzun süreli
              kampanya olabilir.
            </p>
          </div>
        </motion.header>

        <motion.section
          variants={fadeUp}
          className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 sm:grid-cols-4 sm:gap-x-12 sm:px-10"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold leading-none tracking-tight text-[color:var(--app-ink)]">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                {s.label}
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-violet">
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
                {s.delta}
              </p>
            </div>
          ))}
        </motion.section>

        {/* ─── HERO: Bu haftaki taraftar sesi (kartsız, editorial) ─── */}
        <motion.section variants={fadeUp} className="grid gap-8 px-6 sm:px-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
          {/* Sol: Sayı + AI özet */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-violet" strokeWidth={1.9} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">
                Bu haftaki taraftar sesi
              </p>
            </div>

            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              Sahnede <span className="italic text-violet">yalnız değilsin</span>.
            </h2>

            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <div>
                <p className="font-display text-5xl font-bold leading-none text-violet sm:text-6xl">
                  {matchRecaps.reduce((s, m) => s + m.cheers, 0).toLocaleString("tr-TR")}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  Sessiz tezahürat
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold leading-none text-[color:var(--app-ink)] sm:text-5xl">
                  {matchRecaps.length}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  Maç sonrası
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
              Bu haftaki mesajlarda <span className="font-semibold text-[color:var(--app-ink)]">sabır</span>,{" "}
              <span className="font-semibold text-[color:var(--app-ink)]">aile</span> ve{" "}
              <span className="font-semibold text-[color:var(--app-ink)]">Türkiye</span> kelimeleri öne çıktı.
              24 kişi sana özel bir not bıraktı.
            </p>
          </div>

          {/* Sağ: Maç özetleri listesi — divider ile, kartsız satırlar */}
          <div className="flex flex-col">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
              Son maçların
            </p>
            <ul className="divide-y divide-[color:var(--app-line)]">
              {matchRecaps.map((m) => (
                <li key={m.id}>
                  <Link
                    to="/tezahurat/$matchId/ozet"
                    params={{ matchId: m.id }}
                    className="group flex items-center gap-3 py-3 transition-colors hover:text-violet"
                  >
                    <span className="chip chip-violet shrink-0">{m.score}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[color:var(--app-ink)] group-hover:text-violet">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                        {m.date} · {m.city} · {m.cheers.toLocaleString("tr-TR")} tezahürat
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[color:var(--app-ink-mute)] transition-all group-hover:translate-x-0.5 group-hover:text-violet" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ─── ALT: Marka teklifleri + İhtiyaç kartları (2 kolon, dikey ayraç) ─── */}
        <motion.section variants={fadeUp} className="grid gap-8 px-6 sm:px-10 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[color:var(--app-line)]">
          {/* Marka teklifleri */}
          <div className="flex flex-col gap-3 lg:pr-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-display inline-flex items-center gap-2 text-lg font-bold text-[color:var(--app-ink)]">
                Marka teklifleri
                <Bell className="h-4 w-4 text-coral" strokeWidth={1.9} />
              </h2>
              <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                AI uyum skoruna göre dizildi · {offers.length} yeni
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {offers.map((o) => (
                <div key={o.id} className="soft-card flex flex-col gap-3 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky/14 font-display text-sm font-bold text-sky">
                      {o.brandName.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[color:var(--app-ink)]">
                        {o.brandName}
                      </p>
                      <p className="truncate text-[11px] text-[color:var(--app-ink-mute)]">
                        {o.brandSector}
                      </p>
                    </div>
                    <span className="chip chip-sky shrink-0">{o.fitScore}%</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-xl font-bold text-[color:var(--app-ink)]">
                      ₺ {o.amount.toLocaleString("tr-TR")}
                    </p>
                    <p className="text-[11px] text-[color:var(--app-ink-soft)]">{o.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/sporcu-panel/teklifler"
              className="btn-ghost-light inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            >
              Tümünü görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* İhtiyaç kartları */}
          <div className="flex flex-col gap-3 lg:pl-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-display inline-flex items-center gap-2 text-lg font-bold text-[color:var(--app-ink)]">
                İhtiyaç kartların
                <Wrench className="h-4 w-4 text-violet" strokeWidth={1.9} />
              </h2>
              <p className="text-[11px] text-[color:var(--app-ink-mute)]">
                Topluluk seni duyuyor · {myNeeds.length} aktif
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {myNeeds.slice(0, 2).map((n) => {
                const pct = n.targetAmount && n.collectedAmount
                  ? Math.round((n.collectedAmount / n.targetAmount) * 100)
                  : 0;
                return (
                  <div key={n.id} className="soft-card flex flex-col gap-2 rounded-2xl p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="chip chip-violet">{n.category}</span>
                      {n.urgent && <span className="chip chip-coral">acil</span>}
                    </div>
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-[color:var(--app-ink)]">
                      {n.title}
                    </p>
                    {n.type === "money" && n.targetAmount ? (
                      <>
                        <div className="mt-auto h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                          <div className="h-full rounded-full bg-violet" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-[color:var(--app-ink-soft)]">
                          %{pct} · son {n.deadline}
                        </p>
                      </>
                    ) : (
                      <p className="mt-auto text-[11px] text-[color:var(--app-ink-soft)]">
                        Yetenek aranıyor · {n.deadline}
                      </p>
                    )}
                  </div>
                );
              })}

              {myNeeds.length < 2 && (
                <Link
                  to="/sporcu-panel/ihtiyac-olustur"
                  className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--app-line)] bg-white/40 p-4 text-center transition-all hover:border-violet/40 hover:bg-violet/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet/12 text-violet transition-colors group-hover:bg-violet group-hover:text-white">
                    <Plus className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-[color:var(--app-ink)]">Yeni ihtiyaç</p>
                  <p className="text-[11px] text-[color:var(--app-ink-mute)]">Topluluğa söyle</p>
                </Link>
              )}
            </div>

            <Link
              to="/sporcu-panel/ihtiyaclar"
              className="btn-ghost-light inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            >
              Tümünü görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
