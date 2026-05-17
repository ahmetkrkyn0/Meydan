import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { needs, type Need } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar")({
  component: NeedsPage,
  head: () => ({ meta: [{ title: "İhtiyaçlarım — Sporcu Paneli" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

type Tab = "all" | "active" | "completed";

function NeedsPage() {
  const myNeeds: Need[] = needs.slice(0, 4).map((n, i) => ({
    ...n,
    athleteSlug: "mete-gazoz",
    athleteName: "Mete Gazoz",
    urgent: i === 0,
  }));

  const [tab, setTab] = useState<Tab>("all");

  const list = tab === "all" ? myNeeds : tab === "active" ? myNeeds.slice(0, 3) : myNeeds.slice(3);

  const totalCollected = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.collectedAmount ?? 0), 0);
  const totalTarget = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.targetAmount ?? 0), 0);

  return (
    <AppShell role="athlete" userName="Mete Gazoz" userCity="İstanbul">
      {/* Swiss surface — pure white, hard rules, mono accents */}
      <div className="-mx-5 -my-6 min-h-screen bg-white sm:-mx-8 sm:-my-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-12 sm:py-16"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {/* ── Top meta bar ── */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between border-b border-[color:var(--app-ink)] pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--app-ink)]"
          >
            <div className="flex items-center gap-4">
              <span>İhtiyaç Kartları</span>
              <span className="hidden text-[color:var(--app-ink-mute)] sm:inline">/ Sporcu Paneli</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[color:var(--app-ink-mute)]">N° 04</span>
              <span>2026.05</span>
            </div>
          </motion.div>

          {/* ── Headline grid: 12-col, asymmetric ── */}
          <motion.section
            variants={fadeUp}
            className="mt-10 grid grid-cols-12 items-end gap-6"
          >
            <h1
              className="col-span-12 text-[3.5rem] font-black leading-[0.92] tracking-[-0.02em] text-[color:var(--app-ink)] md:col-span-9 md:text-[5rem]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Topluluğa neye<br />
              ihtiyacın olduğunu<br />
              <span className="italic font-light">söyle.</span>
            </h1>
            <div className="col-span-12 md:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                İlke
              </div>
              <p className="mt-2 text-[13px] leading-[1.5] text-[color:var(--app-ink-soft)]">
                Para ya da yetenek. Açık olduğunda, yardım daha hızlı geliyor. Net ol, somut ol.
              </p>
            </div>
          </motion.section>

          {/* ── Stat row: hard rule above, mono labels, numeric data ── */}
          <motion.section
            variants={fadeUp}
            className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[color:var(--app-ink)] pt-8 sm:grid-cols-4"
          >
            {[
              { n: "01", k: "Aktif kart",       v: String(myNeeds.length).padStart(2, "0"), unit: "kart" },
              { n: "02", k: "Toplanan",         v: totalCollected.toLocaleString("tr-TR"),  unit: "₺" },
              { n: "03", k: "Hedef",            v: totalTarget.toLocaleString("tr-TR"),     unit: "₺" },
              { n: "04", k: "Yetenek başvuru",  v: "07",                                     unit: "kişi" },
            ].map((s) => (
              <div key={s.k} className="flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                    {s.n} —
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                    {s.unit}
                  </span>
                </div>
                <p
                  className="mt-3 text-[2.5rem] font-black leading-none tracking-[-0.02em] text-[color:var(--app-ink)]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {s.v}
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink)]">
                  {s.k}
                </p>
              </div>
            ))}
          </motion.section>

          {/* ── Toolbar: filter pills (rectangular, no chrome) + primary action ── */}
          <motion.section
            variants={fadeUp}
            className="mt-20 flex items-center justify-between border-b border-[color:var(--app-ink)] pb-3"
          >
            <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em]">
              <span className="text-[color:var(--app-ink-mute)]">Filtre</span>
              {(["all", "active", "completed"] as Tab[]).map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative pb-1 transition-colors ${
                      active ? "text-[color:var(--app-ink)]" : "text-[color:var(--app-ink-mute)] hover:text-[color:var(--app-ink)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="swiss-tab"
                        className="absolute -bottom-[14px] left-0 right-0 h-[3px] bg-violet"
                      />
                    )}
                    {t === "all" ? "Hepsi" : t === "active" ? "Aktif" : "Tamamlanan"}
                  </button>
                );
              })}
            </div>
            <Link
              to="/sporcu-panel/ihtiyac-olustur"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink)] hover:text-violet"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Yeni İhtiyaç Ekle
              <span className="inline-block h-[1px] w-6 bg-current transition-all group-hover:w-10" />
            </Link>
          </motion.section>

          {/* ── Needs list: rule-separated rows (no cards) ── */}
          <motion.section variants={fadeUp} className="mt-0">
            {list.map((n, i) => (
              <NeedRow key={n.id} n={n} index={i} />
            ))}
            {list.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
                  Bu sekmede ihtiyaç yok
                </p>
              </div>
            )}
          </motion.section>

          {/* ── Footer rule ── */}
          <motion.footer
            variants={fadeUp}
            className="mt-20 flex items-center justify-between border-t border-[color:var(--app-ink)] pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--app-ink-mute)]"
          >
            <span>Meydan / İhtiyaç Kartları</span>
            <span>{list.length} / {myNeeds.length}</span>
          </motion.footer>
        </motion.div>
      </div>
    </AppShell>
  );
}

function NeedRow({ n, index }: { n: Need; index: number }) {
  const pct = n.targetAmount && n.collectedAmount
    ? Math.round((n.collectedAmount / n.targetAmount) * 100)
    : 0;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="grid grid-cols-12 items-start gap-x-6 border-b border-[color:var(--app-line)] py-8 sm:py-10"
    >
      {/* Index number — large, mono, fades */}
      <div className="col-span-12 sm:col-span-1">
        <p className="font-mono text-[11px] tracking-[0.22em] text-[color:var(--app-ink-mute)]">
          № {num}
        </p>
      </div>

      {/* Title + description */}
      <div className="col-span-12 sm:col-span-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">
            {n.type === "money" ? "Para" : "Yetenek"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
            / {n.category}
          </span>
          {n.urgent && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
              / Acil
            </span>
          )}
        </div>
        <h3
          className="mt-2 text-[1.625rem] font-bold leading-[1.1] tracking-[-0.01em] text-[color:var(--app-ink)] sm:text-[2rem]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {n.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-[1.55] text-[color:var(--app-ink-soft)]">
          {n.description}
        </p>
      </div>

      {/* Metric / progress */}
      <div className="col-span-12 sm:col-span-3">
        {n.type === "money" && n.targetAmount ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
              Toplanan
            </p>
            <p
              className="mt-2 text-[1.75rem] font-black leading-none tracking-[-0.02em] text-[color:var(--app-ink)]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              ₺ {n.collectedAmount?.toLocaleString("tr-TR")}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-[color:var(--app-ink-mute)]">
              / ₺ {n.targetAmount?.toLocaleString("tr-TR")}
            </p>
            <div className="mt-3 h-[3px] w-full bg-[color:var(--app-line)]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-violet"
              />
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-violet">
              %{pct} TAMAMLANDI
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">
              Aranan
            </p>
            <p
              className="mt-2 text-[1.25rem] font-bold leading-tight text-[color:var(--app-ink)]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {n.talentNeeded}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-700">
              Yetenek bağışı
            </p>
          </>
        )}
      </div>

      {/* Meta + action */}
      <div className="col-span-12 flex flex-col items-start gap-3 sm:col-span-2 sm:items-end">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)] sm:text-right">
          <p>{n.city}</p>
          <p className="mt-1 text-[color:var(--app-ink)]">Son: {n.deadline}</p>
        </div>
        <button className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--app-ink)] hover:text-violet">
          Detay
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>
      </div>
    </motion.article>
  );
}
