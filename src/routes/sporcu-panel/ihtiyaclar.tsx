import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Plus, Wrench, Banknote, MapPin, Clock, AlertCircle, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { AppShell } from "@/components/meydan/AppShell";
import { needs, type Need } from "@/lib/mock-data";

export const Route = createFileRoute("/sporcu-panel/ihtiyaclar")({
  component: NeedsPage,
  head: () => ({ meta: [{ title: "İhtiyaçlarım — Sporcu Paneli" }] }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

type Tab = "all" | "active" | "completed";

function NeedsPage() {
  const myNeeds: Need[] = needs.slice(0, 4).map((n, i) => ({
    ...n,
    athleteSlug: "mete-gazoz",
    athleteName: "Mete Gazoz",
    urgent: i === 0,
  }));

  const [tab, setTab] = useState<Tab>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const list = tab === "all" ? myNeeds : tab === "active" ? myNeeds.slice(0, 3) : myNeeds.slice(3);

  const totalCollected = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.collectedAmount ?? 0), 0);
  const totalTarget = myNeeds
    .filter((n) => n.type === "money")
    .reduce((s, n) => s + (n.targetAmount ?? 0), 0);

  return (
    <AppShell role="athlete" userName="Mete Gazoz" userCity="İstanbul">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto flex w-full max-w-6xl flex-col gap-7"
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet">İhtiyaç kartlarım</p>
            <h1 className="font-display mt-1.5 text-3xl font-bold tracking-tight text-[color:var(--app-ink)] sm:text-4xl">
              Topluluğa neye ihtiyacın olduğunu söyle.
            </h1>
            <p className="mt-2 max-w-md text-sm text-[color:var(--app-ink-soft)]">
              Para ya da yetenek. Açık olduğunda yardım daha hızlı geliyor.
            </p>
          </div>
          <Link
            to="/sporcu-panel/ihtiyac-olustur"
            className="btn-primary-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Yeni İhtiyaç
          </Link>
        </motion.header>

        {/* Stat strip */}
        <motion.section
          variants={fadeUp}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { k: "Aktif kart",       v: String(myNeeds.length) },
            { k: "Toplanan",         v: `₺ ${totalCollected.toLocaleString("tr-TR")}` },
            { k: "Hedef",            v: `₺ ${totalTarget.toLocaleString("tr-TR")}` },
            { k: "Yetenek başvuru",  v: "7" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-[color:var(--app-line)] bg-white px-5 py-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[color:var(--app-ink-mute)]">{s.k}</p>
              <p className="font-display mt-2 text-3xl font-bold leading-none text-[color:var(--app-ink)]">{s.v}</p>
            </div>
          ))}
        </motion.section>

        {/* Tabs */}
        <motion.div variants={fadeUp} className="flex items-center gap-1.5 rounded-full border border-[color:var(--app-line)] bg-white p-1 self-start">
          {(["all", "active", "completed"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === t ? "text-white" : "text-[color:var(--app-ink-soft)] hover:text-[color:var(--app-ink)]"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="needs-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-[color:var(--app-ink)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {t === "all" ? "Hepsi" : t === "active" ? "Aktif" : "Tamamlanan"}
            </button>
          ))}
        </motion.div>

        {/* Need cards grid */}
        <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-2">
          {list.map((n) => {
            const pct = n.targetAmount && n.collectedAmount
              ? Math.round((n.collectedAmount / n.targetAmount) * 100)
              : 0;

            return (
              <motion.article
                key={n.id}
                variants={fadeUp}
                className="relative flex flex-col gap-3 rounded-3xl border border-[color:var(--app-line)] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`chip ${n.type === "money" ? "chip-violet" : "chip-emerald"}`}>
                      {n.type === "money" ? <Banknote className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                      {n.category}
                    </span>
                    {n.urgent && (
                      <span className="chip chip-coral">
                        <AlertCircle className="h-3 w-3" />
                        Acil
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === n.id ? null : n.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--app-ink-mute)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]"
                      aria-label="Menü"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === n.id && (
                      <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-[color:var(--app-line)] bg-white p-1 shadow-lg">
                        <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[color:var(--app-ink-soft)] hover:bg-[color:var(--app-line-soft)] hover:text-[color:var(--app-ink)]">
                          <Pencil className="h-3.5 w-3.5" /> Düzenle
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-coral hover:bg-coral/8">
                          <Trash2 className="h-3.5 w-3.5" /> Kapat
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold leading-tight text-[color:var(--app-ink)]">
                  {n.title}
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--app-ink-soft)]">
                  {n.description}
                </p>

                {n.type === "money" && (
                  <div className="mt-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-base font-bold text-[color:var(--app-ink)]">
                        ₺ {n.collectedAmount?.toLocaleString("tr-TR")}
                        <span className="ml-1 text-xs font-medium text-[color:var(--app-ink-mute)]">
                          / ₺ {n.targetAmount?.toLocaleString("tr-TR")}
                        </span>
                      </p>
                      <span className="text-xs font-semibold text-violet">%{pct}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--app-line-soft)]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, ease: EASE }}
                        className="h-full rounded-full bg-gradient-to-r from-violet to-sky"
                      />
                    </div>
                  </div>
                )}

                {n.type === "talent" && n.talentNeeded && (
                  <div className="mt-1 rounded-2xl border border-[color:oklch(0.70_0.16_152/0.20)] bg-[color:oklch(0.70_0.16_152/0.06)] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-[color:oklch(0.40_0.14_152)]">Aranan</p>
                    <p className="text-sm font-semibold text-[color:var(--app-ink)]">{n.talentNeeded}</p>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-[color:var(--app-line-soft)] pt-3 text-[11px] text-[color:var(--app-ink-mute)]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {n.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Son tarih: {n.deadline}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.section>

        {list.length === 0 && (
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-dashed border-[color:var(--app-line)] bg-white px-6 py-12 text-center"
          >
            <p className="text-sm text-[color:var(--app-ink-soft)]">Bu sekmede ihtiyaç kartın yok.</p>
            <Link
              to="/sporcu-panel/ihtiyac-olustur"
              className="btn-primary-light mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Yeni İhtiyaç
            </Link>
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
}
